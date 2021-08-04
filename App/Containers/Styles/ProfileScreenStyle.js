import { StyleSheet } from 'react-native'
import { ApplicationStyles, Colors, Metrics } from '../../Theme/'
export default StyleSheet.create({
  ...ApplicationStyles.screen,
  ...ApplicationStyles.button,
  container: {
    ...ApplicationStyles.screen.container,
    margin: 10,
  },
  row: {
    flexDirection: 'column',
  },
  rowLabel: {
    marginTop: 10
  },
  textInput: {
    // fontSize: 20,
    paddingLeft: 5,
    height: 40,
    color: Colors.coal,
    backgroundColor: Colors.snow,
    borderWidth: 1,
    borderColor: Colors.charcoal,
  },
  textInputReadonly: {
    height: 40,
    backgroundColor: Colors.primary,
    color: Colors.coal,
  }
})
