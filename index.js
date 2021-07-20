/**
 * @format
 */

import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';

import messaging from '@react-native-firebase/messaging';

async function requestUserPermission() {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;
  
    if (enabled) {
      console.log('Authorization status:', authStatus);
    }
}

requestUserPermission()

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
