import React, {useState} from 'react';
import {
  StyleSheet,
  TextInput,
  View,
  ActivityIndicator,
  Text,
  TouchableOpacity,
} from 'react-native';
import * as layout from '../styles/layout';
import * as colors from '../styles/colors';
import * as defaultStyles from '../styles/defaultStyles';
import {confirmAccount} from '../services/authService';
import {connect} from 'react-redux';

const ConfirmAccountScreen = props => {
  const [email, setEmail] = useState(props?.route?.params?.email);
  const [code, setCode] = useState();
  const [error, setError] = useState();
  const [loading, setLoading] = useState(false);

  const [emailError, setEmailError] = useState(false);
  const [codeError, setCodeError] = useState(false);

  const handlePress = async () => {
    if (!email) {
      setEmailError(true);
      return;
    }

    if (!code) {
      setCodeError(true);
      return;
    }

    setLoading(true);

    try {
      await confirmAccount(email, code);
      setError();
      props.navigation.replace('Login');
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
        <Text style={styles.headerText}>Confirm Account</Text>
        <Text>
          The verification will be emailed to the email address you provided
          when signing up. Please, check your email inbox or junk folder.
        </Text>
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
            codeError
              ? [styles.textInput, defaultStyles.default.textInputError]
              : styles.textInput
          }
          autoCapitalize="none"
          placeholder="Code*"
          keyboardType="numeric"
          value={code}
          onChangeText={setCode}
        />

        <Text style={styles.errorText}>{error}</Text>
        <Text
          style={styles.ConfirmAccountText}
          onPress={() =>
            props.navigation.navigate('ResendConfirmationCode', {email})
          }>
          Resend Confirmation Code?
        </Text>

        {loading ? (
          <View style={styles.container}>
            <ActivityIndicator color={colors.default.COLORS.PRIMARY} />
          </View>
        ) : (
          <View>
            <TouchableOpacity style={styles.button} onPress={handlePress}>
              <Text style={styles.buttonText}>Confirm Account</Text>
            </TouchableOpacity>
          </View>
        )}
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
  ConfirmAccountText: {
    ...defaultStyles.default.standardText,
    paddingBottom: 20,
    color: colors.default.COLORS.ERROR,
  },
  buttonText: {
    color: colors.default.COLORS.WHITE,
  },
});

const mapStateToProps = state => {
  const {user} = state;
  return {user};
};

export default connect(mapStateToProps)(ConfirmAccountScreen);
