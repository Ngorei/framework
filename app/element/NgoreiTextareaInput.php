<?php
namespace app\element;

class NgoreiTextareaInput {
    /**
     * Mengubah elemen TextareaInput menjadi format HTML yang diinginkan
     * @param string $content Konten yang akan ditransformasi
     * @return string Konten yang sudah ditransformasi
     */
    public static function transform(string &$content): string 
    {
        // Pattern untuk mencocokkan elemen TextareaInput
        $pattern = '/<TextareaInput\s*([^>]*)(?:>(.*?)<\/TextareaInput>|\/?>)/is';
        
        // Lakukan transformasi
        $transformedContent = preg_replace_callback($pattern, function($matches) {
            // Parse atribut
            $attributes = isset($matches[1]) ? self::parseAttributes($matches[1]) : [];
            
            // Siapkan nilai default
            $label = $attributes['label'] ?? '';
            $id = $attributes['id'] ?? self::generateId($label);
            $rows = $attributes['rows'] ?? '3';
            $placeholder = $attributes['placeholder'] ?? '';
            $value = $attributes['value'] ?? '';
            $className = $attributes['className'] ?? '';
            
            // Handle state dan size
            $state = $attributes['state'] ?? ''; // valid, invalid
            $size = $attributes['size'] ?? ''; // sm, lg
            $readonly = isset($attributes['readonly']) && $attributes['readonly'] !== 'false';
            $disabled = isset($attributes['disabled']) && $attributes['disabled'] !== 'false';
            $resize = $attributes['resize'] ?? 'vertical'; // none, both, horizontal, vertical
            
            // Bangun class
            $baseClass = 'form-nexa-control';
            if ($size === 'sm') {
                $baseClass = 'form-nexa-control-sm';
            } else if ($size === 'lg') {
                $baseClass = 'form-nexa-control-lg';
            }
            
            // Tambahkan class tambahan
            $textareaClass = $baseClass . ($className ? ' ' . $className : '');
            if ($state === 'valid') {
                $textareaClass .= ' is-valid';
            } else if ($state === 'invalid') {
                $textareaClass .= ' is-invalid';
            }
            
            // Bangun style untuk resize
            $style = '';
            if ($resize !== 'both') {
                $style = sprintf('resize: %s;', $resize);
            }
            
            // Bangun HTML output
            $html = "<div class=\"form-nexa\">\n";
            
            // Label
            if (!empty($label)) {
                $html .= "    <label for=\"{$id}\">{$label}</label>\n";
            }
            
            // Textarea
            $html .= "    <textarea class=\"{$textareaClass}\" id=\"{$id}\"" .
                    " rows=\"{$rows}\"" .
                    (!empty($placeholder) ? " placeholder=\"{$placeholder}\"" : "") .
                    (!empty($style) ? " style=\"{$style}\"" : "") .
                    ($readonly ? " readonly" : "") .
                    ($disabled ? " disabled" : "") .
                    ">";
            
            // Value
            $html .= htmlspecialchars($value);
            
            $html .= "</textarea>\n";
            
            // Tambahkan feedback jika ada state
            if ($state === 'valid' || $state === 'invalid') {
                $feedbackClass = $state === 'valid' ? 'valid-feedback' : 'invalid-feedback';
                $feedbackText = $attributes['feedback'] ?? ($state === 'valid' ? 'Looks good!' : 'Please check this field.');
                $html .= "    <div class=\"{$feedbackClass}\">{$feedbackText}</div>\n";
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
            return 'textarea_' . preg_replace('/[^a-zA-Z0-9]/', '_', strtolower($label));
        }
        return 'textarea_' . substr(md5(uniqid()), 0, 8);
    }
} 