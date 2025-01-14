<?php
namespace app\element;

class NgoreiDatePicker {
    /**
     * Mengubah elemen DatePicker menjadi format HTML yang diinginkan
     * @param string $content Konten yang akan ditransformasi
     * @return string Konten yang sudah ditransformasi
     */
    public static function transform(string &$content): string 
    {
        // Pattern untuk mencocokkan elemen DatePicker
        $pattern = '/<DatePicker\s*([^>]*)(?:>(.*?)<\/DatePicker>|\/?>)/is';
        
        // Lakukan transformasi
        $transformedContent = preg_replace_callback($pattern, function($matches) {
            // Parse atribut
            $attributes = isset($matches[1]) ? self::parseAttributes($matches[1]) : [];
            
            // Siapkan nilai default
            $label = $attributes['label'] ?? '';
            $id = $attributes['id'] ?? self::generateId($label);
            $type = $attributes['type'] ?? 'date'; // date, datetime-local, month, time, week
            $value = $attributes['value'] ?? '';
            $placeholder = $attributes['placeholder'] ?? '';
            $min = $attributes['min'] ?? '';
            $max = $attributes['max'] ?? '';
            $disabled = isset($attributes['disabled']) && $attributes['disabled'] !== 'false';
            $required = isset($attributes['required']) && $attributes['required'] !== 'false';
            $iconLeft = $attributes['iconLeft'] ?? self::getDefaultIcon($type);
            
            // Build HTML output
            $html = "<div class=\"form-nexa\">\n";
            
            // Label
            if (!empty($label)) {
                $html .= "    <label for=\"{$id}\">{$label}</label>\n";
            }
            
            // Date input container
            $html .= "    <div class=\"form-nexa-date\">\n";
            
            // Icon wrapper
            $html .= "        <div class=\"form-nexa-icon\">\n";
            if (!empty($iconLeft)) {
                $html .= "            <i class=\"fas fa-{$iconLeft}\"></i>\n";
            }
            
            // Input
            $html .= "            <input type=\"{$type}\" class=\"form-nexa-control\"" .
                    " id=\"{$id}\"" .
                    (!empty($value) ? " value=\"{$value}\"" : "") .
                    (!empty($placeholder) ? " placeholder=\"{$placeholder}\"" : "") .
                    (!empty($min) ? " min=\"{$min}\"" : "") .
                    (!empty($max) ? " max=\"{$max}\"" : "") .
                    ($disabled ? " disabled" : "") .
                    ($required ? " required" : "") .
                    ">\n";
            
            $html .= "        </div>\n";
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
     * Get default icon berdasarkan tipe date input
     */
    private static function getDefaultIcon(string $type): string 
    {
        switch ($type) {
            case 'datetime-local':
                return 'calendar-alt';
            case 'month':
                return 'calendar-day';
            case 'time':
                return 'clock';
            case 'week':
                return 'calendar-week';
            default:
                return 'calendar';
        }
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
            return 'date_' . preg_replace('/[^a-zA-Z0-9]/', '_', strtolower($label));
        }
        return 'date_' . substr(md5(uniqid()), 0, 8);
    }
} 