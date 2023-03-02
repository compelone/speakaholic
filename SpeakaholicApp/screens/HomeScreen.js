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
import * as Keychain from 'react-native-keychain';
import SocialLogin from '../components/SocialLogin';
import {signIn} from '../services/authService';
import {request, check, PERMISSIONS, RESULTS} from 'react-native-permissions';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {updateUser} from '../modules/UserActions';
import {updateUserCreditsLeft} from '../modules/UserCreditsLeftAction';
import {DataStore, syncExpression} from 'aws-amplify';
import {getCreditsLeft} from '../services/dataService';
import {SpeechItems, UserCreditsLeft, Users} from '../models';
import Purchases from 'react-native-purchases';
import {Analytics} from 'aws-amplify';
import * as Sentry from '@sentry/react-native';
import flagsmith from 'react-native-flagsmith';

const HomeScreen = props => {
  useEffect(() => {
    (async () => {
      const credentials = await Keychain.getGenericPassword();
      if (credentials) {
        const loggedInUser = await signIn(
          credentials.username,
          credentials.password,
        );

        props.updateUser(loggedInUser);

        const cognito_user_name = loggedInUser.attributes.sub;
        flagsmith.identify(cognito_user_name);
        DataStore.configure({
          syncExpressions: [
            syncExpression(UserCreditsLeft, () => {
              return ucl => ucl.cognito_user_name.eq(cognito_user_name);
            }),
            syncExpression(SpeechItems, () => {
              return si => si.cognito_user_name.eq(cognito_user_name);
            }),
            syncExpression(Users, () => {
              return u => u.cognito_user_name.eq(cognito_user_name);
            }),
          ],
        });

        DataStore.start();
        try {
          const userCreditsLeft = await getCreditsLeft(cognito_user_name);

          if (userCreditsLeft.data.getUserCreditsLeft === null) {
            props.navigation.navigate('Purchase');
            return;
          }

          props.updateUserCreditsLeft(userCreditsLeft);

          props.navigation.navigate('Root');
        } catch (error) {
          Sentry.captureException(error);
          Alert.alert('Something went wrong.');
        }
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
    <View style={styles.mainContainer}>
      <View>
        <View style={styles.imageView}>
          <Image
            style={styles.image}
            source={require('../assets/images/Transparent.png')}
          />
        </View>
        <Text style={styles.headerText}>Speakaholic</Text>
        <View>
          <TouchableOpacity
            style={styles.button}
            onPress={() => props.navigation.navigate('Login')}>
            <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.signupButton]}
            onPress={() => props.navigation.navigate('SignUp')}>
            <Text style={styles.buttonText}>Sign Up</Text>
          </TouchableOpacity>
        </View>
        <View>
          <SocialLogin navigation={props.navigation} />
        </View>
      </View>
    </View>
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
  imageView: {
    alignItems: 'center',
    paddingBottom: 50,
  },
  image: {
    width: 100,
    height: 100,
  },
  buttonsContainer: {
    flexDirection: 'row',
  },
  button: {
    backgroundColor: colors.default.COLORS.PRIMARY,
    alignItems: 'center',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
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
  buttonText: {
    color: colors.default.COLORS.WHITE,
  },
});

const mapStateToProps = state => {
  const {user} = state;
  return {user};
};

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      updateUserCreditsLeft,
      updateUser,
    },
    dispatch,
  );

export default connect(mapStateToProps, mapDispatchToProps)(HomeScreen);
