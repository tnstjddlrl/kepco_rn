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

  // PushNotification.localNotificationSchedule({
  //   channelId: "your-channel-id",
  //   ticker: "My Notification Ticker",
  //   vibrate: true, // (optional) default: true
  //   vibration: 300,
  //   group: "group", // (optional) add group to message
  //   priority: "high", // (optional) set notification priority, default: high
  //   visibility: "private", // (optional) set notification visibility, default: private
  //   ignoreInForeground: false, // (optional) if true, the notification will not be visible when the app is in the foreground (useful for parity with how iOS notifications appear). should be used in combine with `com.dieam.reactnativepushnotification.notification_foreground` setting

  //   messageId: "google:message_id", // (optional) added as `message_id` to intent extras so opening push notification can find data stored by @react-native-firebase/messaging module. 


  //   actions: ["Yes", "No"], // (Android only) See the doc for notification actions to know more
  //   invokeApp: true, // (optional) This enable click on actions to bring back the application to foreground or stay in background, default: true

  //   /* iOS and Android properties */
  //   title: "My Notification Title", // (optional)
  //   message: "My Notification Message", // (required)
  //   playSound: true, // (optional) default: true
  //   soundName: "default", // (optional) Sound to play when the notification is shown. Value of 'default' plays the default sound. It can be set to a custom sound such as 'android.resource://com.xyz/raw/my_sound'. It will look for the 'my_sound' audio file in 'res/raw' directory and play it. default: 'default' (default sound is played)

  //   date: new Date(Date.now()),
  //   allowWhileIdle: false,
  //   repeatTime: 1,

  // });

  // try {
  //     console.log('uri : ' + remoteMessage.notification.body)
  //     storeData(remoteMessage.notification.body)
  // } catch (e) {
  //     console.log(e)
  // }
});


AppRegistry.registerComponent(appName, () => App);
