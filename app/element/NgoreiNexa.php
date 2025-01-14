<?php
namespace app\Framework;

use app\Framework\Nexaui\NgoreiNexa as NexaUI;
use app\Framework\Nexaui\PercodeProcessor;

class NgoreiNexa {
    private $nexaUI;
    private $percodeProcessor;
    
    // Definisi konstanta untuk tipe button
    private const BUTTON_TYPES = [
        'basic' => ['white', 'light', 'dark', 'black', 'text', 'ghost','win-blue', 'win-purple', 'win-teal', 'win-green', 'win-system', 
                     'win-error', 'win-warning', 'win-success', 'win-accent', 'win-accent-light'],
        'contextual' => ['primary', 'link', 'info', 'success', 'warning', 'danger'],
        'secondary' => ['secondary', 'secondary-light', 'secondary-dark', 'secondary-outline']
    ];

    private const BUTTON_SIZES = ['small','sm','xl','lg', 'normal', 'medium', 'large'];

    // Tambahkan konstanta untuk urutan atribut yang benar
    private const BUTTON_ATTRIBUTE_ORDER = [
        'title',
        'class',
        'icon',
        'href',
        'spinner',
        'window',
        'size',
        'onPress',
        'onRoute',
        'onPage',
        'onModal',
        'aria-label',
        'aria-hidden',
        'only',
        'style',
        'disabled'
    ];

    // Tambahkan konstanta untuk pesan error
    private const ERROR_MESSAGES = [
        'invalid_size' => [
            'error' => 'Ukuran button tidak valid. Gunakan: small, normal, medium, atau large',
            'suggestion' => 'Contoh penggunaan yang benar: size="small" atau size="medium"'
        ],
        'invalid_window' => [
            'error' => 'Tipe window tidak valid. Gunakan: win-blue, win-purple, win-teal, dll',
            'suggestion' => 'Contoh penggunaan yang benar: window="win-blue" atau window="win-purple"'
        ],
        'invalid_class' => [
            'error' => 'Class button tidak valid. Harap periksa dokumentasi untuk daftar class yang tersedia',
            'suggestion' => 'Contoh class yang valid: "primary", "success", "warning", "danger"'
        ],
        'missing_title' => [
            'error' => 'Atribut title wajib diisi pada button',
            'suggestion' => 'Tambahkan atribut title="Teks Button"'
        ],
        'invalid_spinner' => [
            'error' => 'Nilai spinner harus true atau false',
            'suggestion' => 'Contoh penggunaan yang benar: spinner="true" atau spinner="false"'
        ],
        'invalid_attribute_order' => [
            'error' => 'Urutan atribut button tidak sesuai standar',
            'suggestion' => "Urutan atribut yang benar adalah:\n" .
                           "1. title=\"text\"\n" .
                           "2. class=\"type\"\n" .
                           "3. icon=\"icon-name\"\n" .
                           "4. href=\"url\"\n" .
                           "5. spinner=\"true/false\"\n" .
                           "6. window=\"style\"\n" .
                           "7. size=\"ukuran\"\n" .
                           "8. aria-label=\"text\"\n" .
                           "9. aria-hidden=\"true/false\"\n" .
                           "10. only=\"true/false\"\n" .
                           "11. style=\"custom-style\"\n" .
                           "12. disabled\n\n"
                          
        ]
    ];

    private const JAVASCRIPT_VOID = 'javascript:void(0);';

    public function __construct() {
        $this->nexaUI = new NexaUI();
        $this->percodeProcessor = new PercodeProcessor();
    }

    /**
     * Memproses elemen percode dalam konten
     * @param string $content Konten yang akan diproses
     * @return string Konten yang telah diproses
     */
    public function processPercode(string $content): string {
        return $this->percodeProcessor->processPercode($content);
    }

    /**
     * Mengatur opsi code highlighting
     * @param array $options Opsi yang akan diatur
     */
    public function setCodeHighlightOptions(array $options): void {
        $this->percodeProcessor->setCodeHighlightOptions($options);
    }

    /**
     * Memproses button element dan mengubahnya menjadi format yang sesuai
     * @param string $content Konten yang berisi button element
     * @return string Konten yang telah diproses
     */
    public function processButton(string $content): string {
        // Update pattern regex untuk mengenali atribut tanpa validasi
        $patterns = [
            // Pattern untuk button biasa yang bisa mengenali atribut dalam urutan apapun
            '/<button\s*(?:\s*(?:title|class|icon?|href|spinner|window|size|onPress|onRoute|onPage|onModal|aria-label|aria-hidden|only|style|disabled)=(?:"[^"]*"|\'[^\']*\')\s*)*\s*\/>/s',
            
            // Pattern untuk buttonGroup (tidak berubah)
            '/<buttonGroup\s*\n*\s*title="([^"]*)"\s*\n*\s*group=\'(\([^)]+\))\'\s*\n*\s*\/>/s'
        ];
        
        // Proses button biasa
        $content = preg_replace_callback($patterns[0], function($matches) {
            $buttonText = $matches[0];
            $errors = [];
            $suggestions = [];
            
            // Ekstrak semua atribut dari button
            preg_match_all('/(\w+(?:-\w+)?)=("[^"]*"|\'[^\']*\')|disabled/', $buttonText, $foundAttributes, PREG_SET_ORDER);
            
            // Buat array untuk menyimpan atribut dan nilainya
            $attributes = [];
            foreach ($foundAttributes as $attr) {
                if ($attr[0] === 'disabled') {
                    $attributes['disabled'] = true;
                    continue;
                }
                $name = $attr[1];
                $value = trim($attr[2], '"\'');
                $attributes[$name] = $value;
            }
            
            // Cek urutan atribut
            $attributeOrder = array_keys($attributes);
            $currentOrder = array_intersect(self::BUTTON_ATTRIBUTE_ORDER, $attributeOrder);
            $isCorrectOrder = $attributeOrder === array_values($currentOrder);
            
            if (!$isCorrectOrder) {
                $errors[] = 'Urutan atribut button tidak sesuai standar';
                $suggestions[] = self::ERROR_MESSAGES['invalid_attribute_order']['suggestion'];
                
                // Split kode button menjadi baris-baris
                $lines = explode("\n", $buttonText);
                $codePreview = '';
                
                // Generate line numbers dan konten
                foreach ($lines as $index => $line) {
                    $lineNum = $index + 1;
                    $codePreview .= sprintf(
                        '<div class="code-line%s">' .
                            '<span class="line-number">%d</span>' .
                            '<span class="line-content">%s</span>' .
                        '</div>',
                        $lineNum === 1 ? ' error-line' : '', // Highlight baris pertama sebagai error
                        $lineNum,
                        htmlspecialchars($line)
                    );
                }
                
                return sprintf(
                    '<div class="ngorei-alert ngorei-alert-danger">' .
                        // Header
                        '<div class="ngorei-alert-header">' .
                            '<div class="ngorei-alert-icon">' .
                                '<svg width="20" height="20" viewBox="0 0 20 20" fill="none">' .
                                    '<path d="M10 6V10M10 14H10.01M19 10C19 14.9706 14.9706 19 10 19C5.02944 19 1 14.9706 1 10C1 5.02944 5.02944 1 10 1C14.9706 1 19 5.02944 19 10Z" ' .
                                    'stroke="#DC2626" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>' .
                                '</svg>' .
                            '</div>' .
                            '<div class="ngorei-alert-title">NEXA UI ERROR</div>' .
                        '</div>' .
                        // Close button
                        '<button onclick="this.parentElement.remove()" class="ngorei-alert-close">×</button>' .
                        // Code preview dengan line numbers
                        '<div class="ngorei-alert-code">' .
                            '<div class="code-section">' .
                                '%s' . // Code preview dengan line numbers
                            '</div>' .
                        '</div>' .
                        // Error info
                        '<div class="ngorei-alert-info">' .
                            '<div class="ngorei-alert-problem">' .
                                '<div class="ngorei-alert-label">Masalah:</div>' .
                                '<div class="ngorei-alert-text">%s</div>' .
                            '</div>' .
                            '<div class="ngorei-alert-solution">' .
                                '<div class="ngorei-alert-label">Saran Perbaikan:</div>' .
                                '<div class="ngorei-alert-text">%s</div>' .
                            '</div>' .
                        '</div>' .
                    '</div>',
                    $codePreview,
                    implode("<br>", $errors),
                    implode("<br>", $suggestions)
                );
            } else {
                // Ambil nilai atribut yang diperlukan
                $title = $attributes['title'] ?? '';
                $class = $attributes['class'] ?? '';
                $icon = $attributes['icon'] ?? '';
                $href = $attributes['href'] ?? '';
                $spinner = $attributes['spinner'] ?? '';
                $window = $attributes['window'] ?? '';
                $size = $attributes['size'] ?? '';
                $ariaLabel = $attributes['aria-label'] ?? '';
                $ariaHidden = $attributes['aria-hidden'] ?? '';
                $only = $attributes['only'] ?? '';
                $style = $attributes['style'] ?? '';
                $disabled = isset($attributes['disabled']);
                $onPress = $attributes['onPress'] ?? '';

                // Validasi class button (BUTTON_TYPES)
                $buttonClass = str_replace('nx-btn-', '', $class);
                $validClasses = array_merge(
                    self::BUTTON_TYPES['basic'],
                    self::BUTTON_TYPES['contextual'],
                    self::BUTTON_TYPES['secondary']
                );

                // Pisahkan class menjadi array jika ada multiple class
                $classArray = explode(' ', $buttonClass);
                $mainClass = $classArray[0]; // Ambil class utama

                // Cek apakah ada class yang mengandung 'is-'
                $hasIsClass = false;
                foreach ($classArray as $cls) {
                    if (strpos($cls, 'is-') === 0) {
                        $hasIsClass = true;
                        break;
                    }
                }

                // Validasi hanya jika tidak ada 'is-' class dan bukan custom
                if (!$hasIsClass && !in_array($mainClass, $validClasses) && $mainClass !== 'custom') {
                    $errors[] = self::ERROR_MESSAGES['invalid_class']['error'];
                    $suggestions[] = self::ERROR_MESSAGES['invalid_class']['suggestion'];
                }

                // Validasi size button
                if ($size && !in_array($size, self::BUTTON_SIZES)) {
                    // Buat array untuk format is- yang valid
                    $validIsFormats = ['is-small', 'is-medium', 'is-large', 'is-normal'];
                    
                    // Jika size menggunakan format is-* yang valid, lewati validasi
                    if (!in_array($size, $validIsFormats)) {
                        $errors[] = sprintf(
                            'Ukuran button "%s" tidak valid. Gunakan: %s',
                            $size,
                            implode(', ', self::BUTTON_SIZES)
                        );
                        $suggestions[] = sprintf(
                            'Contoh penggunaan yang benar: size="sm", size="lg", size="xl" atau size="normal"'
                        );
                    }
                }

                // Jika ada error, tampilkan pesan error
                if (!empty($errors)) {
                    // Split kode button menjadi baris-baris
                    $lines = explode("\n", $buttonText);
                    $codePreview = '';
                    
                    // Generate line numbers dan konten
                    foreach ($lines as $index => $line) {
                        $lineNum = $index + 1;
                        $codePreview .= sprintf(
                            '<div class="code-line%s">' .
                                '<span class="line-number">%d</span>' .
                                '<span class="line-content">%s</span>' .
                            '</div>',
                            $lineNum === 1 ? ' error-line' : '',
                            $lineNum,
                            htmlspecialchars($line)
                        );
                    }
                    
                    return sprintf(
                        '<div class="ngorei-alert ngorei-alert-danger">' .
                            // Header
                            '<div class="ngorei-alert-header">' .
                                '<div class="ngorei-alert-icon">' .
                                    '<svg width="20" height="20" viewBox="0 0 20 20" fill="none">' .
                                        '<path d="M10 6V10M10 14H10.01M19 10C19 14.9706 14.9706 19 10 19C5.02944 19 1 14.9706 1 10C1 5.02944 5.02944 1 10 1C14.9706 1 19 5.02944 19 10Z" ' .
                                        'stroke="#DC2626" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>' .
                                    '</svg>' .
                                '</div>' .
                                '<div class="ngorei-alert-title">NEXA UI ERROR</div>' .
                            '</div>' .
                            // Close button
                            '<button onclick="this.parentElement.remove()" class="ngorei-alert-close">×</button>' .
                            // Code preview dengan line numbers
                            '<div class="ngorei-alert-code">' .
                                '<div class="code-section">' .
                                    '%s' . // Code preview dengan line numbers
                                '</div>' .
                            '</div>' .
                            // Error info
                            '<div class="ngorei-alert-info">' .
                                '<div class="ngorei-alert-problem">' .
                                    '<div class="ngorei-alert-label">Masalah:</div>' .
                                    '<div class="ngorei-alert-text">%s</div>' .
                                '</div>' .
                                '<div class="ngorei-alert-solution">' .
                                    '<div class="ngorei-alert-label">Saran Perbaikan:</div>' .
                                    '<div class="ngorei-alert-text">%s</div>' .
                                '</div>' .
                            '</div>' .
                        '</div>',
                        $codePreview,
                        implode("<br>", $errors),
                        implode("<br>", $suggestions)
                    );
                }
            }

            // Lanjutkan dengan pemrosesan normal jika urutan benar
            $title = $attributes['title'] ?? '';
            $icon = $attributes['icon'] ?? $attributes['icon'] ?? '';
            $href = $attributes['href'] ?? '';
            $spinner = $attributes['spinner'] ?? '';
            $window = $attributes['window'] ?? '';
            $size = $attributes['size'] ?? '';
            $ariaLabel = $attributes['aria-label'] ?? '';
            $ariaHidden = $attributes['aria-hidden'] ?? '';
            $only = $attributes['only'] ?? '';
            $class = $attributes['class'] ?? '';
            $style = $attributes['style'] ?? '';
            $disabled = isset($attributes['disabled']);
            
            // Jika ada window, gunakan itu sebagai class
            if ($window) {
                $class = $window;
            } else if (!str_starts_with($class, 'nx-btn-')) {
                $class = 'nx-btn-' . $class;
            }
            
            // Tambahkan class sesuai atribut
            if ($icon && !$only) {
                $class .= ' icon-button';
            }
            if ($spinner) {
                $class .= ' loading';
            }
            
            // Tambahkan class size
            if ($size) {
                // Jika sudah menggunakan format is-*, gunakan langsung
                if (in_array($size, ['is-small', 'is-medium', 'is-large', 'is-normal'])) {
                    $class .= ' ' . $size;
                } else {
                    // Jika menggunakan format lain, konversi sesuai kebutuhan
                    switch ($size) {
                        case 'sm':
                            $class .= ' is-small';
                            break;
                        case 'lg':
                            $class .= ' is-large';
                            break;
                        case 'xl':
                            $class .= ' is-xl';
                            break;
                        case 'normal':
                            $class .= ' is-normal';
                            break;
                        case 'medium':
                            $class .= ' is-medium';
                            break;
                        default:
                            $class .= ' is-' . $size;
                            break;
                    }
                }
            }
            
            // Bangun konten button
            $content = '';
            
            // Tambahkan spinner jika ada
            if ($spinner) {
                $content .= '<span class="spinner"></span>';
            }
            
            // Tambahkan icon jika ada
            if ($icon) {
                $content .= sprintf('<i class="%s" aria-hidden="true"></i>', $icon);
                if (!$only) {
                    $content .= sprintf('<span>%s</span>', $title);
                } else {
                    $content .= sprintf('<span class="sr-only">%s</span>', $title);
                }
            } else {
                $content .= $title;
            }
            
            // Proses style yang disederhanakan
            if ($style && !str_contains($style, '--button-color:')) {
                $style = '--button-color: ' . $style;
            }
            
            // Tambahkan atribut aria dan style
            $attributes = [];
            if ($style) {
                $attributes[] = sprintf('style="%s"', $style);
            }
            if ($ariaLabel) {
                $attributes[] = sprintf('aria-label="%s"', $ariaLabel);
            }
            if ($disabled) {
                $attributes[] = 'disabled';
            }
            
            $attributesStr = $attributes ? ' ' . implode(' ', $attributes) : '';
            
            // Validasi atribut
            $errors = [];
            $suggestions = [];
            
            // Validasi title
            if (empty($title)) {
                $errors[] = self::ERROR_MESSAGES['missing_title']['error'];
                $suggestions[] = self::ERROR_MESSAGES['missing_title']['suggestion'];
            }

            // Validasi size
            if ($size && !in_array($size, self::BUTTON_SIZES)) {
                $errors[] = self::ERROR_MESSAGES['invalid_size']['error'];
                $suggestions[] = self::ERROR_MESSAGES['invalid_size']['suggestion'];
            }

          
            // Validasi spinner
            if ($spinner && !in_array(strtolower($spinner), ['true', 'false'])) {
                $errors[] = self::ERROR_MESSAGES['invalid_spinner']['error'];
                $suggestions[] = self::ERROR_MESSAGES['invalid_spinner']['suggestion'];
            }

            // Jika ada error, tampilkan pesan error dan saran
            if (!empty($errors)) {
                return sprintf(
                    '<div class="nx-error-container">' .
                        '<div class="nx-error-icon">⚠️</div>' .
                        '<div class="nx-error-content">' .
                            '<div class="nx-error-title">NEXA UI ERROR:</div>' .
                            '<div class="nx-error-message">%s</div>' .
                            '<div class="nx-error-suggestion">' .
                                '<strong>SARAN PERBAIKAN:</strong><br>%s' .
                            '</div>' .
                            '<div class="nx-error-code">' .
                                '<strong>Kode Asli:</strong><br>' .
                                '<code>%s</code>' .
                            '</div>' .
                        '</div>' .
                    '</div>',
                    implode("<br>", $errors),
                    implode("<br>", $suggestions),
                    htmlspecialchars($buttonText)
                );
            }
            
            // Format parameter onPress jika ada
            if ($onPress) {
                // Deteksi dan format JSON
                if (preg_match('/^\s*{.*}\s*$/s', $onPress)) {
                    // Gunakan JSON sebagai parameter
                    $attributesStr .= sprintf(' onClick="onPress(%s);"', trim($onPress));
                } else {
                    // Format string biasa
                    $attributesStr .= sprintf(' onClick="onPress(\'%s\');"', addslashes($onPress));
                }
            }

            // Buat output sesuai tipe (button atau link)
            if ($href && !$disabled) { // Jika disabled, jangan buat link
                return sprintf('<a href="%s" class="%s"%s>%s</a>', $href, $class, $attributesStr, $content);
            }
            
            return sprintf('<button class="%s"%s>%s</button>', $class, $attributesStr, $content);
        }, $content);
        
        // Proses buttonGroup terlebih dahulu
        $content = preg_replace_callback($patterns[1], function($matches) {
            $groupContent = $matches[2];
            
            // Hapus tanda kurung dan decode HTML entities
            $groupContent = html_entity_decode(trim($groupContent, '()'));
            
            // Proses setiap button dalam group
            $groupContent = preg_replace_callback(
                '/<button\s+class="([^"]*)"(?:\s*icon="([^"]*)")?\s*(?:spinner="([^"]*)")?\s*>([^<]*)<\/button>/',
                function($m) {
                    $cls = $m[1];
                    $icon = $m[2] ?? '';
                    $spinner = $m[3] ?? '';
                    $text = $m[4] ?? '';
                    
                    // Tambahkan prefix nx-btn- jika belum ada
                    if (!str_starts_with($cls, 'nx-btn-')) {
                        $cls = 'nx-btn-' . $cls;
                    }
                    
                    // Tambahkan class loading jika ada spinner
                    if ($spinner) {
                        $cls .= ' loading';
                    }
                    
                    // Bangun konten button
                    $content = '';
                    
                    // Tambahkan spinner jika ada
                    if ($spinner) {
                        $content .= '<span class="spinner"></span>';
                    }
                    
                    // Tambahkan icon jika ada
                    if ($icon) {
                        $content .= sprintf('<i class="%s"></i>', $icon);
                    }
                    
                    // Tambahkan text
                    $content .= $text;
                    
                    return sprintf('<button class="%s">%s</button>', $cls, $content);
                },
                $groupContent
            );
            
            return sprintf('<div class="nx-btn-group">%s</div>', trim($groupContent));
        }, $content);
        
        return $content;
    }

    /**
     * Memproses semua elemen Nexa dalam konten
     * @param string &$content Konten yang akan diproses
     */
    public function domNexa(string &$content): void {
        $content = $this->processButton($content);
        $this->nexaUI->domNexa($content);
    }
}
     