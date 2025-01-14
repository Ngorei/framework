<?php
namespace app\element;

class NgoreiAvatar {
    private static $cache = [];
    
    /**
     * Transform avatar elements dalam konten
     * @param string $content
     * @return string
     */
    public static function transform(string &$content): string 
    {
        // Pattern untuk mencocokkan Avatar elements
        $pattern = '/<Avatar\s+(.*?)\/>/is';
        return preg_replace_callback($pattern, function($matches) {
            $attributes = self::parseAttributes($matches[1]);
            
            // Ambil atribut yang diperlukan
            $class = $attributes['class'] ?? '';
            $src = $attributes['src'] ?? '';
            $alt = $attributes['alt'] ?? '';
            $size = $attributes['size'] ?? 'md';
            $status = $attributes['status'] ?? '';
            
            // Base classes
            $classes = ['nx-avatar'];
            $classes[] = 'nx-avatar-' . $size;
            
            if ($status) {
                $classes[] = 'nx-avatar-status';
                $classes[] = 'nx-avatar-' . $status;
            }
            
            if ($class) {
                $classes[] = $class;
            }
            
            // Build avatar HTML
            $html = '<div class="' . implode(' ', $classes) . '">';
            if ($src) {
                $html .= '<img src="' . htmlspecialchars($src) . '" alt="' . htmlspecialchars($alt) . '">';
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