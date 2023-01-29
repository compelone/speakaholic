import React, {useState} from 'react';
import {
  StyleSheet,
  TextInput,
  View,
  Alert,
  Text,
  TouchableOpacity,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';

import * as layout from '../styles/layout';
import * as colors from '../styles/colors';
import * as defaultStyles from '../styles/defaultStyles';
import {registration} from '../services/authService';
import SocialLogin from '../components/SocialLogin';

const SignUpScreen = ({navigation}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [nameError, setNameError] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [confirmPasswordError, setConfirmPasswordError] = useState(false);

  const emptyState = () => {
    setName('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
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
        navigation.navigate('ConfirmAccount');
      } catch (error) {
        Alert.alert('Something went wrong.');
      }
    }
  };

  return (
    <View style={styles.mainContainer}>
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
        <TextInput
          style={
            confirmPasswordError
              ? [styles.textInput, defaultStyles.default.textInputError]
              : styles.textInput
          }
          autoCapitalize="none"
          secureTextEntry={true}
          placeholder="Confirm Password*"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />
      </View>
      <View>
        <TouchableOpacity
          style={[styles.button, styles.signupButton]}
          onPress={handlePress}>
          <Text>Sign Up</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('Login')}>
          <Text>Login</Text>
        </TouchableOpacity>
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
    backgroundColor: colors.default.COLORS.SALMON,
    alignItems: 'center',
    padding: 10,
    minWidth: '48%',
    marginBottom: 10,
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
});

export default SignUpScreen;