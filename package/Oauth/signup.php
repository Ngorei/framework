<?php
namespace package\Oauth;
use app\tatiye;
use Exception;
use app\NgoreiCrypto;

class Signin extends NgoreiCrypto {
    protected function validateCredentials($data) {
          $uid = tatiye::fetch('appuser', 'id,email', 'email="'.htmlspecialchars($data['email']).'"');
          if (isset($uid['id'])) {
              return false;
          } else {
              return [
               'data'=>'Regis Baru'
              ];
          }       
    }
}

// Penggunaan
$val = json_decode(file_get_contents("php://input"), true);
$signin = new Signin($val['endpoint']);
return $signin->authenticate($val);
