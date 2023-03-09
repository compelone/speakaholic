import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  TextInput,
  View,
  ActivityIndicator,
  Text,
  TouchableOpacity,
  Alert,
} from 'react-native';
import * as layout from '../styles/layout';
import * as colors from '../styles/colors';
import * as defaultStyles from '../styles/defaultStyles';
import {signIn} from '../services/authService';
import {bindActionCreators} from 'redux';
import {updateUser} from '../modules/UserActions';
import {updateUserCreditsLeft} from '../modules/UserCreditsLeftAction';
import {connect} from 'react-redux';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import * as Sentry from '@sentry/react-native';
import * as Keychain from 'react-native-keychain';
import {reset} from '../modules/ResetAction';
import flagsmith from 'react-native-flagsmith';
import {DataStore, syncExpression} from '@aws-amplify/datastore';
import {getCreditsLeft} from '../services/dataService';
import {SpeechItems, UserCreditsLeft, Users} from '../models';
import {useFlags} from 'react-native-flagsmith/react';
import {Hub} from 'aws-amplify';

const LoginScreen = props => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);

  const flags = useFlags(['allow_skip_purchase_screen_if_no_credits']);
  const flagAllowSkipPurchaseScreenIfNoCredits =
    flags.allow_skip_purchase_screen_if_no_credits;

  useEffect(() => {
    (async () => {
      const credentials = await Keychain.getGenericPassword();
      if (credentials) {
        const {username, password} = credentials;
        await signIn(username, password);
      }
    })();
  }, []);

  useEffect(() => {
    const unsubscribe = Hub.listen('auth', async ({payload: {event, data}}) => {
      switch (event) {
        case 'signIn':
          props.updateUser(data);

          const cognito_user_name = data.attributes.sub;
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

          const userCreditsLeft = await getCreditsLeft(cognito_user_name);

          if (userCreditsLeft.data.getUserCreditsLeft === null) {
            if (flagAllowSkipPurchaseScreenIfNoCredits.enabled) {
              props.navigation.navigate('Root');
            } else {
              props.navigation.navigate('Purchase');
            }
            break;
          }

          props.updateUserCreditsLeft(userCreditsLeft);

          props.navigation.replace('Root');
          break;
        case 'tokenRefresh':
        case 'tokenRefresh_failure':
        case 'signOut':
          await Keychain.resetGenericPassword();
          props.reset();
          props.navigation.navigate('Home');
          break;
      }
    });
  }, []);

  const handlePress = async () => {
    setError('');

    if (!email) {
      setEmailError(true);
      return;
    }

    if (!password) {
      setPasswordError(true);
      return;
    }

    setLoading(true);

    try {
      await signIn(email, password);
      await Keychain.setGenericPassword(email, password);
    } catch (err) {
      if (
        err.toString() === 'UserNotConfirmedException: User is not confirmed.'
      ) {
        Alert.alert(
          'Your account is not confirmed. Check your email for your confirmation code.',
        );
        props.navigation.navigate('ConfirmAccount', {email});
        return;
      }
      Sentry.captureException(error);

      setError(err.toString());
    } finally {
      setLoading(false);
      setEmail('');
      setPassword('');
    }
  };

  return (
    <KeyboardAwareScrollView contentContainerStyle={styles.mainContainer}>
      <View>
        <Text style={styles.headerText}>Login</Text>
        <TextInput
          style={
            emailError
              ? [styles.textInput, defaultStyles.default.textInputError]
              : styles.textInput
          }
          autoCapitalize="none"
          placeholder="Email*"
          placeholderTextColor={colors.default.COLORS.DARKGRAY}
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          style={
            passwordError
              ? [styles.textInput, defaultStyles.default.textInputError]
              : styles.textInput
          }
          autoCapitalize="none"
          secureTextEntry={true}
          placeholder="Password*"
          placeholderTextColor={colors.default.COLORS.DARKGRAY}
          value={password}
          onChangeText={setPassword}
        />

        <Text style={styles.errorText}>{error}</Text>

        <Text
          style={styles.forgotPasswordText}
          onPress={() => props.navigation.navigate('ForgotPassword')}>
          Forgot Password?
        </Text>
        <Text
          style={styles.forgotPasswordText}
          onPress={() => props.navigation.navigate('ConfirmAccount')}>
          Have a Code?
        </Text>
        {loading ? (
          <View style={styles.container}>
            <ActivityIndicator color={colors.default.COLORS.PRIMARY} />
          </View>
        ) : (
          <View>
            <TouchableOpacity style={styles.button} onPress={handlePress}>
              <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.signupButton]}
              onPress={() => props.navigation.navigate('SignUp')}>
              <Text style={styles.buttonText}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
      <View>{/* <SocialLogin navigation={props.navigation} /> */}</View>
    </KeyboardAwareScrollView>
  );
};
const styles = StyleSheet.create({
  mainContainer: layout.default.centered,
  headerText: {
    color: colors.default.COLORS.PRIMARY,
    fontSize: defaultStyles.default.largestText.fontSize,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  textInput: {
    ...defaultStyles.default.textInput,
  },
  buttonsContainer: {
    flexDirection: 'row',
  },
  button: {
    backgroundColor: colors.default.COLORS.PRIMARY,
    alignItems: 'center',
    padding: 10,
    minWidth: '48%',
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
  errorText: {
    color: 'red',
  },
  forgotPasswordText: {
    ...defaultStyles.default.standardText,
    paddingBottom: 20,
    color: colors.default.COLORS.ERROR,
  },
  buttonText: {
    color: colors.default.COLORS.WHITE,
  },
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      updateUser,
      updateUserCreditsLeft,
      reset,
    },
    dispatch,
  );

const mapStateToProps = state => {
  const {user} = state;
  return {user};
};

export default connect(mapStateToProps, mapDispatchToProps)(LoginScreen);
