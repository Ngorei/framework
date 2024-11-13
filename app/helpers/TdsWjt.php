<?php
/**
 * tatiye - PHP Helpers for Develover wolf05
 *
 * (The MIT License)
 *
 * Copyright (c) 2018 wolf05 <info@tatiye.net / https://www.facebook.com/tatiye/>.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */
namespace app;
use app\Tds;

class TdsWjt 
{
  protected static $instance;  
  private $connection;
  private $driver;
  private $token;
  private $data = array();
  

  
 
    
    
   /*
   |--------------------------------------------------------------------------
   | Initializes Db 
   |--------------------------------------------------------------------------
   | Develover Tatiye.Net 2022
   | @Date Kam 24 Mar 2022 12:16:50  WITA 
   */
    public static function init($params='') {    
        if ( !isset(self::$instance) ) 
        {
            $class = __CLASS__;
            self::$instance = new $class();
        }
     return self::$instance;
  }
   /* and class Db */


  public function array($values=''){
       $this->data['rows']= $values;  
       return self::$instance;
  }  
  /*
   |--------------------------------------------------------------------------
   | Initializes Encode 
   |--------------------------------------------------------------------------
   | Develover Tatiye.Net 2022
   | @Date Min 27 Mar 2022 11:29:11  WITA 
   */
  
   public  function Encode($key=''){
      $array2=$this->data['rows'];
      $data =array_merge($array2);
        $payload=$data;
         $payload= json_encode($payload);
        // BASE 64
          $payload= self::base64url_encode($payload);
        // // Assinature

         return $payload;
   }
   /* and class Encode */ 

   public  function Encode1($key=''){
      $array2=$this->data['rows'];
      $data =array_merge($array2);
        $payload=$data;
         $payload= json_encode($payload);
        // BASE 64
          $payload= self::base64url_encode($payload);
        // // Assinature

         return $payload;
   }
   /* and class Encode */ 


      public  function Encodex($key=''){

      $array1=array(
        'key' =>"$key",
      );
        $payload=$array1;
         $payload= json_encode($payload);
        // BASE 64
          $payload= self::base64url_encode($payload);
        // // Assinature

         return $payload;
   }
   /* and class Encode */ 
   /*
   |--------------------------------------------------------------------------
   | Initializes base64url_encode 
   |--------------------------------------------------------------------------
   | Develover Tatiye.Net 2020
   | @Date Min 27 Mar 2022 11:29:27  WITA
   */
   public static function base64url_encode($data){
        return rtrim(strtr(base64_encode($data), '+/', '-_'), '=');
       // return ;
   }
   /*
   |--------------------------------------------------------------------------
   | AND base64url_encode 
   |--------------------------------------------------------------------------
   */
   /*
   |--------------------------------------------------------------------------
   | Initializes token 
   |--------------------------------------------------------------------------
   | Develover Tatiye.Net 2022
   | @Date  
   */
   public  function token($token=''){
       $base= base64_decode(str_pad(strtr($token, '-_', '+/'), strlen($token) % 4, '=', STR_PAD_RIGHT));
       $this->token= json_decode($base, true);
       return self::$instance;
   }
   /* and class token */
   /*
   |--------------------------------------------------------------------------
   | Initializes Decode 
   |--------------------------------------------------------------------------
   | Develover Tatiye.Net 2022
   | @Date  
   */
   public  function Decode($key=''){
    if (!empty($this->token[$key])) {
         return $this->token[$key];
    } else {
        return false;
    }
    
    
       
   }
   /* and class Decode */
   /*
   |--------------------------------------------------------------------------
   | Initializes code 
   |--------------------------------------------------------------------------
   | Develover Tatiye.Net 2022
   | @Date  
   */
   public  function code(){
      return $this->token;
   }
   /* and class code */

}