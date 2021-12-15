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

    
    private function readRawData() {
        header("Access-Control-Allow-Methods: GET,HEAD,OPTIONS,POST,PUT");
        header("Access-Control-Allow-Headers: Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");
        header("Access-Control-Allow-Origin: *");
        $raw_data = Yii::$app->request->getRawBody();
        return json_decode($raw_data, true );  // as array
    }
    
    // ajax
	public function actionLogin() {
        $data = $this->readRawData() ;
        
        Yii::warning($data) ;
        Yii::warning($data['name']) ;
        Yii::warning($data['passwd']) ;
        
        $user = Users::find()->where(['name' => $data['name']])->andWhere(['passwd' => $data['passwd']])->one() ;
        
        if ($user) {
            Yii::warning($user->attributes) ;
            exit(json_encode(['success' => true , 'data' => [$user->attributes]])) ;
        } else {
            exit(json_encode(['success' => false , 'error' => 'Wrong name or password'])) ;
        }
    }
    
    
}
