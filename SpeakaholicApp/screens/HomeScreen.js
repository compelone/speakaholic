import React, {useEffect} from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  Alert,
} from 'react-native';
import * as layout from '../styles/layout';
import * as colors from '../styles/colors';
import * as defaultStyles from '../styles/defaultStyles';
import {SafeAreaView} from 'react-native-safe-area-context';
import * as Keychain from 'react-native-keychain';
import SocialLogin from '../components/SocialLogin';
import {signIn} from '../services/authService';
import {request, check, PERMISSIONS, RESULTS} from 'react-native-permissions';

const HomeScreen = ({navigation}) => {
  useEffect(() => {
    (async () => {
      const credentials = await Keychain.getGenericPassword();
      if (credentials) {
        await signIn(credentials.username, credentials.password);
      }
    })();
  }, []);

  // useEffect(() => {
  //   (async () => {
  //     const NotificationSettings = {
  //       // properties only available on iOS
  //       // unavailable settings will not be included in the response object
  //       alert: true,
  //       badge: true,
  //       sound: true,
  //       carPlay: false,
  //       criticalAlert: false,
  //       provisional: false,
  //       providesAppSettings: false,
  //       lockScreen: true,
  //       notificationCenter: true,
  //     };

  //     const checkNotificationPermission = await check(
  //       PERMISSIONS.IOS.NOTIF,
  //     );

  //     if (checkNotificationPermission !== RESULTS.GRANTED) {
  //       const requestLocationPermission = await request(
  //         PERMISSIONS.IOS.LOCATION_ALWAYS,
  //       );

  //       if (requestLocationPermission !== RESULTS.GRANTED) {
  //         Alert.alert('Permission to send notifications is not allowed');
  //         return;
  //       }
  //     }
  //   })();
  // }, []);

  return (
    <SafeAreaView style={styles.mainContainer}>
      <View>
        <View style={styles.image}>
          <Image source={require('../assets/images/Appleicon_120px.png')} />
        </View>
        <Text style={styles.headerText}>Dealsy</Text>
        <View>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate('Login')}>
            <Text>Login</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.signupButton]}
            onPress={() => navigation.navigate('SignUp')}>
            <Text>Sign Up</Text>
          </TouchableOpacity>
        </View>
        <View>
          <SocialLogin navigation={navigation} />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    ...layout.default.centered,
    minWidth: '80%',
  },
  headerText: {
    color: colors.default.COLORS.PRIMARY,
    fontSize: defaultStyles.default.largestText.fontSize,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  image: {
    alignItems: 'center',
    paddingBottom: 50,
  },
  buttonsContainer: {
    flexDirection: 'row',
  },
  button: {
    backgroundColor: colors.default.COLORS.PRIMARY,
    alignItems: 'center',
    padding: 10,
    marginBottom: 10,
  },
  signupButton: {
    backgroundColor: colors.default.COLORS.SALMON,
  },
  socialView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  useText: {
    fontSize: 20,
    padding: 20,
    textAlign: 'center',
  },
});

export default HomeScreen;
