<?php
namespace app;
use app\TdsWjt as Wjt;
use Phpfastcache\CacheManager;
use Phpfastcache\Config\ConfigurationOption;
use Endroid\QrCode\QrCode;
use Endroid\QrCode\Writer\PngWriter;
use Endroid\QrCode\Color\Color;
class Tds {
    private $host;
    private $directory;
    private $controllers;
    private $uid;
    private $cache;

    // Konstruktor
    public function __construct($base = 'index') {
        // Mendapatkan direktori root proyek
        $this->host = HOST.'/';
        $this->host = HOST.'/';
        $this->directory = ROOT; // Or some actual directory value
        $this->controllers =CRTL; 
    }

    /*
    |--------------------------------------------------------------------------
    | Initializes dir 
    |--------------------------------------------------------------------------
    | Develover Tatiye.Net 2020
    |
    */
    public static function dir($dir = '') {
        return ROOT . $dir;
    } 

    public static function QRcode($url, $width =250,$margin=0) {
        try {
            // Konfigurasi QR Code
            $qrCode = QrCode::create($url)
                ->setSize($width)          // Ukuran QR Code (pixel)
                ->setMargin($margin)         // Margin/padding (pixel)
                ->setForegroundColor(new Color(0, 0, 0))     // Warna QR (hitam)
                ->setBackgroundColor(new Color(255, 255, 255)); // Warna background (putih)

            // Generate QR Code
            $writer = new PngWriter();
            $result = $writer->write($qrCode);
            return $result->getDataUri();
            
        } catch (Exception $e) {
            return 'Gagal menggenerate QR Code: ' . $e->getMessage();
        }
     }
      /* and class oauth */
     public static function getWJT($token){
        $GetID=self::WJT($token); 
        return $GetID;
      }

       public static function headerContent($key){
               error_reporting(0);
               // header("Access-Control-Allow-Origin:".self::LINK());
               header("Access-Control-Allow-Origin:*");
               header("Content-Type: application/json; charset=UTF-8");
               header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
               // header("Access-Control-Allow-Methods: ".$key);
               header("Access-Control-Allow-Credentials: true");
               header("Access-Control-Max-Age: 3600");
               header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
           
       }


    public static function WJT($options='',$key=''){
        if(is_array($options)) {
             return Wjt::init()->array($options)->Encode();
        } else {
            if (!empty($key)) {
                return Wjt::init()->token($options)->Decode($key);
            } else {
               return Wjt::init()->token($options)->code();
            }   
        }
    }

     public static function imgPath($img=''){
       $Exp=array();
       $filePath = CRTL . 'elements.json';
        if (!file_exists($filePath)) {
            throw new Exception("File tidak ditemukan: " . $filePath);
        }
        $navigasiData = file_get_contents($filePath);
        $variable = json_decode($navigasiData, true);
        // Tambahkan direktori yang ingin ditampilkan
        $customDir =ROOT.'/assets/images';
        $Exp2=array();
        $subfolders = ['doc', 'logo', 'topik'];
         foreach ($subfolders as $index => $subfolder) {
                    $Exp2['img'.$index]=$customDir.'/'.$subfolder;
         }
         $variable['custom'] =$Exp2;
        foreach ($variable as $key1 => $value) {
             foreach ($value as $key => $row) {
                $files = ($key1 === 'custom') ? $row : Tds::dir('/'.$row);
                if (!is_dir($files)) {
                } else {
                    $fileList = scandir($files);
                    if (empty($fileList)) {
                    } else {
                        foreach ($fileList as $file) {
                            if ($file != "." && $file != "..") {
                                $fullPath = $files . DIRECTORY_SEPARATOR . $file;
                                $ext = pathinfo($fullPath, PATHINFO_EXTENSION);
                                if (in_array(strtolower($ext), ['jpg', 'jpeg', 'png', 'gif', 'svg'])) {
                                    if ($file==$img) {
                                       return $files.'/'.$file;
                                    } 

                                }
                            }
                        }
                    }
                }
             }
        }
    }



     public static function workerImg(){
       $Exp=array();
       $filePath = CRTL . 'elements.json';
        if (!file_exists($filePath)) {
            throw new Exception("File tidak ditemukan: " . $filePath);
        }
        $navigasiData = file_get_contents($filePath);
        $variable = json_decode($navigasiData, true);
        // Tambahkan direktori yang ingin ditampilkan
        $customDir =ROOT.'/assets/images';
        $Exp2=array();
        $subfolders = ['doc', 'logo', 'topik'];
         foreach ($subfolders as $index => $subfolder) {
                    $Exp2['img'.$index]=$customDir.'/'.$subfolder;
         }
         $variable['custom'] =$Exp2;
        foreach ($variable as $key1 => $value) {
             foreach ($value as $key => $row) {
                $files = ($key1 === 'custom') ? $row : Tds::dir('/'.$row);
                if (!is_dir($files)) {
                } else {
                    $fileList = scandir($files);
                    if (empty($fileList)) {
                    } else {
                        foreach ($fileList as $file) {
                            if ($file != "." && $file != "..") {
                                $fullPath = $files . DIRECTORY_SEPARATOR . $file;
                                $ext = pathinfo($fullPath, PATHINFO_EXTENSION);
                                if (in_array(strtolower($ext), ['jpg', 'jpeg', 'png', 'gif', 'svg'])) {
                                  $Exp[$file]=self::img($file);
                                }
                            }
                        }
                    }
                }
             }
        }
        return $Exp;
    }
    /*
    |--------------------------------------------------------------------------
    | Initializes worker 
    |--------------------------------------------------------------------------
    | Develover Tatiye.Net 2020
    |
    */
    public static function img($file) {
        return HOST.'/img/'.$file;
    } 

    /*
    |--------------------------------------------------------------------------
    | Initializes manifest 
    |--------------------------------------------------------------------------
    | Develover Tatiye.Net 2020
    |
    */
    public function manifest() {
        $file = CRTL . 'manifest.json';

        if (!file_exists($file)) {
            throw new Exception("File tidak ditemukan: " . $file);
        }

        $jsonData = file_get_contents($file);
        $data = json_decode($jsonData, true); 

        if (json_last_error() !== JSON_ERROR_NONE) {
            throw new Exception("Error dalam decoding JSON: " . json_last_error_msg());
        }
        return $data;
    }
    /*
    |--------------------------------------------------------------------------
    | Initializes manifest 
    |--------------------------------------------------------------------------
    | Develover Tatiye.Net 2020
    |
    */
    public static function elements() {
        $file = CRTL . 'elements.json';

        if (!file_exists($file)) {
            throw new Exception("File tidak ditemukan: " . $file);
        }

        $jsonData = file_get_contents($file);
        $data = json_decode($jsonData, true); 

        if (json_last_error() !== JSON_ERROR_NONE) {
            throw new Exception("Error dalam decoding JSON: " . json_last_error_msg());
        }

        return $data;
    }
    /*
    |--------------------------------------------------------------------------
    | Initializes properti 
    |--------------------------------------------------------------------------
    | Develover Tatiye.Net 2020
    |
    */
    public function properti() {
        $file = $this->controllers . 'assets.json';

        if (!file_exists($file)) {
            throw new Exception("File tidak ditemukan: " . $file);
        }

        $jsonData = file_get_contents($file);
        $data = json_decode($jsonData, true); 

        if (json_last_error() !== JSON_ERROR_NONE) {
            throw new Exception("Error dalam decoding JSON: " . json_last_error_msg());
        }

        if (!isset($data['assets'])) {
            throw new Exception("Key tidak ditemukan dalam data aset: ");
        }

        return $data['assets'];
    }

    /*
    |--------------------------------------------------------------------------
    | Initializes assets 
    |--------------------------------------------------------------------------
    | Develover Tatiye.Net 2020
    |
    */
    public function assets($key) {
        $file = CRTL . 'assets.json';

        if (!file_exists($file)) {
            throw new Exception("File tidak ditemukan: " . $file);
        }

        $jsonData = file_get_contents($file);
        $data = json_decode($jsonData, true); 

        if (json_last_error() !== JSON_ERROR_NONE) {
            throw new Exception("Error dalam decoding JSON: " . json_last_error_msg());
        }

        if (!isset($data['assets']['assets'][$key])) {
            throw new Exception("Key tidak ditemukan dalam data aset: " . $key);
        }

        return $data['assets']['assets'][$key];
    }
    /*
    |--------------------------------------------------------------------------
    | Initializes refAssets 
    |--------------------------------------------------------------------------
    | Develover Tatiye.Net 2020
    |
    */
    public function refAssets($link) {
        // Cek apakah ada separator '|' untuk module
        $parts = explode('|', $link);
        $isModule = (count($parts) > 1 && $parts[0] === 'module');
        $actualLink = $isModule ? $parts[1] : $link;
        
        $ext = pathinfo($actualLink, PATHINFO_EXTENSION);
        $baseLink = (strpos($actualLink, '://') !== false) ? $actualLink : $this->host . $actualLink;
        
        if ($ext === 'css') {
            return '<link rel="stylesheet" href="' . htmlspecialchars($baseLink) . '">';
        } elseif ($ext === 'js') {
            if ($isModule) {
                return '<script type="module" src="' . htmlspecialchars($baseLink) . '"></script>';
            }
            return '<script src="' . htmlspecialchars($baseLink) . '"></script>';
        }
        return '';
    }

    /*
    |--------------------------------------------------------------------------
    | Initializes worker 
    |--------------------------------------------------------------------------
    | Develover Tatiye.Net 2020
    |
    */
    public function worker() {
        $filePath = CRTL . 'navigasi.json';
        if (!file_exists($filePath)) {
            throw new Exception("File tidak ditemukan: " . $filePath);
        }
        $navigasiData = file_get_contents($filePath);
        $variable = json_decode($navigasiData, true);

        if (json_last_error() !== JSON_ERROR_NONE) {
            throw new Exception("Error dalam decoding JSON: " . json_last_error_msg());
        }
        $Exp = [];
        foreach ($variable['navigasi'] as $var => $value) {
            foreach ($value as $key => $item) {
                $public = ($item[0] == 'Home' || $item[0] == 'Beranda') ? '' : 'public/';
                $Exp[] = [
                    'title' => $item[0],
                    'name'  =>$key,
                    "hastag" =>'#'. strtolower(str_replace(' ', '-', $item[0])),
                    'link' => $this->host . '#' . strtolower(str_replace(' ', '-', $item[0])),
                    'path' => $this->directory .'/'.$public . $item[1] . '.html',
                    'base' => $public . $item[1] . '.html',
                    'thread' =>1,
                    'key' => $key,
                ];
            }
        }

        return array_merge($Exp, $this->NavigationItem(['html']));
    }

    /*
    |--------------------------------------------------------------------------
    | Initializes linkThread 
    |--------------------------------------------------------------------------
    | Develover Tatiye.Net 2020
    |
    */
    public function linkThread($searchLink,$uid='') {
        $hastag = explode('#', $searchLink);
        $bestMatch = null;
        $maxMatchLength = 0;
        foreach ($this->worker() as $item) {
            if (strpos($searchLink, $item['link']) === 0) {
                $matchLength = strlen($item['link']);
                if ($matchLength > $maxMatchLength) {
                    $bestMatch = $item;
                    $maxMatchLength = $matchLength;
                }
            }
        }
        if (!empty($bestMatch)) {
            return $bestMatch;
        } else {
            $indexPath = $this->directory . '/public/' . ($hastag[1] ?? '') . '/index.html';
            if (file_exists($indexPath)) {
                return [
                    'title'  => $hastag[1] ?? '',
                    'name' => $hastag[1] ?? '',
                    "hastag" => '#' . ($hastag[1] ?? ''),
                    'link' => $searchLink,
                    'path' => $indexPath,
                    'base' => '/public/' . ($hastag[1] ?? '') . '/index.html',
                    'thread' => 1,
                    'key' => $hastag[1] ?? '',
                ];
            } else {
                return null;
            }
        }
    }

    public function linkGet($searchLink,$uid='') {
    $searchLink = "http://192.168.1.112/DOM5/#web/proyek"; // URL yang ingin dicari
    $result = self::linkThread($searchLink);

// Hasil akan berupa array yang berisi informasi tentang link tersebut
        if ($result) {
            echo "Title: " . $result['title'] . "\n";
            echo "Name: " . $result['name'] . "\n";
            echo "Hashtag: " . $result['hastag'] . "\n";
            echo "Link: " . $result['link'] . "\n";
            echo "Thread: " . $result['thread'] . "\n";
            echo "Key: " . $result['key'] . "\n";
        } else {
            echo "Link tidak ditemukan";
        }
    }
    /*
    |--------------------------------------------------------------------------
    | Initializes hasItem 
    |--------------------------------------------------------------------------
    | Develover Tatiye.Net 2020
    |
    */
    public function hasItem() {
        $Exp = [];
        $variable = $this->NavigationItem(['html']);

        foreach ($variable as $value) {
            $Exp[] = [
                $value['val'] => $value['link'],
                $value['valTi3'] => $value['link'],
                $value['valTi'] => $value['name'],
                $value['valTi4'] => $value['name'],
                $value['valTi5'] => $value['link'],
               // $value['base'] => $value['path'],
            ];
        }

        return $Exp;
    }
    /*
    |--------------------------------------------------------------------------
    | Initializes NavigationItem 
    |--------------------------------------------------------------------------
    | Develover Tatiye.Net 2020
    |
    */
    public function NavigationItem($segment = ['html']) {
        $data = $this->manifest();
        $prefixes = $this->extractPrefixes($data['public']);
        return $this->extractPaths($data['public'], '', ['html'], $prefixes);
    }
    /*
    |--------------------------------------------------------------------------
    | Initializes Navigation 
    |--------------------------------------------------------------------------
    | Develover Tatiye.Net 2020
    |
    */
    public function Navigation() {
        $filePath = $this->controllers . 'navigasi.json';

        if (!file_exists($filePath)) {
            throw new Exception("File tidak ditemukan: " . $filePath);
        }

        $navigasiData = file_get_contents($filePath);
        $variable = json_decode($navigasiData, true);

        if (json_last_error() !== JSON_ERROR_NONE) {
            throw new Exception("Error dalam decoding JSON: " . json_last_error_msg());
        }

        $Exp = [];
        foreach ($variable['navigasi'] as $var => $value) {
            foreach ($value as $key => $item) {
                $Exp[] = [
                    $var . '.' . $key => $this->host . '#' . strtolower(str_replace(' ', '-', $item[0])),
                    $var . '.' . $key.'.title' => $item[0],
                    $var . '.' . $key . '.dir' => $item[1],
                ];
            }
        }
        //return array_merge($Exp);
        return array_merge($Exp, $this->hasItem());
    }

    /*
    |--------------------------------------------------------------------------
    | Initializes explode 
    |--------------------------------------------------------------------------
    | Develover Tatiye.Net 2020
    |
    */
    public function explode($path) {
        $parts = explode('/', $path);
        $lastPart = array_pop($parts);
        $info = pathinfo($lastPart);
        $filename = $info['filename'];
        return implode('/', $parts) . '/' . $filename;
    }
    /*
    |--------------------------------------------------------------------------
    | Initializes extractPrefixes 
    |--------------------------------------------------------------------------
    | Develover Tatiye.Net 2020
    |
    */
    public function extractPrefixes($array, $basePath = '') {
        $prefixes = [];
        foreach ($array as $key => $value) {
            if (is_array($value)) {
                $newBasePath = $basePath . $key . '/';
                $prefixes[] = $newBasePath;
                $prefixes = array_merge($prefixes, $this->extractPrefixes($value, $newBasePath));
            }
        }
        return array_unique($prefixes);
    }
    /*
    |--------------------------------------------------------------------------
    | Initializes extractPaths 
    |--------------------------------------------------------------------------
    | Develover Tatiye.Net 2020
    |
    */
    public function extractPaths($array, $basePath = '', $extensions = [], $prefixesToRemove = []) {
        $paths = [];

        foreach ($array as $key => $value) {
            if (is_array($value)) {
                $paths = array_merge($paths, $this->extractPaths($value, $basePath . $key . '/', $extensions, $prefixesToRemove));
            } else {
                $fileExtension = pathinfo($value, PATHINFO_EXTENSION);
                if (in_array($fileExtension, $extensions)) {
                    $count = substr_count($basePath, '/');
                    if ($count > 0) {
                        $name = $basePath . $value;

                        foreach ($prefixesToRemove as $prefix) {
                            if (strpos($name, $prefix) === 0) {
                                $name = substr($name, strlen($prefix));
                            }
                        }

                        $name = pathinfo($name, PATHINFO_FILENAME);
                        $ID = explode('/', $basePath);
                        $nmHas = ($name == 'default') ? 'items' : $name;
                        $var1 = str_replace(['_', '-'], ' ', $ID[($count - 1)] . ' ' . $nmHas);
                        $var2 = str_replace(['_', '-'], ' ', $nmHas);
                        $var = preg_replace('/([a-z])([A-Z])/', '$1 $2', $var1);
                        $var3 = preg_replace('/([a-z])([A-Z])/', '$1 $2', $var2);
                        $paths[] = [
                            'title' => ucwords($var),
                            'name' =>ucwords($var3),
                            "hastag" => '#' .strtolower(str_replace(' ', '-', $nmHas)),
                            "link" => $this->host . '#' . strtolower(str_replace(' ', '-', $ID[($count - 1)] . '/' . $nmHas)),
                            "val" => strtolower(str_replace(' ', '-', $ID[($count - 1)] . '.' . $nmHas)),
                            "valTi" => strtolower(str_replace(' ', '-', $ID[($count - 1)] . '.' . $nmHas.'.title')),
                            'valTi3' =>str_replace('/', '.', $basePath . $nmHas),
                            'valTi4' =>str_replace('/', '.', $nmHas.'.title'),
                            'valTi5' =>str_replace('/', '.', $nmHas.'.link'),
                            'base' =>str_replace('/', '.', $nmHas.'.path'),
                            'path' => $this->directory .'/public/'. $basePath . $value,
                            'thread' => 2,
                            "key" => $ID[($count - 1)],
                        ];
                    }
                }
            }
        }
        return $paths;
    }

     /*
    |--------------------------------------------------------------------------
    | Initializes URLParser 
    |--------------------------------------------------------------------------
    | Develover Tatiye.Net 2020
    |
    */
     public function URLParser($url) {
         // Memisahkan domain dan path
        $parsed_url = parse_url($url);

        // Menangani skema dan host jika ada
        $scheme = isset($parsed_url['scheme']) ? $parsed_url['scheme'] . '://' : '';
        $host = isset($parsed_url['host']) ? $parsed_url['host'] : '';
        $port = isset($parsed_url['port']) ? ':' . $parsed_url['port'] : '';
        $domain = $scheme . $host . $port;

        // Menangani path dari bagian hash jika ada
        $path = isset($parsed_url['fragment']) ? $parsed_url['fragment'] : '';

        // Memisahkan path menjadi bagian-bagian
        $parts = explode('/', trim($path, '/'));

        // Mencari dan mengganti bagian yang relevan
        foreach ($parts as &$part) {
            if (strpos($part, '-') !== false) {
                $part = str_replace('-', ' ', $part);
            }
        }
        
        $new_url = implode('/', $parts);
        
        // Mengubah string menjadi array dengan delimiter '/'
        $array = explode('/', $new_url);
        
        // Menentukan kunci dasar
        $base_keys = ['page'];
        
        // Menambahkan kunci tambahan jika jumlah elemen lebih dari kunci dasar
        $additional_keys = [];
        if (count($array) > count($base_keys)) {
            $extra_count = count($array) - count($base_keys);
            for ($i = 1; $i <= $extra_count; $i++) {
                $additional_keys[] = 'page' . $i;
            }
        }
        
        // Menggabungkan kunci dasar dan tambahan
        $all_keys = array_merge($base_keys, $additional_keys);
        
        // Membuat array asosiatif dengan kunci yang telah ditentukan
        $associativeArray = array_combine($all_keys, $array);
        
        // Mengembalikan hasil atau array kosong jika hasil kosong
        return $associativeArray ? $associativeArray : [];
      }
      /*
      |--------------------------------------------------------------------------
      | Initializes uid 
      |--------------------------------------------------------------------------
      | Develover Tatiye.Net 2022
      | @Date  
      */
      public static function uid($red) {
          $Exp = [];
          // Pastikan $uid adalah string sebelum mencoba untuk decode
          if (isset($red) && is_string($red)) {
              // Decode base64 string
              $decodedData = json_decode(base64_decode($red), true);
              // $_SESSION['oauth_token']='';
              // Jika decoding berhasil dan hasilnya adalah array
              if (is_array($decodedData)) {
                  $_SESSION['oauth_token']=$red;
                  foreach ($decodedData as $key => $value) {
                      $Exp['oauth_' . $key] = $value;
                  }
              }
          }
          return $Exp;
      }
      /*
      |--------------------------------------------------------------------------
      | Initializes config 
      |--------------------------------------------------------------------------
      | Develover Tatiye.Net 2022
      | @Date  
      */
      public static function config(){
          $file =PCKG.'ngorei.config';
          $data = file_get_contents($file);
          $json_arr = json_decode($data, true);
          return $json_arr;
          
      }
      /* and class config */
      /*
      |--------------------------------------------------------------------------
      | Initializes cular 
      |--------------------------------------------------------------------------
      | Develover Tatiye.Net 2022
      | @Date  
      */
      public static function curl($key){
            $json_arr = self::config();
            $curl = curl_init();
            curl_setopt_array($curl, array(
              CURLOPT_URL =>$json_arr['endpoint'].'pckg',
              CURLOPT_RETURNTRANSFER => true,
              CURLOPT_ENCODING => '',
              CURLOPT_MAXREDIRS => 10,
              CURLOPT_TIMEOUT => 0,
              CURLOPT_FOLLOWLOCATION => true,
              CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
              CURLOPT_CUSTOMREQUEST => 'POST',
              CURLOPT_POSTFIELDS =>'{
                 "id": "'.$key.'"
              }',
              CURLOPT_HTTPHEADER => array(
                'Content-Type: application/json',
                'Authorization:"'.$json_arr['cradensial'].'"'
              ),
            ));

            $response = curl_exec($curl);
            curl_close($curl);
            return json_decode($response, true);
          
      }
      /* and class cular */
      /*
      |--------------------------------------------------------------------------
      | Initializes pckge 
      |--------------------------------------------------------------------------
      | Develover Tatiye.Net 2022
      | @Date  
      */
      public static function pckg($key){
         return self::curl($key);
      }
      /* and class pckge */
      /*
      |--------------------------------------------------------------------------
      | Initializes pckgOublic 
      |--------------------------------------------------------------------------
      | Develover Tatiye.Net 2022
      | @Date  
      */
      public static function role(){
           return self::curl(1);
          
      }
      /* and class pckgOublic */

       public static  function checkbox($package,$key) {
              $variable3 = self::pckg($key);
              foreach ($variable3 as $value) {
                  if ($value['id'] == $package) {
                      return 'checked';
                  }
              }
              return '';
          }

      /*
      |--------------------------------------------------------------------------
      | Initializes oauth 
      |--------------------------------------------------------------------------
      | Develover Tatiye.Net 2022
      | @Date  
      */
      public static function oauth(){
             $json_arr = self::config();
             if ($json_arr['development']=='dashboard') {
                 if (!empty($_COOKIE["oauth_id"])) {
                    $setMode='/index.html';// code...
                 } else {
                    $setMode='/public.html';// code...
                    unset($_SESSION['oauth_token']);
                    session_destroy();
                 }
             } else {
                 $setMode='./index.html';// code...
             }
             return $setMode;
      }
      /*
      |--------------------------------------------------------------------------
      | Initializes title 
      |--------------------------------------------------------------------------
      | Develover Tatiye.Net 2022
      | @Date  
      */
      public static function indexPath(){
            $json_arr = self::config();
            $hastag=explode('#', $json_arr['otentikasi']);
            return $hastag[1];
          
      }
      /* and class title */
      /*
      |--------------------------------------------------------------------------
      | Initializes link 
      |--------------------------------------------------------------------------
      | Develover Tatiye.Net 2022
      | @Date  
      */
      public static function link($key){
            return HOST.'/'.$key;
          
      }
      /* and class link */

      public static function oauthWorker($id=''){
             $json_arr = self::config();
             if ($json_arr['development']=='dashboard') {
                 if (!empty($id)) {
                    $setMode='/default.html';// code...
                 } else {
                    $setMode='/public/'.str_replace("#", "",$json_arr['otentikasi'].'.html');
                 }
             } else {
                 $setMode='/default.html';// code...
             }
             return $setMode;
          
      }
      /* and class oauth */

      /* and class uid */
}
?>
