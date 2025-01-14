<?php
/**
switch ($method) {
    case 'POST':
        // Create
        $data = json_decode(file_get_contents('php://input'), true);
        $response = $firebase->create('users', $data);
        break;
        
    case 'GET':
        // Read
        $userId = isset($_GET['user_id']) ? $_GET['user_id'] : null;
        if ($userId) {
            $filter = [
                'field' => 'user_id',
                'value' => $userId
            ];
            $response = $firebase->read('users', $filter);
        } else {
            $response = $firebase->read('users');
        }
        break;
        
    case 'PUT':
        // Update
        $data = json_decode(file_get_contents('php://input'), true);
        $key = isset($_GET['key']) ? $_GET['key'] : null;
        if ($key) {
            $response = $firebase->update('users', $key, $data);
        } else {
            $response = ['error' => 'Key tidak ditemukan'];
        }
        break;
        
    case 'DELETE':
        // Delete
        $key = isset($_GET['key']) ? $_GET['key'] : null;
        if ($key) {
            $response = $firebase->delete('users', $key);
        } else {
            $response = ['error' => 'Key tidak ditemukan'];
        }
        break;
}
 */
namespace app;
use app\tatiye;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use Kreait\Firebase\Factory;
/**
 * Generates an HTML block tag that follows the Bootstrap documentation
 * on how to display  component.
 *
 * See {@link https://tatiye.net/} for more information.
 */
class NgoreiFirebase  {
    private $databaseURL;
    private $apiKey;
    
    public function __construct() {
        $this->databaseURL = 'https://ngorey-default-rtdb.firebaseio.com';
        $this->apiKey = 'AIzaSyC2Jy55sVarbaH4C-MwXnWa3xbKbYaOc6E'; // Dari Firebase Console
    }
    
    // CREATE
    public function create($path, $data) {
        try {
            $url = $this->databaseURL . '/' . $path . '.json';
            $ch = curl_init();
            curl_setopt($ch, CURLOPT_URL, $url);
            curl_setopt($ch, CURLOPT_POST, 1);
            curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
            
            $response = curl_exec($ch);
            curl_close($ch);
            
            return [
                'status' => 'success',
                'data' => json_decode($response, true)
            ];
        } catch (Exception $e) {
            return ['error' => $e->getMessage()];
        }
    }
    
    // READ
    public function read($path, $filter = null) {
        try {
            $url = $this->databaseURL . '/' . $path . '.json';
            if ($filter) {
                $url .= '?orderBy="' . $filter['field'] . '"&equalTo="' . $filter['value'] . '"';
            }
            
            $ch = curl_init();
            curl_setopt($ch, CURLOPT_URL, $url);
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
            
            $response = curl_exec($ch);
            curl_close($ch);
            
            return [
                'status' => 'success',
                'data' => json_decode($response, true)
            ];
        } catch (Exception $e) {
            return ['error' => $e->getMessage()];
        }
    }
    
    // UPDATE
    public function update($path, $key, $data) {
        try {
            $url = $this->databaseURL . '/' . $path . '/' . $key . '.json';
            
            $ch = curl_init();
            curl_setopt($ch, CURLOPT_URL, $url);
            curl_setopt($ch, CURLOPT_CUSTOMREQUEST, 'PATCH');
            curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
            
            $response = curl_exec($ch);
            curl_close($ch);
            
            return [
                'status' => 'success',
                'data' => json_decode($response, true)
            ];
        } catch (Exception $e) {
            return ['error' => $e->getMessage()];
        }
    }
    
    // DELETE
    public function delete($path, $key) {
        try {
            $url = $this->databaseURL . '/' . $path . '/' . $key . '.json';
            
            $ch = curl_init();
            curl_setopt($ch, CURLOPT_URL, $url);
            curl_setopt($ch, CURLOPT_CUSTOMREQUEST, 'DELETE');
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
            
            $response = curl_exec($ch);
            curl_close($ch);
            
            return [
                'status' => 'success',
                'message' => 'Data berhasil dihapus'
            ];
        } catch (Exception $e) {
            return ['error' => $e->getMessage()];
        }
    }
// Simpan dengan custom key
// $result = $firebase->createKey('users', $data, 'user123');

    public function createKey($path, $data, $customKey) {
        try {
            // Validasi input
            if (empty($path) || empty($data) || empty($customKey)) {
                return ['error' => 'Path, data, dan custom key tidak boleh kosong'];
            }

            // Validasi format custom key
            // if (!preg_match('/^[a-zA-Z0-9_-]+$/', $customKey)) {
            //     return ['error' => 'Custom key hanya boleh mengandung huruf, angka, underscore, dan dash'];
            // }

            // Buat URL dengan custom key
            $url = $this->databaseURL . '/' . $path . '/' . $customKey . '.json';
            
            $ch = curl_init();
            curl_setopt($ch, CURLOPT_URL, $url);
            curl_setopt($ch, CURLOPT_CUSTOMREQUEST, 'PUT');
            curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
            
            $response = curl_exec($ch);
            
            // Cek error CURL
            if (curl_errno($ch)) {
                curl_close($ch);
                return ['error' => 'CURL Error: ' . curl_error($ch)];
            }
            
            curl_close($ch);
            
            return [
                'status' => 'success',
                'key' => $customKey,
                'data' => json_decode($response, true)
            ];
        } catch (Exception $e) {
            return ['error' => $e->getMessage()];
        }
    }
}