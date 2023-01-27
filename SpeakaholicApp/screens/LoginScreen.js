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
import {SafeAreaView} from 'react-native-safe-area-context';
import * as layout from '../styles/layout';
import * as colors from '../styles/colors';
import * as defaultStyles from '../styles/defaultStyles';
import {signIn} from '../services/authService';
import * as Keychain from 'react-native-keychain';
import SocialLogin from '../components/SocialLogin';

const LoginScreen = ({navigation}) => {
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
      await signIn(email, password);

      setError('');
      await Keychain.setGenericPassword(email, password);
      navigation.replace('Root');
    } catch (err) {
      if (
        err.toString() === 'UserNotConfirmedException: User is not confirmed.'
      ) {
        Alert.alert(
          'Your account is not confirmed. Check your email for your confirmation code.',
        );
        navigation.navigate('ConfirmAccount');
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
          onPress={() => navigation.navigate('ForgotPassword')}>
          Forgot Password?
        </Text>
        <Text
          style={styles.forgotPasswordText}
          onPress={() => navigation.navigate('ConfirmAccount')}>
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
              onPress={() => navigation.navigate('SignUp')}>
              <Text>Sign Up</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
      <View>
        <SocialLogin navigation={navigation} />
      </View>
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

export default LoginScreen;
