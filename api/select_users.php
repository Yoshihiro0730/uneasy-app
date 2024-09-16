<?php 
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header('Content-Type: application/json; charset=UTF-8');
header("Access-Control-Allow-Credentials: true");
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

require_once 'db_connect.php';
include 'func_select_id.php';

//クラスの生成
$obj = new db_connect();
if($_SERVER['REQUEST_METHOD'] === 'GET') {
    error_log("GET parameters: " . print_r($_GET, true));
    $first_name = $_GET['first_name'];
    $last_name = $_GET['last_name'];
    $email = $_GET['email'];

    // 検索したユーザーのユーザーIDを取得
    $responce = func_select_id($first_name, $last_name, $email);
    if(is_array($responce) && isset($responce[0]['user_id'])){
        $user_id = $responce[0]['user_id'];
        // var_dump($user_id);
    }
    // var_dump($responce);
    // $data = json_decode($responce, true);
    // $user_id = $data[0]['user_id'];
    $sql = 'SELECT
                date
            FROM
                T_reserve
            WHERE
                user_id=:user_id
            ORDER BY
                date ASC
            ';
    try{
        $params = [':user_id' => $user_id];
        $result = $obj->select($sql, $params);
        if(empty($result)){
            echo json_encode([
                'user_id' => $user_id
            ]);
        } else {
            echo json_encode([
                'user_id' => $user_id,
                'date' => $result
            ]);
        }
    } catch(Exception $e){
        echo "データ検索に失敗しました。" . $e->getMessage();
    }
    // $user_id = $_GET['userId'];
    // $sql = 'SELECT user_id, date FROM T_reserve WHERE user_id = :user_id ORDER BY date ASC';
    // try{
    //     $params = [':user_id' => $user_id];
    //     $result = $obj->select($sql, $params);
    //     echo json_encode($result);
    // } catch(Exception $e){
    //     echo "データ検索に失敗しました。" . $e->getMessage();
    // }
}
?>