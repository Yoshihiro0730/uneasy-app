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

if($_SERVER['REQUEST_METHOD'] === 'POST') {
    $reserve_id = $_POST['reserveId'];

    $sql = 'DELETE FROM
                T_reserve 
            WHERE
                reserve_id=:reserve_id
            ';

    // パラメータセット
    $params = array(
        ':reserve_id' => $reserve_id
    );

    try {
        $result = $obj->delete($sql, $params);
        if($result > 0){
            echo "データ削除が完了しました。レコード:" . $result;
        } else{
            echo "削除データがありませんでした。";
        }
    } catch(Exception $e) {
        echo "データ削除に失敗しました。" . $e->getMessage();
    }
}

?>