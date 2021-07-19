/**
 * @format
 */

import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';

import messaging from '@react-native-firebase/messaging';

import AsyncStorage from '@react-native-async-storage/async-storage';


// const storeData = async (value) => {
//     try {
//         await AsyncStorage.setItem('@url_recived', value)
//     } catch (e) {
//         console.log(e)
//         // saving error
//     }
// }

// Register background handler
messaging().setBackgroundMessageHandler(async remoteMessage => {
    console.log('Message handled in the background!', remoteMessage);

    // try {
    //     console.log('uri : ' + remoteMessage.notification.body)
    //     storeData(remoteMessage.notification.body)
    // } catch (e) {
    //     console.log(e)
    // }
});


AppRegistry.registerComponent(appName, () => App);
