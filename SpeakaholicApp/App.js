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
import {Provider} from 'react-redux';
import {createStore} from 'redux';
import userReducer from './modules/UserStore';

import awsconfig from './aws-exports';

Amplify.configure(awsconfig);
const store = createStore(userReducer);

function App() {
  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <Navigation />
      </SafeAreaProvider>
    </Provider>
  );
}

export default App;
