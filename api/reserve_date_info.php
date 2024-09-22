<?php 
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header('Content-Type: application/json; charset=UTF-8');
header("Access-Control-Allow-Credentials: true");
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

require_once 'db_connect.php';

function debug_log($message) {
    error_log($message);
}

//クラスの生成
$obj = new db_connect();
if($_SERVER['REQUEST_METHOD'] === 'GET') {
    $year = $_GET['year'];
    $month = $_GET['month'];
    $day = $_GET['day'];
    echo "Received parameters: Year: $year, Month: $month, Day: $day";
    $formatted_date = sprintf("%04d-%02d-%02d", $year, $month, $day);
    debug_log("バックエンド: " . $formatted_date);
    $sql = 'SELECT * 
                FROM 
                    T_RESERVE 
                WHERE 
                    DATE(date) = :formatted_date
    ';
    try{
        $params = [':formatted_date' => $formatted_date];
        $result = $obj->select($sql, $params);
        echo json_encode($result);
    } catch(Exception $e){
        echo "データ検索に失敗しました。" . $e->getMessage();
    }
}
?>