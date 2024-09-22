<?php
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header('Content-Type: application/json; charset=UTF-8');
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Headers: Content-Type, Accept");
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);

//必ずsession_startは最初に記述
session_start();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $_SESSION = array();

    if (isset($_COOKIE[session_name()])) {
        setcookie(session_name(), '', time()-42000, '/');
    }

    session_destroy();

    echo json_encode(["message" => "ログアウトしました"]);
} else {
    echo json_encode(["error" => "ログアウトに失敗しました。"]);
}

?>
