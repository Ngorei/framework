<?php
namespace package;
use app\tatiye;
$val = json_decode(file_get_contents("php://input"), true);
$result = tatiye::findByKey($val['payload']);
return $result;
