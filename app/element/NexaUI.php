<?php
namespace app\element;

class NexaUI {
    // Menyimpan instance komponen
    private static $components = [];
    
    // Daftar semua komponen yang didukung
    private static $supportedComponents = [
        'avatar' => NgoreiAvatar::class,
        'spinner' => NgoreiSpinner::class,
        'accordion' => NgoreiAccordion::class,
         'alerts' => NgoreiAlerts::class,
         'badge' => NgoreiBadge::class,
         'btnblock' => NgoreiBtnblock::class,
         'button' => NgoreiButton::class,
         'card' => NgoreiCard::class,
         'carousel' => NgoreiCarousel::class,
         'datepicker' => NgoreiDatePicker::class,
         'dropdown' => NgoreiDropdown::class,
         'fileinput' => NgoreiFileInput::class,
         'flex' => NgoreiFlex::class,
         'formwizard' => NgoreiFormWizard::class,
         'gridform' => NgoreiGridForm::class,
         'icon' => NgoreiIcon::class,
         'link' => NgoreiLink::class,
         'menu' => NgoreiMenu::class,
         'modal' => NgoreiModal::class,
         'navbar' => NgoreiNavbar::class,
         'offcanvas' => NgoreiOffcanvas::class,
         'popover' => NgoreiPopover::class,
         'progress' => NgoreiProgress::class,
         'rangeinput' => NgoreiRangeInput::class,
         'searchoption' => NgoreiSearchOption::class,
         'selectioninput' => NgoreiSelectionInput::class,
         'selectoption' => NgoreiSelectOption::class,
         'switchinput' => NgoreiSwitchInput::class,
         'textareainput' => NgoreiTextareaInput::class,
         'texteditor' => NgoreiTextEditor::class,
         'textinput' => NgoreiTextInput::class,
         'tooltip' => NgoreiTooltip::class,
         'utility' => NgoreiUtility::class
    ];

    /**
     * Transform konten dengan semua komponen yang terdaftar
     * @param string $content Konten yang akan ditransformasi
     * @return string Konten yang sudah ditransformasi
     */
    public static function transform(string &$content): string {
        try {
            foreach (self::$supportedComponents as $name => $class) {
                if (!isset(self::$components[$name])) {
                    self::$components[$name] = new $class();
                }
                $content = self::$components[$name]->transform($content);
            }
            return $content;
        } catch (\Exception $e) {
            error_log("Error in NexaUI transform: " . $e->getMessage());
            return $content;
        }
    }
    /**
     * Mendaftarkan komponen kustom
     * @param string $name Nama komponen
     * @param string $class Nama class komponen
     */
    public static function register(string $name, string $class): void {
        if (!class_exists($class)) {
            throw new \Exception("Class {$class} tidak ditemukan");
        }
        
        self::$supportedComponents[strtolower($name)] = $class;
    }

    /**
     * Mengecek apakah komponen tersedia
     * @param string $name Nama komponen
     * @return bool
     */
    public static function has(string $name): bool {
        return isset(self::$supportedComponents[strtolower($name)]);
    }

    /**
     * Mendapatkan instance komponen
     * @param string $name Nama komponen
     * @return object Instance komponen
     */
    public static function get(string $name): object {
        $name = strtolower($name);
        
        if (!self::has($name)) {
            throw new \Exception("Komponen {$name} tidak terdaftar");
        }
        
        if (!isset(self::$components[$name])) {
            $class = self::$supportedComponents[$name];
            self::$components[$name] = new $class();
        }
        
        return self::$components[$name];
    }
}
