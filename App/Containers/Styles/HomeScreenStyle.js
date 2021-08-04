import { StyleSheet } from 'react-native'
import { ApplicationStyles, Colors, Metrics } from '../../Theme/'

export default StyleSheet.create({
  ...ApplicationStyles.screen,
  container: {
    paddingTop: 40,
    paddingLeft: 10,
    paddingRight: 10,
    backgroundColor: Colors.silver
  },
  profileContainer: {
    alignItems: "center",
    paddingTop: 70,
    paddingBottom: 30,
    margin: Metrics.baseMargin,
    backgroundColor: Colors.primary
  },
  avatar: {
  },
  nama: {
    marginTop: 20,
    marginBottom: 14,
    fontSize: 18
  },
  alamat: {
    marginBottom: 2,
    fontSize: 14
  },
  syncButton: {
    margin: Metrics.baseMargin,
    borderRadius: 5,
    flex: 1,
    marginTop: 30,
    width: 120,
    height: 120,
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.primary
  }
})
