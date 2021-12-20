<?php

namespace app\controllers;

use Yii;
use yii\filters\AccessControl;
use yii\web\Controller;
use yii\web\Response;
use yii\filters\VerbFilter;

use app\models\Users;

class SiteController extends Controller {
    public $enableCsrfValidation = false;
    
    public function behaviors()
    {
        return [
            'access' => [
                'class' => AccessControl::className(),
                'only' => ['foo'],
                'rules' => [
                    [
                        'actions' => ['foo'],
                        'allow' => true,
                        'roles' => ['admin'],
                    ],
                ],
            ],
        ];
    }

    /**
     * {@inheritdoc}
     */
    public function actions()
    {
        return [
            'error' => [
                'class' => 'yii\web\ErrorAction',
            ],
            'captcha' => [
                'class' => 'yii\captcha\CaptchaAction',
                'fixedVerifyCode' => YII_ENV_TEST ? 'testme' : null,
            ],
        ];
    }

    // used with axios, now we use fetch
    /*
    private function readRawData() {
        header("Access-Control-Allow-Methods: GET,HEAD,OPTIONS,POST,PUT");
        header("Access-Control-Allow-Headers: Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");
        header("Access-Control-Allow-Origin: *");
        $raw_data = Yii::$app->request->getRawBody();
        return json_decode($raw_data, true );  // as array
    }
    */
    // ajax
	public function actionLogin() {
     //   $data = $this->readRawData() ;
        Yii::warning(json_encode($_POST)) ;
        $data = $_POST ;
        
        $user = Users::find()->where(['name' => $data['name']])->andWhere(['passwd' => $data['passwd']])->one() ;
        
        if ($user) {
            Yii::warning($user->attributes) ;
            exit(json_encode(['success' => true , 'data' => [$user->attributes]])) ;
        } else {
            exit(json_encode(['success' => false , 'error' => 'Wrong name or password'])) ;
        }
    }
    
     // ajax
	public function actionEvents() {
        Yii::warning(json_encode($_POST)) ;
        if (!isset($_POST['id'])) {
            exit(json_encode(['success' => false , 'error' => 'missing user id'])) ;
        }
        
         $sql =  "select events.id, events.name, events.date, events.id_user, last_photo.url from events  left join (" .
        "select * from photos " . 
        "where id in (" .
        "    select max(id) from photos group by id_event " .
        ")) as last_photo on events.id = last_photo.id_event " .
        " where events.id_user = :id " .
        " order by events.id desc" ;
        
        $rows = Yii::$app->db->createCommand($sql)
            ->bindValue(':id', $_POST['id'])
            ->queryAll();
        
        Yii::warning(json_encode($rows)) ;
        
        exit (json_encode(['success' => true, 'data' => $rows])) ; 
    }
    

     // ajax
	public function actionFriend_events() {
        Yii::warning(json_encode($_POST)) ;
        if (!isset($_POST['id'])) {
            exit(json_encode(['success' => false , 'error' => 'missing user id'])) ;
        }
        
        $sql = 
        "select DISTINCT events.id, events.name, events.date, last_photo.url, shares.id_friend as id_friend " .
        " from users, shares, events  left join (" .
        "select * from photos " .
        "where id in (" .
        "    select max(id) from photos group by id_event " .
        ")) as last_photo on events.id = last_photo.id_event " .
        " where events.id_user = shares.id_friend and shares.id_user = :id " .
        " order by events.id desc"; 
        
        $data = [] ;
        $rows = Yii::$app->db->createCommand($sql)
            ->bindValue(':id', $_POST['id'])
            ->queryAll();

        foreach ($rows as $row) {
            $da = $row ;
            $sql = "SELECT * FROM users WHERE id = :id " ;
            $res = Yii::$app->db->createCommand($sql)
                        ->bindValue(':id', $row['id_friend'])
                        ->queryAll();
            $da['friend'] = $res ;
            $data[] = $da ;
        }
        
        exit (json_encode(['success' => true, 'data' => $data])) ; 
    }

     // ajax
	public function actionPictures() {
        Yii::warning(json_encode($_POST)) ;
        if (!isset($_POST['id'])) {
            exit(json_encode(['success' => false , 'error' => 'missing event id'])) ;
        }
        
        $sql = "SELECT * FROM photos WHERE id_event = :id ORDER BY date DESC " ;        
        $rows = Yii::$app->db->createCommand($sql)
            ->bindValue(':id', $_POST['id'])
            ->queryAll();

        exit (json_encode(['success' => true, 'data' => $rows])) ; 
    }
    
    // ajax
	public function actionDeleteEvent() {
        Yii::warning(json_encode($_POST)) ;
        if (!isset($_POST['id'])) {
            exit(json_encode(['success' => false , 'error' => 'missing event id'])) ;
        }
        
        try {       
            $sql = "SELECT * FROM  photos WHERE id_event = :id" ;
            $rows = Yii::$app->db->createCommand($sql)
                    ->bindValue(':id', $_POST['id'])
                    ->queryAll();
            foreach($rows as $row) {
                unlink(dirname ( __FILE__ ) . '/../web/images/' . $row['url']) ;
                $sql ="DELETE FROM  photos WHERE id_event = :id" ;
                Yii::$app->db->createCommand($sql)
                    ->bindValue(':id', $_POST['id'])
                    ->execute();
                $sql ="DELETE FROM  events WHERE id = :id" ;
                Yii::$app->db->createCommand($sql)
                    ->bindValue(':id', $_POST['id'])
                    ->execute();
            }
        } catch (Exception $e) {
            exit (json_encode(['success' => false, 'data' => $e->getMessage()])) ; 
        } 
        
        exit (json_encode(['success' => true, 'data' => $rows])) ; 
    }


    
    
    
}
