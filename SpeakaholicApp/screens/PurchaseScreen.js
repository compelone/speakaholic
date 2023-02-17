import React, {useEffect} from 'react';
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
import {updateUserCreditsLeft} from '../modules/UserCreditsLeftAction';
import {connect} from 'react-redux';
import {purchaseCredits, getCreditsLeft} from '../services/dataService';
import {Glassfy} from 'react-native-glassfy-module';

const PurchaseScreen = props => {
  const [isLoading, setIsLoading] = React.useState(false);

  // useEffect(() => {
  //   (async () => {
  //   //   await Glassfy.initialize('a0df75170c064d528ccd3af9c505b6f6', false);

  //   //   try {
  //   //     let offering = Glassfy.offerings.all.find(
  //   //       o => o.identifier === 'standard',
  //   //     );
  //   //     console.log(offering);

  //   //     offering?.skus.forEach(sku => {
  //   //       // sku.extravars
  //   //       // sku.product.description;
  //   //       console.log(sku.product.price);
  //   //     });
  //   //   } catch (error) {
  //   //     console.log(error);
  //   //   }
  //   // })();
  // }, []);

  const handlePress = async credits => {
    try {
      setIsLoading(true);
      const creditAmount = credits;
      const cognitoUserName = props.user.loggedInUser.attributes.sub;
      await purchaseCredits(cognitoUserName, creditAmount);

      await new Promise(resolve => setTimeout(resolve, 5000));
      let userCreditsLeft = await getCreditsLeft(cognitoUserName);

      while (userCreditsLeft.data.getUserCreditsLeft === null) {
        // sleep for 5 seconds
        await new Promise(resolve => setTimeout(resolve, 5000));
        userCreditsLeft = await getCreditsLeft(cognitoUserName);
      }

      props.updateUserCreditsLeft(userCreditsLeft);

      props.navigation.navigate('Root');
    } catch (error) {
      console.log(error);
      Alert.alert('Something went wrong.');
    } finally {
      setIsLoading(false);
    }
  };

  // const checkCredits = cognitoUserName => {
  //   return new Promise(resolve => {
  //     setTimeout(() => {
  //       getCreditsLeft(cognitoUserName).then(userCreditsLeft => {
  //         if (userCreditsLeft.data.getUserCreditsLeft === null) {
  //           checkCredits(cognitoUserName);
  //         } else {
  //           resolve(userCreditsLeft);
  //         }
  //       });
  //     }, 5000);
  //   });
  // };

  return (
    <View style={styles.mainContainer}>
      <Text> </Text>
      <Text>
        Allow up to 2 minutes for your credit balance to show in the
        application. Also, note that we will allow you to go over on credits,
        however, when purchasing new credits, the new credits will go towards
        the overage balance prior to be credited to your account.
      </Text>
      <Text> </Text>
      {isLoading ? (
        <ActivityIndicator color={colors.default.COLORS.PRIMARY} />
      ) : (
        <View>
          <TouchableOpacity
            style={styles.buttons}
            onPress={() => handlePress(4000)}>
            <Text style={styles.buttonText}>
              Buy 3000 + 1000 (free) credits
            </Text>
            <Text> </Text>
            <Text style={styles.buttonText}>$4.99</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.buttons}
            onPress={() => handlePress(9000)}>
            <Text style={styles.buttonText}>
              Buy 8000 + 1000 (free) credits
            </Text>
            <Text> </Text>
            <Text style={styles.buttonText}>$6.99</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.buttons}
            onPress={() => handlePress(16000)}>
            <Text style={styles.buttonText}>
              Buy 15000 + 1000 (free) credits
            </Text>
            <Text> </Text>
            <Text style={styles.buttonText}>$9.99</Text>
          </TouchableOpacity>
        </View>
      )}
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

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      updateUserCreditsLeft,
      updateUser,
    },
    dispatch,
  );

export default connect(mapStateToProps, mapDispatchToProps)(PurchaseScreen);
