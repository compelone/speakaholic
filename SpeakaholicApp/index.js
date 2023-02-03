/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import {Amplify, Analytics} from 'aws-amplify';
// import {
//   AmazonAIPredictionsProvider,
//   Predictions,
// } from '@aws-amplify/predictions';
import awsconfig from './aws-exports';

Amplify.configure(awsconfig);
// Amplify.register(Predictions);

// Amplify.addPluggable(new AmazonAIPredictionsProvider());

AppRegistry.registerComponent(appName, () => App);
