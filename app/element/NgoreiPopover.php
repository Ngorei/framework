<?php
namespace app\element;

class NgoreiPopover {
    private static $cache = [];
    
    /**
     * Transform popover elements dalam konten
     * @param string $content
     * @return string
     */
    public static function transform(string &$content): string 
    {
        $pattern = '/<(Popover|NotificationPopover|MenuPopover)\s+(.*?)>(.*?)<\/\1>/is';
        
        return preg_replace_callback($pattern, function($matches) {
            $tag = $matches[1];
            $attributes = self::parseAttributes($matches[2]);
            $content = $matches[3] ?? '';
            
            switch($tag) {
                case 'NotificationPopover':
                    return self::generateNotificationPopover($attributes, $content);
                case 'MenuPopover':
                    return self::generateMenuPopover($attributes, $content);
                default:
                    return self::generatePopover($attributes, $content);
            }
        }, $content);
    }

    /**
     * Generate HTML notification popover
     * @param array $attrs
     * @param string $content
     * @return string
     */
    private static function generateNotificationPopover(array $attrs, string $content): string 
    {
        $position = $attrs['position'] ?? 'right';
        $icon = $attrs['icon'] ?? '';
        $title = $attrs['title'] ?? 'Notifikasi';
        $badge = $attrs['badge'] ?? '';
        $viewAllText = $attrs['viewAllText'] ?? 'Lihat Semua Notifikasi';
        $viewAllUrl = $attrs['viewAllUrl'] ?? '#';
        
        return <<<HTML
        <button class="nx-btn nx-popover" data-position="{$position}">
            <img src="{$icon}" class="nx-avatar nx-avatar-sm" alt="Notifications">
            <div class="popover-content notification-popover">
                <div class="popover-header">
                    <h4>{$title}</h4>
                    <span class="badge">{$badge}</span>
                </div>
                <div class="popover-body">
                    {$content}
                </div>
                <div class="popover-footer">
                    <a href="{$viewAllUrl}" class="view-all">{$viewAllText}</a>
                </div>
            </div>
        </button>
        HTML;
    }

    /**
     * Generate HTML popover
     * @param array $attrs
     * @param string $content
     * @return string
     */
    private static function generatePopover(array $attrs, string $content): string 
    {
        $position = $attrs['position'] ?? 'top';
        $avatar = $attrs['avatar'] ?? '';
        $name = $attrs['name'] ?? '';
        $role = $attrs['role'] ?? '';
        
        return <<<HTML
        <button class="nx-btn nx-popover" data-position="{$position}">
            <img src="{$avatar}" class="nx-avatar nx-avatar-sm" alt="User">
            <div class="popover-content">
                <div class="popover-header">
                    <img src="{$avatar}" class="nx-avatar" alt="User">
                    <div class="user-info">
                        <h4>{$name}</h4>
                        <p class="user-role">{$role}</p>
                    </div>
                </div>
                <div class="popover-body">
                    {$content}
                </div>
            </div>
        </button>
        HTML;
    }

    /**
     * Generate HTML menu popover
     * @param array $attrs
     * @param string $content
     * @return string
     */
    private static function generateMenuPopover(array $attrs, string $content): string 
    {
        $position = $attrs['position'] ?? 'bottom';
        $icon = $attrs['icon'] ?? '';
        $buttonClass = $attrs['buttonClass'] ?? 'nx-btn nx-popover';
        
        return <<<HTML
        <button class="{$buttonClass}" data-position="{$position}">
            <img src="{$icon}" class="nx-avatar nx-avatar-sm" alt="Menu">
            <div class="popover-content menu-popover">
                {$content}
            </div>
        </button>
        HTML;
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