<?php
namespace app\element;

class NgoreiAlerts {
    /**
     * Transform alert elements dalam konten
     * @param string $content
     * @return string
     */
    public static function transform(string $content): string {
        // Pattern untuk mencocokkan alert elements dengan content
        $pattern = '/<Alert\s+(.*?)\/>/is';
        
        return preg_replace_callback($pattern, function($matches) {
            $attributes = self::parseAttributes($matches[1]);
            
            $title = $attributes['title'] ?? '';
            $class = $attributes['class'] ?? '';
            $alertContent = $attributes['content'] ?? '';
            $close = isset($attributes['close']) && $attributes['close'] === 'true';
            $icon = $attributes['icon'] ?? '';
            $actions = $attributes['actions'] ?? '';
            
            // Bersihkan content dan actions dari wrapper ()
            $alertContent = preg_replace('/^\s*\(([\s\S]*?)\)\s*$/s', '$1', $alertContent);
            $actions = preg_replace('/^\s*\(([\s\S]*?)\)\s*$/s', '$1', $actions);
            
            // Pisahkan paragraf dari actions
            $actionsParagraph = '';
            if ($actions) {
                if (preg_match('/<p>(.*?)<\/p>/s', $actions, $matches)) {
                    $actionsParagraph = $matches[0];
                    $actions = preg_replace('/<p>.*?<\/p>\s*/s', '', $actions);
                }
            }
            
            // Base class
            $classes = ['nx-alert'];
            if ($class) {
                $classes[] = $class;
            }
            
            // Build alert HTML
            $html = '<div class="' . implode(' ', $classes) . '">';
            
            if ($close) {
                $html .= '<button type="button" class="nx-alert-close" data-dismiss="alert">×</button>';
            }
            
            // Content wrapper
            $html .= '<div class="nx-alert-content">';
            
            if ($icon) {
                $html .= '<i class="' . $icon . '"></i>';
            }
            
            if ($title) {
                $html .= '<h5 class="nx-alert-title">' . $title . '</h5>';
            }
            
            if ($actionsParagraph) {
                $html .= $actionsParagraph;
            }
            
            if ($alertContent) {
                $html .= $alertContent;
            }
            
            $html .= '</div>'; // Tutup nx-alert-content
            
            // Tambahkan actions (tombol-tombol) jika ada
            if ($actions) {
                $html .= $actions;
            }
            
            $html .= '</div>';
            
            return $html;
        }, $content);
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