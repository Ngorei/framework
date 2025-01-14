<?php
namespace app\element;

class NgoreiFlex {
    /**
     * Cache untuk hasil transformasi
     * @var array
     */
    private static $cache = [];
    
    /**
     * Maksimum cache entries
     * @var int
     */
    private static $maxCacheSize = 100;
    
    /**
     * Mengubah elemen Grid menjadi format HTML yang diinginkan
     * @param string $content Konten yang akan ditransformasi
     * @return string Konten yang sudah ditransformasi
     */
    public static function transform(string &$content): string 
    {
        if (empty($content)) {
            return '';
        }

        $cacheKey = md5($content);
        if (isset(self::$cache[$cacheKey])) {
            return self::$cache[$cacheKey];
        }

        static $patterns = null;
        if ($patterns === null) {
            $patterns = [
                // Pattern untuk @Flex syntax
                '/@Flex\s*\(\s*([^)]*)\s*\)\s*{((?:[^{}]|(?R))*)}/' => function($matches) {
                    $attrs = self::parseInlineAttributes($matches[1]);
                    return sprintf('<Flex %s>%s</Flex>', $attrs, $matches[2]);
                },
                
                // Pattern untuk multiple Flex elements
                '/<Flex[^>]*>.*?<\/Flex>(?:\s*<Flex[^>]*>.*?<\/Flex>)+/is' => function($matches) {
                    // Ekstrak semua Flex elements
                    preg_match_all('/<Flex\s+([^>]*?)>(.*?)<\/Flex>/is', $matches[0], $sections, PREG_SET_ORDER);
                    
                    $columns = [];
                    foreach ($sections as $section) {
                        $attrs = self::parseAttributes($section[1]);
                        $classes = self::extractGridClasses($attrs['class'] ?? '');
                        $extraAttrs = self::buildExtraAttributes($attrs);
                        
                        $columns[] = '<div class="nx-col-' . $classes['size'] . $classes['extra'] . '"' . 
                                   $extraAttrs . '>' . trim($section[2]) . '</div>';
                    }
                    
                    // Gabungkan semua kolom dalam satu row
                    return '<div class="nx-row">' . implode('', $columns) . '</div>';
                }
            ];
        }

        $result = $content;
        foreach ($patterns as $pattern => $callback) {
            $result = preg_replace_callback($pattern, $callback, $result);
        }
        
        if (count(self::$cache) >= self::$maxCacheSize) {
            array_shift(self::$cache);
        }
        self::$cache[$cacheKey] = $result;
        
        return $result;
    }
    
    /**
     * Ekstrak ukuran kolom dan class tambahan
     * @param string $classString
     * @return array
     */
    private static function extractGridClasses(string $classString): array 
    {
        $classes = explode(' ', trim($classString));
        $size = array_shift($classes) ?? ''; // Ambil angka pertama sebagai ukuran
        
        // Filter dan gabungkan class tambahan
        $extraClasses = array_filter($classes, function($class) {
            return !empty(trim($class));
        });
        
        $extra = !empty($extraClasses) ? ' ' . implode(' ', $extraClasses) : '';
        
        return [
            'size' => $size,
            'extra' => $extra
        ];
    }
    
    /**
     * Bangun string atribut tambahan
     * @param array $attrs
     * @return string
     */
    private static function buildExtraAttributes(array $attrs): string 
    {
        $result = '';
        foreach ($attrs as $key => $value) {
            if ($key !== 'class') {
                // Handle boolean attributes
                if ($value === true) {
                    $result .= ' ' . $key;
                } else {
                    $result .= sprintf(' %s="%s"', $key, htmlspecialchars($value, ENT_QUOTES));
                }
            }
        }
        return $result;
    }
    
    /**
     * Parse atribut dari string menjadi array
     * @param string $attributeString
     * @return array
     */
    private static function parseAttributes(string $attributeString): array 
    {
        $attributes = [];
        $pattern = '/(\w+)\s*=\s*["\']([^"\']*)["\']|(\w+)/';
        
        preg_match_all($pattern, $attributeString, $matches, PREG_SET_ORDER);
        
        foreach ($matches as $match) {
            if (isset($match[3])) {
                $attributes[$match[3]] = true;
            } else {
                $attributes[$match[1]] = $match[2];
            }
        }
        
        return $attributes;
    }
} 