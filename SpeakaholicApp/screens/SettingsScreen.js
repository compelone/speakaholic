import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Alert,
  Linking,
} from 'react-native';
import * as colors from '../styles/colors';
import {signOut} from '../services/authService';
import * as Keychain from 'react-native-keychain';
import layout from '../styles/layout';
import {connect} from 'react-redux';
import {version} from '../package.json';
import {DataStore} from 'aws-amplify';
import {reset} from '../modules/ResetAction';
import {bindActionCreators} from 'redux';

const SettingsScreen = props => {
  const handlePress = async () => {
    await Keychain.resetGenericPassword();
    await DataStore.clear();
    props.reset();
    await signOut();
    props.navigation.navigate('Home');
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
          onPress={() =>
            Linking.openURL('https://speakaholic.com/pages/privacy')
          }>
          Privacy Policy
        </Text>
        <View style={styles.separator}></View>
        <Text
          style={styles.textLinks}
          onPress={() =>
            Linking.openURL('https://speakaholic.com/pages/terms')
          }>
          Terms
        </Text>
        <TouchableOpacity style={styles.button} onPress={restore}>
          <Text style={styles.buttonText}>Restore Purchases</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => props.navigation.navigate('Purchase')}>
          <Text style={styles.buttonText}>Purchase Credits</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => handlePress()}>
          <Text style={styles.buttonText}>Signout</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.versionView}>
        <Text style={styles.textVersion}>Version: {version}</Text>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  mainContainer: {
    ...layout.top,
    justifyContent: 'center',
    paddingTop: 100,
  },
  buttonsContainer: {
    flexDirection: 'row',
  },
  button: {
    backgroundColor: colors.default.COLORS.DEFAULT,
    alignItems: 'center',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
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
  versionView: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginBottom: 20,
  },
});

const mapStateToProps = state => {
  const {user} = state;
  return {user};
};

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      reset,
    },
    dispatch,
  );

export default connect(mapStateToProps, mapDispatchToProps)(SettingsScreen);
