<?php
/**
 * tatiye - PHP Helpers for Develover wolf05
 *
 * (The MIT License)
 *
 * Copyright (c) 2020 wolf05 <info@tatiye.net / https://www.facebook.com/tatiye/>.
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
// Tambahkan use statement untuk kelas tatiye
use app\tatiye;

/**
 * Generates an HTML block tag that follows the Bootstrap documentation
 * on how to display  component.
 *
 * See {@link https://tatiye.net/} for more information.
 */
class TdsProtokol  {
  

     /*
     |--------------------------------------------------------------------------
     | Initializes HttpClients 
     |--------------------------------------------------------------------------
     | Develover Tatiye.Net 2021
     | @Date  
     */
     public static function httpServer(): string {
        $statusMobile = self::STATUS_MOBILE;
        @$userBrowser = $_SERVER['HTTP_ACCEPT']; 
        @$userAgent = isset($_SERVER['HTTP_USER_AGENT']) ? strtolower($_SERVER['HTTP_USER_AGENT']): '';
        if(stristr($userBrowser, 'application/vnd.wap.xhtml+xml')) 
        {
        $_REQUEST['wap2'] = 1;
        }

        elseif(stripos($userAgent,"iPod"))
        {
        $_REQUEST['iphone'] = 1;

        }
        elseif(stripos($userAgent,"iPhone"))
        {
        $_REQUEST['iphone'] = 1;

        }
        elseif(stripos($userAgent,"Android"))
        {
        $_REQUEST['Android'] = 1;

        }
        elseif(stripos($userAgent,"IEMobile")) {

        $_REQUEST['IEMobile'] = 1;

        }
        // elseif(stristr($userBrowser, 'DoCoMo/' || 'portalmmm/'))
        // {
        // $_REQUEST['imode'] = 1;
        // }

        elseif(stristr($userBrowser, 'text/vnd.wap.wml')) 
        {
        $_REQUEST['wap'] = 1;
        }
        elseif(stristr($userBrowser, 'text/html')) 
        {
        $_REQUEST['html'] = 1;
        }


        if(!defined('WAP'))
            define('WAP', isset($_REQUEST['wap']) || isset($_REQUEST['wap2']) || isset($_REQUEST['imode'])|| isset($_REQUEST['html'])|| isset($_REQUEST['Android'])|| isset($_REQUEST['iphone'])|| isset($_REQUEST['IEMobile']));
            
            if (WAP)
        {
         @define('WIRELESS_PROTOCOL', isset($_REQUEST['wap']) ? 'wap' : (isset($_REQUEST['wap2']) ? 'wap2' : (isset($_REQUEST['iphone']) ? 'iphone' : (isset($_REQUEST['imode']) ? 'imode' : (isset($_REQUEST['IEMobile']) ? 'IEMobile' :(isset($_REQUEST['html']) ? 'html' : (isset($_REQUEST['Android']) ? 'Android' : '')))))));  

        if (WIRELESS_PROTOCOL == 'wap')
              {
        $browser_t = $statusMobile;
              }
        elseif (WIRELESS_PROTOCOL == 'wap2')
              {


        $browser_t = $statusMobile;


              }
        elseif (WIRELESS_PROTOCOL == 'imode')
              {
            
        $browser_t = $statusMobile;

              }
              elseif (WIRELESS_PROTOCOL == 'iphone')
              {
            

        $browser_t = $statusMobile;

              }
              elseif (WIRELESS_PROTOCOL == 'Android')
              {
            

        $browser_t = $statusMobile;

              }
               elseif (WIRELESS_PROTOCOL == 'IEMobile')
              {
            
        $browser_t = $statusMobile;

              }
              elseif (WIRELESS_PROTOCOL == 'html')
              {

             $mobile_browser = '0';

        if(preg_match('/(up.browser|up.link|mmp|symbian|smartphone|midp|wap|phone)/i',
            strtolower($_SERVER['HTTP_USER_AGENT']))){
            $mobile_browser++;
            }

        if((strpos(strtolower($_SERVER['HTTP_ACCEPT']),'application/vnd.wap.xhtml+xml')>0) or 
            ((isset($_SERVER['HTTP_X_WAP_PROFILE']) or isset($_SERVER['HTTP_PROFILE'])))){
            $mobile_browser++;
            }

        $mobile_ua = strtolower(substr($_SERVER['HTTP_USER_AGENT'],0,4));
        $mobile_agents = array(
            'w3c ','acs-','alav','alca','amoi','audi','avan','benq','bird','blac',
            'blaz','brew','cell','cldc','cmd-','dang','doco','eric','hipt','inno',
            'ipaq','java','jigs','kddi','keji','leno','lg-c','lg-d','lg-g','lge-',
            'maui','maxo','midp','mits','mmef','mobi','mot-','moto','mwbp','nec-',
            'newt','noki','oper','palm','pana','pant','phil','play','port','prox',
            'qwap','sage','sams','sany','sch-','sec-','send','seri','sgh-','shar',
            'sie-','siem','smal','smar','sony','sph-','symb','t-mo','teli','tim-',
            'tosh','tsm-','upg1','upsi','vk-v','voda','wap-','wapa','wapi','wapp',
            'wapr','webc','winw','winw','xda','xda-');

        if(in_array($mobile_ua,$mobile_agents)){
            $mobile_browser++;
            }

        if (strpos(strtolower($_SERVER['HTTP_USER_AGENT']),'iemobile')>0) {
        $mobile_browser++;
        }
        if (strpos(strtolower($_SERVER['HTTP_USER_AGENT']),'windows')>0) {
            $mobile_browser=0;
        }
         $browser_t = "theme";
         } 
      }
      if (isset($browser_t)) {
         return $browser_t;
      }



          
         // return ;
     }
     /* and class HttpClients */


  /* and class cradensialUID */
/**
 * and class tatiyeRbac
 */

private const STATUS_MOBILE = 'mobile';
private const STATUS_THEME = 'theme';

private static function isMobileBrowser($userAgent) {
    $patterns = [
        '/(up.browser|up.link|mmp|symbian|smartphone|midp|wap|phone)/i',
        '/iemobile/i',
        '/windows/i'
    ];
    
    return (preg_match($patterns[0], $userAgent) || 
            preg_match($patterns[1], $userAgent)) &&
            !preg_match($patterns[2], $userAgent);
}
}