<?php
use app\Tds;
Tds::headerContent('POST');
 $file =ROOT.'/package/ngorei.config';
 // echo json_encode($directory.'app/manifest.config');
    if (file_exists($file)) {
        header('Content-Type: text/plain');
        readfile($file);
    } else {
        http_response_code(404);
        echo "File not found.";
    }
 //      $Exp[]=array(
 //         'ststus'              =>'ON',
 //         );
 // echo json_encode($Exp);
?>
