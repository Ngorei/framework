<?php
use app\Tds;
use app\Ngorei;

// Validasi parameter URL
$redID = explode('/', $_GET['url']);
if (count($redID) < 3) {
    die('Invalid URL format');
}

$format = strtolower($redID[1]);
$endpoint = $redID[2];
// Validasi format yang didukung
$allowedFormats = ['csv', 'excel', 'json', 'xml'];
if (!in_array($format, $allowedFormats)) {
    die('Format tidak didukung. Gunakan: ' . implode(', ', $allowedFormats));
}
try {
    $Tds = new Tds();
    $template = new Ngorei();

    // Set header berdasarkan format
    switch($format) {
        case 'csv':
            header('Content-Type: text/csv');
            header('Content-Disposition: attachment; filename="export_'.$endpoint.'_'.date('Y-m-d').'.csv"');
            break;
        case 'excel':
            header('Content-Type: application/vnd.ms-excel');
            header('Content-Disposition: attachment; filename="export_'.$endpoint.'_'.date('Y-m-d').'.xls"');
            break;
        case 'json':
            header('Content-Type: application/json');
            header('Content-Disposition: attachment; filename="export_'.$endpoint.'_'.date('Y-m-d').'.json"');
            break;
        case 'xml':
            header('Content-Type: application/xml');
            header('Content-Disposition: attachment; filename="export_'.$endpoint.'_'.date('Y-m-d').'.xml"');
            break;
    }

    // Set variabel template
    $template->val('format', $format);
    $template->val('endpoint', $endpoint);

    // Buat dan parse Brief
    $brief = "<!-- Brief row:{endpoint}|export={format} -->\n";
    $brief .= "<!-- END_Brief row -->";
    
    // Parse dan output hasilnya
    echo $template->parse($brief);
    
} catch (Exception $e) {
    // Log error
    error_log("Export error: " . $e->getMessage());
    die('Terjadi kesalahan saat proses export. Silakan coba lagi.');
}

exit;
 
