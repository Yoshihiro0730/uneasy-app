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

//クラスの生成
$obj = new db_connect();

if($_SERVER['REQUEST_METHOD'] === 'POST'){
    $lid = $_POST['userId'];
    $lpw = $_POST['passWord'];
    $sql = 'SELECT * FROM T_USERS WHERE ID=:lid';
    $params = [':lid'=>$lid];
    try {
        $result = $obj->select($sql, $params);
        // echo $result;
        $val = $result[0];
    } catch(Exception $e){
        echo "ユーザーIDが存在しません。" . $e->getMessage();
    }
    if(isset($val)){
        $pw = password_verify($lpw, $val['upw']);
        if($pw){
            $_SESSION["user_id"] = $val['ID'];
            $_SESSION["user_name"] = $val['user_name'];
            $_SESSION["chk_ssid"] = session_id();
            echo json_encode([
                "user" => [
                    "id" => $_SESSION["user_id"],
                    "name" => $_SESSION["user_name"],
                    "session_id" => $_SESSION["chk_ssid"]
                ]
            ], JSON_UNESCAPED_UNICODE);
        } else {
            if(!isset($_SESSION["chk_ssid"]) || $_SESSION["chk_ssid"]!=session_id()){
                echo json_encode(["error" => "Invalid session"]);
                exit();
            }
        }
    }
    
}


?>