import { StyleSheet } from 'react-native'
import { ApplicationStyles, Colors, Metrics } from '../../Theme/'

export default StyleSheet.create({
  ...ApplicationStyles.screen,
  ...ApplicationStyles.button,
  container: {
    paddingTop: 50,
    paddingLeft: 10,
    paddingRight: 10,
    backgroundColor: Colors.silver
  },
  headForm: {
    justifyContent: 'center',
    padding: 20,
    height: 160,
    backgroundColor: Colors.primary,
    marginBottom: -10,
    margin: Metrics.baseMargin,
    borderRadius: 4
  },
  bodyForm: {

    flexDirection: 'row',
    height: 130,
    backgroundColor: Colors.secondary,
    margin: Metrics.baseMargin,
    borderRadius: 4
  },
  left: {
    flex: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  right: {
    flex: 5,
    justifyContent: 'center',
  },
  iconForm: {
    backgroundColor: Colors.snow,
    borderRadius: 50,
    width: 54,
    // position: "absolute",
    // zIndex: 100
  },
  errorBox: {
    fontSize: 8,
    margin: Metrics.baseMargin,
  }
})
