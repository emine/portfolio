import { View,  } from 'react-native';
import { Text, Button, Divider } from 'react-native-elements';

import AppContext from '../AppContext' ;

export class UserScreen extends Component{

    static contextType = AppContext ;    
       
    render() {
        console.log(this.context.state.user) ;

        return (
            <View style={{ flexDirection:"column", padding: 5}}>
                <Text>
                    User Screen 
                </Text>
            </View>
            
        );
    } 
}
