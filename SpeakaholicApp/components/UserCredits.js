import React from 'react';
import {connect} from 'react-redux';
import {getCreditsLeft} from '../services/dataService';
import {bindActionCreators} from 'redux';
import {updateUser} from '../modules/UserActions';
import {updateUserCreditsLeft} from '../modules/UserCreditsLeftAction';

const UserCredits = props => {
  setInterval(async () => {
    if (props.user.loggedInUser.attributes !== undefined) {
      const remainingCredits = await getCreditsLeft(
        props.user.loggedInUser.attributes.sub,
      );
      props.updateUserCreditsLeft(remainingCredits);
      console.log('remaining credits', remainingCredits);
    }
  }, 300000);
  return <></>;
};

const mapStateToProps = state => {
  const {user} = state;
  return {user};
};

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      updateUser,
      updateUserCreditsLeft,
    },
    dispatch,
  );

export default connect(mapStateToProps, mapDispatchToProps)(UserCredits);
