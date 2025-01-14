<?php
namespace app\element;

class NgoreiSearchOption {
    /**
     * Mengubah elemen SearchOption menjadi format HTML yang diinginkan
     * @param string $content Konten yang akan ditransformasi
     * @return string Konten yang sudah ditransformasi
     */
    public static function transform(string &$content): string 
    {
        // Pattern untuk mencocokkan elemen SearchOption
        $pattern = '/<SearchOption\s*([^>]*)>(.+?)<\/SearchOption>/is';
        
        // Lakukan transformasi
        $transformedContent = preg_replace_callback($pattern, function($matches) {
            // Parse atribut
            $attributes = isset($matches[1]) ? self::parseAttributes($matches[1]) : [];
            $innerContent = $matches[2] ?? '';
            
            // Siapkan nilai default
            $label = $attributes['label'] ?? '';
            $id = $attributes['id'] ?? self::generateId($label);
            $type = $attributes['type'] ?? 'single'; // single, multiple
            $placeholder = $attributes['placeholder'] ?? 'Search...';
            $icon = $attributes['icon'] ?? '';
            $options = self::parseOptions($innerContent);
            
            // Build HTML output
            $html = "<div class=\"form-nexa-search\">\n";
            
            // Label
            if (!empty($label)) {
                $html .= "    <label for=\"{$id}\">{$label}</label>\n";
            }
            
            // Search container
            $html .= "    <div class=\"form-nexa-search-container\">\n";
            
            // Input container
            if ($type === 'multiple') {
                $html .= "        <div class=\"form-nexa-search-tags\">\n";
                $html .= "            <div class=\"form-nexa-search-input-container\">\n";
            }
            
            if (!empty($icon)) {
                $html .= "        <div class=\"form-nexa-icon\">\n";
                $html .= "            <i class=\"fas fa-{$icon}\"></i>\n";
            }
            
            // Input
            $html .= "            <input type=\"text\"" . 
                    " class=\"" . ($type === 'multiple' ? "form-nexa-search-input" : "form-nexa-control") . "\"" .
                    " id=\"{$id}\"" .
                    " placeholder=\"{$placeholder}\"" .
                    ($type === 'multiple' ? " data-multiple=\"true\"" : "") .
                    ">\n";
            
            if (!empty($icon)) {
                $html .= "        </div>\n"; // Close icon container
            }
            
            if ($type === 'multiple') {
                $html .= "            </div>\n"; // Close input container
                $html .= "        </div>\n"; // Close tags container
            }
            
            // Dropdown
            $html .= "        <div class=\"form-nexa-search-dropdown\">\n";
            $html .= "            <div class=\"form-nexa-search-items\">\n";
            foreach ($options as $option) {
                $html .= "                <div class=\"form-nexa-search-item\"" .
                        " data-value=\"{$option['value']}\">";
                if (isset($option['icon'])) {
                    $html .= "<i class=\"fas fa-{$option['icon']}\"></i>\n";
                    $html .= "                    <span>{$option['label']}</span>";
                } else {
                    $html .= $option['label'];
                }
                $html .= "</div>\n";
            }
            $html .= "            </div>\n";
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
     * Parse options dari inner content dengan dukungan icon
     */
    private static function parseOptions(string $content): array 
    {
        $options = [];
        $pattern = '/<Option\s+value=([\'"])(.*?)\1(?:\s+icon=([\'"])(.*?)\3)?[^>]*>(.*?)<\/Option>/is';
        
        if (preg_match_all($pattern, $content, $matches, PREG_SET_ORDER)) {
            foreach ($matches as $match) {
                $option = [
                    'value' => $match[2],
                    'label' => trim($match[5])
                ];
                
                // Tambahkan icon jika ada
                if (isset($match[4])) {
                    $option['icon'] = $match[4];
                }
                
                $options[] = $option;
            }
        }
        
        return $options;
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
            return 'search_' . preg_replace('/[^a-zA-Z0-9]/', '_', strtolower($label));
        }
        return 'search_' . substr(md5(uniqid()), 0, 8);
    }
} 