/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
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
  return (
    <SafeAreaProvider>
      <Navigation />
    </SafeAreaProvider>
  );
}

export default App;
