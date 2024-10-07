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
    $sql = 'SELECT 
                u.ID as user_id,
                u.user_name,
                p.ID as post_id,
                p.posts,
                p.created_at
            FROM 
                T_POSTS p
            INNER JOIN
                T_USERS u ON p.user_id = u.ID
            WHERE 
                p.resolve_flag = 0
            ORDER BY
                p.created_at DESC
            LIMIT 10
            ';
    try{
        $params = [];
        $result = $obj->select($sql, $params);
        echo json_encode($result);
    } catch(Exception $e){
        echo "データ検索に失敗しました。" . $e->getMessage();
    }
}
?>