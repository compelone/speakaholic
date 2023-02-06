import React, {useEffect, useContext} from 'react';
import {
  StyleSheet,
  FlatList,
  RefreshControl,
  Text,
  TouchableOpacity,
  View,
  Linking,
  Alert,
} from 'react-native';
import {getProcessedSpeechItems} from '../services/dataService';
import {connect} from 'react-redux';
import layout from '../styles/layout';
import colors from '../styles/colors';
import {downloadFile} from '../services/generalService';
import RNFetchBlob from 'rn-fetch-blob';

const DownloadsScreen = (props, navigation) => {
  const [speechItems, setSpeechItems] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(false);

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      try {
        const user = props.user.loggedInUser;
        const items = await getProcessedSpeechItems(user.attributes.sub);
        setSpeechItems(items);
      } catch (error) {
        Alert.alert('Something went wrong');
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  const onRefresh = async () => {
    setIsLoading(true);
    try {
      const user = props.user.loggedInUser;
      const items = await getProcessedSpeechItems(user.attributes.sub);
      setSpeechItems(items);
    } catch (error) {
      Alert.alert('Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  const downloadSpeech = async key => {
    // split the key and take the last part
    const filename = key.split('/').pop();

    const url = await downloadFile(filename);
    const dirs = RNFetchBlob.fs.dirs;

    const fullFileName = `${dirs.DocumentDir}/${filename}`;
    RNFetchBlob.config({
      // response data will be saved to this path if it has access right.
      path: fullFileName,
      fileCache: true,
      // // by adding this option, the temp files will have a file extension
      // // appendExt: 'mp3',
    })
      .fetch('GET', url, {
        //some headers ..
      })
      .then(res => {
        RNFetchBlob.fs.writeFile(fullFileName, res.data, 'base64');
        RNFetchBlob.ios.previewDocument(fullFileName);
      });
  };

  const listenInBrowser = async key => {
    const filename = key.split('/').pop();

    const url = await downloadFile(filename);

    Linking.openURL(url);
  };

  return (
    <View style={styles.mainContainer}>
      <FlatList
        keyExtractor={item => item.id}
        data={speechItems}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={() => onRefresh()}
          />
        }
        renderItem={({item}) => (
          <View style={styles.speechItemContainer}>
            <Text style={styles.item}>{item.name}</Text>
            {item.failed_reason === null ? (
              <View style={styles.horizontalView}>
                <TouchableOpacity
                  style={styles.buttons}
                  onPress={() => downloadSpeech(item.s3_output_key)}>
                  <Text>Download</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.buttons}
                  onPress={() => listenInBrowser(item.s3_output_key)}>
                  <Text>Listen</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <Text style={styles.failedText}>
                Something went wrong processing this item.
              </Text>
            )}
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
    fontSize: 18,
  },
  buttons: {
    backgroundColor: colors.COLORS.SALMON,
    marginBottom: 5,
    width: 100,
    padding: 5,
    borderRadius: 10,
    alignItems: 'center',
  },
  horizontalView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  speechItemContainer: {
    backgroundColor: colors.COLORS.LIGHTGRAY,
    marginBottom: 5,
    padding: 10,
  },
  failedText: {
    color: 'red',
    fontSize: 12,
  },
});

const mapStateToProps = state => {
  const {user} = state;
  return {user};
};

export default connect(mapStateToProps)(DownloadsScreen);
