<?php 
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
if($_SERVER['REQUEST_METHOD'] === 'GET') {
    $user_id = $_GET['userId'];
    $sql = 'SELECT user_id, date FROM T_reserve WHERE user_id = :user_id ORDER BY date ASC';
    try{
        $params = [':user_id' => $user_id];
        $result = $obj->select($sql, $params);
        echo json_encode($result);
    } catch(Exception $e){
        echo "データ検索に失敗しました。" . $e->getMessage();
    }
}
?>