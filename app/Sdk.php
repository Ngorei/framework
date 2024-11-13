<?php
use app\Tds;
$val=Tds::getWJT(file_get_contents("php://input"));
header('Content-Type: application/json');
    if ($val['endpoint']=='package') {
         function checkbox($package,$key) {
              $variable3 = Tds::pckg($key);
              foreach ($variable3 as $value) {
                  if ($value['id'] == $package) {
                      return 'checked';
                  }
              }
              return '';
          }
      if ($val['data']=='role') {
          $variable =Tds::pckg(1);
          // Fungsi untuk mencocokkan status
          $item2 = [];
          if (is_array($variable) || $variable instanceof Traversable) {
              foreach ($variable as $value) {
                 if ($value['public']==1) {
                  $item2[] = [
                      "no" => $value['no'],
                      "id" => $value['id'],
                      "title" => $value['title'],
                      "package" => $value['package'],
                      "icon" => $value['icon'],
                      "version" =>$value['version'],
                      "date" => $value['date'],
                      "count" => $value['count'],
                      "check" => checkbox($value['id'],$val['key']),
                  ];
                }
              }
          }
           $data=$item2;
      } else {
          if (!empty(checkbox($val['hash'],$val['oauth']['red']))) {
              $Sts='';
          } else {
              $Sts='404';
          }
          $variable3 = Tds::pckg(1);
          $Exp=array(
             'page' =>$Sts,
             'package' =>$variable3,
          );
          // $variable =Tds::pckg($val['oauth']['red']);
          $data=$Exp ;
      }
   
  
    } else {
        // code...
    }


echo json_encode($data);
?>
