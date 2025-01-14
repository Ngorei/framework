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
            $type = $attrs['type'] ?? 'default';
            $autoplay = $type === 'autoplay' ? true : 
                filter_var($attrs['autoplay'] ?? 'true', FILTER_VALIDATE_BOOLEAN);
            $showProgress = filter_var($attrs['progress'] ?? 'true', FILTER_VALIDATE_BOOLEAN);
            $showControls = filter_var($attrs['controls'] ?? 'true', FILTER_VALIDATE_BOOLEAN);
            
            // Generate carousel items berdasarkan tipe
            $carouselItems = self::generateCarouselItems($images, $type, $attrs);
            
            $autoplayClass = $autoplay ? 'nx-carousel-autoplay' : '';
            $typeClass = sprintf('nx-carousel-%s', $type);
            
            // Generate controls berdasarkan tipe
            $controls = self::generateControls($type, $showControls);
            
            // Generate progress bar berdasarkan tipe
            $progressBar = self::generateProgressBar($type, $showProgress);
            
            return sprintf(
                '<div class="nx-carousel %s %s" data-interval="%d">
                    <div class="nx-carousel-inner">%s</div>
                    %s
                    %s
                </div>',
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
     * Generate carousel items berdasarkan tipe
     * @param array $images
     * @param string $type
     * @param array $attrs
     * @return string
     */
    private static function generateCarouselItems(array $images, string $type, array $attrs): string {
        $items = '';
        foreach ($images as $index => $image) {
            $activeClass = $index === 0 ? 'active' : '';
            
            switch ($type) {
                case 'basic':
                    $items .= sprintf(
                        '<div class="nx-carousel-item %s">
                            <img src="%s" alt="Slide %d">
                        </div>',
                        $activeClass, $image, $index + 1
                    );
                    break;

                case 'caption':
                    // Parse judul dan deskripsi dari atribut
                    $titles = explode('|', $attrs['titles'] ?? '');
                    $descriptions = explode('|', $attrs['descriptions'] ?? '');
                    
                    $currentTitle = $titles[$index] ?? '';
                    $currentDesc = $descriptions[$index] ?? '';
                    
                    $items .= sprintf(
                        '<div class="nx-carousel-item %s">
                            <img src="%s" alt="Image %d">
                            <div class="nx-carousel-caption">
                                <h5>%s</h5>
                                <p>%s</p>
                            </div>
                        </div>',
                        $activeClass, 
                        $image, 
                        $index + 1,
                        trim($currentTitle),
                        trim($currentDesc)
                    );
                    break;

                case 'responsif':
                    $items .= sprintf(
                        '<div class="nx-carousel-item %s">
                            <img src="%s" alt="Slide %d" class="nx-img-responsive">
                        </div>',
                        $activeClass, $image, $index + 1
                    );
                    break;

                case 'mobile':
                    $items .= sprintf(
                        '<div class="nx-carousel-item %s nx-mobile-optimized">
                            <img src="%s" alt="Slide %d">
                        </div>',
                        $activeClass, $image, $index + 1
                    );
                    break;

                case 'indikator':
                    $items .= sprintf(
                        '<div class="nx-carousel-item %s" data-slide-index="%d">
                            <img src="%s" alt="Slide %d">
                        </div>',
                        $activeClass, $index, $image, $index + 1
                    );
                    break;

                default: // termasuk type="autoplay"
                    $items .= sprintf(
                        '<div class="nx-carousel-item %s">
                            <img src="%s" alt="Slide %d">
                        </div>',
                        $activeClass, $image, $index + 1
                    );
            }
        }
        return $items;
    }

    /**
     * Generate controls berdasarkan tipe
     * @param string $type
     * @param bool $showControls
     * @return string
     */
    private static function generateControls(string $type, bool $showControls): string {
        if (!$showControls) return '';

        $controls = '';
        
        switch ($type) {
            case 'basic':
            case 'caption':
                $controls .= '<button class="nx-carousel-prev">❮</button>
                             <button class="nx-carousel-next">❯</button>';
                break;

            default:
                $controls .= '<button class="nx-carousel-prev">&#10094;</button>
                             <button class="nx-carousel-next">&#10095;</button>';
        }

        // Tambahan khusus per tipe
        switch ($type) {
            case 'indikator':
                $controls .= '<div class="nx-carousel-indicators"></div>';
                break;
            case 'autoplay':
                $controls .= '<button class="nx-carousel-play-toggle" aria-label="Toggle autoplay">
                    <span class="pause-icon">⏸</span>
                    <span class="play-icon" style="display:none">▶</span>
                </button>';
                break;
        }

        return $controls;
    }

    /**
     * Generate progress bar berdasarkan tipe
     * @param string $type
     * @param bool $showProgress
     * @return string
     */
    private static function generateProgressBar(string $type, bool $showProgress): string {
        if (!$showProgress) return '';

        switch ($type) {
            case 'basic':
            case 'autoplay':
                return '<div class="nx-carousel-progress"><div class="progress-bar"></div></div>';
            case 'mobile':
                return '<div class="nx-carousel-progress nx-mobile"><div class="progress-bar"></div></div>';
            default:
                return '';
        }
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
} 