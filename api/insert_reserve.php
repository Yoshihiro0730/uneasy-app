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
    $sql = 'INSERT INTO T_reserve (user_id, date) VALUES (:user_id, :formatted_date)';

    // パラメータセット
    $params = array(
        ':user_id' => $user_id,
        ':formatted_date' => $formatted_date
    );

    try {
        $result = $obj->insert($sql, $params);
        echo "データ挿入が完了しました。レコード:" . $result;
    } catch(Exception $e) {
        echo "データ挿入に失敗しました。" . $e->getMessage();
    }
}
?>

<!-- 動作確認用のhtml -->
<!-- <!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>予約フォーム</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; margin: 0; padding: 20px; }
        form { max-width: 400px; margin: 0 auto; }
        label { display: block; margin-top: 10px; }
        select { width: 100%; padding: 5px; margin-bottom: 10px; }
        input[type="submit"] { background-color: #4CAF50; color: white; padding: 10px 15px; border: none; cursor: pointer; }
        input[type="submit"]:hover { background-color: #45a049; }
    </style>
</head>
<body>
    <form method="post" action="<?php echo htmlspecialchars($_SERVER["PHP_SELF"]); ?>">
        <label for="user_id">ユーザーID:</label>
        <select name="user_id" id="user_id" required>
            <?php
            // ここでユーザーIDのオプションを動的に生成できます
            for ($i = 1; $i <= 10; $i++) {
                echo "<option value=\"$i\">ユーザー $i</option>";
            }
            ?>
        </select>

        <label for="year">年:</label>
        <select name="year" id="year" required>
            <?php
            $currentYear = date('Y');
            for ($i = $currentYear; $i <= $currentYear + 5; $i++) {
                echo "<option value=\"$i\">$i</option>";
            }
            ?>
        </select>

        <label for="month">月:</label>
        <select name="month" id="month" required>
            <?php
            for ($i = 1; $i <= 12; $i++) {
                $padded = str_pad($i, 2, '0', STR_PAD_LEFT);
                echo "<option value=\"$padded\">$padded</option>";
            }
            ?>
        </select>

        <label for="day">日:</label>
        <select name="day" id="day" required>
            <?php
            for ($i = 1; $i <= 31; $i++) {
                $padded = str_pad($i, 2, '0', STR_PAD_LEFT);
                echo "<option value=\"$padded\">$padded</option>";
            }
            ?>
        </select>

        <label for="hour">時:</label>
        <select name="hour" id="hour" required>
            <?php
            for ($i = 0; $i <= 23; $i++) {
                $padded = str_pad($i, 2, '0', STR_PAD_LEFT);
                echo "<option value=\"$padded\">$padded</option>";
            }
            ?>
        </select>

        <label for="minites">分:</label>
        <select name="minites" id="minites" required>
            <?php
            for ($i = 0; $i <= 59; $i++) {
                $padded = str_pad($i, 2, '0', STR_PAD_LEFT);
                echo "<option value=\"$padded\">$padded</option>";
            }
            ?>
        </select>

        <input type="submit" value="予約する">
    </form>
</body>
</html> -->