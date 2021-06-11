import {StyleSheet} from 'react-native';
import {Metrics} from '../../res/styles';

const styles = StyleSheet.create({
  listMainView: {
    // height: Metrics.FILL,
  },

  item: {
    flexDirection: 'row',
  },

  lineContainer: {
    width: Metrics.WIDTH * 0.1,
    backgroundColor: 'purple',
  },

  listItemContainer: {
    width: Metrics.WIDTH * 0.85,
  },

  line: {
    position: 'absolute',
    width: Metrics.WIDTH * 0.015,
    height: Metrics.FILL,
    backgroundColor: '#d7e5eb',
    left: Metrics.WIDTH * 0.05,
    //   borderWidth: 1,
    borderRadius: 10,
    // marginLeft: Metrics.WIDTH * 0.04,
  },
});

export default styles;
