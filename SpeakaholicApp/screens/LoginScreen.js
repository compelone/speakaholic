import React, {useState} from 'react';
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
import * as Keychain from 'react-native-keychain';
import {bindActionCreators} from 'redux';
import {updateUser} from '../modules/UserActions';
import {connect} from 'react-redux';
import {DataStore, syncExpression} from '@aws-amplify/datastore';
import {SpeechItems, UserCreditsLeft, Users} from '../models';

const LoginScreen = props => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);

  const handlePress = async () => {
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
      const loggedInUser = await signIn(email, password);

      props.updateUser(loggedInUser);

      setError('');
      await Keychain.setGenericPassword(email, password);

      DataStore.configure({
        syncExpressions: [
          syncExpression(UserCreditsLeft, () => {
            return ucl =>
              ucl.cognito_user_name.eq(props.user.loggedInUser.attributes.sub);
          }),
          syncExpression(SpeechItems, () => {
            return si =>
              si.cognito_user_name.eq(props.user.loggedInUser.attributes.sub);
          }),
          syncExpression(Users, () => {
            return u =>
              u.cognito_user_name.eq(props.user.loggedInUser.attributes.sub);
          }),
        ],
      });

      props.navigation.replace('Root');
    } catch (err) {
      if (
        err.toString() === 'UserNotConfirmedException: User is not confirmed.'
      ) {
        Alert.alert(
          'Your account is not confirmed. Check your email for your confirmation code.',
        );
        props.navigation.navigate('ConfirmAccount', {email});
      } else {
        setError(err.toString());
      }
    } finally {
      setLoading(false);
      setPassword('');
    }
  };

  return (
    <View style={styles.mainContainer}>
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
              <Text>Login</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.signupButton]}
              onPress={() => props.navigation.navigate('SignUp')}>
              <Text>Sign Up</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
      <View>{/* <SocialLogin navigation={props.navigation} /> */}</View>
    </View>
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
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      updateUser,
    },
    dispatch,
  );

const mapStateToProps = state => {
  const {user} = state;
  return {user};
};

export default connect(mapStateToProps, mapDispatchToProps)(LoginScreen);
