<?php
namespace app\element;

class NgoreiLink {
    private static $cache = [];
    
    /**
     * Transform button group elements dalam konten
     * @param string $content
     * @return string
     */
    public static function transform(string &$content): string 
    {
        // Pattern untuk mencocokkan Btnblock elements
        $pattern = '/<Link\s+(.*?)\/>/is';
        return preg_replace_callback($pattern, function($matches) {
            $attributes = self::parseAttributes($matches[1]);
            // Ambil atribut yang diperlukan
            $class = $attributes['class'] ?? '';
            $title = $attributes['title'] ?? '';
            $icon = $attributes['icon'] ?? '';
            $content = $attributes['content'] ?? '';
            $href = $attributes['href'] ?? 'javascript:void(0);';
            
            // Bersihkan content dari wrapper ()
            $content = preg_replace('/^\s*\(([\s\S]*?)\)\s*$/s', '$1', $content);
            if ($icon) {
               $iconClass="icon-button";
            } else {
               $iconClass="";
                // code...
            }
            
            // Base class
            $classes = [];
            if ($class) {
                $classes[] = $class;
            }
            
            // Build button group HTML
            $html = '<a  class="'.$class.' '.$iconClass.'" href="'.$href.'">';
            if ($content) {
                 $html .= $content;
            } else {
                if ($icon) {
                  $html .= '<i class="fas fa-save"></i>';
                  $html .= '<span> '.$title.'</span>';
                } else {
                  $html .= $title;
                }
            }
            $html .= '</a>';
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