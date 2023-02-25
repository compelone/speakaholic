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

export default App;
