<?php

namespace app\models;

use Yii;

/**
 * This is the model class for table "users".
 *
 * @property int $id
 * @property string $name
 * @property string $passwd
 * @property string $date
 * @property string $token
 */
class Users extends \yii\db\ActiveRecord implements \yii\web\IdentityInterface
{
    /**
     * {@inheritdoc}
     */
    public static function tableName()
    {
        return 'users';
    }

    /**
     * {@inheritdoc}
     */
    public function rules()
    {
        return [
            [['date'], 'safe'],
            [['name', 'passwd', 'token'], 'string', 'max' => 150],
            [['name'], 'unique'],
        ];
    }

    /**
     * {@inheritdoc}
     */
    public function attributeLabels()
    {
        return [
            'id' => 'ID',
            'name' => 'Name',
            'passwd' => 'Passwd',
            'date' => 'Date',
            'token' => 'Token',
        ];
    }
    
    
    public function hasAllowed($id_friend) {
        if (Shares::find()->where(['id_user' => $this->id])->andWhere(['id_friend' => $id_friend])->one()) {
            return true ;
        } else {
            return false ;
        }
    }
    
    public function hasBlocked($id_friend) {
        if (Blocks::find()->where(['id_user' => $this->id])->andWhere(['id_friend' => $id_friend])->one()) {
            return true ;
        } else {
            return false ;
        }
    }
    
    ////////////////////////////////////////////////////////////////////////
    // implementation of UserIdentity interface
    
      public static function findIdentity($id)
    {
    }

    public static function findIdentityByAccessToken($token, $type = null)
    {
        return static::findOne(['token' => $token]);
    }

    public function getId()
    {
        return $this->id;
    }

    public function getAuthKey()
    {
    }

    public function validateAuthKey($authKey)
    {
    }
    
    
}
