<?php
namespace app;

use Exception;
class Ngorei {
  private $_tpldata = [];
  private $_section = [];
  private $files = [];
   
  private $showLanguageIndex = false;
  private $root;
  private $languageData;
  private $specialVariables = [];
    
  /**
   * Konstruktor kelas Ngorei
   * @param string $root Direktori root
   * @param array $languageData Data bahasa
   */
  public function __construct(string $root = "./", array $languageData = []) {
    $this->setRootDir($root);
    $this->languageData = $languageData;
  }
  
  /**
   * Mengatur direktori root
   * @param string $root Direktori root
   */
  private function setRootDir(string $root): void
  {
    $this->root = str_replace('\\', '/', rtrim($root, '/')) . '/';
  }
  
  /**
   * Destruktor kelas Ngorei
   */
  public function __destruct()
  {
    $this->destroy();
  }
  
  /**
   * Mereset daftar file
   */
  public function resetFiles()
  {
    $this->files = [];
  }
  
  /**
   * Menghancurkan objek template
   */
  public function destroy()
  {
    unset($this->_tpldata);
    unset($this->files);
    unset($this->_section);
    unset($this->root, $this->showLanguageIndex, $this->languageData);
  }

  /**
   * Menetapkan atau menambahkan nilai variabel
   * @param string $varname Nama variabel
   * @param mixed $varval Nilai variabel
   * @param bool $append Apakah menambahkan nilai
   * @return bool Berhasil atau tidak
   */
  public function val(string $varname, $varval, bool $append = false): bool
  {
    if ($append && isset($this->_tpldata['.'][$varname])) {
      $this->_tpldata['.'][$varname] .= $varval;
      return true;
    }
    
    $this->_tpldata['.'][$varname] = $varval;
    return true;
  }

  /**
   * Menambahkan array ke blok variabel
   * @param string $varblock Nama blok variabel
   * @param array $vararray Array yang akan ditambahkan
   * @return bool Berhasil atau tidak
   */
  public function TDSnet(string $varblock, array $vararray): bool
  {
    if (!isset($this->_tpldata['.'][$varblock]) || !is_array($this->_tpldata['.'][$varblock])) {
      $this->_tpldata['.'][$varblock] = [];
    }
    $this->_tpldata['.'][$varblock][] = $vararray;
    return true;
  }

  /**
   * Menambahkan file template sementara
   * @param string $varfile Nama file
   * @return bool Berhasil atau tidak
   */
  private function addTempfile(string $varfile): bool
  {
    if (!file_exists($varfile)) {
      die("Parser->add_file(): Couldn't load template file $this->root$varfile");
    }
    $this->files[$varfile] = $varfile;
    return true;
  }
  
  /**
   * Mengubah karakter khusus HTML
   * @param string &$content Konten yang akan diubah
   */
  public function htmlStandard(string &$content): void
  {
    if (!empty($content)) {
      $content = str_replace(array('& ', ' & '), array('&amp; ', ' &amp; '), $content);
    }
  }

  /**
   * Menambahkan variabel khusus baru
   * @param string $key Kunci variabel khusus
   * @param string $value Nilai variabel khusus
   */
  public function addSpecialVariable(string $key, string $value): void
  {
    $this->specialVariables[$key] = rtrim($value, '/');
  }

  /**
   * Menambahkan dan mengurai file template
   * @param string $key Kunci variabel khusus
   * @param string $value Path file template
   */
  public function addFile(string $key, string $value): void {
     $cleanPath = str_replace('\\', '/', rtrim($value, '/'));
    $this->specialVariables[$key] = $cleanPath;
  }

  /**
   * Mengurai variabel khusus dalam konten
   * @param string &$content Konten yang akan diurai
   */
  private function parseSpecialVariables(string &$content): void
  {
    foreach ($this->specialVariables as $key => $value) {
      $pattern = '/\{' . preg_quote($key, '/') . '\$(.*?)\}/';
      $content = preg_replace_callback($pattern, function($matches) use ($value) {
        return $value . '/' . $matches[1];
      }, $content);
    }
  }

  /**
   * Mengurai konten template
   * @param string &$content Konten yang akan diurai
   * @param bool $removeVars Apakah menghapus variabel yang tidak digunakan
   * @param bool $return Apakah mengembalikan hasil
   * @param bool $compress Apakah mengompres hasil
   * @return string Hasil penguraian
   */
  public function parse(string &$content, bool $removeVars = true, bool $return = true, bool $compress = false): string
  {
    try {
      // Panggil fungsi parseSpecialVariables sebelum parsing lainnya
      $this->parseSpecialVariables($content);

      $content = preg_replace_callback(
        "#\{([a-z0-9_.]*)\}#i",
        function($matches) use ($removeVars) {
          return $this->_tpldata['.'][$matches[1]] ?? (!$removeVars ? $matches[0] : '');
        },
        $content
      );

      $content = preg_replace_callback(
        "#_lang\{(.*)\}#i",
        function($matches) {
          return $this->showLanguageIndex ? ($this->languageData[$matches[1]] ?? $matches[1]) : ($this->languageData[$matches[1]] ?? '');
        },
        $content
      );

      if ($removeVars) {
        $content = preg_replace("#\{([a-z0-9_]*)\}#i", '', $content);
      }

      if ($compress) {
        $this->compress($content);
      }

      $this->htmlStandard($content);
      $content = trim($content);

      if (!$return) {
        echo $content;
        return '';
      }

      return $content;
    } catch (Exception $e) {
      // Log error atau tangani sesuai kebutuhan
      throw new Exception("Error parsing template: " . $e->getMessage());
    }
  }

  /**
   * Mengurai blok dalam template
   * @param string &$content Konten yang akan diurai
   * @param string $blockname Nama blok
   * @param bool $removeVars Apakah menghapus variabel yang tidak digunakan
   * @param bool $return Apakah mengembalikan hasil
   * @return string Hasil penguraian blok
   */
  private function parseBlock(string &$content, string $blockname, bool $removeVars = true, bool $return = true): string
  {
    $matchArray = [];
    preg_match_all("#\{$blockname\.([a-z0-9_]*)\}#i", $content, $matchArray, PREG_SET_ORDER);
    
    $blockLength = count($this->_tpldata['.'][$blockname]);
      
    $res = '';
    for ($i = 0; $i < $blockLength; $i++) {
      $temp = $content;
      foreach ($matchArray as $val) {
        if ($this->_tpldata['.'][$blockname][$i][$val[1]] === true) {
          $this->_tpldata['.'][$blockname][$i][$val[1]] = 'start_loop_section_' . $blockname . '_' . $i;
          eval('global $start_loop_section_' . $blockname . '_' . $i . ';');
          eval('$start_loop_section_' . $blockname . '_' . $i . ' = true;');
        }
        $temp = str_replace(
          $val[0], 
          isset($this->_tpldata['.'][$blockname][$i][$val[1]]) ? 
          trim($this->_tpldata['.'][$blockname][$i][$val[1]]) : '', 
          $temp 
        );
      }
      $res .= $temp;
    }
    $content = $res;
    if ($i > 0) {
      global $$blockname;
      $$blockname = true;
    }
    if (!$return) {
      echo $content;
      return '';
    }

    return $content;
  }

  /**
   * Mengurai file PHP dan mengembalikan hasilnya
   * @param string $varfile Nama file PHP
   * @param bool $removeVars Apakah menghapus variabel yang tidak digunakan
   * @param bool $return Apakah mengembalikan hasil
   * @param bool $compress Apakah mengompres hasil
   * @return string Hasil penguraian
   */
  public function SDK(string $varfile, bool $removeVars = false, bool $return = true, bool $compress = false): string
  {
    ob_start();
    require_once($varfile);
    $content = ob_get_contents();
    ob_end_clean();
    $tempfile = tempnam(sys_get_temp_dir(), $varfile);
    $temphandle = fopen($tempfile, "w");
    fwrite($temphandle, $content);
    fclose($temphandle);
    $this->addTempfile($tempfile);
    $content = $this->parseFile($tempfile, $removeVars, true, $compress);
    unlink($tempfile);
    return $this->parse($content, $removeVars, true, $compress);
  }

  /**
   * Mengurai file template
   * @param string $file Nama file template
   * @param bool $removeVars Apakah menghapus variabel yang tidak digunakan
   * @param bool $return Apakah mengembalikan hasil
   * @param bool $compress Apakah mengompres hasil
   * @return string Hasil penguraian file
   */
  public function parseFile(string $file, bool $removeVars = false, bool $return = true, bool $compress = false): string
  {
    try {
      if (!isset($this->files[$file]) || !file_exists($this->files[$file])) {
        throw new Exception("Template file not found: {$this->files[$file]}");
      }

      $fileContent = file_get_contents($this->files[$file]);

      // Proses blok dan bagian template
      $fileContent = $this->processBlocks($fileContent);
      $fileContent = $this->processSections($fileContent);

      // Ganti variabel template
      if (isset($this->_tpldata['.'][$file])) {
        foreach ($this->_tpldata['.'][$file] as $varName => $varVal) {
          $fileContent = str_replace('{' . $varName . '}', $varVal, $fileContent);
        }
      }

      return $this->parse($fileContent, $removeVars, $return, $compress);
    } catch (Exception $e) {
      // Log error atau tangani sesuai kebutuhan
      throw new Exception("Error parsing file: " . $e->getMessage());
    }
  }

  /**
   * Memproses blok dalam konten
   * @param string $content Konten yang akan diproses
   * @return string Hasil pemrosesan blok
   */
  private function processBlocks(string $content): string
  {
    $pattern = "#<!-- App ([a-z0-9_]*) -->([\S\W]*)<!-- END_App \\1 -->#i";
    return preg_replace_callback($pattern, [$this, 'processBlockCallback'], $content);
  }

  /**
   * Callback untuk memproses blok
   * @param array $matches Hasil pencocokan regex
   * @return string Hasil pemrosesan blok
   */
  private function processBlockCallback(array $matches): string
  {
    $blockName = $matches[1];
    $blockContent = $matches[2];

    if (isset($this->_tpldata['.'][$blockName]) && is_array($this->_tpldata['.'][$blockName])) {
      return $this->parseBlock($blockContent, $blockName);
    }

    return $blockContent;
  }

  /**
   * Memproses bagian dalam konten
   * @param string $content Konten yang akan diproses
   * @return string Hasil pemrosesan bagian
   */
  private function processSections(string $content): string
  {
    $pattern = "#<!-- START_SECTION ([a-z0-9_]*) -->([\S\W]*)<!-- STOP_SECTION \\1 -->#i";
    return preg_replace_callback($pattern, [$this, 'processSectionCallback'], $content);
  }

  /**
   * Callback untuk memproses bagian
   * @param array $matches Hasil pencocokan regex
   * @return string Hasil pemrosesan bagian
   */
  private function processSectionCallback(array $matches): string
  {
    $sectionName = $matches[1];
    $sectionContent = $matches[2];

    if ($sectionName === 'donot_compress') {
      return $matches[0];
    }

    if (!empty($this->_section[$sectionName])) {
      return $this->parse($sectionContent);
    }

    return '';
  }
}

?>
