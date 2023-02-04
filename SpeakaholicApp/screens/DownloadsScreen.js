import React, {useEffect, useContext} from 'react';
import {Alert, Text, View} from 'react-native';
import {getProcessedSpeechItems} from '../services/dataService';
import {connect} from 'react-redux';

const DownloadsScreen = (props, navigation) => {
  const [speechItems, setSpeechItems] = React.useState([]);

  useEffect(() => {
    (async () => {
      const user = props.user.loggedInUser;
      const items = await getProcessedSpeechItems(user.attributes.sub);
      setSpeechItems(items);
    })();
  }, []);

  return (
    <View>
      <Text>{speechItems.length}</Text>
    </View>
  );
};

const mapStateToProps = state => {
  const {user} = state;
  return {user};
};

export default connect(mapStateToProps)(DownloadsScreen);
