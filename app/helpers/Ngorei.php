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
  private $includeTemplates = [];
  private $filters = [];
    
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
   * Menambahkan template untuk diinclude
   * @param string $key Kunci template
   * @param string $value Path template
   */
  public function includeTemplate(string $key, string $value): void {
    $cleanPath = str_replace('\\', '/', rtrim($value, '/'));
    $this->includeTemplates[$key] = $cleanPath;
  }

  /**
   * Mengurai dan memproses file template yang diinclude
   * @param string &$content Konten yang akan diurai
   */
  private function parseIncludeTemplates(string &$content): void
  {
    foreach ($this->includeTemplates as $key => $value) {
      $pattern = '/\{' . preg_quote($key, '/') . '\:(.*?)\}/';
      $content = preg_replace_callback($pattern, function($matches) use ($value) {
        $fullPath = $value . '/' . $matches[1];
        if (file_exists($fullPath)) {
          $fileContent = file_get_contents($fullPath);
          // Parse konten file untuk memproses variabel template di dalamnya
          return $this->parse($fileContent, true, true, false);
        }
        return ''; // Return kosong jika file tidak ditemukan
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
      // Tambahkan parseAssets sebelum parsing lainnya
      $this->parseAssets($content);
      
      // Proses special variables
      $this->parseSpecialVariables($content);
      
      // Proses include templates
      $this->parseIncludeTemplates($content);
      
      // Proses kondisi if-elseif-else
      $this->processAdvancedConditions($content);
      
      // Update regex untuk menangkap filter
      $content = preg_replace_callback(
        "#\{([a-z0-9_.|()]*)\}#i",
        function($matches) use ($removeVars) {
          // Split variable dan filter
          $parts = explode('|', $matches[1]);
          $varName = trim($parts[0]);
          
          // Ambil nilai dasar
          $value = $this->_tpldata['.'][$varName] ?? (!$removeVars ? $matches[0] : '');
          
          // Terapkan filter jika ada
          for ($i = 1; $i < count($parts); $i++) {
            $filterStr = trim($parts[$i]);
            // Parse filter dan argumennya
            if (preg_match('/^([a-z_]+)(?:\((.*?)\))?$/i', $filterStr, $filterMatches)) {
              $filterName = $filterMatches[1];
              $arguments = isset($filterMatches[2]) ? 
                array_map('trim', explode(',', $filterMatches[2])) : 
                [];
              $value = $this->applyFilter($value, $filterName, $arguments);
            }
          }
          
          return $value;
        },
        $content
      );

      // Proses language tags
      $content = preg_replace_callback(
        "#_lang\{(.*)\}#i",
        function($matches) {
          return $this->showLanguageIndex ? 
            ($this->languageData[$matches[1]] ?? $matches[1]) : 
            ($this->languageData[$matches[1]] ?? '');
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
      $fileContent = $this->processBrief($fileContent);

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

  /**
   * Memproses blok Brief dengan endpoint API
   * @param string $content Konten yang akan diproses
   * @return string Hasil pemrosesan blok Brief
   */
  private function processBrief(string $content): string
  {
    // Pattern untuk menangkap Brief
    $pattern = "#<!-- Brief ([a-z0-9_]*):([A-Z0-9-]*)(?:\|((?:[^>]*)))? -->([\S\W]*)<!-- END_Brief \\1 -->#i";
    
    return preg_replace_callback($pattern, function($matches) {
        $briefName = strtolower($matches[1]);
        $apiEndpoint = $matches[2];
        $params = isset($matches[3]) ? $this->parseParams($matches[3]) : [];
        $briefContent = $matches[4];
        
        try {
            // Proses variabel template dalam endpoint jika ada
            if (preg_match('/{([a-z0-9_]*)}/', $apiEndpoint, $endpointMatches)) {
                $varName = $endpointMatches[1];
                $apiEndpoint = $this->_tpldata['.'][$varName] ?? $apiEndpoint;
            }
            
            // Proses parameter dengan variabel template
            foreach ($params as $key => $value) {
                if (preg_match('/{([a-z0-9_]*)}/', $value, $paramMatches)) {
                    $varName = $paramMatches[1];
                    $params[$key] = $this->_tpldata['.'][$varName] ?? $value;
                }
            }
            
            // Lanjutkan dengan proses normal...
            $cacheKey = md5($apiEndpoint . serialize($params));
            $cachedData = null;
            
            if (!empty($params['cache'])) {
                $cachedData = $this->getCache($cacheKey);
            }
            
            if ($cachedData !== null) {
                $apiData = $cachedData;
            } else {
                $apiData = $this->fetchFromApi($apiEndpoint);
                
                if (!empty($params['cache'])) {
                    $this->setCache($cacheKey, $apiData, (int)$params['cache']);
                }
            }
            
            if (empty($apiData)) {
                return '';
            }

            // Proses export jika diminta
            if (!empty($params['export'])) {
                return $this->processExport($apiData['data'] ?? [], $params);
            }

            // Proses normal jika tidak ada export
            if (isset($apiData['data']) && is_array($apiData['data'])) {
                $items = $apiData['data'];
                $items = $this->processParameters($items, $params);
                
                $result = '';
                foreach ($items as $item) {
                    $processedItem = array_change_key_case($item, CASE_LOWER);
                    $result .= $this->replacePlaceholders($briefContent, $processedItem, $briefName);
                }
                
                return $result;
            }
            
            return '';
            
        } catch (Exception $e) {
            error_log("Error processing Brief block: " . $e->getMessage());
            return '<!-- API Error: ' . htmlspecialchars($e->getMessage()) . ' -->';
        }
    }, $content);
  }

  /**
   * Parse parameter string menjadi array
   * @param string $paramString String parameter
   * @return array Parameter yang sudah di-parse
   */
  private function parseParams(string $paramString): array
  {
    // Proses variabel template terlebih dahulu
    $paramString = preg_replace_callback(
        '/{([a-z0-9_]*)}/',
        function($matches) {
            return $this->_tpldata['.'][$matches[1]] ?? '';
        },
        $paramString
    );

    $params = [
        'start' => 0,
        'limit' => null,
        'sort' => null,
        'order' => 'asc',
        'filter' => null,
        'search' => null,
        'cache' => 0,
        'template' => null
    ];

    $parts = explode('|', $paramString);
    foreach ($parts as $part) {
        if (strpos($part, '=') !== false) {
            list($key, $value) = explode('=', $part);
            $params[trim($key)] = trim($value);
        } elseif (strpos($part, ',') !== false) {
            list($start, $limit) = explode(',', $part);
            $params['start'] = (int)$start;
            $params['limit'] = (int)$limit;
        }
    }

    return $params;
  }

  /**
   * Memproses parameter secara terpisah dan independen
   */
  private function processParameters(array $data, array $params): array 
  {
    $processedData = $data;
    
    // Proses pagination
    if ($this->shouldProcessPagination($params)) {
        $processedData = $this->processPagination($processedData, $params);
    }
    
    // Proses sorting
    if ($this->shouldProcessSorting($params)) {
        $processedData = $this->processSorting($processedData, $params);
    }
    
    // Proses filtering
    if ($this->shouldProcessFilter($params)) {
        $processedData = $this->processFilter($processedData, $params);
    }
    
    // Proses searching
    if ($this->shouldProcessSearch($params)) {
        $processedData = $this->processSearch($processedData, $params);
    }

    // Tambahkan proses grouping dan agregasi
    if ($this->shouldProcessGrouping($params)) {
        $processedData = $this->processGrouping($processedData, $params);
    }

    // Proses export jika diminta
    if ($this->shouldProcessExport($params)) {
        $processedData = $this->processExport($processedData, $params);
    }
    
    return $processedData;
  }

  /**
   * Validasi dan proses pagination
   */
  private function shouldProcessPagination(array $params): bool 
  {
    return isset($params['start']) || isset($params['limit']);
  }

  private function processPagination(array $data, array $params): array 
  {
    $start = (int)($params['start'] ?? 0);
    $limit = isset($params['limit']) ? (int)$params['limit'] : null;
    
    return array_slice($data, $start, $limit);
  }

  /**
   * Validasi dan proses sorting
   */
  private function shouldProcessSorting(array $params): bool 
  {
    return !empty($params['sort']);
  }

  private function processSorting(array $data, array $params): array 
  {
    $sort = $params['sort'];
    $order = strtolower($params['order'] ?? 'asc');
    
    usort($data, function($a, $b) use ($sort, $order) {
        $valueA = $a[$sort] ?? '';
        $valueB = $b[$sort] ?? '';
        
        if (is_numeric($valueA) && is_numeric($valueB)) {
            $comparison = $valueA <=> $valueB;
        } else {
            $comparison = strnatcmp((string)$valueA, (string)$valueB);
        }
        
        return $order === 'asc' ? $comparison : -$comparison;
    });
    
    return $data;
  }

  /**
   * Validasi dan proses filtering
   */
  private function shouldProcessFilter(array $params): bool 
  {
    return !empty($params['filter']);
  }

  private function processFilter(array $data, array $params): array 
  {
    $filters = explode(';', $params['filter']); // Mendukung multiple filter dengan separator ;
    
    foreach ($filters as $filter) {
        list($field, $value) = array_pad(explode(':', $filter), 2, null);
        if ($field && $value !== null) {
            // Cek apakah nilai dalam kurung kurawal (template variable)
            if (preg_match('/{([^}]+)}/', $value, $matches)) {
                $varName = $matches[1];
                // Ambil nilai dari template variable
                $value = $this->_tpldata['.'][$varName] ?? '';
            }
            
            $data = array_filter($data, function($item) use ($field, $value) {
                if (!isset($item[$field])) {
                    return false;
                }
                
                $fieldValue = (string)$item[$field];
                $searchValue = (string)$value;
                
                // Lakukan pencarian exact match
                return strcasecmp($fieldValue, $searchValue) === 0;
            });
        }
    }
    
    return array_values($data);
  }

  /**
   * Validasi dan proses searching
   */
  private function shouldProcessSearch(array $params): bool 
  {
    return !empty($params['search']);
  }

  private function processSearch(array $data, array $params): array 
  {
    $search = strtolower($params['search']);
    $searchFields = isset($params['search_fields']) ? 
                   explode(',', $params['search_fields']) : 
                   null;
    
    return array_filter($data, function($item) use ($search, $searchFields) {
        foreach ($item as $field => $value) {
            // Jika search_fields ditentukan, hanya cari di field tersebut
            if ($searchFields && !in_array($field, $searchFields)) {
                continue;
            }
            
            if (is_string($value) && 
                strpos(strtolower($value), $search) !== false) {
                return true;
            }
        }
        return false;
    });
  }

  /**
   * Render konten Brief dengan data
   * @param string $template Template konten
   * @param array $data Data untuk rendering
   * @param string $prefix Prefix untuk akses data (artikel/row)
   * @param array $params Parameter tambahan
   * @return string Hasil render
   */
  private function renderBriefContent(string $template, array $data, string $prefix, array $params = []): string 
  {
    if (isset($data['data']) && is_array($data['data'])) {
        $items = $data['data'];
        
        // Proses semua parameter secara independen
        $items = $this->processParameters($items, $params);
        
        $result = '';
        foreach ($items as $item) {
            $result .= $this->replacePlaceholders($template, $item, $prefix);
        }
        
        return $result;
    }
    return '';
  }

  /**
   * Ganti placeholder dengan nilai sebenarnya
   * @param string $template Template
   * @param array $data Data
   * @param string $prefix Prefix untuk akses data
   * @return string Hasil replacement
   */
  private function replacePlaceholders(string $template, array $data, string $prefix): string
  {
    $result = $template;
    
    // Ubah data menjadi format nested dengan prefix dinamis
    $nestedData = [
      $prefix => $data
    ];
    
    // Proses placeholder dengan format nested
    $result = preg_replace_callback(
      '/{([a-z0-9_.]+)\|?([^}]*)}?/i',
      function($matches) use ($nestedData) {
        $fullMatch = $matches[0];
        $path = strtolower($matches[1]); // Konversi path ke lowercase
        $filters = !empty($matches[2]) ? explode('|', $matches[2]) : [];
        
        // Split path untuk nested access
        $keys = explode('.', $path);
        $value = $nestedData;
        
        // Traverse nested array
        foreach ($keys as $key) {
          $key = strtolower($key); // Konversi key ke lowercase
          if (!isset($value[$key])) {
            return $fullMatch; // Return original jika key tidak ditemukan
          }
          $value = $value[$key];
        }
        
        // Terapkan filter jika ada
        foreach ($filters as $filter) {
          $filter = trim($filter);
          if (!empty($filter)) {
            // Parse filter dan argumennya
            if (preg_match('/^([a-z_]+)(?:\((.*?)\))?$/i', $filter, $filterMatches)) {
              $filterName = $filterMatches[1];
              $arguments = isset($filterMatches[2]) ? 
                array_map('trim', explode(',', $filterMatches[2])) : 
                [];
              $value = $this->applyFilter($value, $filterName, $arguments);
            }
          }
        }
        
        return is_array($value) ? json_encode($value) : (string)$value;
      },
      $result
    );
    
    return $result;
  }

  /**
   * Mengambil data dari API menggunakan CURL POST
   * @param string $endpoint ID endpoint API
   * @return array Data dari API
   * @throws Exception jika ada error
   */
  private function fetchFromApi(string $endpoint): array
  {
    try {
      $curl = curl_init();
      $apiConfig = $this->getApiConfig();
      
      curl_setopt_array($curl, array(
        CURLOPT_URL => $apiConfig['base_url'] . "sdk/{$endpoint}",
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_ENCODING => '',
        CURLOPT_MAXREDIRS => 10,
        CURLOPT_TIMEOUT => 0,
        CURLOPT_FOLLOWLOCATION => true,
        CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
        CURLOPT_CUSTOMREQUEST => 'POST',
        // Tambahkan header API key jika diperlukan
        CURLOPT_HTTPHEADER => [
          'API-KEY:'.$apiConfig['api_key']
        ],
      ));

      $response = curl_exec($curl);
      
      if (curl_errno($curl)) {
        throw new Exception('Curl error: ' . curl_error($curl));
      }
      
      curl_close($curl);
      
      $data = json_decode($response, true);
      if (json_last_error() !== JSON_ERROR_NONE) {
        throw new Exception('Invalid JSON response');
      }
      
      return $data;
      
    } catch (Exception $e) {
      error_log("API fetch failed for endpoint $endpoint: " . $e->getMessage());
      throw new Exception('API fetch failed: ' . $e->getMessage());
    }
  }

  /**
   * Mengambil konfigurasi API
   * @return array Konfigurasi API
   */
  private function getApiConfig(): array
  {
    $con = Tds::config();
    return [
      'base_url' => $con['endpoint'],
      'api_key' => $con['cradensial'] 
    ];
  }

  /**
   * Memproses parameter if dalam Brief
   * @param array $data Data yang akan diproses
   * @param array $params Parameter Brief
   * @return array Data yang telah difilter
   */
  private function processIfParameter(array $data, array $params): array 
  {
      if (empty($params['if'])) return $data;
      
      list($field, $value) = explode(':', $params['if']);
      return array_filter($data, function($item) use ($field, $value) {
          return $item[$field] == $value;
      });
  }

  /**
   * Memproses kondisi dalam konten
   * @param string $content Konten template
   * @param array $data Data untuk evaluasi
   * @return string Hasil proses
   */
  private function processIfConditions(string $content, array $data): string 
  {
      $pattern = '/\{if:(.*?)\}(.*?)(?:\{elseif:(.*?)\}(.*?))*(?:\{else\}(.*?))?\{endif\}/s';
      
      return preg_replace_callback($pattern, function($matches) use ($data) {
          $condition = trim($matches[1]);
          $ifContent = $matches[2];
          $elseContent = $matches[3] ?? '';
          
          // Evaluasi kondisi
          $result = $this->evaluateSimpleCondition($condition, $data);
          
          return $result ? $ifContent : $elseContent;
      }, $content);
  }

  /**
   * Evaluasi kondisi sederhana
   * @param string $condition Kondisi yang akan dievaluasi
   * @param array $data Data untuk evaluasi
   * @return bool Hasil evaluasi
   */
  private function evaluateSimpleCondition(string $condition, array $data): bool 
  {
      // Cek operator
      $operators = [
          ':' => '==',    // field:value
          '=' => '==',    // field=value
          '!=' => '!=',   // field!=value
          '>' => '>',     // field>value
          '<' => '<',     // field<value
          '>=' => '>=',   // field>=value
          '<=' => '<=',   // field<=value
      ];
      
      foreach ($operators as $symbol => $operator) {
          if (strpos($condition, $symbol) !== false) {
              list($field, $value) = array_map('trim', explode($symbol, $condition, 2));
              return $this->compareValue($data[$field] ?? null, $value, $operator);
          }
      }
      
      // Jika tidak ada operator, cek keberadaan field
      return !empty($data[$condition]);
  }

  /**
   * Membandingkan nilai
   * @param mixed $fieldValue Nilai field
   * @param mixed $compareValue Nilai pembanding
   * @param string $operator Operator perbandingan
   * @return bool Hasil perbandingan
   */
  private function compareValue($fieldValue, $compareValue, string $operator): bool 
  {
      // Hapus tanda kutip jika ada
      $compareValue = trim($compareValue, '"\'');
      
      switch ($operator) {
          case '==':
              return $fieldValue == $compareValue;
          case '!=':
              return $fieldValue != $compareValue;
          case '>':
              return $fieldValue > $compareValue;
          case '<':
              return $fieldValue < $compareValue;
          case '>=':
              return $fieldValue >= $compareValue;
          case '<=':
              return $fieldValue <= $compareValue;
          default:
              return false;
      }
  }

  /**
   * Mendaftarkan filter baru
   * @param string $name Nama filter
   * @param callable $callback Function filter
   */
  public function addFilter(string $name, callable $callback): void 
  {
    $this->filters[$name] = $callback;
  }
  
  /**
   * Menerapkan filter pada nilai
   * @param mixed $value Nilai yang akan difilter
   * @param string $filter Nama filter
   * @param array $arguments Argument tambahan
   * @return mixed Nilai hasil filter
   */
  private function applyFilter($value, string $filter, array $arguments = []) 
  {
    // Cek apakah filter ada
    if (isset($this->filters[$filter])) {
      return call_user_func_array($this->filters[$filter], [$value, ...$arguments]);
    }
    
    // Filter bawaan
    switch($filter) {
        case 'number_format':
            // Pastikan nilai adalah numerik sebelum diformat
            if (is_numeric($value)) {
                $decimals = $arguments[0] ?? 0;
                $decPoint = $arguments[1] ?? ',';
                $thousandsSep = $arguments[2] ?? '.';
                return number_format((float)$value, $decimals, $decPoint, $thousandsSep);
            }
            return $value;
            
        case 'upper':
            return strtoupper($value);
            
        case 'lower':
            return strtolower($value);
            
        case 'readmore':
            return $this->truncateText($value, ...$arguments);
            
        case 'date':
            // Format tanggal dengan format custom
            // Penggunaan: {tanggal|date(Y-m-d)}
            $format = $arguments[0] ?? 'Y-m-d H:i:s';
            return date($format, strtotime($value));
            
        case 'currency':
            // Format mata uang
            // Penggunaan: {harga|currency(IDR)}
            if (!is_numeric($value)) return $value;
            $currency = $arguments[0] ?? 'IDR';
            $decimals = $arguments[1] ?? 0;
            return $currency . ' ' . number_format((float)$value, $decimals, ',', '.');
            
        case 'nl2br':
            // Konversi newline ke <br>
            // Penggunaan: {deskripsi|nl2br}
            return nl2br($value);
            
        case 'limit_words':
            // Batasi jumlah kata
            // Penggunaan: {content|limit_words(20,...)}
            $limit = (int)($arguments[0] ?? 20);
            $end = $arguments[1] ?? '...';
            $words = str_word_count($value, 2);
            if (count($words) > $limit) {
                return implode(' ', array_slice($words, 0, $limit)) . $end;
            }
            return $value;
            
        case 'strip_tags':
            // Hapus HTML tags
            // Penggunaan: {content|strip_tags}
            return strip_tags($value);
            
        case 'escape':
            // Escape HTML entities
            // Penggunaan: {content|escape}
            return htmlspecialchars($value, ENT_QUOTES, 'UTF-8');
            
        case 'trim':
            // Trim whitespace
            // Penggunaan: {text|trim}
            return trim($value);
            
        case 'md5':
            // Generate MD5 hash
            // Penggunaan: {text|md5}
            return md5($value);
            
        case 'json':
            // Encode/decode JSON
            // Penggunaan: {data|json}
            return is_string($value) ? json_decode($value, true) : json_encode($value);
            
        case 'ucfirst':
            // Kapital huruf pertama
            // Penggunaan: {nama|ucfirst}
            return ucfirst(strtolower($value));
            
        case 'ucwords':
            // Kapital setiap kata
            // Penggunaan: {judul|ucwords} 
            return ucwords(strtolower($value));
            
        case 'slug':
            // Generate URL slug
            // Penggunaan: {judul|slug}
            $text = strtolower($value);
            $text = preg_replace('/[^a-z0-9\-]/', '-', $text);
            return trim(preg_replace('/-+/', '-', $text), '-');
            
        case 'phone':
            // Format nomor telepon
            // Penggunaan: {telepon|phone}
            $number = preg_replace('/[^0-9]/', '', $value);
            if (strlen($number) > 10) {
                return substr($number, 0, 4) . '-' . substr($number, 4, 4) . '-' . substr($number, 8);
            }
            return $value;
            
        default:
            return $value;
    }
  }
  
  /**
   * Memotong teks dengan panjang tertentu
   */
  private function truncateText(string $text, int $length = 100, string $append = '...'): string 
  {
    if (mb_strlen($text) <= $length) {
      return $text;
    }
    return rtrim(mb_substr($text, 0, $length)) . $append;
  }

  /**
   * Validasi dan proses grouping
   */
  private function shouldProcessGrouping(array $params): bool 
  {
    return !empty($params['group']) || !empty($params['aggregate']);
  }

  /**
   * Memproses grouping dan agregasi data
   */
  private function processGrouping(array $data, array $params): array 
  {
    $result = [];
    
    // Proses group by
    if (!empty($params['group'])) {
        $groupFields = explode(',', $params['group']);
        
        foreach ($data as $item) {
            $groupKey = [];
            foreach ($groupFields as $field) {
                $groupKey[] = $item[trim($field)] ?? '';
            }
            $key = implode('|', $groupKey);
            $result[$key][] = $item;
        }
        
        // Proses agregasi jika ada
        if (!empty($params['aggregate'])) {
            foreach ($result as &$group) {
                $group = $this->calculateAggregates($group, $params['aggregate']);
            }
        }
        
        // Format hasil akhir
        return array_values($result);
    }
    
    return $data;
  }

  /**
   * Menghitung nilai agregasi
   */
  private function calculateAggregates(array $group, string $aggregateParams): array 
  {
    $aggregates = explode(',', $aggregateParams);
    $result = ['items' => $group];
    
    foreach ($aggregates as $agg) {
        list($function, $field) = explode(':', trim($agg));
        
        switch (strtolower($function)) {
            case 'sum':
                $result[$function . '_' . $field] = array_sum(array_column($group, $field));
                break;
            case 'avg':
                $values = array_column($group, $field);
                $result[$function . '_' . $field] = count($values) ? array_sum($values) / count($values) : 0;
                break;
            case 'count':
                $result[$function . '_' . $field] = count($group);
                break;
            case 'min':
                $result[$function . '_' . $field] = min(array_column($group, $field));
                break;
            case 'max':
                $result[$function . '_' . $field] = max(array_column($group, $field));
                break;
        }
    }
    
    return $result;
  }

  /**
   * Validasi dan proses export
   */
  private function shouldProcessExport(array $params): bool 
  {
    return !empty($params['export']);
  }

  /**
   * Memproses export data ke berbagai format
   */
  private function processExport(array $data, array $params): string 
  {
    if (empty($data)) {
        header('Content-Type: application/json');
        return json_encode(['error' => 'Data kosong']);
    }

    $format = strtolower($params['export']);
    
    switch($format) {
        case 'json':
            header('Content-Type: application/json');
            return json_encode([
                'status' => 'success',
                'data' => $data,
                'total' => count($data)
            ]);

        case 'csv':
            header('Content-Type: text/csv');
            header('Content-Disposition: attachment; filename="export_'.date('Y-m-d').'.csv"');
            return $this->exportToCsv($data);

        case 'excel':
            header('Content-Type: application/vnd.ms-excel');
            header('Content-Disposition: attachment; filename="export_'.date('Y-m-d').'.xls"');
            return $this->exportToExcel($data);

        case 'xml':
            header('Content-Type: application/xml; charset=utf-8');
            header('Content-Disposition: attachment; filename="export_'.date('Y-m-d').'.xml"');
            return $this->exportToXml($data);

        default:
            throw new Exception("Format export tidak didukung: $format");
    }
  }

  /**
   * Export data ke format CSV
   */
  private function exportToCsv(array $data): string 
  {
    if (empty($data)) return '';
    
    $output = fopen('php://temp', 'r+');
    
    // Tulis header
    fputcsv($output, array_keys(reset($data)));
    
    // Tulis data
    foreach ($data as $row) {
        fputcsv($output, array_values($row));
    }
    
    rewind($output);
    $csv = stream_get_contents($output);
    fclose($output);
    
    return $csv;
  }

  /**
   * Export data ke format XML
   */
  private function exportToXml(array $data): string 
  {
    $xml = new \SimpleXMLElement('<?xml version="1.0" encoding="UTF-8"?><data></data>');
    
    foreach ($data as $item) {
        $record = $xml->addChild('record');
        foreach ($item as $key => $value) {
            $record->addChild($key, htmlspecialchars((string)$value));
        }
    }
    
    return $xml->asXML();
  }

  /**
   * Export data ke format Excel
   */
  private function exportToExcel(array $data): string 
  {
    $output = "<table border='1'>\n";
    
    // Header
    $output .= "<tr>";
    foreach (array_keys(reset($data)) as $header) {
        $output .= "<th>" . htmlspecialchars($header) . "</th>";
    }
    $output .= "</tr>\n";
    
    // Data
    foreach ($data as $row) {
        $output .= "<tr>";
        foreach ($row as $value) {
            $output .= "<td>" . htmlspecialchars((string)$value) . "</td>";
        }
        $output .= "</tr>\n";
    }
    
    $output .= "</table>";
    
    return $output;
  }

  /**
   * Cache system
   */
  private function processCaching(string $endpoint, array $params): ?array 
  {
    if (empty($params['cache'])) {
        return null;
    }

    $cacheKey = $this->generateCacheKey($endpoint, $params);
    $cacheDuration = (int)$params['cache']; // Dalam detik

    // Cek cache
    $cachedData = $this->getCache($cacheKey);
    if ($cachedData !== null) {
        return $cachedData;
    }

    // Fetch data baru
    $data = $this->fetchFromApi($endpoint);
    $this->setCache($cacheKey, $data, $cacheDuration);
    
    return $data;
  }

  /**
   * Generate cache key
   */
  private function generateCacheKey(string $endpoint, array $params): string 
  {
    return md5($endpoint . serialize($params));
  }

  /**
   * Get data dari cache
   */
  private function getCache(string $key): ?array 
  {
    try {
        $cacheDir = dirname(__DIR__) . '/cache';
        $cacheFile = $cacheDir . '/ngorei_cache_' . $key;
        
        error_log("Mencoba membaca cache dari: " . $cacheFile);
        
        if (file_exists($cacheFile)) {
            $content = file_get_contents($cacheFile);
            if ($content === false) {
                error_log("Gagal membaca file cache");
                return null;
            }
            
            $cache = unserialize($content);
            if ($cache === false) {
                error_log("Gagal unserialize cache");
                return null;
            }
            
            if ($cache['expires'] > time()) {
                error_log("Cache masih valid, mengembalikan data cache");
                return $cache['data'];
            }
            
            error_log("Cache sudah expired, menghapus file cache");
            unlink($cacheFile);
        }
        
        error_log("Cache tidak ditemukan");
        return null;
        
    } catch (Exception $e) {
        error_log("Error saat membaca cache: " . $e->getMessage());
        return null;
    }
  }

  /**
   * Set data ke cache
   */
  private function setCache(string $key, array $data, int $duration): void 
  {
    try {
        $cacheDir = dirname(__DIR__) . '/cache';
        
        error_log("Mencoba menyimpan cache di: " . $cacheDir);
        
        // Buat direktori cache jika belum ada
        if (!is_dir($cacheDir)) {
            error_log("Membuat direktori cache...");
            if (!mkdir($cacheDir, 0777, true)) {
                throw new Exception("Gagal membuat direktori cache");
            }
            chmod($cacheDir, 0777);
        }
        
        $cacheFile = $cacheDir . '/ngorei_cache_' . $key;
        $cache = [
            'expires' => time() + $duration,
            'data' => $data
        ];
        
        error_log("Menulis cache ke: " . $cacheFile);
        if (file_put_contents($cacheFile, serialize($cache)) === false) {
            throw new Exception("Gagal menulis file cache");
        }
        
        error_log("Cache berhasil disimpan");
        
    } catch (Exception $e) {
        error_log("Error saat menyimpan cache: " . $e->getMessage());
    }
  }

  /**
   * Memproses kondisi if-elseif-else dalam template
   * @param string $content Konten template
   * @return string Hasil proses
   */
  private function processAdvancedConditions(string &$content): void
  {
      $pattern = '/\{if:(.*?)\}(.*?)(?:\{elseif:(.*?)\}(.*?))*(?:\{else\}(.*?))?\{endif\}/s';
      
      $content = preg_replace_callback($pattern, function($matches) {
          // Ekstrak kondisi if utama dan kontennya
          $mainCondition = $this->parseCondition(trim($matches[1]));
          $ifContent = $matches[2];
          
          // Evaluasi kondisi if utama
          if ($this->evaluateCondition($mainCondition)) {
              return $this->parseTemplateVariables($ifContent);
          }
          
          // Cari dan evaluasi semua elseif
          $fullContent = $matches[0];
          if (preg_match_all('/\{elseif:(.*?)\}(.*?)(?=\{elseif|{else|{endif})/s', $fullContent, $elseifMatches)) {
              for ($i = 0; $i < count($elseifMatches[1]); $i++) {
                  $elseifCondition = $this->parseCondition(trim($elseifMatches[1][$i]));
                  if ($this->evaluateCondition($elseifCondition)) {
                      return $this->parseTemplateVariables($elseifMatches[2][$i]);
                  }
              }
          }
          
          // Jika ada else, ambil kontennya
          if (preg_match('/\{else\}(.*?)\{endif\}/s', $fullContent, $elseMatch)) {
              return $this->parseTemplateVariables($elseMatch[1]);
          }
          
          return '';
      }, $content);
  }

  /**
   * Parse kondisi dari template
   * @param string $condition Kondisi yang akan diparsing
   * @return array Hasil parsing kondisi
   */
  private function parseCondition(string $condition): array
  {
      $result = [
          'left' => '',
          'operator' => '',
          'right' => ''
      ];
      
      // Pisahkan kondisi berdasarkan operator
      if (strpos($condition, '==') !== false) {
          list($left, $right) = array_map('trim', explode('==', $condition));
          $result['operator'] = '==';
      } elseif (strpos($condition, '!=') !== false) {
          list($left, $right) = array_map('trim', explode('!=', $condition));
          $result['operator'] = '!=';
      } else {
          return $result;
      }

      // Parse nilai kiri
      if (preg_match('/^"([^"]*)"$/', $left, $matches)) {
          // Jika string dengan kutip
          $result['left'] = $matches[1];
      } elseif (preg_match('/^\{([a-z0-9_]+)\}$/i', $left, $matches)) {
          // Jika variabel dalam kurung kurawal
          $result['left'] = $this->_tpldata['.'][$matches[1]] ?? '';
      } else {
          // Jika variabel biasa
          $result['left'] = $this->_tpldata['.'][$left] ?? $left;
      }

      // Parse nilai kanan
      if (preg_match('/^"([^"]*)"$/', $right, $matches)) {
          // Jika string dengan kutip
          $result['right'] = $matches[1];
      } elseif (preg_match('/^\{([a-z0-9_]+)\}$/i', $right, $matches)) {
          // Jika variabel dalam kurung kurawal
          $result['right'] = $this->_tpldata['.'][$matches[1]] ?? '';
      } else {
          // Jika variabel biasa
          $result['right'] = $this->_tpldata['.'][$right] ?? $right;
      }

      return $result;
  }

  /**
   * Evaluasi kondisi yang sudah diparsing
   * @param array $condition Kondisi yang akan dievaluasi
   * @return bool Hasil evaluasi
   */
  private function evaluateCondition(array $condition): bool
  {
      if (empty($condition['operator'])) {
          return false;
      }
      
      $left = (string)$condition['left'];
      $right = (string)$condition['right'];

      switch ($condition['operator']) {
          case '==':
              return $left === $right;
          case '!=':
              return $left !== $right;
          default:
              return false;
      }
  }

  /**
   * Parse variabel template dalam konten
   * @param string $content Konten yang akan diparsing
   * @return string Hasil parsing
   */
  private function parseTemplateVariables(string $content): string
  {
      return preg_replace_callback(
          '/{([a-z0-9_]+)(?:\|([^}]+))?}/i',
          function($matches) {
              $varName = $matches[1];
              $value = $this->_tpldata['.'][$varName] ?? '';
              
              // Proses filter jika ada
              if (isset($matches[2])) {
                  $filters = explode('|', $matches[2]);
                  foreach ($filters as $filter) {
                      $value = $this->applyFilter($value, $filter);
                  }
              }
              
              return $value;
          },
          $content
      );
  }

  /**
   * Property untuk menyimpan layout dan blocks
   */
  private $layouts = [];
  private $blocks = [];
  private $currentBlock = null;

  /**
   * Mendaftarkan layout baru
   * @param string $name Nama layout
   * @param string $template Konten template layout
   */
  public function setLayout(string $name, string $template): void 
  {
    $this->layouts[$name] = $template;
  }

  /**
   * Menggunakan layout yang sudah didefinisikan
   * @param string $name Nama layout
   * @param array $data Data untuk layout
   * @return string Hasil render layout
   */
  public function extendLayout(string $name, array $data = []): string 
  {
    if (!isset($this->layouts[$name])) {
        throw new NgoreiException("Layout '$name' tidak ditemukan");
    }
    
    // Set data untuk layout
    foreach ($data as $key => $value) {
        $this->val($key, $value);
    }
    
    $content = $this->layouts[$name];
    
    // Parse blocks dalam layout
    $content = $this->parseBlocks($content);
    
    // Parse konten normal
    return $this->parse($content);
  }

  /**
   * Mendefinisikan block dalam template
   * @param string $name Nama block
   * @param string $content Konten block
   */
  public function setBlock(string $name, string $content): void 
  {
    $this->blocks[$name] = $content;
  }

  /**
   * Memulai pendefinisian block
   * @param string $name Nama block
   */
  public function startBlock(string $name): void 
  {
    $this->currentBlock = $name;
    ob_start();
  }

  /**
   * Mengakhiri pendefinisian block
   */
  public function endBlock(): void 
  {
    if ($this->currentBlock === null) {
        throw new NgoreiException("Tidak ada block yang sedang aktif");
    }
    
    $content = ob_get_clean();
    $this->blocks[$this->currentBlock] = $content;
    $this->currentBlock = null;
  }

  /**
   * Mengambil konten block
   * @param string $name Nama block
   * @param string $default Konten default jika block tidak ada
   * @return string Konten block
   */
  public function getBlock(string $name, string $default = ''): string 
  {
    return $this->blocks[$name] ?? $default;
  }

  /**
   * Parse blocks dalam template
   * @param string $content Konten template
   * @return string Hasil parsing
   */
  private function parseBlocks(string $content): string 
  {
    // Parse @block directives
    $content = preg_replace_callback('/@block\(([^)]+)\)/', function($matches) {
        $blockName = trim($matches[1], '"\'');
        return $this->getBlock($blockName);
    }, $content);
    
    // Parse @hasBlock directives
    $content = preg_replace_callback('/@hasBlock\(([^)]+)\)(.*?)@endHasBlock/s', function($matches) {
        $blockName = trim($matches[1], '"\'');
        return isset($this->blocks[$blockName]) ? $matches[2] : '';
    }, $content);
    
    return $content;
  }

  // Tambahkan property untuk assets
  private $assets = [
      'header' => [],
      'footer' => []
  ];

  private $assetHost ='./'; // Tambah property untuk host

  /**
   * Set host domain untuk assets
   * @param string $host Host domain (contoh: https://example.com)
   */
  public function setAssetHost(string $host): void
  {
      $this->assetHost = rtrim($host, '/');
  }

  /**
   * Menambahkan assets (CSS/JS) ke template dengan posisi yang tepat
   * @param string|array $files Path file atau array path files
   * @param string $position Posisi asset (header/footer)
   * @param array $attributes Atribut tambahan untuk tag
   */
  public function setAssets($files, string $position = 'header', array $attributes = []): void
  {
      // Validasi input
      if (!is_string($files) && !is_array($files)) {
          throw new Exception("Assets must be string or array");
      }
      
      if (!isset($this->assets[$position])) {
          $this->assets[$position] = [];
      }

      // Normalize input
      $files = (array)$files;

      // Process files
      foreach ($files as $file) {
          if (!is_string($file) || empty(trim($file))) {
              continue;
          }

          try {
              // CSS selalu di header
              $actualPosition = (pathinfo($file, PATHINFO_EXTENSION) === 'css') ? 'header' : $position;
              
              if (strpos($file, 'module|') === 0) {
                  $this->processModuleAsset($file, $actualPosition, $attributes);
              } else {
                  $this->processRegularAsset($file, $actualPosition, $attributes);
              }
          } catch (Exception $e) {
              error_log("Asset processing error: " . $e->getMessage());
          }
      }

      // Update template
      if (isset($this->assets['header'])) {
          $this->val("assets.header", implode("\n", $this->assets['header']));
      }
      if (isset($this->assets['footer'])) {
          $this->val("assets.footer", implode("\n", $this->assets['footer']));
      }
  }

  /**
   * Menentukan posisi yang tepat untuk asset
   * @param string $file Path file
   * @param string $defaultPosition Posisi default
   * @return string Posisi yang ditentukan
   */

  /**
   * Proses module asset
   */
  private function processModuleAsset(string $file, string $position, array $attributes): void
  {
      $actualFile = substr($file, 7); // Hapus 'module|'
      if (empty(trim($actualFile))) {
          return;
      }

      $url = $this->buildAssetUrl($actualFile);
      // Hapus indentasi tambahan untuk script module
      $this->assets[$position][] = sprintf('<script type="module" src="%s"></script>',
          htmlspecialchars($url, ENT_QUOTES, 'UTF-8')
      );
  }

  /**
   * Proses regular asset
   */
  private function processRegularAsset(string $file, string $position, array $attributes): void
  {
      $url = $this->buildAssetUrl($file);
      $ext = strtolower(pathinfo($file, PATHINFO_EXTENSION));

      if (empty($ext)) {
          throw new Exception("File extension required: $file");
      }
      
      switch ($ext) {
          case 'css':
              $attrs = $this->buildAttributes(array_merge($attributes, ['rel' => 'stylesheet']));
              $this->assets[$position][] = sprintf('<link%s href="%s">',
                  $attrs,
                  htmlspecialchars($url, ENT_QUOTES, 'UTF-8')
              );
              break;

          case 'js':
              $attrs = $this->buildAttributes($attributes);
              // Pastikan semua script (termasuk module) menggunakan format yang sama
              $this->assets[$position][] = sprintf('<script%s src="%s"></script>',
                  $attrs,
                  htmlspecialchars($url, ENT_QUOTES, 'UTF-8')
              );
              break;

          default:
              throw new Exception("Unsupported asset type: $ext");
      }
  }

  /**
   * Build asset URL
   */
  private function buildAssetUrl(string $path): string
  {
      $path = $this->sanitizePath($path);
      
      if (preg_match('/^(https?:)?\/\//i', $path)) {
          return $path;
      }

      return rtrim($this->assetHost, '/') . '/' . ltrim($path, '/');
  }

  /**
   * Sanitize file path
   */
  private function sanitizePath(string $path): string
  {
      return str_replace(['../', './'], '', trim($path));
  }

  /**
   * Build HTML attributes string
   */
  private function buildAttributes(array $attributes): string
  {
      $attrs = [];
      foreach ($attributes as $key => $value) {
          if ($value === true) {
              $attrs[] = htmlspecialchars($key);
          } elseif ($value !== false && $value !== null) {
              $attrs[] = sprintf(
                  '%s="%s"',
                  htmlspecialchars($key),
                  htmlspecialchars($value)
              );
          }
      }
      return empty($attrs) ? '' : ' ' . implode(' ', $attrs);
  }

  /**
   * Mendapatkan assets untuk posisi tertentu
   * @param string $position Posisi asset (header/footer)
   * @return string HTML assets
   */
  public function getAssets(string $position): string
  {
      return implode("\n", $this->assets[$position] ?? []);
  }

  /**
   * Membersihkan assets untuk posisi tertentu
   * @param string $position Posisi asset (header/footer)
   * @return void
   */
  public function clearAssets(string $position): void
  {
      if (isset($this->assets[$position])) {
          $this->assets[$position] = [];
          $this->val("assets.{$position}", '');
      }
  }

  private function parseAssets(string &$content): void 
  {
    // Parse header assets dengan indentasi yang tepat
    $content = preg_replace_callback(
        '/<!-- assets\.header -->/',
        function() {
            $assets = $this->getAssets('header');
            // Tambahkan 4 spasi di awal setiap baris
            $lines = explode("\n", $assets);
            $indentedLines = array_map(function($line) {
                return "    " . $line;
            }, $lines);
            return implode("\n", $indentedLines);
        },
        $content
    );

    // Parse footer assets dengan indentasi yang tepat
    $content = preg_replace_callback(
        '/<!-- assets\.footer -->/',
        function() {
            $assets = $this->getAssets('footer');
            // Tambahkan 2 spasi di awal setiap baris
            $lines = explode("\n", $assets);
            $indentedLines = array_map(function($line) {
                return "  " . $line;
            }, $lines);
            return implode("\n", $indentedLines);
        },
        $content
    );
  }

}

?>
