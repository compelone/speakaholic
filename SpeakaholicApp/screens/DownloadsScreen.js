import React, {useEffect, useContext} from 'react';
import {
  StyleSheet,
  FlatList,
  Alert,
  Text,
  TouchableOpacity,
  View,
  Linking,
} from 'react-native';
import {getProcessedSpeechItems} from '../services/dataService';
import {connect} from 'react-redux';
import layout from '../styles/layout';
import colors from '../styles/colors';
import {downloadFile} from '../services/generalService';
import RNFetchBlob from 'rn-fetch-blob';

const DownloadsScreen = (props, navigation) => {
  const [speechItems, setSpeechItems] = React.useState([]);

  useEffect(() => {
    (async () => {
      const user = props.user.loggedInUser;
      const items = await getProcessedSpeechItems(user.attributes.sub);
      setSpeechItems(items);
    })();
  }, []);

  const downloadSpeech = async key => {
    // split the key and take the last part
    const filename = key.split('/').pop();

    const url = await downloadFile(filename);
    let dirs = RNFetchBlob.fs.dirs;

    RNFetchBlob.config({
      // response data will be saved to this path if it has access right.
      path: dirs.DocumentDir,
    })
      .fetch('GET', url, {
        //some headers ..
      })
      .then(res => {
        // the path should be dirs.DocumentDir + 'path-to-file.anything'
        Alert.alert('The file saved to your documents folder.');
      });
    // await RNFetchBlob.config({
    // Linking.openURL(url);
  };

  const listenInBrowser = async key => {
    const filename = key.split('/').pop();

    const url = await downloadFile(filename);

    Linking.openURL(url);
  };

  return (
    <View style={styles.mainContainer}>
      <FlatList
        data={speechItems}
        renderItem={({item}) => (
          <View>
            <Text style={styles.item}>{item.name}</Text>
            <View style={styles.horizontalView}>
              <TouchableOpacity
                style={styles.itemContainer}
                onPress={() => downloadSpeech(item.s3_output_key)}>
                <Text>Download</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.itemContainer}
                onPress={() => listenInBrowser(item.s3_output_key)}>
                <Text>Listen</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: layout.top,
  item: {
    padding: 10,
    color: colors.COLORS.SALMON,
    fontSize: 18,
  },
  itemContainer: {
    backgroundColor: colors.COLORS.LIGHTGRAY,
    marginBottom: 5,
    width: 100,
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  horizontalView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

const mapStateToProps = state => {
  const {user} = state;
  return {user};
};

export default connect(mapStateToProps)(DownloadsScreen);
