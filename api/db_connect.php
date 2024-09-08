<?php
class db_connect{
  const DB_NAME = "reserve_app";
  const HOST = "localhost";
  const USER = "root";
  const PASS = "";

  private $dbh;

  public function __construct(){
    $dsn = "mysql:host=".self::HOST.";dbname=".self::DB_NAME.";charset=utf8";
    try {
      // PDOのインスタンスをクラス変数に格納する
      $this->dbh = new PDO($dsn, self::USER, self::PASS);

    } catch(Exception $e){
      // Exceptionが発生したら表示して終了
      exit($e->getMessage());
    }

    // DBのエラーを表示するモードを設定
    $this->dbh->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_WARNING);
  }

  public function select($sql, $params){
    // プリペアドステートメントを作成し、SQL文を実行する準備をする
    $stmt = $this->dbh->prepare($sql);
    $keys = array_keys($params);
    $count = count($keys);
    for ($i = 0; $i < $count; $i++) {
      $key = $keys[$i];
      $value = $params[$key];
      $type = $this->getPDO($value);
      $stmt->bindValue($key, $value, $type);
    }
    $status = $stmt->execute();
    $items=$stmt->fetchAll(PDO::FETCH_ASSOC);
    // echo $items;
    return $items;
  }

  public function insert($sql, $params){
    $stmt = $this->dbh->prepare($sql);
    $status = $stmt->execute($params);
    if($status==false){
        $error = $stmt->errorInfo();
        exit("SQLError:".$error[2]);
    }else{
        return $this->dbh->lastInsertId();
    }
  }

  private function getPDO($value) {
    if (is_int($value)) {
        return PDO::PARAM_INT;
    } else {
        return PDO::PARAM_STR;
    }
}
}
?>
