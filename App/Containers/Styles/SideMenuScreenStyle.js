import { Platform, StyleSheet } from 'react-native'
import Fonts from  '../../Theme/Fonts'
import ApplicationStyles from '../../Theme/ApplicationStyles'

export default StyleSheet.create({
  container: {
    ...ApplicationStyles.screen.container,
  },

  MainContainer: {

    flex: 1,
    paddingTop: (Platform.OS) === 'ios' ? 20 : 0,
    alignItems: 'center',
    justifyContent: 'center',

  },

  sideMenuContainer: {

    width: '100%',
    height: '100%',
    backgroundColor: '#fff',
    // alignItems: 'center',
  },

  sideMenuProfileIcon:
  {
    resizeMode: 'center',
    width: 150,
    height: 150,
    borderRadius: 150 / 2
  },

  sideMenuIcon:
  {
    width: 28,
    height: 28,
    marginRight: 10,
    marginLeft: 20

  },

  menuText: {
    fontSize: 16,
    color: '#222222',

  }
})
