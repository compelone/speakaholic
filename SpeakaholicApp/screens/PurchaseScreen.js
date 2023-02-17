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
import {purchaseCredits} from '../services/dataService';

const PurchaseScreen = props => {
  const handlePress = async credits => {
    const creditAmount = credits;
    const cognitoUserName = props.user.loggedInUser.attributes.sub;

    try {
      await purchaseCredits(cognitoUserName, creditAmount);
    } catch (error) {
      console.log(error);
      Alert.alert('Something went wrong.');
    }
  };
  return (
    <View style={styles.mainContainer}>
      <Text>
        Allow up to 10 minutes for your credit balance to show in the
        application. Also, note that we will allow you to go over on credits,
        however, when purchasing new credits, the new credits will go towards
        the overage balance prior to be credited to your account.
      </Text>
      <TouchableOpacity
        style={styles.buttons}
        onPress={() => handlePress(4000)}>
        <Text style={styles.buttonText}>Buy 3000 + 1000 (free) credits</Text>
        <Text> </Text>
        <Text style={styles.buttonText}>$4.99</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.buttons}
        onPress={() => handlePress(9000)}>
        <Text style={styles.buttonText}>Buy 8000 + 1000 (free) credits</Text>
        <Text> </Text>
        <Text style={styles.buttonText}>$6.99</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.buttons}
        onPress={() => handlePress(16000)}>
        <Text style={styles.buttonText}>Buy 15000 + 1000 (free) credits</Text>
        <Text> </Text>
        <Text style={styles.buttonText}>$9.99</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: layout.default.top,
  item: {
    padding: 5,
    fontSize: 18,
  },
  buttons: {
    backgroundColor: colors.default.COLORS.PRIMARY,
    marginBottom: 5,
    padding: 5,
    borderRadius: 5,
    alignItems: 'center',
  },
  horizontalView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  speechItemContainer: {
    backgroundColor: colors.default.COLORS.LIGHTGRAY,
    marginBottom: 5,
    padding: 10,
  },
  failedText: {
    color: 'red',
    fontSize: 12,
  },
  buttonText: {
    color: colors.default.COLORS.WHITE,
  },
});

const mapStateToProps = state => {
  const {user} = state;
  return {user};
};

export default connect(mapStateToProps)(PurchaseScreen);
