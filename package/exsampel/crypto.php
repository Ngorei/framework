<?php
namespace package\Oauth;
use app\tatiye;
use Exception;
use app\NgoreiCrypto;

class Signin extends NgoreiCrypto {
    protected function validateCredentials($data) {
          return $data;
    }
}

// Penggunaan
$val = json_decode(file_get_contents("php://input"), true);
$signin = new Signin($val['endpoint']);
return $signin->authenticate($val);
