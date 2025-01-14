<?php
namespace app\element;

class NgoreiModal {
    private static $cache = [];
    private static $modalStack = [];
    
    public static function transform(string &$content): string 
    {
        // Pertama parse konten dari components
        $content = self::parseComponents($content);
        
        $pattern = '/<Modal\s*(.*?)>(.*?)<\/Modal>/is';
        
        return preg_replace_callback($pattern, function($matches) {
            $attributes = self::parseAttributes($matches[1]);
            $modalContent = $matches[2];
            
            // Cek apakah ada atribut components
            if (isset($attributes['components'])) {
                $routePath = PUBLIC_DIR . '/' . ltrim($attributes['components'], '/');
                if (file_exists($routePath)) {
                    // Muat konten file dan parse dengan NexaUI
                    $fileContent = file_get_contents($routePath);
                    $modalContent = NexaUI::transform($fileContent);
                } else {
                    $modalContent = '<p class="nx-error">File tidak ditemukan: ' . htmlspecialchars($attributes['components']) . '</p>';
                }
            }
            
            // Pisahkan footer dari konten utama
            $footer = '';
            if (preg_match('/<footer>(.*?)<\/footer>/is', $modalContent, $footerMatches)) {
                $footer = $footerMatches[1];
                $modalContent = preg_replace('/<footer>.*?<\/footer>/is', '', $modalContent);
            }
            
            // Ambil atribut-atribut modal
            $id = $attributes['id'] ?? 'modal-' . uniqid();
            $title = $attributes['title'] ?? 'Modal';
            $formId = $attributes['form'] ?? '';
            $class = $attributes['class'] ?? '';
            $parent = $attributes['parent'] ?? '';
            $animated = $attributes['animated'] ?? '';
            if (!empty($attributes['backdrop'])) {
               $stbackdrop='nx-modal-no-backdrop';
            } else {
               $stbackdrop='';
            }
            if (!empty($attributes['form'])) {
               $stform='nx-modal-static';
            } else {
               $stform='';
            }
            
           
            // Tambahkan class untuk modal bertingkat jika ada parent
            $modalClass = 'nx-modal ' . $class .' '.$stform.' '.$stbackdrop;
            if ($parent) {
                $modalClass .= ' nx-modal-child';
            }

            $html = sprintf(
                '<div id="%s" class="%s" role="dialog" aria-labelledby="%s-title" data-parent="%s">',
                $id,
                $modalClass,
                $id,
                $parent
            );
            
            // Gunakan form jika atribut form ada
            if ($formId) {
                $html .= sprintf('<form class="nx-modal-content '.$animated.'" id="%s">', $formId);
            } else {
                $html .= '<div class="nx-modal-content '.$animated.'">';
            }
            
            // Header modal
            $html .= '<div class="nx-modal-header">';
            $html .= sprintf('<h5 id="%s-title">%s</h5>', $id, $title);
            $html .= sprintf(
                '<button class="nx-close" onclick="nxMdClose(\'%s\', \'%s\')" aria-label="Tutup modal">
                    <span>&times;</span>
                </button>',
                $id,
                $parent
            );
            $html .= '</div>';
            
            // Body modal
            $html .= '<div class="nx-modal-body">';
            $html .= trim($modalContent);
            $html .= '</div>';
            
            // Footer modal jika ada
            if ($footer) {
                $html .= '<div class="nx-modal-footer">';
                $html .= trim($footer);
                $html .= '</div>';
            }
            
            // Tutup tag sesuai dengan yang dibuka
            if ($formId) {
                $html .= '</form>';
            } else {
                $html .= '</div>';
            }
            
            $html .= '</div>';
            
            return $html;
        }, $content);
    }
    
    /**
     * Parse konten dari components tag
     * @param string $content
     * @return string
     */
    private static function parseComponents(string $content): string 
    {
        $pattern = '/@components\(["\'](.+?)["\']\)/i';
        
        return preg_replace_callback($pattern, function($matches) {
            $filePath = PUBLIC_DIR . '/' . ltrim($matches[1], '/');
            
            if (file_exists($filePath)) {
                // Baca konten file dan parse dengan NexaUI
                $fileContent = file_get_contents($filePath);
                return NexaUI::transform($fileContent);
            }
            
            return '<p class="nx-error">File tidak ditemukan: ' . htmlspecialchars($matches[1]) . '</p>';
        }, $content);
    }
    
    private static function parseAttributes(string $attributeString): array 
    {
        $attributes = [];
        $pattern = '/([a-zA-Z0-9_-]+)\s*=\s*(["\'])(.*?)\2/s';
        
        if (preg_match_all($pattern, $attributeString, $matches, PREG_SET_ORDER)) {
            foreach ($matches as $match) {
                $attributes[$match[1]] = $match[3];
            }
        }
        
        return $attributes;
    }
}