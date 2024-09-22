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
    $hour = $_POST['hour'];
    $previous = $_POST['previousReserve'];

    // 予約日時をdatetime型にするための文字列結合
    $date_str = $year . "-" . $month . "-" . $day;
    
    // DB登録用にdatetime型に変換
    // $date_datetime = new DateTime($date_str);
    $formatted_date = sprintf("%04d-%02d-%02d", $year, $month, $day);

    // 新しい時間帯のカラム名を取得
    $new_t_column = getTimeColumn($hour);
    
    // 以前の時間帯のカラム名を取得
    $previous_hour = intval(substr($previous, 0, 2));
    $previous_t_column = getTimeColumn($previous_hour);

    if (!$new_t_column || !$previous_t_column) {
        echo json_encode(["error" => "無効な時間です。"]);
        exit;
    }


    $sql = "UPDATE 
                T_reserve 
            SET
                date=:formatted_date,
                `{$previous_t_column}` = NULL,
                `{$new_t_column}` = :user_id
            WHERE
                reserve_id = :reserve_id
            ";

    // パラメータセット
    $params = array(
        ':formatted_date' => $formatted_date,
        ':user_id' => $user_id,
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