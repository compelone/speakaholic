import React, {useState} from 'react';
import {
  StyleSheet,
  TextInput,
  View,
  Alert,
  Text,
  TouchableOpacity,
} from 'react-native';
import {connect} from 'react-redux';

import * as layout from '../styles/layout';
import * as colors from '../styles/colors';
import * as defaultStyles from '../styles/defaultStyles';
import {registration} from '../services/authService';
import SocialLogin from '../components/SocialLogin';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {Analytics} from 'aws-amplify';

const SignUpScreen = props => {
  const [name, setName] = useState();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [confirmPassword, setConfirmPassword] = useState();

  const [nameError, setNameError] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [confirmPasswordError, setConfirmPasswordError] = useState(false);

  const emptyState = () => {
    setName();
    setEmail();
    setPassword();
    setConfirmPassword();
  };
  const handlePress = async () => {
    if (!name) {
      setNameError(true);
    } else if (!email) {
      setEmailError(true);
    } else if (!password) {
      setPasswordError(true);
    } else if (!confirmPassword) {
      setPassword('');
      setConfirmPasswordError(true);
    } else if (password !== confirmPassword) {
      setPasswordError(true);
      setConfirmPasswordError(true);
    } else {
      try {
        await registration(email, password, name);
        emptyState();
        props.navigation.navigate('ConfirmAccount', {
          email,
        });
      } catch (error) {
        Alert.alert('Something went wrong.');
        Analytics.record({
          name: 'Error',
          attributes: {
            error: error.message,
            stack: error.stack,
            component: 'SignUpScreen',
            function: 'handlePress',
            action: 'handlePress',
          },
          metrics: {
            error: error.message,
          },
        });
      }
    }
  };

  return (
    <KeyboardAwareScrollView contentContainerStyle={styles.mainContainer}>
      <View>
        <Text style={styles.headerText}>Sign Up</Text>

        <TextInput
          style={
            nameError
              ? [styles.textInput, defaultStyles.default.textInputError]
              : styles.textInput
          }
          autoCapitalize="none"
          placeholder="Name*"
          placeholderTextColor={colors.default.COLORS.DARKGRAY}
          value={name}
          onChangeText={setName}
        />
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
        <TextInput
          style={
            confirmPasswordError
              ? [styles.textInput, defaultStyles.default.textInputError]
              : styles.textInput
          }
          autoCapitalize="none"
          secureTextEntry={true}
          placeholder="Confirm Password*"
          placeholderTextColor={colors.default.COLORS.DARKGRAY}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />
      </View>
      <View>
        <TouchableOpacity
          style={[styles.button, styles.signupButton]}
          onPress={handlePress}>
          <Text style={styles.buttonText}>Sign Up</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => props.navigation.navigate('Login')}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
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
    backgroundColor: colors.default.COLORS.SALMON,
    alignItems: 'center',
    padding: 10,
    minWidth: '48%',
    marginBottom: 10,
    borderRadius: 5,
  },
  signupButton: {
    backgroundColor: colors.default.COLORS.PRIMARY,
  },
  socialView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  orText: {
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

export default connect(mapStateToProps)(SignUpScreen);
