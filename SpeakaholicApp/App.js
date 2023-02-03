/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useEffect} from 'react';
import Navigation from './navigation';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {Amplify, Analytics} from 'aws-amplify';
import {PushNotification} from '@aws-amplify/pushnotification';
import PushNotificationIOS from '@react-native-community/push-notification-ios';

import awsconfig from './aws-exports';

Amplify.configure({
  ...awsconfig,
  PushNotification: {
    requestIOSPermissions: true,
  },
});

function App() {
  useEffect(() => {
    PushNotificationIOS.addEventListener('notification', onRemoteNotification);
  });

  const onRemoteNotification = notification => {
    const isClicked = notification.getData().userInteraction === 1;

    if (isClicked) {
      // Navigate user to another screen
      console.log('clicked');
    } else {
      // Do something else with push notification
      console.log('not clicked');
    }
  };

  return (
    <SafeAreaProvider>
      <Navigation />
    </SafeAreaProvider>
  );
}

export default App;
