<?php

namespace app\controllers;

use Yii;
use yii\filters\AccessControl;
use yii\web\Controller;
use yii\web\Response;
use yii\filters\VerbFilter;

use app\models\Users;
use app\models\Photos;
use app\models\Events;
use app\models\Shares;



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
        " where events.id_user = shares.id_user and shares.id_friend = :id " .
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

    private function getAttribs($modelArray) {
        return array_map(
            function($elem) {
                return $elem->attributes ;
            },
            $modelArray
        ) ;
    }
    
     // ajax
	public function actionPictures() {
        Yii::warning(json_encode($_POST)) ;
        if (!isset($_POST['id'])) {
            exit(json_encode(['success' => false , 'error' => 'missing event id'])) ;
        }
        $photos = Photos::find()->where(['id_event' => $_POST['id']])->orderBy(['id' => SORT_DESC])->all() ;
        $res = json_encode(['success' => true, 'data' => $this->getAttribs($photos)]) ;
        Yii::warning($res) ;
        exit ($res) ; 
    }
    
    // ajax
	public function actionDeleteEvent() {
        Yii::warning(json_encode($_POST)) ;
        if (!isset($_POST['id'])) {
            exit(json_encode(['success' => false , 'error' => 'missing event id'])) ;
        }
        $event = Events::findOne($_POST['id']) ;
        exit(json_encode($event->deleteEvent())) ; 
    }
    

    public function actionAddEvent() {
        Yii::warning(json_encode($_POST)) ;
        if (!isset($_POST['id_user']) || !isset($_POST['name']) ) {
            exit(json_encode(['success' => false , 'error' => 'missing id_user or name'])) ;
        }
        $event = new Events ;
        $event->id_user = $_POST['id_user'] ;
        $event->name = $_POST['name'] ;
        if ($event->save()) {
            exit (json_encode(['success' => true])) ; 
        } else {
            Yii::warning('GOT HERE') ;
            exit(json_encode(['success' => false, 'error'=>$this->error_message($event)])) ;
        }
    }

    
    private function saveFile($file) {
        if (isset($file) && is_uploaded_file($file['tmp_name'])) {
            $filename = $file['name'] ;
            $urlFilename = uniqid()  ;
 			move_uploaded_file($file['tmp_name'], dirname ( __FILE__ ) . '/../web/images/' . $urlFilename);     
            return $urlFilename ;    
        } else {
            return "" ;
        }
    }
    
    private function error_message($model) {
        $errmsg = '' ;
        $errors = $model->getErrors() ;
        foreach ($errors as $attrib=>$msg) {
                $errmsg .= implode($msg , ',') . "\n" ;
        }
        return $errmsg ;
    }
    
    public function actionUpload() {
        Yii::warning('ACTION UPLOAD') ;
        Yii::warning(json_encode($_POST)) ;
        Yii::warning(json_encode($_FILES)) ;
        
        $url = $this->saveFile($_FILES['photo']) ;
        
        $photo = new Photos ;
        $photo->url = $url ;
        $photo->id_event = $_POST['id'] ;
        if ($photo->save()) {
            exit(json_encode(['success' => true ])) ; 
        } else {
            exit(json_encode(['success' => false, 'error'=>$this->error_message($photo)])) ;
        }
    }  
    
    public function actionRegister() {
        Yii::warning('ACTION REGISTER') ;
        Yii::warning(json_encode($_POST)) ;
        if (isset($_POST['name']) && isset($_POST['passwd'])) {
            $user = new Users ;
            $user->name = $_POST['name'] ;
            $user->passwd = $_POST['passwd'] ;
            $user->token = $_POST['token'] ;
            if ($user->save()) {
                exit(json_encode(['success' => true, 'data' => $user->attributes])) ; 
            } else {
                exit(json_encode(['success' => false, 'error'=>$this->error_message($user)])) ;
            }
        } else {        
            exit(json_encode(['success' => false, 'error'=>'missing name or passwd'])) ;
        }
    }      
    
    
    public function actionUnregister() {
        Yii::warning(json_encode($_POST)) ;
        if (isset($_POST['id'])) {
            $user = Users::findOne($_POST['id']) ;
            // first delete all events 
            foreach (Events::find()->where(['id_user' => $user->id]) as $event) {
                $res = $event->deleteEvent() ;
                if (!$res['success']) {
                    exit(json_encode($res)) ;
                }
            }
            if ($user->delete()) {
                exit(json_encode(['success' => true])) ; 
            } else {
                exit(json_encode(['success' => false, 'error'=>$this->error_message($user)])) ;
            }
        } else {        
            exit(json_encode(['success' => false, 'error'=>'missing id'])) ;
        }
    }      
    
    public function actionFriends() {
        Yii::warning(json_encode($_POST)) ;
        if (isset($_POST['id'])) {
            $user = Users::findOne($_POST['id']) ;
            $data = [] ;
            foreach (Users::find()->where(['<>', 'id', $_POST['id']])->orderBy('name')->all() as $friend) {
                $rec = $friend->attributes ; 
                $rec['isFriend'] = $user->hasAllowed($friend->id) ? 1 : 0 ;
                $data[] = $rec ;
            }
            exit(json_encode(['success' => true, 'data' => $data])) ; 
        } else {        
            exit(json_encode(['success' => false, 'error'=>'missing id'])) ;
        }
    }
    
    public function actionUpdateFriend() {
        Yii::warning('UPDATE FRIEND') ;
        Yii::warning(json_encode($_POST)) ;
        if (!isset($_POST['id_user']) || !isset($_POST['id_friend']) || !isset($_POST['isFriend'])) {
            exit(json_encode(['success' => false, 'error'=>'missing parameters'])) ;
        }
        
        if ($_POST['isFriend'] == '0' ) {
            $share = Shares::find()->where(['id_user' => $_POST['id_user']])->andWhere(['id_friend' => $_POST['id_friend']])->one() ;
            Yii::warning('CHECK 1') ;
            if ($share) {
                if (!$share->delete()) {
                    exit(json_encode(['success' => false, 'error'=>$this->error_message($share)])) ;
                }
            }
        } else {
            Yii::warning('CHECK 2') ;
            $share = new Shares ;
            $share->id_user = $_POST['id_user'] ;
            $share->id_friend = $_POST['id_friend'] ;
            if (!$share->save()) {
                 exit(json_encode(['success' => false, 'error'=>$this->error_message($share)])) ;
            }
        }
        exit(json_encode(['success' => true, 'data' => $data])) ; 
    }
    
    
}
