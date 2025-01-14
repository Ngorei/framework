<?php
namespace app\element;

class NgoreiAccordion {
    private static $cache = [];
    
    public static function transform(string &$content): string 
    {
        
        // Pattern untuk mencocokkan Accordion tag dengan konten multiline
        $pattern = '/<Accordion\s+(.*?)\/>/is';
        
        $result = preg_replace_callback($pattern, function($matches) {
            $attributes = self::parseAttributes($matches[1]);
           
            $title = $attributes['title'] ?? '';
            $content = $attributes['content'] ?? '';
            $class = $attributes['class'] ?? '';
            $icon = $attributes['icon'] ?? 'expand_more'; // Default icon
            $iconPosition = $attributes['iconPosition'] ?? 'right'; // Default position
            
            // Bersihkan content dari wrapper ()
            $content = preg_replace('/^\s*\(([\s\S]*?)\)\s*$/s', '$1', $content);
            $rendered = self::render($title, $content, $class, $icon, $iconPosition);
            return $rendered;
        }, $content);
        
        return $result;
    }
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
    
    private static function render(
        string $title, 
        string $content, 
        string $class = '', 
        string $icon = 'expand_more',
        string $iconPosition = 'right'
    ): string 
    {
        $cacheKey = md5($title . $content . $class . $icon . $iconPosition);
        if (isset(self::$cache[$cacheKey])) {
            return self::$cache[$cacheKey];
        }
        
        // Siapkan icon HTML
        $iconHtml = '<span class="material-icons icon">' . htmlspecialchars($icon) . '</span>';
        
        // Susun header berdasarkan posisi icon
        $headerContent = $iconPosition === 'left' 
            ? $iconHtml . ' ' . $title
            : $title . ' ' . $iconHtml;
        
        $html = <<<HTML
        <div class="nx-accordion">
            <div class="nx-accordion-item $class">
                <div class="nx-accordion-header">
                    $headerContent
                </div>
                <div class="nx-accordion-content">
                    $content
                </div>
            </div>
        </div>
        HTML;
        
        self::$cache[$cacheKey] = $html;
        return $html;
    }
    
    private static function cleanCache(int $maxItems = 100) 
    {
        if (count(self::$cache) > $maxItems) {
            self::$cache = array_slice(self::$cache, -$maxItems, null, true);
        }
    }
}