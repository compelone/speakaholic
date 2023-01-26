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
import {resendConfirmationCode} from '../services/authService';

const ResendConfirmationCodeScreen = ({navigation}) => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const [emailError, setEmailError] = useState(false);

  const handlePress = async () => {
    if (!email) {
      setEmailError(true);
      return;
    }

    setLoading(true);

    try {
      await resendConfirmationCode(email);
      setError('');
      navigation.replace('ConfirmAccount');
    } catch (err) {
      setError(err.toString());
    } finally {
      setLoading(false);
      setEmail('');
    }
  };

  return (
    <SafeAreaView style={styles.mainContainer}>
      <View>
        <Text style={styles.headerText}>Resend Code</Text>
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
              <Text>Resend Confirmation Code</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </SafeAreaView>
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
    backgroundColor: colors.default.COLORS.DEFAULT,
  },
  socialView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  errorText: {
    color: 'red',
  },
  ResendConfirmationCodeText: {
    ...defaultStyles.default.standardText,
    paddingBottom: 20,
    color: colors.default.COLORS.ERROR,
  },
});

export default ResendConfirmationCodeScreen;
