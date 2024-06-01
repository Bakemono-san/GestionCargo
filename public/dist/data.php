<?php
// api.php

header('Content-Type: application/json');

function readJSON($filename)
{
    $json_data = file_get_contents($filename);
    return json_decode($json_data, true);
}

function writeJSON($filename, $data)
{
    $json_data = json_encode($data, JSON_PRETTY_PRINT);
    file_put_contents($filename, $json_data);
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $action = json_decode(file_get_contents('php://input'), true);

   
    $cargos = $action;

    writeJSON('./datas/cargos.json', $cargos);

    echo json_encode([
        'success' => true,
        'cargos' => $cargos
    ]);
    exit;
} else {
    $cargos = readJSON('./datas/cargos.json');

    $data = [
        'cargos' => $cargos,
    ];

    echo json_encode($data);
    exit;
}
