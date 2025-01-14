<?php
namespace app\element;

class NgoreiEscode {
    // Cache untuk style CSS
    private static $style = null;
    
    // Cache untuk pattern regex
    private static $patterns = [
        'escode' => '/<Escode\s*([^>]*)>([\s\S]+?)<\/Escode>/is',
        'attributes' => '/(\w+)=["\']([^"\']*)["\']/',
        'duplicate_class' => '/(<[^>]+)\s+(class=(["\'])(.*?)\3)(\s+class=(["\'])(.*?)\6)/i',
        'curly_braces' => '/\{([^}]*)\}/'
    ];

    // Inisialisasi style saat class dimuat
    public static function init()
    {
        if (self::$style === null) {
            self::$style = self::getStyle();
        }
    }

    /**
     * Mengubah elemen Escape menjadi format HTML yang diinginkan
     * @param string $content Konten yang akan ditransformasi
     * @return string Konten yang sudah ditransformasi
     */
    public static function converCode(string &$content): string 
    {
        // Lakukan transformasi menggunakan preg_replace_callback
        return preg_replace_callback(self::$patterns['escode'], [self::class, 'processMatch'], $content);
    }

    /**
     * Memproses setiap match dari tag Escode
     */
    private static function processMatch($matches): string 
    {
        $original_content = trim($matches[2]);
        
        // Parse atribut dari tag Escode
        $attributes = self::parseAttributes($matches[1]);
        
        // Ambil nilai type dan title
        $type = $attributes['type'] ?? 'xml';
        $title = $attributes['title'] ?? 'Escaped';
        $label = $attributes['label'] ?? 'Label';
        
        // Proses escape content
        $escaped = self::processContent($original_content);
        
        return self::generateOutput($original_content, $escaped, $type, $title,$label);
    }

    /**
     * Parse atribut dari tag
     */
    private static function parseAttributes(string $attributeString): array 
    {
        $attributes = [];
        if (preg_match_all(self::$patterns['attributes'], $attributeString, $attrs)) {
            foreach ($attrs[1] as $i => $name) {
                $attributes[$name] = $attrs[2][$i];
            }
        }
        return $attributes;
    }

    /**
     * Proses escape content
     */
    private static function processContent(string $content): string 
    {
        // Proses duplikasi class - menangani multiple class attributes dalam satu tag
        $pattern = '/(<[^>]+?)(?:class=(["\'])(.*?)\2\s*)+/i';
        $content = preg_replace_callback($pattern, function($matches) {
            // Ambil semua class attributes
            preg_match_all('/class=(["\'])(.*?)\1/', $matches[0], $classes);
            
            // Gabungkan semua nilai class
            $allClasses = [];
            foreach ($classes[2] as $classString) {
                $allClasses = array_merge($allClasses, preg_split('/\s+/', trim($classString)));
            }
            
            // Hapus duplikasi dan gabungkan
            $uniqueClasses = array_unique($allClasses);
            
            // Kembalikan tag dengan class yang sudah digabung
            return str_replace($matches[0], $matches[1] . ' class="' . implode(' ', $uniqueClasses) . '"', $matches[0]);
        }, $content);
        
        // Escape kurung kurawal
        $content = preg_replace_callback(self::$patterns['curly_braces'], function($m) {
            return '&lbrace;' . $m[1] . '&rbrace;';
        }, $content);
        
        // Escape karakter HTML
        return str_replace(
            ['<', '>', '"', "'", '&'],
            ['&lt;', '&gt;', '&quot;', '&apos;', '&amp;'],
            $content
        );
    }

    /**
     * Generate output HTML
     */
    private static function generateOutput(string $original, string $escaped, string $type, string $title, string $label): string 
    {
        // Format escaped content untuk tampilan utama
        $escaped = "&lt;pre&gt;&lt;code class=&quot;language-{$type}&quot; title=&quot;{$title}&quot;&gt;{$escaped}\n&lt;/code&gt;&lt;/pre&gt;";
        
        // Generate unique tab IDs
        $uniqueId = 'tab_' . uniqid();
        $tab1 = $uniqueId . '_1';
        $tab2 = $uniqueId . '_2';
        
        // Pastikan style sudah diinisialisasi
        self::init();
        
        // Ambil style ke variabel lokal
        $style = self::$style;
        
        return <<<HTML
            <div class="nx-card">
                <div class="preview-escaped">
                    {$original}
                </div>
                <div class="escaped-section">
                    <div class="escaped-content">
                        <pre><code class="language-{$type}" title="{$title}">{$escaped}</code></pre>
                        <pre><code class="language-html" title="demo">&lt;div class=&quot;demo-section&quot;&gt;
    &lt;h3&gt;Demo:&lt;/h3&gt;
    &lt;!-- Demo disini --&gt;
&lt;/div&gt;
&lt;div class=&quot;nx-tabcode&quot;&gt;
    &lt;div class=&quot;nx-tabcode-code&quot;&gt;
        &lt;h3&gt;{$label}&lt;/h3&gt;
        &lt;div class=&quot;nx-tabcode-buttons&quot;&gt;
            &lt;button class=&quot;nx-tabcode-btn active&quot; data-tab=&quot;{$tab1}&quot;&gt;HTML&lt;/button&gt;
            &lt;button class=&quot;nx-tabcode-btn&quot; data-tab=&quot;{$tab2}&quot;&gt;NexaUI&lt;/button&gt;
        &lt;/div&gt;
    &lt;/div&gt;
    &lt;div class=&quot;tab-content&quot;&gt;
        &lt;div class=&quot;nx-tabcode-pane active&quot; id=&quot;{$tab1}&quot;&gt;
            {$escaped}
        &lt;/div&gt;
        &lt;div class=&quot;nx-tabcode-pane&quot; id=&quot;{$tab2}&quot;&gt;
          
        &lt;/div&gt;
    &lt;/div&gt;
&lt;/div&gt;
    </code></pre>
                    </div>
                </div>
            </div>
            {$style}
HTML;
    }

    /**
     * Get CSS style
     */
    private static function getStyle(): string 
    {
        return '<style>
            .preview-escaped { padding: 20px; border-bottom: 1px solid #e0e0e0; }
            .escaped-section { background: #f8f9fa; padding: 15px; }
            .escaped-section h3 { text-align: center; color: #333; margin: 0 0 15px 0; font-size: 16px; }
            .escaped-content { position: relative; border: 1px solid #e0e0e0; border-radius: 4px; overflow: hidden; }
            .code-header { background: #2d2d2d; color: #fff; padding: 8px 15px; display: flex; justify-content: space-between; align-items: center; }
            .language-type { background: #444; padding: 2px 6px; border-radius: 3px; font-size: 12px; }
        </style>';
    }
} 

// Inisialisasi style saat file dimuat
NgoreiEscode::init(); 
