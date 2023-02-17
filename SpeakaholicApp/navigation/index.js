import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/FontAwesome';

import HomeScreen from '../screens/HomeScreen';
import LoadingScreen from '../screens/LoadingScreen';
import SignUpScreen from '../screens/SignUpScreen';
import LoginScreen from '../screens/LoginScreen';
import ForgotPasswordScreen from '../screens/ForgotPasswordScreen';
import ConfirmAccountScreen from '../screens/ConfirmAccountScreen';
import ResendConfirmationCodeScreen from '../screens/ResendConfirmationCodeScreen';
import ForgotPasswordConfirmationScreen from '../screens/ForgotPasswordConfirmationScreen';
import SettingsScreen from '../screens/SettingsScreen';
import colors from '../styles/colors';
import BottomTabNavigator from './BottomTabNavigator';
import DownloadsScreen from '../screens/DownloadsScreen';
import {View} from 'react-native';
import PurchaseScreen from '../screens/PurchaseScreen';

Icon.loadFont().then();

const Stack = createNativeStackNavigator();

export default function Navigation() {
  return (
    <NavigationContainer>
      <RootNavigator />
    </NavigationContainer>
  );
}

function RootNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={({navigation}) => ({
        headerStyle: {
          backgroundColor: colors.COLORS.PRIMARY,
        },
        headerBackVisible: false,
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        headerRight: () => (
          <View style={{flexDirection: 'row'}}>
            <Icon.Button
              onPress={() => navigation.navigate('Downloads')}
              name="cloud-download"
              backgroundColor={colors.COLORS.PRIMARY}
            />
            <Icon.Button
              onPress={() => navigation.navigate('Settings')}
              name="gear"
              backgroundColor={colors.COLORS.PRIMARY}
            />
          </View>
        ),
        headerLeft: () => (
          <Icon.Button
            onPress={() => navigation.goBack()}
            name="chevron-left"
            backgroundColor={colors.COLORS.PRIMARY}
          />
        ),
      })}>
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Loading"
        component={LoadingScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="SignUp"
        component={SignUpScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Root"
        component={BottomTabNavigator}
        options={{
          headerShown: true,
          headerTitle: '',
          headerLeft: () => {
            <></>;
          },
        }}
      />
      <Stack.Screen
        name="ForgotPassword"
        component={ForgotPasswordScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="ConfirmAccount"
        component={ConfirmAccountScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="ResendConfirmationCode"
        component={ResendConfirmationCodeScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="ForgotPasswordConfirmation"
        component={ForgotPasswordConfirmationScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Settings"
        component={SettingsScreen}
        options={{headerShown: true}}
      />
      <Stack.Screen
        name="Downloads"
        component={DownloadsScreen}
        options={{headerShown: true}}
      />
      <Stack.Screen
        name="Purchase"
        component={PurchaseScreen}
        options={{headerShown: true}}
      />
    </Stack.Navigator>
  );
}
