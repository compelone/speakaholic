import React, {useEffect} from 'react';
import {
  StyleSheet,
  FlatList,
  RefreshControl,
  Text,
  TouchableOpacity,
  View,
  Linking,
  Alert,
  ActivityIndicator,
} from 'react-native';
import {deleteSpeechItem} from '../services/dataService';
import {connect} from 'react-redux';
import layout from '../styles/layout';
import colors from '../styles/colors';
import {downloadFile} from '../services/generalService';
import RNFetchBlob from 'rn-fetch-blob';
import {API} from 'aws-amplify';
import {listSpeechItems} from '../models/graphql/queries';
import * as Sentry from '@sentry/react-native';

const DownloadsScreen = props => {
  const [speechItems, setSpeechItems] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(false);

  useEffect(() => {
    (async () => {
      await getProcessedItems();

      // const subscription = DataStore.observeQuery(SpeechItems, si =>
      //   si.and(si => [
      //     si.cognito_user_name.eq(props.user.loggedInUser.attributes.sub),
      //     si.is_processed.eq(true),
      //   ]),
      // ).subscribe(snapshot => {
      //   const {items, isSynced} = snapshot;
      //   console.log(
      //     `[Snapshot] item count: ${items.length}, isSynced: ${isSynced}`,
      //   );
      // });
    })();
  }, []);

  const getProcessedItems = async () => {
    setIsLoading(true);
    try {
      const filter = {
        cognito_user_name: {eq: props.user.loggedInUser.attributes.sub},
      };
      const items = await API.graphql({
        query: listSpeechItems,
        variables: {filter: filter},
      });

      // Sort the speechitems
      const sortedItems = items?.data?.listSpeechItems?.items.sort((a, b) => {
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      });

      setSpeechItems(sortedItems?.filter(m => m._deleted === null));
    } catch (error) {
      console.log(error);
      Alert.alert('Something went wrong');
      Sentry.captureException(error);
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

  const deleteItem = async item => {
    try {
      setIsLoading(true);
      await deleteSpeechItem(item.id);
      await new Promise(resolve => setTimeout(resolve, 2000));
      await getProcessedItems();
    } catch (error) {
      console.log(error);
      Alert.alert('Something went wrong');
      Sentry.captureException(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.mainContainer}>
      <Text style={styles.pullToRefreshText}>Pull to refresh</Text>
      <FlatList
        keyExtractor={item => item.id}
        data={speechItems}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={() => getProcessedItems()}
          />
        }
        renderItem={({item}) => (
          <View style={styles.speechItemContainer}>
            <View style={[styles.horizontalView, styles.horizontalViewHeader]}>
              <Text style={styles.item}>{item.name}</Text>
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => deleteItem(item)}>
                <Text style={[styles.buttonText, styles.deleteButtonText]}>
                  X
                </Text>
              </TouchableOpacity>
            </View>
            {item.failed_reason === null && item.is_processed ? (
              <View>
                <View style={styles.centeredView}>
                  <Text style={styles.characterCount}>
                    {item.character_count} character(s) processed
                  </Text>
                </View>
                <View style={styles.horizontalView}>
                  <TouchableOpacity
                    style={styles.buttons}
                    onPress={() => downloadSpeech(item.s3_output_key)}>
                    <Text style={styles.buttonText}>Download</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.buttons}
                    onPress={() => listenInBrowser(item.s3_output_key)}>
                    <Text style={styles.buttonText}>Listen</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              <View>
                {item.is_processed === false && item.failed_reason === null ? (
                  <ActivityIndicator color={colors.COLORS.PRIMARY} />
                ) : (
                  <Text style={styles.failedText}>
                    Something went wrong processing this item. No credits have
                    been charged.
                  </Text>
                )}
              </View>
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
    padding: 5,
    fontSize: 18,
  },
  buttons: {
    backgroundColor: colors.COLORS.PRIMARY,
    marginBottom: 5,
    width: 100,
    padding: 5,
    borderRadius: 5,
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
  pullToRefreshText: {
    alignSelf: 'center',
    color: colors.COLORS.SALMON,
  },
  buttonText: {
    color: colors.COLORS.WHITE,
  },
  deleteButton: {
    backgroundColor: 'transparent',
    borderRadius: 10,
    width: 25,
    height: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  horizontalViewHeader: {
    marginBottom: 20,
  },
  deleteButtonText: {
    fontWeight: 'bold',
    color: colors.COLORS.SALMON,
  },
  centeredView: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  characterCount: {
    color: colors.COLORS.PRIMARY,
  },
});

const mapStateToProps = state => {
  const {user} = state;
  return {user};
};

export default connect(mapStateToProps)(DownloadsScreen);
