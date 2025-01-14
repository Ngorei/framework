<?php
namespace app\element;

class NgoreiCarousel {
    /**
     * Transform carousel elements dalam konten
     * @param string $content
     * @return string
     */
    public static function transform(string $content): string {
        // Pattern yang mendukung multi-line attributes
        $pattern = '/<Carousel\s+([\s\S]*?)\/>/is';
        
        return preg_replace_callback($pattern, function($matches) {
            // Bersihkan whitespace berlebih dari atribut
            $attrString = preg_replace('/\s+/', ' ', trim($matches[1]));
            $attrs = self::parseAttributes($attrString);
            
            // Default values
            $interval = $attrs['interval'] ?? 3000;
            $images = self::parseImages($attrs['images'] ?? '');
            $type = strtolower($attrs['type'] ?? 'default');
            
            // Atur default berdasarkan tipe
            $autoplay = match($type) {
                'autoplay' => true,
                'basic' => false,
                default => filter_var($attrs['autoplay'] ?? 'true', FILTER_VALIDATE_BOOLEAN)
            };
            
            $showProgress = match($type) {
                'basic' => false,
                default => filter_var($attrs['progress'] ?? 'true', FILTER_VALIDATE_BOOLEAN)
            };
            
            $showControls = match($type) {
                'basic' => true,
                default => filter_var($attrs['controls'] ?? 'true', FILTER_VALIDATE_BOOLEAN)
            };
            
            $carouselItems = '';
            foreach ($images as $index => $image) {
                $carouselItems .= self::createCarouselItem($type, $image, $index);
            }
            
            $autoplayClass = $autoplay ? 'nx-carousel-autoplay' : '';
            $typeClass = sprintf('nx-carousel-%s', $type);
            
            $controls = '';
            
            // Tampilkan tombol navigasi sesuai tipe
            if ($showControls) {
                $controls .= sprintf(
                    '<button class="nx-carousel-prev">%s</button>
                     <button class="nx-carousel-next">%s</button>',
                    $type === 'basic' ? '❮' : '&#10094;',
                    $type === 'basic' ? '❯' : '&#10095;'
                );
            }
            
            // Tambahkan tombol play/pause hanya jika bukan tipe basic dan autoplay aktif
            if ($showControls && $autoplay && $type !== 'basic') {
                $controls .= '<button class="nx-carousel-play-toggle" aria-label="Toggle autoplay">
                    <span class="pause-icon">⏸</span>
                    <span class="play-icon" style="display:none">▶</span>
                </button>';
            }
            
            // Tambahkan progress bar jika diminta
            $progressBar = $showProgress ? 
                '<div class="nx-carousel-progress"><div class="progress-bar"></div></div>' : '';
            
            $template = match($type) {
                'basic' => self::getBasicTemplate(),
                'autoplay' => self::getAutoplayTemplate(),
                default => self::getDefaultTemplate()
            };
            
            return sprintf(
                $template,
                $autoplayClass,
                $typeClass,
                $interval,
                $carouselItems,
                $controls,
                $progressBar
            );
        }, $content);
    }

    /**
     * Parse atribut dari string
     * @param string $attributeString
     * @return array
     */
    private static function parseAttributes(string $attributeString): array {
        $attributes = [];
        preg_match_all('/(\w+)=["\'](.+?)["\']/', $attributeString, $matches, PREG_SET_ORDER);
        
        foreach ($matches as $match) {
            $attributes[$match[1]] = $match[2];
        }
        
        return $attributes;
    }

    /**
     * Parse string gambar menjadi array
     * @param string $imagesString
     * @return array
     */
    private static function parseImages(string $imagesString): array {
        // Bersihkan whitespace dan baris baru
        $imagesString = preg_replace('/\s+/', '', $imagesString);
        return array_filter(explode(',', $imagesString));
    }

    /**
     * Template untuk carousel basic
     */
    private static function getBasicTemplate(): string {
        return '<div class="nx-carousel %s %s" data-interval="%d">
            <div class="nx-carousel-inner">%s</div>
            %s
        </div>';
    }

    /**
     * Template untuk carousel autoplay
     */
    private static function getAutoplayTemplate(): string {
        return '<div class="nx-carousel %s %s" data-interval="%d">
            <div class="nx-carousel-wrapper">
                <div class="nx-carousel-inner">%s</div>
                %s
            </div>
            %s
        </div>';
    }

    /**
     * Template untuk carousel default
     */
    private static function getDefaultTemplate(): string {
        return '<div class="nx-carousel %s %s" data-interval="%d">
            <div class="nx-carousel-container">
                <div class="nx-carousel-inner">%s</div>
                <div class="nx-carousel-controls">
                    %s
                </div>
                %s
            </div>
        </div>';
    }

    /**
     * Membuat item carousel sesuai tipe
     */
    private static function createCarouselItem(string $type, string $image, int $index): string {
        $activeClass = $index === 0 ? 'active' : '';
        
        return match($type) {
            'basic' => sprintf(
                '<div class="nx-carousel-item %s">
                    <img src="%s" alt="Slide %d">
                </div>',
                $activeClass, $image, $index + 1
            ),
            'autoplay' => sprintf(
                '<div class="nx-carousel-item %s">
                    <div class="nx-carousel-image">
                        <img src="%s" alt="Slide %d">
                    </div>
                </div>',
                $activeClass, $image, $index + 1
            ),
            default => sprintf(
                '<div class="nx-carousel-item %s">
                    <div class="nx-carousel-content">
                        <img src="%s" alt="Slide %d">
                    </div>
                </div>',
                $activeClass, $image, $index + 1
            )
        };
    }
} 