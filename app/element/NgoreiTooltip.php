<?php
namespace app\element;

class NgoreiTooltip {
    private static $cache = [];
    
    /**
     * Transform button group elements dalam konten
     * @param string $content
     * @return string
     */
    public static function transform(string &$content): string 
    {
        // Pattern untuk mencocokkan Btnblock elements
        $pattern = '/<Tooltip\s+(.*?)\/>/is';
        return preg_replace_callback($pattern, function($matches) {
            $attributes = self::parseAttributes($matches[1]);
            // Ambil atribut yang diperlukan
            $class = $attributes['class'] ?? '';
            $title = $attributes['title'] ?? '';
            $data = $attributes['data'] ?? '';
            $position = $attributes['position'] ?? '';
            
            // Bersihkan content dari wrapper ()
            
            
            // Base class
            $classes = [];
            if ($class) {
                $classes[] = $class;
            }
            if ($position) {
               $html = '<button class="' . implode(' ', $classes) . '"data-tooltip="'.$data.'"data-position="'.$position.'">';
               $html .= $title;
               $html .= '</button>';
            } else {
               $html = '<button class="' . implode(' ', $classes) . '"data-tooltip="'.$data.'">';
               $html .= $title;
               $html .= '</button>';
            }
            
            // Build button group HTML

            
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