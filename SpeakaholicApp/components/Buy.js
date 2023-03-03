import {TouchableOpacity, Text} from 'react-native';
import {connect} from 'react-redux';
import Icon from 'react-native-vector-icons/FontAwesome';
import colors from '../styles/colors';

const Buy = props => {
  return (
    <Icon.Button
      name="plus-circle"
      backgroundColor="transparent"
      color={colors.COLORS.SALMON}
      size={30}
      borderRadius={20}
      onPress={() => props.navigation.navigate('Purchase')}
    />
  );
};

const mapStateToProps = state => {
  const {user} = state;
  return {user};
};

export default connect(mapStateToProps)(Buy);
