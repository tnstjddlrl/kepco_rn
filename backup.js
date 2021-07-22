
// import React, { useRef, useEffect, useState, useCallback } from 'react';
// import {
//   Alert,
//   SafeAreaView,
//   ScrollView,
//   StatusBar,
//   StyleSheet,
//   Text,
//   useColorScheme,
//   View,
//   BackHandler,
//   ActivityIndicator,
//   Dimensions,
//   RefreshControl
// } from 'react-native';

// import { WebView } from 'react-native-webview';

// import RNExitApp from 'react-native-exit-app';

// import messaging from '@react-native-firebase/messaging';

// import AutoHeightWebView from 'react-native-autoheight-webview'

// var rnw
// var cbc = false;

// const chwidth = Dimensions.get('window').width
// const chheight = Dimensions.get('window').height


// async function requestUserPermission() {
//   const authStatus = await messaging().requestPermission();
//   const enabled =
//     authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
//     authStatus === messaging.AuthorizationStatus.PROVISIONAL;

//   if (enabled) {
//     console.log('Authorization status:', authStatus);
//   }
// }



// const App = () => {

//   const [uri, setUri] = useState({ uri: 'http://ip1002.hostingbox.co.kr/' })

//   useEffect(() => {
//     const backHandler = BackHandler.addEventListener(
//       "hwbp",
//       function () {
//         if (cbc && rnw) {
//           rnw.goBack();
//           return true;
//         } else if (cbc == false) {
//           Alert.alert('앱을 종료하시겠습니까?', '', [
//             {
//               text: "No",
//               onPress: () => console.log("Cancel Pressed")
//             },
//             { text: "Yes", onPress: () => RNExitApp.exitApp() }
//           ])
//           return true;
//         }
//       }
//     );
//     return () => backHandler.remove();
//   }, []);

//   useEffect(() => {
//     const unsubscribe = messaging().onMessage(async remoteMessage => {

//       console.log(remoteMessage)

//       Alert.alert(JSON.stringify(remoteMessage.notification.title).replace(/"/gi, ""), JSON.stringify(remoteMessage.notification.body).replace(/"/gi, ""), [
//         {
//           text: "닫기",
//           onPress: () => console.log("Cancel Pressed")
//         },
//         {
//           text: "확인", onPress: () => {
//             setUri({ uri: 'http://ip1002.hostingbox.co.kr/' });
//             setTimeout(() => {
//               setUri({ uri: remoteMessage.data.url });
//             }, 100);
//           }
//         }
//       ]);




//     });

//     return unsubscribe;
//   }, []);

//   useEffect(() => {

//     messaging().onNotificationOpenedApp(remoteMessage => {
//       console.log(
//         'Notification caused app to open from background state:',
//         remoteMessage.data.url,
//       );

//       setUri({ uri: 'http://ip1002.hostingbox.co.kr/' });
//       setTimeout(() => {
//         setUri({ uri: remoteMessage.data.url });
//       }, 100);
//     });

//     messaging()
//       .getInitialNotification()
//       .then(remoteMessage => {
//         if (remoteMessage) {
//           console.log(
//             'Notification caused app to open from quit state:',
//             remoteMessage.data.url,
//           );
//           setUri({ uri: remoteMessage.data.url });
//         }
//       });
//   }, []);

//   const [pushToken, setPushToken] = useState('')
//   const [isAuthorized, setIsAuthorized] = useState(false)

//   const handlePushToken = useCallback(async () => {
//     const enabled = await messaging().hasPermission()
//     if (enabled) {
//       const fcmToken = await messaging().getToken()
//       if (fcmToken) setPushToken(fcmToken)
//     } else {
//       const authorized = await messaging.requestPermission()
//       if (authorized) setIsAuthorized(true)
//     }
//   }, [])


//   const saveDeviceToken = useCallback(async () => {
//     if (isAuthorized) {
//       const currentFcmToken = await firebase.messaging().getToken()
//       if (currentFcmToken !== pushToken) {
//         return saveTokenToDatabase(currentFcmToken)
//       }
//       return messaging().onTokenRefresh((token) => saveTokenToDatabase(token))
//     }
//   }, [pushToken, isAuthorized])

//   useEffect(() => {
//     requestUserPermission()
//     try {
//       handlePushToken()
//       saveDeviceToken()

//       setTimeout(() => {
//         console.log(pushToken)
//       }, 1000);
//     } catch (error) {
//       console.log(error)
//       Alert.alert('토큰 받아오기 실패')
//     }

//   }, [])

//   function onMessage(event) {
//     console.log(event.nativeEvent.data);
//     // Alert.alert(event.nativeEvent.data);
//     // rnw.postMessage('app')

//     if (event.nativeEvent.data == 'LoginToken') {
//       rnw.postMessage(pushToken)
//       console.log('전송 : ' + pushToken)
//     }
//   }

//   const wait = (timeout) => {
//     return new Promise(resolve => setTimeout(resolve, timeout));
//   }

//   const [refreshing, setRefreshing] = React.useState(false);

//   const onRefresh = React.useCallback(() => {
//     setRefreshing(true);
//     wait(500).then(() => { setRefreshing(false), setUri({ uri: 'http://ip1002.hostingbox.co.kr/' }) });
//   }, []);

//   useEffect(() => {

//   }, [])

//   return (
//     <SafeAreaView style={{ flex: 1 }}>
//       <ScrollView
//         nestedScrollEnabled={true}
//         refreshControl={
//           <RefreshControl
//             refreshing={refreshing}
//             onRefresh={onRefresh}
//           />
//         }
//       >
//         <AutoHeightWebView
//           style={{ width: chwidth }}
//           ref={wb => { rnw = wb }}
//           onMessage={event => {
//             onMessage(event)
//           }}
//           onLoadEnd={() => {

//           }}
//           source={uri}
//           originWhitelist={['https://*', 'http://*',]}
//           onNavigationStateChange={(navState) => { cbc = navState.canGoBack; }}
//         />

//       </ScrollView>
//     </SafeAreaView>
//   )
// }



// export default App;
