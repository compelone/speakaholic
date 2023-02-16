import React from 'react';

const RootScreen = props => {
  return <></>;
};

const mapStateToProps = state => {
  const {user} = state;
  return {user};
};

export default connect(mapStateToProps, mapDispatchToProps)(RootScreen);
