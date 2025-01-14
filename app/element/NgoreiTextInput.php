<?php
namespace app\element;

class NgoreiTextInput {
    /**
     * Mengubah elemen TextInput menjadi format HTML yang diinginkan
     * @param string $content Konten yang akan ditransformasi
     * @return string Konten yang sudah ditransformasi
     */
    public static function transform(string &$content): string 
    {
        // Pattern untuk mencocokkan elemen TextInput dengan atributnya dan penutup tag
        $pattern = '/<TextInput\s*([^>]*)(?:>(.*?)<\/TextInput>|\/?>)/is';
        
        // Simpan konten asli
        $originalContent = $content;
        
        // Lakukan transformasi
        $transformedContent = preg_replace_callback($pattern, function($matches) {
            // Ambil semua atribut
            $attributes = $matches[1];
            
            // Parse atribut menggunakan helper function
            $attrs = self::parseAttributes($attributes);
            
            // Siapkan nilai default
            $label = $attrs['label'] ?? '';
            $type = $attrs['type'] ?? 'text';
            $placeholder = $attrs['placeholder'] ?? $label;
            $value = $attrs['value'] ?? '';
            $id = $attrs['id'] ?? self::generateId($label);
            $className = $attrs['className'] ?? '';
            
            // Tambahkan dukungan untuk size
            $size = $attrs['size'] ?? ''; // sm, lg, atau kosong untuk ukuran normal
            
            // Tambahkan dukungan untuk state
            $state = $attrs['state'] ?? ''; // valid, invalid, atau kosong untuk normal
            $readonly = isset($attrs['readonly']) && $attrs['readonly'] !== 'false';
            
            // Tambahkan dukungan untuk icon
            $iconLeft = $attrs['iconLeft'] ?? '';
            $iconRight = $attrs['iconRight'] ?? '';
            $iconClass = $attrs['iconClass'] ?? ''; // Default icon class
            
            // Tambahkan dukungan untuk input groups
            $prefix = $attrs['prefix'] ?? '';
            $suffix = $attrs['suffix'] ?? '';
            $prefixIcon = $attrs['prefixIcon'] ?? '';
            $suffixIcon = $attrs['suffixIcon'] ?? '';
            $isStack = isset($attrs['stack']) && $attrs['stack'] !== 'false';
            
            // Tambahkan dukungan untuk floating label
            $floating = isset($attrs['floating']) && $attrs['floating'] !== 'false';
            
            // Sesuaikan class berdasarkan size
            $baseClass = 'form-nexa-control';
            if ($size === 'sm') {
                $baseClass = 'form-nexa-control-sm';
            } else if ($size === 'lg') {
                $baseClass = 'form-nexa-control-lg';
            }
            
            // Tambahkan class form-nexa-control ke className yang sudah ada
            $inputClass = $baseClass . ($className ? ' ' . $className : '');
            
            // Sesuaikan class berdasarkan state
            if ($state === 'valid') {
                $inputClass .= ' is-valid';
            } else if ($state === 'invalid') {
                $inputClass .= ' is-invalid';
            }
            
            // Bangun atribut input - Pindahkan ke sini sebelum digunakan
            $inputAttrs = [
                'type' => $type,
                'class' => $inputClass,
                'id' => $id,
                'placeholder' => $floating ? ' ' : $placeholder // Placeholder kosong untuk floating label
            ];

            // Tambahkan value jika ada
            if (!empty($value)) {
                $inputAttrs['value'] = $value;
            }

            // Tambahkan readonly jika diperlukan
            if ($readonly) {
                $inputAttrs['readonly'] = 'readonly';
            }
            
            // Tambahkan atribut tambahan yang mungkin ada
            foreach ($attrs as $key => $val) {
                if (!in_array($key, ['label', 'type', 'placeholder', 'value', 'id', 'className'])) {
                    $key = self::convertReactAttr($key);
                    $inputAttrs[$key] = $val;
                }
            }
            
            // Bangun HTML output dengan format yang lebih rapi
            if ($floating) {
                $html = "<div class=\"form-nexa-floating\">\n";
                
                if (!empty($iconLeft) || !empty($iconRight)) {
                    // Untuk floating label dengan icon
                    $html .= "    <div class=\"form-nexa-icon\">\n";
                    
                    // Tambahkan icon kiri jika ada
                    if (!empty($iconLeft)) {
                        $html .= "        <i class=\"{$iconClass} {$iconLeft}\"></i>\n";
                    }
                    
                    // Tambahkan input
                    $html .= "        <input " . self::buildAttributes($inputAttrs) . ">\n";
                    
                    // Tambahkan icon kanan jika ada
                    if (!empty($iconRight)) {
                        $html .= "        <i class=\"{$iconClass} {$iconRight}\"" . 
                                (!empty($attrs['iconAction']) ? " data-action=\"{$attrs['iconAction']}\"" : "") . 
                                "></i>\n";
                    }
                    
                    // Label harus berada setelah input untuk floating label
                    if (!empty($label)) {
                        $html .= "        <label for=\"" . htmlspecialchars($id) . "\">" . htmlspecialchars($label) . "</label>\n";
                    }
                    
                    $html .= "    </div>\n";
                } else {
                    // Floating label tanpa icon
                    $html .= "    <input " . self::buildAttributes($inputAttrs) . ">\n";
                    if (!empty($label)) {
                        $html .= "    <label for=\"" . htmlspecialchars($id) . "\">" . htmlspecialchars($label) . "</label>\n";
                    }
                }
                
                $html .= "</div>";
                return $html;
            }
            
            // Non-floating label
            $html = "<div class=\"form-nexa\">\n";
            
            // Tambahkan label di awal untuk non-floating
            if (!empty($label)) {
                $html .= "    <label for=\"" . htmlspecialchars($id) . "\">" . htmlspecialchars($label) . "</label>\n";
            }
            
            // Lanjutkan dengan kode yang sudah ada untuk input groups
            if (!empty($prefix) || !empty($suffix) || !empty($prefixIcon) || !empty($suffixIcon)) {
                // Tentukan class untuk input group
                $groupClass = 'form-nexa-input-group';
                if ($isStack) {
                    $groupClass .= ' form-nexa-input-group-stack';
                }
                if (!empty($prefixIcon) || !empty($suffixIcon)) {
                    $groupClass .= ' form-nexa-input-group-icon';
                }
                
                // Buka div input group
                $html .= "    <div class=\"{$groupClass}\">\n";
                
                // Tambahkan prefix jika ada
                if (!empty($prefix) || !empty($prefixIcon)) {
                    $html .= "        <span class=\"form-nexa-input-group-text\">\n";
                    if (!empty($prefixIcon)) {
                        $html .= "            <i class=\"{$prefixIcon}\"></i>\n";
                    }
                    if (!empty($prefix)) {
                        $html .= "            " . htmlspecialchars($prefix) . "\n";
                    }
                    $html .= "        </span>\n";
                }
                
                // Tambahkan input
                $html .= "        <input " . self::buildAttributes($inputAttrs) . ">\n";
                
                // Tambahkan suffix jika ada
                if (!empty($suffix) || !empty($suffixIcon)) {
                    $html .= "        <span class=\"form-nexa-input-group-text\">\n";
                    if (!empty($suffixIcon)) {
                        $html .= "            <i class=\"{$suffixIcon}\"></i>\n";
                    }
                    if (!empty($suffix)) {
                        $html .= "            " . htmlspecialchars($suffix) . "\n";
                    }
                    $html .= "        </span>\n";
                }
                
                $html .= "    </div>\n";
            } else if (!empty($iconLeft) || !empty($iconRight)) {
                $html .= "    <div class=\"form-nexa-icon\">\n";
                if (!empty($iconLeft)) {
                    $html .= "        <i class=\"{$iconClass} {$iconLeft}\"></i>\n";
                }
                $html .= "        <input " . self::buildAttributes($inputAttrs) . ">\n";
                if (!empty($iconRight)) {
                    $html .= "        <i class=\"{$iconClass} {$iconRight}\"" . 
                            (!empty($attrs['iconAction']) ? "id='iconLeft' data-action=\"{$attrs['iconAction']}\"" : "") . 
                            "></i>\n";
                }
                $html .= "    </div>\n";
            } else {
                // Input biasa
                $html .= "    <input " . self::buildAttributes($inputAttrs) . ">\n";
            }
            
            $html .= "</div>";
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
     * @param string $attributes String atribut
     * @return array Array atribut
     */
    private static function parseAttributes(string $attributes): array 
    {
        $attrs = [];
        
        // Pattern untuk mencocokkan atribut dengan berbagai format
        $patterns = [
            // Format: key="value" atau key='value'
            '/([a-zA-Z0-9_-]+)\s*=\s*([\'"])(.*?)\2/i',
            // Format: key={value}
            '/([a-zA-Z0-9_-]+)\s*=\s*\{(.*?)\}/i'
        ];
        
        foreach ($patterns as $pattern) {
            if (preg_match_all($pattern, $attributes, $matches, PREG_SET_ORDER)) {
                foreach ($matches as $match) {
                    $key = $match[1];
                    $value = $match[count($match)-1]; // Ambil grup terakhir sebagai nilai
                    $attrs[$key] = trim($value, '"\'{}'); // Bersihkan tanda kutip dan kurung kurawal
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
            // Gunakan label untuk membuat ID, hapus karakter non-alphanumeric
            return 'input_' . preg_replace('/[^a-zA-Z0-9]/', '_', strtolower($label));
        }
        
        // Jika tidak ada label, generate random ID
        return 'input_' . substr(md5(uniqid()), 0, 8);
    }
    
    /**
     * Membangun string atribut HTML dari array
     * @param array $attributes Array atribut
     * @return string String atribut HTML
     */
    private static function buildAttributes(array $attributes): string 
    {
        $html = [];
        
        foreach ($attributes as $key => $value) {
            // Skip atribut kosong
            if ($value === '' || $value === null) {
                continue;
            }
            
            // Handle boolean attributes
            if ($value === true) {
                $html[] = htmlspecialchars($key);
            } else {
                $html[] = sprintf(
                    '%s="%s"',
                    htmlspecialchars($key),
                    htmlspecialchars($value)
                );
            }
        }
        
        return implode(' ', $html);
    }

    /**
     * Konversi atribut React ke HTML
     * @param string $attr Nama atribut React
     * @return string Nama atribut HTML
     */
    private static function convertReactAttr(string $attr): string 
    {
        $conversions = [
            'onChangeText' => 'onchange',
            'onChange' => 'onchange',
            'onClick' => 'onclick',
            'onFocus' => 'onfocus',
            'onBlur' => 'onblur'
        ];

        return $conversions[$attr] ?? $attr;
    }
}
