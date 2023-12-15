<?php

$usersData = json_decode(file_get_contents("users.json"), true);

function isValidUser($username, $password) {
    global $usersData;
    foreach ($usersData as $user) {
        if ($user['username'] === $username && $user['password'] === $password) {
            return true;
        }
    }
    return false;
}

if (!isset($_SERVER['PHP_AUTH_USER']) || !isset($_SERVER['PHP_AUTH_PW'])) {
    header('WWW-Authenticate: Basic realm="API Authentication"');
    http_response_code(401);
    echo json_encode(['message' => 'Authentification requise']);
    exit;
}

$username = $_SERVER['PHP_AUTH_USER'];
$password = $_SERVER['PHP_AUTH_PW'];

if (!isValidUser($username, $password)) {
    header('WWW-Authenticate: Basic realm="API Authentication"');
    http_response_code(403);
    echo json_encode(['message' => 'Accès non autorisé']);
    exit;
}

$requestMethod = $_SERVER['REQUEST_METHOD'];
$uri = trim($_SERVER['REQUEST_URI'], '/');
$uriSegments = explode('/', $uri);

$resource = $uriSegments[1] ?? null;

switch ($resource) {
    case 'docs':
        require '/dist/index.html';
        break;
    case 'classe': 
        require 'classe.php';
        break;
    case 'student':
        require 'student.php';
        break;
    default:
        // Pour la route "/", renvoie la page HTML de base
        if ($resource === null) {
            include 'frontend.html';
        } else {
            header('HTTP/1.1 404 Not Found');
            echo json_encode(['message' => 'Resource not found']);
        }
        break;
}

?>
