import * as React from 'react';
import {Text} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import DealsScreen from '../screens/DealsScreen';
import ShareDealScreen from '../screens/ShareDealScreen';
import PriceWatcherScreen from '../screens/PriceWatcherScreen';
import defaultStyles from '../styles/defaultStyles';

const BottomTab = createBottomTabNavigator();

export default function BottomTabNavigator() {
  return (
    <BottomTab.Navigator
      initialRouteName="Deals"
      screenOptions={{headerShown: false}}>
      <BottomTab.Screen name="Deals" component={DealsNavigator} />
      <BottomTab.Screen name="Share Deal" component={ShareDealNavigator} />
      <BottomTab.Screen
        name="Price Watcher"
        component={PriceWatcherNavigator}
      />
    </BottomTab.Navigator>
  );
}
const ShareDealStack = createNativeStackNavigator();

function ShareDealNavigator() {
  return (
    <ShareDealStack.Navigator>
      <ShareDealStack.Screen
        name="ShareDealScreen"
        component={ShareDealScreen}
        options={{
          header: () => <></>,
        }}
      />
    </ShareDealStack.Navigator>
  );
}

const DealsStack = createNativeStackNavigator();

function DealsNavigator() {
  return (
    <DealsStack.Navigator>
      <DealsStack.Screen
        name="DealsScreen"
        component={DealsScreen}
        options={{
          header: () => <></>,
        }}
      />
    </DealsStack.Navigator>
  );
}

const PriceWatcherStack = createNativeStackNavigator();

function PriceWatcherNavigator() {
  return (
    <PriceWatcherStack.Navigator>
      <PriceWatcherStack.Screen
        name="PriceWatcherScreen"
        component={PriceWatcherScreen}
        options={{
          header: () => <></>,
        }}
      />
    </PriceWatcherStack.Navigator>
  );
}
