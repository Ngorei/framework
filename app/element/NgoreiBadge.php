<?php
namespace app\element;

class NgoreiBadge {
    private static $cache = [];
    
    public static function transform(string &$content): string 
    {
        $pattern = '/<Badge\s+([^>]*)\/>/i';
        
        return preg_replace_callback($pattern, function($matches) {
            // Generate cache key dari atribut badge
            $cacheKey = md5($matches[0]);
            
            // Cek apakah hasil transform sudah ada di cache
            if (isset(self::$cache[$cacheKey])) {
                return self::$cache[$cacheKey];
            }
            
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
            
            // Generate HTML output berdasarkan atribut
            $output = '';
            
            if (!empty($tooltip)) {
                $output = sprintf(
                    '<span class="nx-badge %s" data-tooltip="%s">%s</span>',
                    htmlspecialchars($class),
                    htmlspecialchars($tooltip),
                    htmlspecialchars($title)
                );
            } 
            elseif (!empty($position)) {
                $output = sprintf(
                    '<div class="nx-position-relative">
                        <div class="nx-box">%s</div>
                        <span class="nx-badge %s">%s</span>
                    </div>',
                    htmlspecialchars($title),
                    htmlspecialchars($class),
                    htmlspecialchars($value)
                );
            }
            elseif (!empty($notifikasi) && !empty($icon)) {
                $output = sprintf(
                    '<div class="nx-icon-badge">
                        <i class="%s"></i>
                        <span class="nx-badge %s">%s</span>
                    </div>',
                    htmlspecialchars($icon),
                    htmlspecialchars($class),
                    htmlspecialchars($value)
                );
            }
            else {
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
                
                if (!empty($button)) {
                    $output = sprintf(
                        '<button class="%s">%s <span class="nx-badge %s">%s</span></button>',
                        htmlspecialchars($button),
                        $badgeContent,
                        htmlspecialchars($class),
                        htmlspecialchars($value)
                    );
                } else {
                    $output = sprintf(
                        '<span class="nx-badge %s">%s</span>', 
                        htmlspecialchars($class),
                        $badgeContent
                    );
                }
            }
            
            // Simpan hasil transform ke cache
            self::$cache[$cacheKey] = $output;
            
            return $output;
        }, $content);
    }
    
    public static function clearCache(): void
    {
        self::$cache = [];
    }
} 