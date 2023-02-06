import React from 'react';
import {StyleSheet, View, Text, TouchableOpacity, Alert} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import * as colors from '../styles/colors';
import {signOut} from '../services/authService';
import * as Keychain from 'react-native-keychain';
import layout from '../styles/layout';

const SettingsScreen = ({navigation}) => {
  const handlePress = async () => {
    await signOut();
    await Keychain.resetGenericPassword();
    navigation.navigate('Home');
  };

  const restore = async () => {
    try {
      await Purchases.restoreTransactions();
      Alert.alert('Purchases restored');
    } catch (e) {
      console.log(e);
      Alert.alert('Something went wrong.');
    }
  };

  return (
    <View style={styles.mainContainer}>
      <View>
        <Text
          style={styles.textLinks}
          onPress={() => Linking.openURL('https://dealsy.app/privacy.html')}>
          Privacy Policy
        </Text>
        <View style={styles.separator}></View>
        <Text
          style={styles.textLinks}
          onPress={() => Linking.openURL('https://dealsy.app/terms.html')}>
          Terms
        </Text>
        <TouchableOpacity style={styles.button} onPress={restore}>
          <Text style={styles.buttonText}>Restore Purchases</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => handlePress()}>
          <Text style={styles.buttonText}>Signout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  mainContainer: {
    ...layout.top,
    justifyContent: 'center',
  },
  buttonsContainer: {
    flexDirection: 'row',
  },
  button: {
    backgroundColor: colors.default.COLORS.DEFAULT,
    alignItems: 'center',
    padding: 10,
    marginBottom: 10,
  },
  buttonText: {
    fontSize: 20,
    color: colors.default.COLORS.WHITE,
  },
  textLinks: {
    fontSize: 30,
    color: colors.default.COLORS.PRIMARY,
    marginBottom: 10,
  },
});

export default SettingsScreen;
