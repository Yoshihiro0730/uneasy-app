<?php 
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header('Content-Type: application/json; charset=UTF-8');
header("Access-Control-Allow-Credentials: true");
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

require_once 'db_connect.php';

function func_select_id($first_name, $last_name, $email) {
    //クラスの生成
    $obj = new db_connect();
    $sql = 'SELECT 
                user_id 
            FROM 
                T_users 
            WHERE
                first_name=:first_name
            AND
                last_name=:last_name
            AND 
                mail=:email
            ';
    try{
        $params = [':first_name' => $first_name, ':last_name' => $last_name, ':email' => $email];
        $result = $obj->select($sql, $params);
        return $result;
    } catch(Exception $e){
        echo "データ検索に失敗しました。" . $e->getMessage();
    }
}



?>