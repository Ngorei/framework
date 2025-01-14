<?php
namespace app\element;

class NgoreiFormWizard {
    /**
     * Mengubah elemen FormWizard menjadi format HTML yang diinginkan
     * @param string $content Konten yang akan ditransformasi
     * @return string Konten yang sudah ditransformasi
     */
    public static function transform(string &$content): string 
    {
        // Pattern untuk mencocokkan elemen FormWizard dan WizardStep
        $pattern = '/<FormWizard\s*([^>]*)>(.*?)<\/FormWizard>/is';
        
        // Lakukan transformasi
        $transformedContent = preg_replace_callback($pattern, function($matches) {
            // Parse atribut FormWizard
            $attributes = isset($matches[1]) ? self::parseAttributes($matches[1]) : [];
            $innerContent = $matches[2] ?? '';
            
            // Parse steps
            $steps = self::parseSteps($innerContent);
            
            // Build HTML output
            $html = "<div class=\"form-nexa-wizard\">\n";
            
            // Progress Bar
            $html .= "    <div class=\"form-nexa-wizard-progress\">\n";
            foreach ($steps as $index => $step) {
                $isActive = $index === 0 ? ' active' : '';
                $stepNum = $index + 1;
                $html .= "        <div class=\"form-nexa-wizard-progress-step{$isActive}\" data-step=\"{$stepNum}\">\n";
                $html .= "            <span class=\"step-number\">{$stepNum}</span>\n";
                $html .= "            <span class=\"step-text\">{$step['title']}</span>\n";
                $html .= "        </div>\n";
            }
            $html .= "    </div>\n\n";
            
            // Form Steps Content
            $html .= "    <div class=\"form-nexa-wizard-content\">\n";
            foreach ($steps as $index => $step) {
                $isActive = $index === 0 ? ' active' : '';
                $stepNum = $index + 1;
                $html .= "        <div class=\"form-nexa-wizard-step{$isActive}\" data-step=\"{$stepNum}\">\n";
                $html .= $step['content'] . "\n";
                $html .= "        </div>\n";
            }
            $html .= "    </div>\n\n";
            
            // Navigation Buttons
            $html .= "    <div class=\"form-nexa-wizard-buttons\">\n";
            $html .= "        <button type=\"button\" class=\"form-nexa-btn\" id=\"prevStep\" disabled>Previous</button>\n";
            $html .= "        <button type=\"button\" class=\"form-nexa-btn primary\" id=\"nextStep\">Next</button>\n";
            $html .= "        <button type=\"button\" class=\"form-nexa-btn success\" id=\"submitWizard\" style=\"display: none;\">Submit</button>\n";
            $html .= "    </div>\n";
            
            $html .= "</div>";
            
            return $html;
        }, $content);
        
        // Update konten asli
        if ($transformedContent !== null) {
            $content = $transformedContent;
        }
        
        return $content;
    }
    
    /**
     * Parse steps dari inner content
     */
    private static function parseSteps(string $content): array 
    {
        $steps = [];
        $pattern = '/<WizardStep\s+title=([\'"])(.*?)\1[^>]*>(.*?)<\/WizardStep>/is';
        
        if (preg_match_all($pattern, $content, $matches, PREG_SET_ORDER)) {
            foreach ($matches as $match) {
                $steps[] = [
                    'title' => $match[2],
                    'content' => trim($match[3])
                ];
            }
        }
        
        return $steps;
    }
    
    /**
     * Parse atribut
     */
    private static function parseAttributes(string $attributes): array 
    {
        $attrs = [];
        $patterns = [
            '/([a-zA-Z0-9_-]+)\s*=\s*([\'"])(.*?)\2/i',
            '/([a-zA-Z0-9_-]+)\s*=\s*\{(.*?)\}/i'
        ];
        
        foreach ($patterns as $pattern) {
            if (preg_match_all($pattern, $attributes, $matches, PREG_SET_ORDER)) {
                foreach ($matches as $match) {
                    $key = $match[1];
                    $value = $match[count($match)-1];
                    $attrs[$key] = trim($value, '"\'{}');
                }
            }
        }
        
        return $attrs;
    }
} 