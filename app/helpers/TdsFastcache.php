<?php
namespace app;
use Phpfastcache\CacheManager as FastCache;
use Phpfastcache\Config\ConfigurationOption;

class TdsFastcache
{
    private static $instance = null;
    private $cache;

    private function __construct()
    {
        FastCache::setDefaultConfig(new ConfigurationOption([
            'path' => APP . '/cache'
        ]));
        $this->cache = FastCache::getInstance('files');
    }

    public static function getInstance()
    {
        if (self::$instance === null) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    public function getOrSetCache($key, $table, $columns, $condition, $expiresAfter = 3600)
    {
        $cacheKey = $key . '_' . md5($condition);
        $cachedData = $this->cache->getItem($cacheKey);
        $needsUpdate = true;

        if ($cachedData->isHit()) {
            $cachedResult = $cachedData->get();
            
            // Menggunakan fungsi global atau metode statis untuk mengambil last_update
            $lastUpdate = $this->getLastUpdate($table, $condition);
            $dbLastUpdate = strtotime($lastUpdate);

            if (isset($cachedResult['cache_timestamp']) && $cachedResult['cache_timestamp'] >= $dbLastUpdate) {
                $needsUpdate = false;
                return $cachedResult['data'];
            }
        }

        if ($needsUpdate) {
            // Menggunakan fungsi global atau metode statis untuk mengambil data
            $data = $this->getData($table, $columns, $condition);
            $result = [
                'data' => $data,
                'cache_timestamp' => time(),
            ];

            $cachedData->set($result)->expiresAfter($expiresAfter);
            $this->cache->save($cachedData);

            return $data;
        }
    }

    public function invalidateCache($key)
    {
        $this->cache->deleteItem($key);
    }

    private function getLastUpdate($table, $condition)
    {
        // Implementasikan metode untuk mengambil last_update
        // Contoh:
        // return YourDatabaseClass::getLastUpdate($table, $condition);
    }

    private function getData($table, $columns, $condition)
    {
        // Implementasikan metode untuk mengambil data
        // Contoh:
        // return YourDatabaseClass::getData($table, $columns, $condition);
    }
}
