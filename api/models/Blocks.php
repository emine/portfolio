<?php

namespace app\models;

use Yii;

/**
 * This is the model class for table "blocks".
 *
 * @property int $id
 * @property int $id_user
 * @property int $id_friend
 */
class Blocks extends \yii\db\ActiveRecord
{
    /**
     * {@inheritdoc}
     */
    public static function tableName()
    {
        return 'blocks';
    }

    /**
     * {@inheritdoc}
     */
    public function rules()
    {
        return [
            [['id_user', 'id_friend'], 'integer'],
        ];
    }

    /**
     * {@inheritdoc}
     */
    public function attributeLabels()
    {
        return [
            'id' => 'ID',
            'id_user' => 'Id User',
            'id_friend' => 'Id Friend',
        ];
    }
}
