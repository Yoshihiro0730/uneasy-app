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
    $first_name = $_POST['firstName'];
    $last_name = $_POST['lastName'];
    $email = $_POST['email'];
    $sql = 'INSERT INTO T_users (first_name, last_name, mail) VALUES (:first_name, :last_name, :email)';

    // パラメータセット
    $params = array(
        ':first_name' => $first_name,
        ':last_name' => $last_name,
        ':email' => $email
    );

    try {
        $result = $obj->insert($sql, $params);
        echo "データ挿入が完了しました。レコード:" . $result;
    } catch(Exception $e) {
        echo "データ挿入に失敗しました。" . $e->getMessage();
    }
}

?>
<!-- <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ユーザー登録フォーム</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; margin: 0; padding: 20px; }
        form { max-width: 400px; margin: 0 auto; }
        label { display: block; margin-bottom: 5px; }
        input[type="text"], input[type="email"] { width: 100%; padding: 8px; margin-bottom: 10px; }
        input[type="submit"] { background-color: #4CAF50; color: white; padding: 10px 15px; border: none; cursor: pointer; }
        input[type="submit"]:hover { background-color: #45a049; }
        .message { margin-top: 20px; padding: 10px; background-color: #f0f0f0; border-radius: 5px; }
    </style>
</head>
<body>
    <form method="post" action="<?php echo htmlspecialchars($_SERVER["PHP_SELF"]); ?>">
        <label for="first_name">名:</label>
        <input type="text" id="first_name" name="first_name" required>

        <label for="last_name">姓:</label>
        <input type="text" id="last_name" name="last_name" required>

        <label for="email">メールアドレス:</label>
        <input type="email" id="email" name="email" required>

        <input type="submit" value="登録">
    </form>

    <?php
    if (isset($message)) {
        echo "<div class='message'>" . htmlspecialchars($message) . "</div>";
    }
    ?>
</body>
</html> -->