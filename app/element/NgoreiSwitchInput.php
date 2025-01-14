<?php
namespace app\element;

class NgoreiSwitchInput {
    /**
     * Mengubah elemen SwitchInput menjadi format HTML yang diinginkan
     * @param string $content Konten yang akan ditransformasi
     * @return string Konten yang sudah ditransformasi
     */
    public static function transform(string &$content): string 
    {
        // Pattern untuk mencocokkan elemen SwitchInput
        $pattern = '/<SwitchInput\s*([^>]*)(?:>(.*?)<\/SwitchInput>|\/?>)/is';
        
        // Lakukan transformasi
        $transformedContent = preg_replace_callback($pattern, function($matches) {
            // Parse atribut
            $attributes = isset($matches[1]) ? self::parseAttributes($matches[1]) : [];
            
            // Siapkan nilai default
            $label = $attributes['label'] ?? '';
            $id = $attributes['id'] ?? self::generateId($label);
            $checked = isset($attributes['checked']) && $attributes['checked'] !== 'false';
            $disabled = isset($attributes['disabled']) && $attributes['disabled'] !== 'false';
            $variant = $attributes['variant'] ?? ''; // primary, success, warning, danger
            $size = $attributes['size'] ?? ''; // sm, lg
            
            // Build class
            $switchClass = 'form-nexa-switch';
            if ($size) {
                $switchClass .= " form-nexa-switch-{$size}";
            }
            if ($variant) {
                $switchClass .= " form-nexa-switch-{$variant}";
            }
            
            // Build HTML output
            $html = "<div class=\"form-nexa\">\n";
            $html .= "    <div class=\"form-nexa-switch-container\">\n";
            $html .= "        <label class=\"{$switchClass}\">\n";
            $html .= "            <input type=\"checkbox\" class=\"form-nexa-switch-input\"" .
                    " id=\"{$id}\"" .
                    ($checked ? " checked" : "") .
                    ($disabled ? " disabled" : "") .
                    ">\n";
            $html .= "            <span class=\"form-nexa-switch-slider\"></span>\n";
            $html .= "        </label>\n";
            
            if (!empty($label)) {
                $html .= "        <span class=\"form-nexa-switch-label\">{$label}</span>\n";
            }
            
            $html .= "    </div>\n";
            $html .= "</div>";
            
            return $html;
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
    
    /**
     * Generate ID
     */
    private static function generateId(string $label): string 
    {
        if (!empty($label)) {
            return 'switch_' . preg_replace('/[^a-zA-Z0-9]/', '_', strtolower($label));
        }
        return 'switch_' . substr(md5(uniqid()), 0, 8);
    }
} 