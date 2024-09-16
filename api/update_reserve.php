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
    $user_id = $_POST['userId'];
    $year = $_POST['year'];
    $month = $_POST['month'];
    $day = $_POST['day'];
    $hour = $_POST['hour'];
    $minutes = $_POST['minutes'];

    // 予約日時をdatetime型にするための文字列結合
    $date_str = $year . "-" . $month . "-" . $day . " " . $hour . ":" . $minutes . ":00";
    
    // DB登録用にdatetime型に変換
    $date_datetime = new DateTime($date_str);
    $formatted_date = $date_datetime->format("Y-m-d H:i:s");

    $sql = 'UPDATE 
                T_reserve 
            SET
                date=:formatted_date
            WHERE
                reserve_id=:reserve_id
            ';

    // パラメータセット
    $params = array(
        ':formatted_date' => $formatted_date,
        ':reserve_id' => $reserve_id
    );

    try {
        $result = $obj->update($sql, $params);
        if($result > 0){
            echo "データ更新が完了しました。レコード:" . $result;
        } else{
            echo "更新データがありませんでした。";
        }
    } catch(Exception $e) {
        echo "データ更新に失敗しました。" . $e->getMessage();
    }
}

?>