<?php
namespace app\element;

class NgoreiButton {
    private static $cache = [];
    
    public static function transform(string &$content): string 
    {
        $pattern = '/<Button\s+([^>]*)\/>/i';
        
        $content = preg_replace_callback($pattern, function($matches) {
            $attributes = $matches[1];
            
            // Buat cache key dari atribut
            $cacheKey = md5($attributes);
            
            // Cek apakah hasil transformasi sudah ada di cache
            if (isset(self::$cache[$cacheKey])) {
                return self::$cache[$cacheKey];
            }
            
            // Ambil title jika ada
            $title = '';
            if (preg_match('/title="([^"]*)"/', $attributes, $titleMatch)) {
                $title = $titleMatch[1];
                // Hapus atribut title dari string atribut
                $attributes = preg_replace('/title="[^"]*"/', '', $attributes);
            }
            
            // Ambil onPress jika ada
            $onPress = '';
            if (preg_match('/onPress="([^"]*)"/', $attributes, $onPressMatch)) {
                $onPress = $onPressMatch[1];
                // Hapus atribut onPress dari string atribut
                $attributes = preg_replace('/onPress="[^"]*"/', '', $attributes);
            }
            
            // Ambil icon jika ada
            $icon = '';
            if (preg_match('/icon="([^"]*)"/', $attributes, $iconMatch)) {
                $icon = $iconMatch[1];
                // Hapus atribut icon dari string atribut
                $attributes = preg_replace('/icon="[^"]*"/', '', $attributes);
            }
            
            // Cek apakah ada atribut spinner
            $hasSpinner = false;
            if (preg_match('/spinner="true"/', $attributes)) {
                $hasSpinner = true;
                // Hapus atribut spinner dari string atribut
                $attributes = preg_replace('/spinner="true"/', '', $attributes);
            }
            
            // Cek apakah icon posisinya di kanan
            $isRightIcon = false;
            if (preg_match('/\sright\b/', $attributes)) {
                $isRightIcon = true;
                // Hapus atribut right dari string atribut
                $attributes = preg_replace('/\sright\b/', '', $attributes);
            }
            
            // Ambil color jika ada
            $color = '';
            if (preg_match('/color="([^"]*)"/', $attributes, $colorMatch)) {
                $color = $colorMatch[1];
                // Hapus atribut color dari string atribut
                $attributes = preg_replace('/color="[^"]*"/', '', $attributes);
            }
            
            // Ambil modal jika ada
            $modal = '';
            if (preg_match('/modal="([^"]*)"/', $attributes, $modalMatch)) {
                $modal = $modalMatch[1];
                // Hapus atribut modal dari string atribut
                $attributes = preg_replace('/modal="[^"]*"/', '', $attributes);
            }
            // Ambil modal jika ada
            $modalClose = '';
            if (preg_match('/close="([^"]*)"/', $attributes, $modalMatch)) {
                $modalClose = $modalMatch[1];
                // Hapus atribut modal dari string atribut
                $attributes = preg_replace('/close="[^"]*"/', '', $attributes);
            }
            // Tambahkan class icon-button jika ada icon dan tidak ada spinner
            if ($icon && !$hasSpinner) {
                if (preg_match('/class="([^"]*)"/', $attributes, $classMatch)) {
                    $attributes = str_replace(
                        $classMatch[0], 
                        'class="' . $classMatch[1] . ' icon-button"', 
                        $attributes
                    );
                } else {
                    $attributes .= ' class="icon-button"';
                }
            }
            
            // Bersihkan spasi berlebih
            $attributes = trim($attributes);
            
            // Tambahkan type="button" jika tidak ada atribut type
            if (!preg_match('/type="[^"]*"/', $attributes)) {
                $attributes .= ' type="button"';
            }
            
            // Tambahkan style untuk custom color jika ada
            if ($color) {
                if (preg_match('/style="([^"]*)"/', $attributes, $styleMatch)) {
                    $attributes = str_replace(
                        $styleMatch[0],
                        'style="' . $styleMatch[1] . '; --button-color: ' . $color . '"',
                        $attributes
                    );
                } else {
                    $attributes .= ' style="--button-color: ' . $color . '"';
                }
            }
            
            // Tambahkan onclick untuk modal jika ada
            if ($modal) {
                if (preg_match('/onClick="([^"]*)"/', $attributes)) {
                    // Jika sudah ada onClick, tambahkan fungsi modal
                    $attributes = preg_replace(
                        '/onClick="([^"]*)"/',
                        'onClick="$1 nxModal(\'' . $modal . '\');"',
                        $attributes
                    );
                } else {
                    // Jika belum ada onClick, buat baru
                    $attributes .= sprintf(' onClick="nxModal(\'%s\');"', $modal);
                }
            }
            
          // Tambahkan onclick untuk modal jika ada
            if ($modalClose) {
                if (preg_match('/onClick="([^"]*)"/', $attributes)) {
                    // Jika sudah ada onClick, tambahkan fungsi modal
                    $attributes = preg_replace(
                        '/onClick="([^"]*)"/',
                        'onClick="$1 nxMdClose(\'' . $modalClose . '\');"',
                        $attributes
                    );
                } else {
                    // Jika belum ada onClick, buat baru
                    $attributes .= sprintf(' onClick="nxMdClose(\'%s\');"', $modalClose);
                }
            }
            

            // Format parameter onPress jika ada
            if ($onPress) {
                // Deteksi dan format JSON
                if (preg_match('/^\s*{.*}\s*$/s', $onPress)) {
                    // Gunakan JSON sebagai parameter
                    $attributes .= sprintf(' onClick="onPress(%s);"', trim($onPress));
                } else {
                    // Format string biasa
                    $attributes .= sprintf(' onClick="onPress(\'%s\');"', addslashes($onPress));
                }
            }
            
            // Buat output HTML dengan spinner/icon dan title
            $output = "<button {$attributes}>";
            
            // Jika ada spinner, tampilkan spinner
            if ($hasSpinner) {
                $output .= "<span class=\"spinner\"></span>";
                if ($title) {
                    $output .= "<span>{$title}</span>";
                }
            } 
            // Jika tidak ada spinner, atur posisi icon sesuai atribut right
            else {
                if ($icon && !$isRightIcon) {
                    $output .= "<i class=\"{$icon}\"></i>";
                }
                if ($title) {
                    $output .= "<span>{$title}</span>";
                }
                if ($icon && $isRightIcon) {
                    $output .= "<i class=\"{$icon}\"></i>";
                }
            }
            
            $output .= "</button>";
            
            // Simpan ke cache sebelum return
            self::$cache[$cacheKey] = $output;
            
            return $output;
        }, $content);
        
        return $content;
    }
    
    // Method untuk membersihkan cache
    public static function clearCache(): void
    {
        self::$cache = [];
    }
} 