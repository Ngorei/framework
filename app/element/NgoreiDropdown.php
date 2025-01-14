<?php
namespace app\element;

class NgoreiDropdown {
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
        $pattern = '/<Dropdown\s+(.*?)\/>/is';
        
        $result = preg_replace_callback($pattern, function($matches) {
            $attributes = self::parseAttributes($matches[1]);
            
            // Ambil atribut yang diperlukan
            $class = $attributes['class'] ?? 'nx-btn-dark';
            $btnContent = $attributes['items'] ?? '';
            $type = $attributes['type'] ?? '';
            $title = $attributes['title'] ?? 'Dropdown';
            if (!empty($type)) {
                $menu="nx-dropdown-".$type;
            } else {
                $menu="";
            }
            
            // Bersihkan content dari wrapper ()
            $btnContent = preg_replace('/^\s*\(([\s\S]*?)\)\s*$/s', '$1', $btnContent);
            
            // Base class
            $classes = [];
            if ($class) {
                $classes[] = $class;
            }
            
            // Build button group HTML
            $html = '<div class="nx-dropdown">';
            $html .= '<button class="' . implode(' ', $classes) . '">' . htmlspecialchars($title) . '</button>';
            $html .= '<div class="nx-dropdown-content '.$menu.'">';
            
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