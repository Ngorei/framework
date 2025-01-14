<?php
namespace package;
use app\tatiye;
use app\Ngorei;
use app\NgoreiBuilder;
$Tds = new Ngorei();
try {
    $db =$Tds->Network->Brief('demo');
   return $db->testConnection();
} catch (\RuntimeException $e) {
    echo "Error: " . $e->getMessage();
}

// SDK JSON Body 
// {
//     "row":1
// }
