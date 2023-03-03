/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import 'core-js/full/symbol/async-iterator';
import React, {useEffect} from 'react';
import Navigation from './navigation';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {Amplify, Analytics, API} from 'aws-amplify';
import {Provider} from 'react-redux';
import userReducer from './modules/UserStore';
import {createStore} from 'redux';

import awsconfig from './aws-exports';
import UserCredits from './components/UserCredits';

import * as Sentry from '@sentry/react-native';
import {SENTRY_DSN} from '@env';

import flagsmith from 'react-native-flagsmith';
import {FlagsmithProvider} from 'react-native-flagsmith/react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {FLAGSMITH_API_KEY} from '@env';

Sentry.init({
  dsn: SENTRY_DSN,
});

Amplify.configure(awsconfig);
const store = createStore(userReducer);

function App() {
  return (
    <Provider store={store}>
      <FlagsmithProvider
        options={{
          environmentID: FLAGSMITH_API_KEY,
          cacheFlags: true,
          AsyncStorage: AsyncStorage, // Pass in whatever storage you use if you wish to cache flag values
          cacheOptions: {
            // How long to cache flags for in seconds
            ttl: 60 * 60 * 24,
          },
        }}
        flagsmith={flagsmith}>
        <SafeAreaProvider>
          <UserCredits />
          <Navigation />
        </SafeAreaProvider>
      </FlagsmithProvider>
    </Provider>
  );
}

export default Sentry.wrap(App);
