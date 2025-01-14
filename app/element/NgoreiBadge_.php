<?php
namespace app\element;

class NgoreiBadge {
    private static $cache = [];
    
    public static function transform(string &$content): string 
    {
        $pattern = '/<Badge\s+([^>]*)\/>/i';
        
        return preg_replace_callback($pattern, function($matches) {
            $attributes = $matches[1];
            
            // Parse atribut
            $attrs = [];
            preg_match_all('/(\w+)\s*=\s*"([^"]*)"/', $attributes, $pairs);
            foreach ($pairs[1] as $index => $key) {
                $attrs[$key] = $pairs[2][$index];
            }
            
            // Ambil nilai atribut
            $class = isset($attrs['class']) ? $attrs['class'] : '';
            $title = isset($attrs['title']) ? $attrs['title'] : '';
            $button = isset($attrs['button']) ? $attrs['button'] : '';
            $value = isset($attrs['value']) ? $attrs['value'] : '';
            $icon = isset($attrs['icon']) ? $attrs['icon'] : '';
            $notifikasi = isset($attrs['notifikasi']) ? $attrs['notifikasi'] : '';
            $position = isset($attrs['position']) ? $attrs['position'] : '';
            $tooltip = isset($attrs['tooltip']) ? $attrs['tooltip'] : '';
            
            // Jika ada atribut tooltip, tambahkan data-tooltip
            if (!empty($tooltip)) {
                return sprintf(
                    '<span class="nx-badge %s" data-tooltip="%s">%s</span>',
                    htmlspecialchars($class),
                    htmlspecialchars($tooltip),
                    htmlspecialchars($title)
                );
            }
            
            // Jika ada atribut position, buat format dengan posisi relatif
            if (!empty($position)) {
                return sprintf(
                    '<div class="nx-position-relative">
                        <div class="nx-box">%s</div>
                        <span class="nx-badge %s">%s</span>
                    </div>',
                    htmlspecialchars($title),
                    htmlspecialchars($class),
                    htmlspecialchars($value)
                );
            }
            
            // Jika ada atribut notifikasi, buat format notifikasi dengan icon
            if (!empty($notifikasi) && !empty($icon)) {
                return sprintf(
                    '<div class="nx-icon-badge">
                        <i class="%s"></i>
                        <span class="nx-badge %s">%s</span>
                    </div>',
                    htmlspecialchars($icon),
                    htmlspecialchars($class),
                    htmlspecialchars($value)
                );
            }
            
            // Siapkan konten badge
            $badgeContent = '';
            if (!empty($icon)) {
                $badgeContent = sprintf('<i class="%s"></i> %s',
                    htmlspecialchars($icon),
                    htmlspecialchars($title)
                );
            } else {
                $badgeContent = htmlspecialchars($title);
            }
            
            // Jika ada atribut button, buat format button dengan badge di dalamnya
            if (!empty($button)) {
                return sprintf(
                    '<button class="%s">%s <span class="nx-badge %s">%s</span></button>',
                    htmlspecialchars($button),
                    $badgeContent,
                    htmlspecialchars($class),
                    htmlspecialchars($value)
                );
            }
            
            // Format default untuk badge biasa
            return sprintf(
                '<span class="nx-badge %s">%s</span>', 
                htmlspecialchars($class),
                $badgeContent
            );
        }, $content);
    }
    
    public static function clearCache(): void
    {
        self::$cache = [];
    }
} 