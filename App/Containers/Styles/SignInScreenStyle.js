import { StyleSheet } from 'react-native'
import { ApplicationStyles, Colors, Metrics } from '../../Theme/'

export default StyleSheet.create({
  ...ApplicationStyles.screen,
  container: {
    paddingTop: 50,
    paddingLeft: 10,
    paddingRight: 10,
    backgroundColor: Colors.silver
  },
  iconForm: {
    marginTop: -30,
    backgroundColor: Colors.snow,
    borderRadius: 50,
    width: 54,
    position: "absolute",
    alignSelf: 'center',
    zIndex: 100
  },
  headForm: {
    height: 65,
    backgroundColor: Colors.secondary,
    marginBottom: -10,
    margin: Metrics.baseMargin,
    borderRadius: 4
  },
  form: {
    paddingTop: 30,
    backgroundColor: Colors.primary,
    margin: Metrics.baseMargin,
    borderRadius: 4
  },
  row: {
    paddingVertical: 10,
    paddingHorizontal: Metrics.doubleBaseMargin
  },
  rowLabel: {
    color: Colors.charcoal
  },
  textInput: {
    fontSize: 16,
    height: 40,
    color: Colors.coal,
    backgroundColor: Colors.snow
  },
  textInputReadonly: {
    fontSize: 16,
    height: 40,
    color: Colors.steel
  },
  loginRow: {
    paddingBottom: Metrics.doubleBaseMargin,
    paddingHorizontal: Metrics.doubleBaseMargin,
    flexDirection: 'row'
  },
  loginButtonWrapper: {
    flex: 1
  },
  loginButton: {
    marginTop: 8,
    marginBottom: 8,
    flex: 1,
    // borderWidth: 1,
    // borderColor: Colors.charcoal,
    // backgroundColor: Colors.panther,
    padding: 6
  },
  loginText: {
    fontSize: 24,
    textAlign: 'center',
    color: Colors.charcoal
  },
  topLogo: {
    alignSelf: 'center',
    resizeMode: 'contain'
  }
})
