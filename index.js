/**
 * @format
 */

import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';

import messaging from '@react-native-firebase/messaging';

import PushNotification, { Importance } from 'react-native-push-notification';
import PushNotificationIOS from "@react-native-community/push-notification-ios";

PushNotification.configure({

  onRegister: function (token) {
    console.log("TOKEN:", token);
  },

  onNotification: function (notification) {
    console.log("NOTIFICATION:", notification);

    notification.finish(PushNotificationIOS.FetchResult.NoData);
  },

  onAction: function (notification) {
    console.log("ACTION:", notification.action);
    console.log("NOTIFICATION:", notification);

    // process the action
  },

  onRegistrationError: function (err) {
    console.error(err.message, err);
  },

  permissions: {
    alert: true,
    badge: true,
    sound: true,
  },

  popInitialNotification: true,

  requestPermissions: Platform.OS === 'ios',
});

PushNotification.createChannel(
  {
    channelId: "fcm_alert", // (required)
    channelName: "My channel", // (required)
    channelDescription: "A channel to categorise your notifications", // (optional) default: undefined.
    playSound: true, // (optional) default: true
    soundName: "default", // (optional) See `soundName` parameter of `localNotification` function
    importance: Importance.HIGH, // (optional) default: Importance.HIGH. Int value of the Android notification importance
    vibrate: true, // (optional) default: true. Creates the default vibration pattern if true.
  },
  (created) => console.log(`createChannel returned '${created}'`) // (optional) callback returns whether the channel was created, false means it already existed.
);

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

PushNotification.getChannels(function (channel_ids) {
  console.log(channel_ids);
});



// Register background handler
messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log('Message handled in the background!', remoteMessage);

  // PushNotification.localNotificationSchedule({
  //   channelId: "fcm_alert",
  //   ticker: "My Notification Ticker",
  //   vibrate: true, // (optional) default: true
  //   vibration: 300,
  //   group: "dgroup", // (optional) add group to message
  //   priority: "max", // (optional) set notification priority, default: high
  //   visibility: "public", // (optional) set notification visibility, default: private
  //   ignoreInForeground: false, // (optional) if true, the notification will not be visible when the app is in the foreground (useful for parity with how iOS notifications appear). should be used in combine with `com.dieam.reactnativepushnotification.notification_foreground` setting

  //   messageId: remoteMessage.messageId, // (optional) added as `message_id` to intent extras so opening push notification can find data stored by @react-native-firebase/messaging module. 


  //   actions: ["Yes", "No"], // (Android only) See the doc for notification actions to know more
  //   invokeApp: true, // (optional) This enable click on actions to bring back the application to foreground or stay in background, default: true
  //   importance: Importance.HIGH,

  //   /* iOS and Android properties */
  //   title: remoteMessage.data.title, // (optional)
  //   message: remoteMessage.data.body, // (required)
  //   playSound: true, // (optional) default: true
  //   soundName: "default", // (optional) Sound to play when the notification is shown. Value of 'default' plays the default sound. It can be set to a custom sound such as 'android.resource://com.xyz/raw/my_sound'. It will look for the 'my_sound' audio file in 'res/raw' directory and play it. default: 'default' (default sound is played)

  //   date: new Date(Date.now()),
  //   allowWhileIdle: true,
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
