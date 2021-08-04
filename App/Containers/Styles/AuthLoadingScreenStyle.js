import { StyleSheet } from 'react-native'
import { ApplicationStyles } from '../../Theme/'

export default StyleSheet.create({
  ...ApplicationStyles.screen,
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10
  }
})
