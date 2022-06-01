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



class TestController extends Controller {
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
    
    public function actionIndex() {
        exit(json_encode(['success' => true, 'message' => 'Yo'])) ;
    }
    
    
      public function actionTestSession() {
        $session = Yii::$app->session;
        echo 'Time out: ' . $session->timeout . '<br>';
        echo 'useCookies: ' . $session->useCookies . '<br>';
        echo 'cookieParams: ' . json_encode($session->cookieParams) . '<br>';
        echo 'userId: ' . (Yii::$app->user->identity ? Yii::$app->user->identity->getId() : "null")  . '<br>';
        echo 'authTimeout: ' . (Yii::$app->user ? Yii::$app->user->authTimeout : "null")  . '<br>';
        echo 'enableSession: ' . (Yii::$app->user ? Yii::$app->user->enableSession : "null")  . '<br>';
        
        
        
    }
    
}
    
    

