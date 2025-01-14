<?php
namespace app\element;

class NgoreiFileInput {
    /**
     * Mengubah elemen FileInput menjadi format HTML yang diinginkan
     * @param string $content Konten yang akan ditransformasi
     * @return string Konten yang sudah ditransformasi
     */
    public static function transform(string &$content): string 
    {
        // Pattern untuk mencocokkan elemen FileInput dengan atribut boolean
        $pattern = '/<FileInput\s*([^>]*)(?:>(.*?)<\/FileInput>|\/?>)/is';
        
        // Lakukan transformasi
        $transformedContent = preg_replace_callback($pattern, function($matches) {
            // Parse atribut
            $attributes = isset($matches[1]) ? self::parseAttributes($matches[1]) : [];
            
            // Siapkan nilai default
            $label = $attributes['label'] ?? '';
            $id = $attributes['id'] ?? self::generateId($label);
            $accept = $attributes['accept'] ?? '*/*';
            
            // Handle boolean attributes dengan benar
            $multiple = isset($attributes['multiple']) && ($attributes['multiple'] === 'true' || $attributes['multiple'] === '{true}');
            $dragDrop = isset($attributes['dragDrop']) && ($attributes['dragDrop'] === 'true' || $attributes['dragDrop'] === '{true}');
            $preview = isset($attributes['preview']) && ($attributes['preview'] === 'true' || $attributes['preview'] === '{true}');
            
            $maxSize = $attributes['maxSize'] ?? '5MB';
            $maxFiles = $attributes['maxFiles'] ?? 5;
            
            // Bangun HTML output
            $html = "<div class=\"form-nexa\">\n";
            
            // Label
            if (!empty($label)) {
                $html .= "    <label for=\"{$id}\">{$label}</label>\n";
            }
            
            // Container utama
            $html .= "    <div class=\"form-nexa-file" . ($dragDrop ? " form-nexa-file-dragdrop" : "") . "\">\n";
            
            // Input file
            $html .= "        <input type=\"file\" class=\"form-nexa-file-input\" id=\"{$id}\"" . 
                    ($multiple ? " multiple" : "") . 
                    " accept=\"{$accept}\"" .
                    " data-max-size=\"{$maxSize}\"" .
                    " data-max-files=\"{$maxFiles}\">\n";
            
            // Label untuk drag & drop
            $html .= "        <label class=\"form-nexa-file-label\" for=\"{$id}\">\n";
            $html .= "            <i class=\"fas fa-cloud-upload-alt\"></i>\n";
            $html .= "            <span class=\"form-nexa-file-text\">" . 
                    ($dragDrop ? "Drag & drop files here or" : "Choose file") . "</span>\n";
            $html .= "            <span class=\"form-nexa-file-button\">Browse</span>\n";
            $html .= "        </label>\n";
            
            $html .= "    </div>\n";
            
            // Preview container
            if ($preview) {
                $html .= "    <div class=\"form-nexa-file-preview\"></div>\n";
            }
            
            // File list
            $html .= "    <div class=\"form-nexa-file-list\"></div>\n";
            
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
     * Parse string atribut menjadi array dengan dukungan boolean
     * @param string $attributes String atribut
     * @return array Array atribut
     */
    private static function parseAttributes(string $attributes): array 
    {
        $attrs = [];
        $patterns = [
            // Format: key="value" atau key='value'
            '/([a-zA-Z0-9_-]+)\s*=\s*([\'"])(.*?)\2/i',
            // Format: key={value} atau key={true/false}
            '/([a-zA-Z0-9_-]+)\s*=\s*\{(.*?)\}/i',
            // Format: key (boolean attribute)
            '/([a-zA-Z0-9_-]+)(?=\s|$)/i'
        ];
        
        foreach ($patterns as $pattern) {
            if (preg_match_all($pattern, $attributes, $matches, PREG_SET_ORDER)) {
                foreach ($matches as $match) {
                    $key = $match[1];
                    $value = count($match) > 2 ? $match[count($match)-1] : 'true';
                    $attrs[$key] = trim($value, '"\'{}');
                }
            }
        }
        
        return $attrs;
    }
    
    /**
     * Generate ID dari label atau random string
     * @param string $label Label input
     * @return string ID yang dihasilkan
     */
    private static function generateId(string $label): string 
    {
        if (!empty($label)) {
            return 'file_' . preg_replace('/[^a-zA-Z0-9]/', '_', strtolower($label));
        }
        return 'file_' . substr(md5(uniqid()), 0, 8);
    }
} 