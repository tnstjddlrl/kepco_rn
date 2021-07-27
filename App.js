
import React, { useRef, useEffect, useState, useCallback } from 'react';
import {
  Alert,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  BackHandler,
  ActivityIndicator
} from 'react-native';

import { WebView } from 'react-native-webview';

import RNExitApp from 'react-native-exit-app';

import messaging from '@react-native-firebase/messaging';

var rnw
var cbc = false;

async function requestUserPermission() {
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  if (enabled) {
    console.log('Authorization status:', authStatus);
  }
}



const App = () => {

  const [uri, setUri] = useState({ uri: 'http://ip1002.hostingbox.co.kr/' })

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hwbp",
      function () {
        if (cbc && rnw) {
          rnw.goBack();
          return true;
        } else if (cbc == false) {
          Alert.alert('앱을 종료하시겠습니까?', '', [
            {
              text: "No",
              onPress: () => console.log("Cancel Pressed")
            },
            { text: "Yes", onPress: () => RNExitApp.exitApp() }
          ])
          return true;
        }
      }
    );
    return () => backHandler.remove();
  }, []);

  useEffect(() => {
    const unsubscribe = messaging().onMessage(async remoteMessage => {

      console.log(remoteMessage)

      Alert.alert(JSON.stringify(remoteMessage.notification.title).replace(/"/gi, ""), JSON.stringify(remoteMessage.notification.body).replace(/"/gi, ""), [
        {
          text: "닫기",
          onPress: () => console.log("Cancel Pressed")
        },
        {
          text: "확인", onPress: () => {
            setUri({ uri: 'http://ip1002.hostingbox.co.kr/' });
            setTimeout(() => {
              setUri({ uri: remoteMessage.data.url });
            }, 100);
          }
        }
      ]);

      if(Platform.OS =='ios'){
        PushNotification.localNotificationSchedule({
          channelId: "fcm_alert",
          ticker: "My Notification Ticker",
          vibrate: true, // (optional) default: true
          vibration: 300,
          group: "dgroup", // (optional) add group to message
          priority: "max", // (optional) set notification priority, default: high
          visibility: "public", // (optional) set notification visibility, default: private
          ignoreInForeground: false, // (optional) if true, the notification will not be visible when the app is in the foreground (useful for parity with how iOS notifications appear). should be used in combine with `com.dieam.reactnativepushnotification.notification_foreground` setting
      
          messageId: remoteMessage.messageId, // (optional) added as `message_id` to intent extras so opening push notification can find data stored by @react-native-firebase/messaging module. 
      
      
          actions: ["Yes", "No"], // (Android only) See the doc for notification actions to know more
          invokeApp: true, // (optional) This enable click on actions to bring back the application to foreground or stay in background, default: true
          importance: Importance.HIGH,
      
          /* iOS and Android properties */
          title: remoteMessage.notification.title, // (optional)
          message: remoteMessage.notification.body, // (required)
          playSound: true, // (optional) default: true
          soundName: "default", // (optional) Sound to play when the notification is shown. Value of 'default' plays the default sound. It can be set to a custom sound such as 'android.resource://com.xyz/raw/my_sound'. It will look for the 'my_sound' audio file in 'res/raw' directory and play it. default: 'default' (default sound is played)
      
          date: new Date(Date.now()),
          allowWhileIdle: true,
          repeatTime: 1,
      
        });
      }


    });

    return unsubscribe;
  }, []);

  useEffect(() => {

    messaging().onNotificationOpenedApp(remoteMessage => {
      console.log(
        'Notification caused app to open from background state:',
        remoteMessage.data.url,
      );

      setUri({ uri: 'http://ip1002.hostingbox.co.kr/' });
      setTimeout(() => {
        setUri({ uri: remoteMessage.data.url });
      }, 300);
    });

    messaging()
      .getInitialNotification()
      .then(remoteMessage => {
        if (remoteMessage) {
          console.log(
            'Notification caused app to open from quit state:',
            remoteMessage.data.url,
          );
          setUri({ uri: remoteMessage.data.url });
        }
      });
  }, []);

  const [pushToken, setPushToken] = useState('')
  const [isAuthorized, setIsAuthorized] = useState(false)

  const handlePushToken = useCallback(async () => {
    const enabled = await messaging().hasPermission()
    if (enabled) {
      const fcmToken = await messaging().getToken()
      if (fcmToken) setPushToken(fcmToken)
    } else {
      const authorized = await messaging.requestPermission()
      if (authorized) setIsAuthorized(true)
    }
  }, [])


  const saveDeviceToken = useCallback(async () => {
    if (isAuthorized) {
      const currentFcmToken = await firebase.messaging().getToken()
      if (currentFcmToken !== pushToken) {
        return saveTokenToDatabase(currentFcmToken)
      }
      return messaging().onTokenRefresh((token) => saveTokenToDatabase(token))
    }
  }, [pushToken, isAuthorized])

  useEffect(() => {
    requestUserPermission()
    try {
      handlePushToken()
      saveDeviceToken()

      setTimeout(() => {
        console.log(pushToken)
      }, 1000);
    } catch (error) {
      console.log(error)
      Alert.alert('토큰 받아오기 실패')
    }

  }, [])

  function onMessage(event) {
    console.log(event.nativeEvent.data);
    // Alert.alert(event.nativeEvent.data);
    // rnw.postMessage('app')

    if (event.nativeEvent.data == 'LoginToken') {
      rnw.postMessage(pushToken)
      console.log('전송 : ' + pushToken)
    }

  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <WebView
        ref={wb => { rnw = wb }}
        onMessage={event => {
          onMessage(event)
        }}
        onLoadEnd={() => {
        }}
        source={uri}
        originWhitelist={['https://*', 'http://*',]}
        style={{ width: '100%', height: '100%' }}
        onNavigationStateChange={(navState) => { cbc = navState.canGoBack; }}
      />
    </SafeAreaView>
  )
}



export default App;
