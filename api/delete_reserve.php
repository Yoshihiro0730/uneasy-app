<?php 
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header('Content-Type: application/json; charset=UTF-8');
header("Access-Control-Allow-Credentials: true");
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

require_once 'db_connect.php';
require_once 'funcs.php';

//クラスの生成
$obj = new db_connect();

if($_SERVER['REQUEST_METHOD'] === 'POST') {
    $reserve_id = $_POST['reserveId'];
    $user_id = $_POST['userId'];
    $year = $_POST['year'];
    $month = $_POST['month'];
    $day = $_POST['day'];
    $previous = $_POST['previousReserve'];

    // 予約日時をdatetime型にするための文字列結合
    $date_str = $year . "-" . $month . "-" . $day;
    
    // DB登録用にdatetime型に変換
    // $date_datetime = new DateTime($date_str);
    $formatted_date = sprintf("%04d-%02d-%02d", $year, $month, $day);
    
    // 以前の時間帯のカラム名を取得
    $previous_hour = intval(substr($previous, 0, 2));
    $previous_t_column = getTimeColumn($previous_hour);

    $sql = "UPDATE 
                T_reserve 
            SET
                date=:formatted_date,
                `{$previous_t_column}` = NULL
            WHERE
                reserve_id = :reserve_id
            ";

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