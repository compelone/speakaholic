/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

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

Sentry.init({
  dsn: 'https://25237073e16042c3abf0de9eafaf8ae3@o4504740238131200.ingest.sentry.io/4504740241604608',
});

Amplify.configure(awsconfig);
const store = createStore(userReducer);

function App() {
  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <UserCredits />
        <Navigation />
      </SafeAreaProvider>
    </Provider>
  );
}

export default Sentry.wrap(App);
