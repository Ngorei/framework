<?php
namespace app\element;

class Ngoreiicon {
    /**
     * Prefix class untuk berbagai tipe icon
     * @var array
     */
    private static $prefixes = [
        'Ionicons' => 'ion-md-',
        'FontAwesome' => 'fas fa-',
        'MaterialDesign' => 'mdi mdi-',
        'MaterialIcon' => 'material-icons',
        'Batch' => 'batch-icon-',
        'Feather' => 'icon-feather-',
        'Dashicons' => 'dashicons dashicons-',
        'Picons' => 'picons-social-icon-',
        'Themefy' => 'ti-',
        'Dripicons' => 'dripicons-',
        'Eightyshades' => 'es es-',
        'Entypo' => 'entypo-icon entypo-',
        'Foundation' => 'fi-',
        'Ligature' => 'ligature-symbols ',  // Pastikan ada spasi di akhir
        'Metrize' => 'icon-',
        'Simple' => 'simple-line-icon icon-',
        'Typicons' => 'typcn typcn-',
        'Weather' => 'wi wi-',
        'Piconsthin' => 'picons-thin-icon-thin-',
        'Office' => 'ms-Icon ms-Icon--'
    ];

    /**
     * Mengubah elemen Icon menjadi tag i dengan class dan style yang sesuai
     * @param string $content Konten yang akan diproses
     * @return string Konten yang telah diproses
     */
    public static function transform(string $content): string 
    {
        $pattern = '/<(Ionicons|FontAwesome|MaterialDesign|MaterialIcon|Batch|Feather|Piconsthin|Dashicons|Picons|Themefy|Dripicons|Foundation|Ligature|Metrize|Simple|Typicons|Weather|Office)\s*(.*?)\s*\/>/is';
        
        return preg_replace_callback($pattern, function($matches) {
            $iconType = $matches[1];    
            $attributes = $matches[2];   
            
            // Parse atribut
            $attrs = [];
            preg_match_all('/(\w+)\s*=\s*(["\'])(.*?)\2/s', $attributes, $attrMatches, PREG_SET_ORDER);
            foreach ($attrMatches as $attr) {
                $attrs[$attr[1]] = $attr[3];
            }
            
            $name = $attrs['name'] ?? '';
            $color = $attrs['color'] ?? '';
            $size = $attrs['size'] ?? '';
            
            // Build style string
            $styles = [];
            if (!empty($color)) {
                $styles[] = "color: " . $color;
            }
            if (!empty($size)) {
                $size = is_numeric($size) ? $size . 'px' : $size;
                $styles[] = "font-size: " . $size;
            }
            $styleAttr = !empty($styles) ? ' style="' . implode('; ', $styles) . '"' : '';
            
            // Khusus untuk Material Icons
            if ($iconType === 'MaterialIcon') {
                return sprintf(
                    '<i class="material-icons"%s>%s</i>', 
                    $styleAttr,
                    htmlspecialchars($name)
                );
            }
            
            // Khusus untuk Office icons
            if ($iconType === 'Office') {
                return sprintf(
                    '<i class="ms-Icon ms-Icon--%s"%s></i>',
                    htmlspecialchars($name),
                    $styleAttr
                );
            }
            
            // Untuk icon lainnya
            $classPrefix = self::getIconClassPrefix($iconType);
            $classes = [];
            if (!empty($classPrefix) && !empty($name)) {
                $classes[] = $classPrefix . $name;
            }
            
            $classAttr = !empty($classes) ? ' class="' . implode(' ', $classes) . '"' : '';
            
            // Khusus untuk Ligature icons
            if ($iconType === 'Ligature') {
                // Pisahkan style yang sudah ada dengan style tambahan
                $existingStyles = [];
                if (!empty($color)) {
                    $existingStyles[] = "color: " . $color;
                }
                if (!empty($size)) {
                    $size = is_numeric($size) ? $size . 'px' : $size;
                    $existingStyles[] = "font-size: " . $size;
                }
                
                // Gabungkan semua style
                $allStyles = array_merge(
                    ["font-style: normal !important"],
                    $existingStyles
                );
                
                // Hapus 's' di akhir nama jika ada
                $iconName = rtrim($name, 's');
                
                return sprintf(
                    '<i class="ligature-symbols" style="%s">%s</i>', 
                    implode('; ', $allStyles),
                    htmlspecialchars($iconName)
                );
            }
            
            // Tambahkan data-original yang berisi format asli
            return sprintf('<i%s%s data-original="%s"></i>', 
                $classAttr, 
                $styleAttr,
                htmlspecialchars($matches[0])
            );
        }, $content);
    }

    /**
     * Mendapatkan prefix class berdasarkan tipe icon
     * @param string $iconType Tipe icon
     * @return string Prefix class
     */
    private static function getIconClassPrefix(string $iconType): string 
    {
        return self::$prefixes[$iconType] ?? '';
    }
}
