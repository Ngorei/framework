<?php
namespace app\element;

class NgoreiSelectionInput {
    /**
     * Mengubah elemen Selection menjadi format HTML yang diinginkan
     * @param string $content Konten yang akan ditransformasi
     * @return string Konten yang sudah ditransformasi
     */
    public static function transform(string &$content): string 
    {
        // Pattern untuk mencocokkan elemen Selection dengan atributnya
        $pattern = '/<Selection\s*([^>]*)(?:>(.*?)<\/Selection>|\/?>)/is';
        
        // Simpan konten asli
        $originalContent = $content;
        
        // Lakukan transformasi
        $transformedContent = preg_replace_callback($pattern, function($matches) {
            // Parse atribut
            $attrs = self::parseAttributes($matches[1]);
            
            // Siapkan nilai default
            $type = $attrs['type'] ?? 'checkbox'; // checkbox atau radio
            $label = $attrs['label'] ?? '';
            $id = $attrs['id'] ?? self::generateId($label);
            $name = $attrs['name'] ?? $id;
            $checked = isset($attrs['checked']) && $attrs['checked'] !== 'false';
            $value = $attrs['value'] ?? '';
            
            // Tentukan class berdasarkan tipe
            $containerClass = $type === 'radio' ? 'form-nexa-radio' : 'form-nexa-check';
            $inputClass = $type === 'radio' ? 'form-nexa-radio-input' : 'form-nexa-check-input';
            $labelClass = $type === 'radio' ? 'form-nexa-radio-label' : 'form-nexa-check-label';
            
            // Bangun atribut input
            $inputAttrs = [
                'type' => $type,
                'class' => $inputClass,
                'id' => $id,
                'name' => $name
            ];
            
            // Tambahkan value jika ada
            if (!empty($value)) {
                $inputAttrs['value'] = $value;
            }
            
            // Tambahkan checked jika perlu
            if ($checked) {
                $inputAttrs['checked'] = 'checked';
            }
            
            // Bangun HTML output dengan format yang lebih rapi
            $html = "<div class=\"{$containerClass}\">\n";
            $html .= "    <input " . self::buildAttributes($inputAttrs) . ">\n";
            if (!empty($label)) {
                $html .= "    <label class=\"{$labelClass}\" for=\"" . 
                        htmlspecialchars($id) . "\">" . 
                        htmlspecialchars($label) . "</label>\n";
            }
            $html .= "</div>\n";
            
            return $html;
        }, $originalContent);
        
        // Update konten asli dengan hasil transformasi
        if ($transformedContent !== null) {
            $content = $transformedContent;
        }
        
        return $content;
    }
    
    /**
     * Parse string atribut menjadi array
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
     * Generate ID dari label
     */
    private static function generateId(string $label): string 
    {
        if (!empty($label)) {
            return 'selection_' . preg_replace('/[^a-zA-Z0-9]/', '_', strtolower($label));
        }
        return 'selection_' . substr(md5(uniqid()), 0, 8);
    }
    
    /**
     * Membangun string atribut HTML
     */
    private static function buildAttributes(array $attributes): string 
    {
        $html = [];
        foreach ($attributes as $key => $value) {
            if ($value === '' || $value === null) continue;
            if ($value === true) {
                $html[] = htmlspecialchars($key);
            } else {
                $html[] = sprintf('%s="%s"', 
                    htmlspecialchars($key), 
                    htmlspecialchars($value)
                );
            }
        }
        return implode(' ', $html);
    }
} 