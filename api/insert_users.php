<?php 
// セッションスタート
session_start();

ini_set('session.cookie_samesite', 'None');
ini_set('session.cookie_secure', 'true');
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header('Content-Type: application/json; charset=UTF-8');
header("Access-Control-Allow-Credentials: true");
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

require_once 'db_connect.php';

session_regenerate_id(true);

//クラスの生成
$obj = new db_connect();

if($_SERVER['REQUEST_METHOD'] === 'POST') {
    $user_name = $_POST['userName'];
    $email = $_POST['email'];
    $pw = $_POST['passWord'];
    $pw = password_hash($pw, PASSWORD_DEFAULT);
    $sql = 'INSERT INTO T_USERS (user_name, email, upw) VALUES (:user_name, :email, :pw)';
    // パラメータセット
    $params = array(
        ':user_name' => $user_name,
        ':email' => $email,
        ':pw' => $pw
    );

    try {
        $result = $obj->insert($sql, $params);
        if(isset($result)){
            $_SESSION["user_id"] = $result;
            $_SESSION["user_name"] = $user_name;
            $_SESSION["chk_ssid"] = session_id();
        }
        echo json_encode([
            "user" => [
                "id" => $_SESSION["user_id"],
                "name" => $_SESSION["user_name"],
                "session_id" => $_SESSION["chk_ssid"]
            ]
        ]);
    } catch(Exception $e) {
        echo "データ挿入に失敗しました。" . $e->getMessage();
    }
} else {
    if(!isset($_SESSION["chk_ssid"]) || $_SESSION["chk_ssid"]!=session_id()){
        echo json_encode(["error" => "Invalid session"]);
        exit();
    }
}
?>
