<?php
use app\Tds;
use app\Ngorei;
$Tds = new Tds();
$tatiyeNet = new Ngorei();
    $uid=$Tds->uid($_POST['uid']);
    $indexOn = [
        'home'         => HOST . '#home',
        'host'         => HOST,
        'link'         => HOST,
        'domain'       => HOST,
        'qrcode'       => isset($_COOKIE['VID']) ? $_COOKIE['VID'] : '',
        'qrlogin'      => isset($_COOKIE['VID']) ? $_COOKIE['VID'] : '',
    ];
    $tatiyeNet->addSpecialVariable("link", HOST."/");
    $tatiyeNet->addSpecialVariable("img", HOST."/img/");
    $outputArray = array();
    foreach ($Tds->Navigation() as $subArray) {
        foreach ($subArray as $key => $value) {
            $outputArray[$key] = $value;
        }
    }
 
    $tatiyeNet->addSpecialVariable("link", HOST."/");
    $tatiyeNet->addSpecialVariable("img", HOST."/img/");
    $tatiyeNet->includeTemplate("require", DIR);
 
    $storage = isset($_POST['data']) ? json_decode($_POST['data'], true) : [];
    if (!is_array($storage)) {
        $storage = [];
    }
    
    foreach (array_merge($indexOn, $outputArray, $storage,$uid) as $page => $value) {
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
      
    // Pastikan bahwa $_POST['package'] ada dan tidak kosong
    if (!empty($_POST['package'])) {
        $result = $Tds->linkThread($_POST['package']);

        // Periksa jika $result adalah array dan memiliki kunci 'path'
          if (is_array($result) && isset($result['path'])) {
              if ($result['key']=='home') {
              	 echo $tatiyeNet->SDK($Tds->dir('/home.html'));
              } else {
         	    echo $tatiyeNet->SDK($result['path']);
              }
          } else {
              // Tangani kasus jika $result bukan array atau tidak memiliki kunci 'path'
              echo $tatiyeNet->SDK($Tds->dir('/home.html'));
          }

    } 
