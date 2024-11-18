<?php
use app\Tds;
$Tds = new Tds('index');
$headerAssets = $Tds->assets('header');
echo json_encode($headerAssets);