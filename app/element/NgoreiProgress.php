<?php
namespace app\element;

class NgoreiProgress {
    private static $cache = [];
    
    /**
     * Transform button group elements dalam konten
     * @param string $content
     * @return string
     */
    public static function transform(string &$content): string 
    {
        // Pattern untuk mencocokkan Btnblock elements
        $pattern = '/<Progress\s+(.*?)\/>/is';
        return preg_replace_callback($pattern, function($matches) {
            $attributes = self::parseAttributes($matches[1]);
            // Ambil atribut yang diperlukan
            $class = $attributes['class'] ?? '';
            $title = $attributes['title'] ?? '';
            $value = $attributes['value'] ?? '';
            // Build button group HTML
            $html = '<div class="nx-progress">';
            $html .= ' <div class="nx-progress-bar '.$class.'" style="width: '.$value.'%">'.$title.'</div>';
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