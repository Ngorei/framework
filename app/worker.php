<?php
    session_start();
    use app\Tds;
    use app\Ngorei;
    $Tds = new Tds();
    $tatiyeNet = new Ngorei();
    $meta=$Tds->properti();
    $uid=$Tds->uid($_POST['uid']);
    $indexOn = [
        'home'         => HOST . '#home',
        'host'         => HOST,
        'link'         => HOST,
        'domain'       => HOST,
        'favicon'      => HOST,
        'App.js'       => HOST . '/App.js',
        'ngorei.js'    => HOST . '/assets/v4.0.1/ngorei.js',
        'Assets.js'    => HOST . '/Assets.js',
        'version' => $meta['version'],
        'qrcode'=> isset($_COOKIE['VID']) ? $_COOKIE['VID'] : '',
        'qrlogin'=> isset($_COOKIE['VID']) ? Tds::QRcode($_COOKIE['VID']) : '',
    ];
    $tatiyeNet->addSpecialVariable("link", HOST."/");
    $tatiyeNet->addSpecialVariable("img", HOST."/img/");
    $tatiyeNet->addFile("public", DIR);
    $outputArray = array();
    foreach ($Tds->Navigation() as $subArray) {
        foreach ($subArray as $key => $value) {
            $outputArray[$key] = $value;
        }
    }
    foreach (array_merge($indexOn,$uid,Tds::workerImg()) as $page => $value) {
        $tatiyeNet->val($page, $value);
    }

    foreach ($outputArray as $page => $value) {
        $tatiyeNet->val($page, $value);
    }

    foreach ($Tds->elements() as $page => $value) {
        foreach ($value as $row => $val) {
              foreach ($Tds->worker() as $word => $item) {
                if ($item['key']===$row) {
                     $tatiyeNet->TDSnet($row, array(
                         'title' =>$item['title'],
                         'link' =>$item['link'],
                         'name' =>$item['name'],
                         'hastag' =>$item['hastag'],
                     ));
                }
              }
         }
    }
      $URLParser = $Tds->URLParser($_POST['package']);
      foreach($URLParser as $page => $value) {
         $tatiyeNet->val($page, $value);
      }
         if (!empty($uid)) {
             $pckg = @$Tds->pckg($uid['oauth_red']);
             if (is_array($pckg)) {
                 foreach ($pckg as $key => $value) {
                     if ($value['public'] == 1) {
                         $tatiyeNet->TDSnet('package', $value);
                     }
                 }
             }
             // code...
         }
 
      if (!empty($uid)) {
         if (isset($_POST['package'])) {
             $result=$Tds->linkThread($_POST['package']);
             if (is_array($result) && isset($result['path'])) {
                 if ($result['key']=='home') {
                    echo $tatiyeNet->SDK($Tds->dir('/home.html'));
                 } else {
                    echo $tatiyeNet->SDK($result['path']);
                 }
             } else {
                 echo $tatiyeNet->SDK($Tds->dir('/home.html'));
             }
         }
      } else {
         $package=$_POST['package'];
         $result=$Tds->linkThread($package);
         $hastag=explode('#',$package);
         if (isset($hastag[1])) { // Tambahkan pengecekan ini
             if ("oauth/signin"==$hastag[1]) {
                 echo $tatiyeNet->SDK($result['path']);
             } else if ("oauth/signup"==$hastag[1]) {
                echo $tatiyeNet->SDK($result['path']);
             } else {
                echo $tatiyeNet->SDK($result['path']);
             }
         } else {
             echo $tatiyeNet->SDK($Tds->dir('/home.html'));
         }     
      }
      
  
echo $Tds->refAssets('assets/lib/prismjs/prism.min.js');