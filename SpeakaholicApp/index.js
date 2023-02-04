/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';

// Amplify.register(Predictions);

// Amplify.addPluggable(new AmazonAIPredictionsProvider());

AppRegistry.registerComponent(appName, () => App);
