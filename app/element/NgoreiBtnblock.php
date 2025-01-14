<?php
namespace app\element;

class NgoreiBtnblock {
    private static $cache = [];
    
    /**
     * Transform button group elements dalam konten
     * @param string $content
     * @return string
     */
    public static function transform(string &$content): string 
    {
        // Pattern untuk mencocokkan Btnblock elements
        $pattern = '/<Btnblock\s+(.*?)\/>/is';
        
        return preg_replace_callback($pattern, function($matches) {
            $attributes = self::parseAttributes($matches[1]);
            
            // Ambil atribut yang diperlukan
            $class = $attributes['class'] ?? '';
            $btnContent = $attributes['content'] ?? '';
            
            // Bersihkan content dari wrapper ()
            $btnContent = preg_replace('/^\s*\(([\s\S]*?)\)\s*$/s', '$1', $btnContent);
            
            // Base class
            $classes = [];
            if ($class) {
                $classes[] = $class;
            }
            
            // Build button group HTML
            $html = '<div class="' . implode(' ', $classes) . '">';
            
            if ($btnContent) {
                $html .= $btnContent;
            }
            
            $html .= '</div>';
            
            return $html;
        }, $content);
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