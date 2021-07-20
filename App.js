
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

import AsyncStorage from '@react-native-async-storage/async-storage';


var rnw
var cbc = false;

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

      Alert.alert(JSON.stringify(remoteMessage.notification.title).replace(/"/gi, ""), JSON.stringify(remoteMessage.notification.body).replace(/"/gi, ""));


      setUri({ uri: 'http://ip1002.hostingbox.co.kr/' });
      setTimeout(() => {
        setUri({ uri: remoteMessage.data.url });
      }, 500);

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
      }, 500);
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
    <WebView
      ref={wb => { rnw = wb }}
      onMessage={event => {
        onMessage(event)
      }}
      onLoadEnd={() => {
      }}
      source={uri}
      style={{ width: '100%', height: '100%' }}
      onNavigationStateChange={(navState) => { cbc = navState.canGoBack; }}
    />
  )
}



export default App;
