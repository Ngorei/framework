<?php
namespace app\element;

class NgoreiNavbar {
    private static $cache = [];
    
    /**
     * Transform button group elements dalam konten
     * @param string $content
     * @return string
     */
    public static function transform(string &$content): string 
    {
        // Cek apakah konten sudah ada di cache
        $cacheKey = md5($content);
        if (isset(self::$cache[$cacheKey])) {
            return self::$cache[$cacheKey];
        }

        // Pattern untuk mencocokkan Btnblock elements
        $pattern = '/<Navbar\s+(.*?)\/>/is';
        
        $result = preg_replace_callback($pattern, function($matches) {
            $attributes = self::parseAttributes($matches[1]);
            // Ambil atribut yang diperlukan
            $class = $attributes['class'] ?? '';
            $brand = $attributes['brand'] ?? '';
            $align = $attributes['align'] ?? '';
            $logo = $attributes['logo'] ?? '';
            $Content = $attributes['content'] ?? '';
            $search = $attributes['search'] ?? '';
            if ($align =='right') {
               $alignTc1='nx-navbar-menu-right';
               $alignTc2='nx-nav-menu-right';
            } else  if ($align =='center') {
               $alignTc1='nx-navbar-menu-center';
               $alignTc2='nx-nav-menu-center';
            } else  if ($align =='left') {
               $alignTc1='nx-navbar-menu-left';
               $alignTc2='nx-nav-menu-left';
            } else {
               $alignTc1='';
               $alignTc2='';
            } 
            // Bersihkan content dari wrapper ()
            $Content = preg_replace('/^\s*\(([\s\S]*?)\)\s*$/s', '$1', $Content);
            $brand = preg_replace('/^\s*\(([\s\S]*?)\)\s*$/s', '$1', $brand);
            $search = preg_replace('/^\s*\(([\s\S]*?)\)\s*$/s', '$1', $search);
            
            // Base class
            $classes = [];
            if ($class) {
                $classes[] = $class;
            }
            
            // Build button group HTML
            $html = '<nav class="nx-navbar '.$class.' '.$alignTc1.' ">';
            if ($logo) {
               $html .= '<a href="#" class="nx-nav-brand">
                   <img src="'.HOST.'/img/'.$logo.'" alt="Logo" class="nx-nav-logo">'.$brand.'
                  </a>';
            } else {
              $html .= '<a href="'.HOST.'" class="nx-nav-brand">'.$brand.'</a>';
            }
            $html .= '<ul class="nx-nav-menu '.$alignTc2.'">';
            if ($Content) {
                $html .= $Content;
            }  
            $html .= '</ul>';
            if ($search) {
              $html .= ' 
              <div class="nx-nav-search">
                <div class="nx-search-container">    
                      <input type="search" placeholder="Search" class="nx-search-input">
                      <span class="nx-search-shortcut">CTRL</span>
                   </div>
                </div>';
             } 
            $html .= '</nav>';
            return $html;
        }, $content);

        // Simpan hasil transformasi ke cache
        self::$cache[$cacheKey] = $result;
        
        return $result;
    }

    /**
     * Parse atribut dari string
     * @param string $attributeString
     * @return array
     */
    private static function parseAttributes(string $attributeString): array 
    {
        $attributes = [];
        
        // Pattern untuk menangkap atribut dengan nilai dalam quotes atau parentheses
        $pattern = '/([a-zA-Z0-9_-]+)\s*=\s*(?:(["\'])(.*?)\2|\((.*?)\))/s';
        
        if (preg_match_all($pattern, $attributeString, $matches, PREG_SET_ORDER)) {
            foreach ($matches as $match) {
                $name = $match[1];
                $value = $match[3] ?? $match[4] ?? '';
                $attributes[$name] = trim($value);
            }
        }
        
        return $attributes;
    }
} 