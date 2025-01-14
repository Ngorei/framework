<?php
namespace app\element;

class NgoreiSelectOption {
    /**
     * Transform select elements dalam konten
     * @param string $content
     * @return string
     */
    public static function transform(string $content): string {
        // Pattern untuk mencocokkan select elements dengan content
        $pattern = '/<Selectoption\s+(.*?)\/>/is';
        
        return preg_replace_callback($pattern, function($matches) {
            // Parse atribut dari tag
            $attrs = self::parseAttributes($matches[1]);
            
            // Ambil nilai yang diperlukan
            $name = $attrs['name'] ?? '';
            $id = $attrs['id'] ?? $name;
            $class = $attrs['class'] ?? 'form-nexa-control';
            $required = isset($attrs['required']) ? 'required' : '';
            $options = self::parseOptions($attrs['options'] ?? '');
            $placeholder = $attrs['placeholder'] ?? 'Select ' . ucfirst($name) . '...';
            
            // Buat HTML select
            $html = "<select class=\"{$class}\" id=\"{$id}\" name=\"{$name}\" {$required}>\n";
            $html .= "\t<option value=\"\">{$placeholder}</option>\n";
            
            // Tambahkan options
            foreach ($options as $value => $label) {
                $html .= "\t<option value=\"{$value}\">{$label}</option>\n";
            }
            
            $html .= "</select>";
            return $html;
        }, $content);
    }
    
    /**
     * Parse atribut dari string
     * @param string $string
     * @return array
     */
    private static function parseAttributes(string $string): array {
        $attrs = [];
        preg_match_all('/(\w+)=["\']([^"\']*)["\']/', $string, $matches, PREG_SET_ORDER);
        foreach ($matches as $match) {
            $attrs[$match[1]] = $match[2];
        }
        return $attrs;
    }
    
    /**
     * Parse options dari string format "value:label,value2:label2"
     * @param string $options
     * @return array
     */
    private static function parseOptions(string $options): array {
        $result = [];
        if (empty($options)) return $result;
        
        $pairs = explode(',', $options);
        foreach ($pairs as $pair) {
            $parts = explode(':', $pair);
            $value = trim($parts[0]);
            // Jika label tidak ada, gunakan value sebagai label
            $label = isset($parts[1]) ? trim($parts[1]) : $value;
            $result[$value] = $label;
        }
        return $result;
    }
} 