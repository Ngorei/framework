<?php
namespace app\element;

class Ngoreiutility {
    /**
     * Daftar warna kustom
     * @var array
     */
    private static $customColors = [
        'primary' => '#007bff',
        'secondary' => '#6c757d', 
        'success' => '#28a745',
        'danger' => '#dc3545',
        'warning' => '#ffc107',
        'info' => '#17a2b8',
        'light' => '#f8f9fa',
        'dark' => '#343a40',
        'white' => '#ffffff',
        'black' => '#000000'
    ];

    /**
     * Daftar utility classes dan properti CSS-nya
     * @var array
     */
    private static $utilities = [
        'tx' => 'text-align',    
        'position' => 'position',
        'pos' => 'position',
        'top' => 'top',
        'bottom' => 'bottom',
        'left' => 'left',
        'right' => 'right',
        'w' => 'width',
        'h' => 'height',
        'min-w' => 'min-width',
        'min-h' => 'min-height',
        'max-w' => 'max-width',
        'max-h' => 'max-height',
        
        // Margin
        'm' => 'margin',
        'mt' => 'margin-top',
        'mb' => 'margin-bottom',
        'ml' => 'margin-left',
        'mr' => 'margin-right',
        'mx' => 'margin-left margin-right',
        'my' => 'margin-top margin-bottom',
        
        // Padding
        'p' =>  'padding',
        'pt' => 'padding-top',
        'pb' => 'padding-bottom',
        'pl' => 'padding-left',
        'pr' => 'padding-right',
        'px' => 'padding-left padding-right',
        'py' => 'padding-top padding-bottom',
        
        // Font
        'fs' => 'font-size',
        'fw' => 'font-weight',
        'lh' => 'line-height',
        
        // Border
        'br' => 'border-radius',
        'bw' => 'border-width',
        
        // Opacity & Z-index
        'op' => 'opacity',
        'z' => 'z-index',
        
        // Background & Text color
        'bg' => 'background-color',
        'text' => 'color',
    ];

    /**
     * Parse class utility patterns dan konversi ke inline style
     * @param string $content Konten yang akan diparsing
     * @return string Hasil parsing
     */
    public static function transform(string $content): string
    {
        // Pattern untuk mencocokkan class warna hex
        $content = preg_replace_callback(
            '/class=(["\'])(b?#[0-9a-f]{3,6})\1/i',
            function($matches) {
                $hexClass = $matches[2];
                
                if (preg_match('/^(b?)#([0-9a-f]{3,6})$/i', $hexClass, $colorMatch)) {
                    $isBackground = ($colorMatch[1] === 'b');
                    $hexColor = '#' . $colorMatch[2];
                    $property = $isBackground ? 'background-color' : 'color';
                    return sprintf('style="%s:%s"', $property, $hexColor);
                }
                
                return $matches[0];
            },
            $content
        );

        // Pattern untuk mencocokkan seluruh tag HTML dengan atribut class
        $pattern = '/<([a-zA-Z0-9]+)([^>]*?class=(["\'])(.*?)\3[^>]*?)>/i';
        
        return preg_replace_callback($pattern, function($elementMatches) {
            $tag = $elementMatches[1];
            $attributes = $elementMatches[2];
            $quote = $elementMatches[3];
            $classes = $elementMatches[4];
            
            // Split classes
            $classArray = explode(' ', $classes);
            $styles = [];
            $remainingClasses = [];
            
            // Proses setiap class
            foreach ($classArray as $class) {
                $matched = false;
                
                // Cek untuk class warna hex
                if (preg_match('/^(b?)#([0-9a-f]{3,6})$/i', $class, $colorMatch)) {
                    $isBackground = ($colorMatch[1] === 'b');
                    $hexColor = '#' . $colorMatch[2];
                    $property = $isBackground ? 'background-color' : 'color';
                    $styles[$property] = $hexColor;
                    $matched = true;
                    continue;
                }
                
                // Cek utility classes yang terdaftar
                foreach (self::$utilities as $prefix => $properties) {
                    if (preg_match('/^' . preg_quote($prefix, '/') . '-([a-zA-Z0-9\#\.]+)(?:-(.*?))?$/', $class, $matches)) {
                        $value = $matches[1];
                        
                        if ($properties === 'text-align') {
                            $alignValues = [
                                'center' => 'center',
                                'left' => 'left',
                                'right' => 'right',
                            ];
                            $value = $alignValues[$value] ?? $value;
                        } else {
                            $unit = $matches[2] ?? self::getDefaultUnit($properties);
                            if (is_numeric($value)) {
                                $value .= $unit;
                            }
                        }
                        
                        foreach (explode(' ', $properties) as $prop) {
                            $styles[$prop] = $value;
                        }
                        $matched = true;
                        break;
                    }
                }
                
                if (!$matched) {
                    $remainingClasses[] = $class;
                }
            }
            
            // Build output tag
            $output = "<$tag";
            
            if (!empty($remainingClasses)) {
                $output .= ' class=' . $quote . implode(' ', $remainingClasses) . $quote;
            }
            
            if (!empty($styles)) {
                $styleString = '';
                foreach ($styles as $prop => $value) {
                    $styleString .= "$prop:$value;";
                }
                
                if (strpos($attributes, 'style=') !== false) {
                    $attributes = preg_replace('/style=(["\'])(.*?)\1/', 'style="$2' . $styleString . '"', $attributes);
                    $output .= $attributes;
                } else {
                    $output .= ' style="' . $styleString . '"' . $attributes;
                }
            } else {
                $output .= $attributes;
            }
            
            $output .= '>';
            return $output;
        }, $content);
    }

    /**
     * Mendapatkan unit default berdasarkan properti
     * @param string $property Properti CSS
     * @return string Unit default
     */
    private static function getDefaultUnit(string $property): string
    {
        $timeProperties = ['transition', 'animation', 'animation-duration', 'transition-duration'];
        $unitlessProperties = ['opacity', 'z-index', 'font-weight', 'flex', 'order', 'scale'];
        
        if (in_array($property, $timeProperties)) {
            return 'ms';
        }
        if (in_array($property, $unitlessProperties)) {
            return '';
        }
        return 'px';
    }
}
