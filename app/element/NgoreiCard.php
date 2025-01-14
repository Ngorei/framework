<?php
namespace app\element;

class NgoreiCard {
    private static $cache = [];
    
    /**
     * Transform button group elements dalam konten
     * @param string $content
     * @return string
     */
    public static function transform(string &$content): string 
    {
        // Pattern untuk mencocokkan Btnblock elements
        $pattern = '/<Card\s+(.*?)\/>/is';
        
        return preg_replace_callback($pattern, function($matches) {
            $attributes = self::parseAttributes($matches[1]);
            
            // Ambil atribut yang diperlukan
            $class = $attributes['class'] ?? '';
            $header = $attributes['header'] ?? '';
            $footer = $attributes['footer'] ?? '';
            $Content = $attributes['content'] ?? '';
            $type = $attributes['type'] ?? '';
            $title = $attributes['title'] ?? 'Dropdown';
        
            // Bersihkan content dari wrapper ()
            $Content = preg_replace('/^\s*\(([\s\S]*?)\)\s*$/s', '$1', $Content);
            $header = preg_replace('/^\s*\(([\s\S]*?)\)\s*$/s', '$1', $header);
            
            // Base class
             $classes = [];
             if ($class) {
                 $classes[] = $class;
             }
            
            // Build button group HTML
            $html = '<div class="nx-card '.$class.'">';
            if ($header) {
               $html .= ' <div class="nx-card-header">'.$header.'</div>';
            }
            
           // $html .= '<button class="' . implode(' ', $classes) . '">' . htmlspecialchars($title) . '</button>';
            $html .= '<div class="nx-card-body">';
            
            if ($Content) {
                $html .= $Content;
            }
            
            $html .= '</div>';
            if ($footer) {
              $html .= '<div class="nx-card-footer">'.$footer.'</div>';
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