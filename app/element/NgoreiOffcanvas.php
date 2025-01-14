<?php
namespace app\element;

class NgoreiOffcanvas {
    private static $cache = [];
    
    /**
     * Transform button group elements dalam konten
     * @param string $content
     * @return string
     */
    public static function transform(string &$content): string 
    {
        // Cek apakah konten sudah ada di cache
        $cacheKey = md5($content);
        if (isset(self::$cache[$cacheKey])) {
            return self::$cache[$cacheKey];
        }

        // Pattern untuk mencocokkan Btnblock elements
        $pattern = '/<Offcanvas\s+(.*?)\/>/is';
        
        $result = preg_replace_callback($pattern, function($matches) {
            $attributes = self::parseAttributes($matches[1]);
            // Ambil atribut yang diperlukan
            $class = $attributes['class'] ?? '';
            $title = $attributes['title'] ?? 'title';
            $id = $attributes['id'] ?? 'id';
            $position = $attributes['position'] ?? 'left';
            $btnContent = $attributes['content'] ?? '';
            
            // Bersihkan content dari wrapper ()
            $btnContent = preg_replace('/^\s*\(([\s\S]*?)\)\s*$/s', '$1', $btnContent);
            
            // Base class
            $classes = [];
            if ($class) {
                $classes[] = $class;
            }
            
            // Build button group HTML
            $html = '<div class="nx-offcanvas" id="'.$id.'" data-position="'.$position.'">';
            $html .= '<div class="nx-offcanvas-header"><h5>'.$title.'</h5><button class="nx-close" data-offcanvas-close></button></div>';
            $html .= '<div class="nx-offcanvas-body">';
            if ($btnContent) {
                $html .= $btnContent;
            }
            
            $html .= '</div>';
            $html .= '</div>';
            
            return $html;
        }, $content);

        // Simpan hasil transformasi ke cache
        self::$cache[$cacheKey] = $result;
        
        return $result;
    }

    /**
     * Parse atribut dari string
     * @param string $attributeString
     * @return array
     */
    private static function parseAttributes(string $attributeString): array 
    {
        $attributes = [];
        
        // Pattern untuk menangkap atribut dengan nilai dalam quotes atau parentheses
        $pattern = '/([a-zA-Z0-9_-]+)\s*=\s*(?:(["\'])(.*?)\2|\((.*?)\))/s';
        
        if (preg_match_all($pattern, $attributeString, $matches, PREG_SET_ORDER)) {
            foreach ($matches as $match) {
                $name = $match[1];
                $value = $match[3] ?? $match[4] ?? '';
                $attributes[$name] = trim($value);
            }
        }
        
        return $attributes;
    }
} 