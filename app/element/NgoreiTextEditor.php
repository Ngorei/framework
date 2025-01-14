<?php
namespace app\element;

class NgoreiTextEditor {
    /**
     * Mengubah elemen TextEditor menjadi format HTML yang diinginkan
     * @param string $content Konten yang akan ditransformasi
     * @return string Konten yang sudah ditransformasi
     */
    public static function transform(string &$content): string 
    {
        // Pattern untuk mencocokkan elemen TextEditor
        $pattern = '/<TextEditor\s*([^>]*)>(.+?)<\/TextEditor>/is';
        
        // Lakukan transformasi
        $transformedContent = preg_replace_callback($pattern, function($matches) {
            // Parse atribut
            $attributes = isset($matches[1]) ? self::parseAttributes($matches[1]) : [];
            $innerContent = $matches[2] ?? '';
            
            // Siapkan nilai default
            $label = $attributes['label'] ?? '';
            $id = $attributes['id'] ?? self::generateId($label);
            $type = $attributes['type'] ?? 'basic'; // basic, minimal
            $height = $attributes['height'] ?? '200px';
            $placeholder = $attributes['placeholder'] ?? '';
            
            // Build toolbar options berdasarkan tipe
            $toolbarOptions = self::getToolbarOptions($type);
            
            // Build HTML output
            $html = "<div class=\"form-nexa\">\n";
            
            // Label
            if (!empty($label)) {
                $html .= "    <label for=\"{$id}\">{$label}</label>\n";
            }
            
            // Editor container
            $html .= "    <div class=\"form-nexa-editor\">\n";
            $html .= "        <div id=\"{$id}\" class=\"form-nexa-editor-control\"" .
                    " style=\"min-height: {$height};\"" .
                    (!empty($placeholder) ? " data-placeholder=\"{$placeholder}\"" : "") .
                    ">\n";
            $html .= "            " . trim($innerContent) . "\n";
            $html .= "        </div>\n";
            $html .= "    </div>\n";
            
            // Add initialization script  
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
     * Get toolbar options berdasarkan tipe editor
     */
    private static function getToolbarOptions(string $type): array 
    {
        switch ($type) {
            case 'minimal':
                return [
                    ['bold', 'italic', 'underline'],
                    ['clean']
                ];
            default: // basic
                return [
                    [['header' => [1, 2, 3, false]]],
                    ['bold', 'italic', 'underline', 'strike'],
                    [['color' => []], ['background' => []]],
                    [['align' => []]],
                    ['link', 'image'],
                    [['list' => 'ordered'], ['list' => 'bullet']],
                    ['clean']
                ];
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
            return 'editor_' . preg_replace('/[^a-zA-Z0-9]/', '_', strtolower($label));
        }
        return 'editor_' . substr(md5(uniqid()), 0, 8);
    }
} 