import React, {useMemo} from 'react';
import {connect} from 'react-redux';
import {getCreditsLeft} from '../services/dataService';
import {bindActionCreators} from 'redux';
import {updateUser} from '../modules/UserActions';
import {
  updateUserCreditsLeft,
  setLastCheckedDate,
} from '../modules/UserCreditsLeftAction';
import {checkCachedDate} from '../services/generalService';

const UserCredits = props => {
  setInterval(async () => {
    if (
      props.user.loggedInUser.attributes !== undefined &&
      checkCachedDate(props.user.lastCheckedCreditsDate)
    ) {
      const remainingCredits = await getCreditsLeft(
        props.user.loggedInUser.attributes.sub,
      );
      props.updateUserCreditsLeft(remainingCredits);
      props.setLastCheckedDate(Date.now());
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
      setLastCheckedDate,
    },
    dispatch,
  );

export default connect(mapStateToProps, mapDispatchToProps)(UserCredits);