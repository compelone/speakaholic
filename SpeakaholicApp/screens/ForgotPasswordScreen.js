import React, {useState} from 'react';
import {
  StyleSheet,
  TextInput,
  View,
  ActivityIndicator,
  Text,
  TouchableOpacity,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import * as layout from '../styles/layout';
import * as colors from '../styles/colors';
import * as defaultStyles from '../styles/defaultStyles';
import {forgotPassword, signOut} from '../services/authService';
import * as Keychain from 'react-native-keychain';
import SocialLogin from '../components/SocialLogin';
import {connect} from 'react-redux';

const ForgotPasswordScreen = props => {
  const [email, setEmail] = useState();
  const [error, setError] = useState();
  const [loading, setLoading] = useState(false);

  const [emailError, setEmailError] = useState(false);

  const handlePress = async () => {
    if (!email) {
      setEmailError(true);
      return;
    }

    setLoading(true);

    try {
      await forgotPassword(email);
      await signOut();
      await Keychain.resetGenericPassword();
      setError();
      props.navigation.navigate('ForgotPasswordConfirmation', {email});
    } catch (err) {
      setError(err.toString());
    } finally {
      setLoading(false);
      setEmail();
    }
  };

  return (
    <View style={styles.mainContainer}>
      <View>
        <Text style={styles.headerText}>ForgotPassword</Text>
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

        <Text style={styles.errorText}>{error}</Text>

        {loading ? (
          <View style={styles.container}>
            <ActivityIndicator color={colors.default.COLORS.PRIMARY} />
          </View>
        ) : (
          <View>
            <TouchableOpacity style={styles.button} onPress={handlePress}>
              <Text>Send Password</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
      <View>{/* <SocialLogin navigation={navigation} /> */}</View>
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
    backgroundColor: colors.default.COLORS.DEFAULT,
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

const mapStateToProps = state => {
  const {user} = state;
  return {user};
};

export default connect(mapStateToProps)(ForgotPasswordScreen);
