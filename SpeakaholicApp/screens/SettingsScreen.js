import React from 'react';
import {StyleSheet, View, Text, TouchableOpacity} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import * as colors from '../styles/colors';
import {signOut} from '../services/authService';
import * as Keychain from 'react-native-keychain';

const SettingsScreen = ({navigation}) => {
  const handlePress = async () => {
    await signOut();
    await Keychain.resetGenericPassword();
    navigation.navigate('Home');
  };

  return (
    <View>
      <View>
        <TouchableOpacity style={styles.button} onPress={() => handlePress()}>
          <Text style={styles.buttonText}>Signout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  buttonsContainer: {
    flexDirection: 'row',
  },
  button: {
    backgroundColor: colors.default.COLORS.DEFAULT,
    alignItems: 'center',
    padding: 10,
  },
  buttonText: {
    fontSize: 20,
  },
});

export default SettingsScreen;
