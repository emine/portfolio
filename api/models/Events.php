<?php

namespace app\models;

use Yii;

/**
 * This is the model class for table "events".
 *
 * @property int $id
 * @property int $id_user
 * @property string $name
 * @property string $date
 */
class Events extends \yii\db\ActiveRecord
{
    /**
     * {@inheritdoc}
     */
    public static function tableName()
    {
        return 'events';
    }

    /**
     * {@inheritdoc}
     */
    public function rules()
    {
        return [
            [['id_user'], 'integer'],
            [['date'], 'safe'],
            [['name'], 'string', 'max' => 250],
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
            'name' => 'Name',
            'date' => 'Date',
        ];
    }
    
    
    public function deleteEvent() {
        try {
            foreach (Photos::find()->where(['id_event' => $this->id])->all() as $photo) {
                unlink(dirname ( __FILE__ ) . '/../web/images/' . $photo->url) ;
                $photo->delete() ;
            }
            
            $this->delete() ;

            } catch (Exception $e) {
                return ['success' => false, 'error' => $e->getMessage()] ; 
            } 
        
            return ['success' => true] ; 

        }
    }
