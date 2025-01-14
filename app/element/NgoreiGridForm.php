<?php
namespace app\element;

class NgoreiGridForm {
    /**
     * Mengubah elemen GridForm menjadi format HTML yang diinginkan
     * @param string $content Konten yang akan ditransformasi
     * @return string Konten yang sudah ditransformasi
     */
    public static function transform(string &$content): string 
    {
        // Pattern untuk mencocokkan elemen GridForm dan GridColumn
        $pattern = '/<GridForm\s*([^>]*)>(.+?)<\/GridForm>/is';
        
        // Lakukan transformasi
        $transformedContent = preg_replace_callback($pattern, function($matches) {
            // Parse atribut GridForm
            $attributes = isset($matches[1]) ? self::parseAttributes($matches[1]) : [];
            $innerContent = $matches[2];
            
            // Parse columns
            $columnPattern = '/<GridColumn\s*([^>]*)>(.*?)<\/GridColumn>/is';
            $innerContent = preg_replace_callback($columnPattern, function($columnMatches) {
                $columnAttrs = isset($columnMatches[1]) ? self::parseAttributes($columnMatches[1]) : [];
                $columnContent = $columnMatches[2];
                
                // Get column size (default: 6 - setengah lebar)
                $size = $columnAttrs['size'] ?? '6';
                
                // Build column class
                $columnClass = "nx-col-{$size}";
                
                return "<div class=\"{$columnClass}\">\n{$columnContent}\n</div>";
            }, $innerContent);
            
            // Build final HTML
            return "<div class=\"nx-row\">\n{$innerContent}\n</div>";
        }, $content);
        
        // Update konten asli
        if ($transformedContent !== null) {
            $content = $transformedContent;
        }
        
        return $content;
    }
    
    /**
     * Parse atribut
     */
    private static function parseAttributes(string $attributes): array 
    {
        $attrs = [];
        $patterns = [
            '/([a-zA-Z0-9_-]+)\s*=\s*([\'"])(.*?)\2/i',
            '/([a-zA-Z0-9_-]+)\s*=\s*\{(.*?)\}/i'
        ];
        
        foreach ($patterns as $pattern) {
            if (preg_match_all($pattern, $attributes, $matches, PREG_SET_ORDER)) {
                foreach ($matches as $match) {
                    $key = $match[1];
                    $value = $match[count($match)-1];
                    $attrs[$key] = trim($value, '"\'{}');
                }
            }
        }
        
        return $attrs;
    }
} 