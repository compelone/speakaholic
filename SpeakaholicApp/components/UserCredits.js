import React from 'react';
import {connect} from 'react-redux';
import {getCreditsLeft} from '../services/dataService';
import {bindActionCreators} from 'redux';
import {updateUser} from '../modules/UserActions';
import {updateUserCreditsLeft} from '../modules/UserCreditsLeftAction';

const UserCredits = props => {
  setInterval(() => {
    if (props.user.loggedInUser !== undefined) {
      getCreditsLeft(props.user.loggedInUser.attributes.sub).then(
        remainingCredits => {
          props.updateUserCreditsLeft(remainingCredits);
        },
      );
    }
  }, 30000);
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
