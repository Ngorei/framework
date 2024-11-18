<?php
use app\Tds;
use app\Ngorei;
use app\TdsProtokol;
class Routing {
    public static function index() {
        // Create an instance of Tds
        session_start();
         $Tds = new Tds('index');
         $tatiyeNet = new Ngorei();
         if (!isset($_COOKIE['VID'])) {
             // Membuat kode unik dengan format kid
             $unique_id = 'VID_' . uniqid() . '_' . time();
             // Menyimpan ke session
             $_SESSION['VID'] = $unique_id;
             // Menyimpan ke cookie
             setcookie('VID', $unique_id, time() + (86400 * 30), '/');
             
         } else {
             $_SESSION['VID'] = $_COOKIE['VID'];
         }
         $uid = [];
         if (!empty($_COOKIE['oauth_id'])) {
             $uid = Tds::uid($_COOKIE['oauth_id']);
         } else {
             $uid = ['oauth_id' => '']; // atau nilai default lainnya
         }
         $meta = $Tds->properti();
         // Mengatur variabel berdasarkan apakah cookie 'request' ada atau tidak
          $og_url = HOST;
          $og_title = $meta['title'];
          $og_description = $meta['description'];
          $og_favicon =HOST . '/img/' . $meta['favicon'];
          $og_images = HOST . '/img/' . $meta['images'];
         // Menyusun array untuk indexOn
         $indexOn = [
             'home' => HOST.'/#home',
             'host' => HOST,
             'sitename' => $meta['sitename'],
             'title' => $og_title,
             'description' => $og_description,
             'url' => $og_url,
             'favicon' => $og_favicon,
             'images' => $og_images,
             'site_name' => HOST,
             'version'  =>$meta['version'],
             'qrcode'=>  isset($_COOKIE['VID']) ? $_COOKIE['VID'] : '',
             'qrlogin'=> isset($_COOKIE['VID']) ? $_COOKIE['VID'] : '',
         ];
         $tatiyeNet->addSpecialVariable("link", HOST."/");
         $tatiyeNet->addSpecialVariable("img", HOST."/img/");
         $tatiyeNet->includeTemplate("require", DIR);


         $outputArray = [];
         foreach ($Tds->Navigation() as $subArray) {
             if (is_array($subArray)) {
                 foreach ($subArray as $key => $value) {
                     $outputArray[$key] = $value;
                 }
             }
         }
         
         // Menyimpan data ke dalam Tatiye Net
         foreach (array_merge($indexOn, $outputArray,$uid) as $page => $value) {
             $tatiyeNet->val($page, $value);
         }
         
         // Menyimpan elemen TDS ke dalam Tatiye Net
         foreach ($Tds->elements() as $page => $value) {
             if (is_array($value)) {
                 foreach ($value as $row => $val) {
                     foreach ($Tds->worker() as $word => $item) {
                         if ($item['key'] === $row) {
                             $tatiyeNet->TDSnet($row, [
                                 'title' => $item['title'],
                                 'name'  => $item['name'],
                                 'link' =>   $item['link'],
                                 'hastag' => $item['hastag'],
                             ]);
                         }
                     }
                 }
             }
         }
         
         // Menambahkan asset header dan footer
         $tatiyeNet->setAssets($Tds->assets('header'), 'header');
         $tatiyeNet->setAssets(array_merge($Tds->assets('footer'),array(
            "module|assets/v4.0.1/ngorei.js",
            'module|App.js',
            "module|Assets.js"
        )), 'footer');

         if (TdsProtokol::httpServer()=='mobile') {
           echo $tatiyeNet->SDK($Tds->dir('/mobile.html'));
         } else {
              if (!empty($uid['oauth_id'])) {
                 echo $tatiyeNet->SDK(ROOT . '/dashboard.html');
              } else {
                 echo $tatiyeNet->SDK(ROOT . '/index.html');
              }
      
         }  
    }
}

?>
