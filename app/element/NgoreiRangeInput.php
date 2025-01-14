<?php
namespace app\element;

class NgoreiRangeInput {
    /**
     * Mengubah elemen RangeInput menjadi format HTML yang diinginkan
     * @param string $content Konten yang akan ditransformasi
     * @return string Konten yang sudah ditransformasi
     */
    public static function transform(string &$content): string 
    {
        // Pattern untuk mencocokkan elemen RangeInput
        $pattern = '/<RangeInput\s*([^>]*)(?:>(.*?)<\/RangeInput>|\/?>)/is';
        
        // Lakukan transformasi
        $transformedContent = preg_replace_callback($pattern, function($matches) {
            // Parse atribut
            $attributes = isset($matches[1]) ? self::parseAttributes($matches[1]) : [];
            
            // Siapkan nilai default
            $label = $attributes['label'] ?? '';
            $id = $attributes['id'] ?? self::generateId($label);
            $min = $attributes['min'] ?? '0';
            $max = $attributes['max'] ?? '100';
            $step = $attributes['step'] ?? '1';
            $value = $attributes['value'] ?? '0';
            $showValue = isset($attributes['showValue']) && $attributes['showValue'] !== 'false';
            $tooltip = isset($attributes['tooltip']) && $attributes['tooltip'] !== 'false';
            $variant = $attributes['variant'] ?? ''; // primary, success, dll
            $double = isset($attributes['double']) && $attributes['double'] !== 'false';
            
            if ($double) {
                return self::renderDoubleRange($attributes);
            }
            
            // Bangun HTML output
            $html = "<div class=\"form-nexa\">\n";
            
            // Label
            if (!empty($label)) {
                $html .= "    <label for=\"{$id}\">{$label}</label>\n";
            }
            
            // Range wrapper untuk tooltip
            if ($tooltip) {
                $html .= "    <div class=\"form-nexa-range-wrapper\">\n";
            }
            
            // Range input
            $rangeClass = "form-nexa-range";
            if ($variant) {
                $rangeClass .= " {$variant}";
            }
            
            $html .= "    <input type=\"range\" class=\"{$rangeClass}\" id=\"{$id}\"" .
                    " min=\"{$min}\" max=\"{$max}\" step=\"{$step}\" value=\"{$value}\">\n";
            
            // Tooltip atau value display
            if ($tooltip) {
                $html .= "    <div class=\"form-nexa-range-tooltip\">{$value}</div>\n";
                $html .= "    </div>\n";
            } else if ($showValue) {
                $html .= "    <span class=\"form-nexa-range-value\">{$value}</span>\n";
            }
            
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
     * Render double range slider
     */
    private static function renderDoubleRange($attributes): string 
    {
        $label = $attributes['label'] ?? '';
        $minId = $attributes['minId'] ?? 'minRange';
        $maxId = $attributes['maxId'] ?? 'maxRange';
        $min = $attributes['min'] ?? '0';
        $max = $attributes['max'] ?? '1000';
        $minValue = $attributes['minValue'] ?? $min;
        $maxValue = $attributes['maxValue'] ?? $max;
        $prefix = $attributes['prefix'] ?? '';
        
        $html = "<div class=\"form-nexa\">\n";
        
        if (!empty($label)) {
            $html .= "    <label>{$label}</label>\n";
        }
        
        $html .= "    <div class=\"form-nexa-range-double\">\n";
        $html .= "        <input type=\"range\" class=\"form-nexa-range\" id=\"{$minId}\"" .
                " min=\"{$min}\" max=\"{$max}\" value=\"{$minValue}\">\n";
        $html .= "        <input type=\"range\" class=\"form-nexa-range\" id=\"{$maxId}\"" .
                " min=\"{$min}\" max=\"{$max}\" value=\"{$maxValue}\">\n";
        $html .= "        <div class=\"form-nexa-range-values\">\n";
        $html .= "            <span>{$prefix}{$minValue}</span>\n";
        $html .= "            <span>{$prefix}{$maxValue}</span>\n";
        $html .= "        </div>\n";
        $html .= "    </div>\n";
        $html .= "</div>";
        
        return $html;
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
            return 'range_' . preg_replace('/[^a-zA-Z0-9]/', '_', strtolower($label));
        }
        return 'range_' . substr(md5(uniqid()), 0, 8);
    }
} 