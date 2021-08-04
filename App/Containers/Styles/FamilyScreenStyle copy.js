import { StyleSheet } from 'react-native'
import { Fonts, Colors, ApplicationStyles } from '../../Theme/'

export default StyleSheet.create({
  ...ApplicationStyles.screen,
  container: {
    padding: 20
  },
  itemBox: {
    backgroundColor: Colors.primary,
    paddingLeft: 10,
    paddingRight: 10,
    marginBottom: 3,
    height: 50,
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  itemTextBox:{
    width: "70%",
    paddingLeft: 5
    // backgroundColor: Colors.steel
  },
  itemText:{
    fontSize: Fonts.size.regular
  },
  itemTextSmall:{
    fontSize: Fonts.size.small
  },
  searchBox: {
    marginBottom: 20,
    height: 50
  },
  searchInput: {
    height: 50,
    backgroundColor: Colors.silver,
    paddingLeft: 15,
    paddingRight: 15
  },
  iconBox: {
    
    backgroundColor: Colors.snow,
    borderRadius: 50,
    width: 34,
    height: 34
  },
  rightBox: {
    width: "10%"
  },
  buttonNav: {
    borderRadius: 5,
    width: 100,
    height: 40,
    backgroundColor: Colors.secondary,
    justifyContent: "center",
    alignItems: "center"
  },
  buttonContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		marginBottom: 20,
	},

	circle: {
		height: 20,
		width: 20,
		borderRadius: 10,
		borderWidth: 1,
		borderColor: '#ACACAC',
		alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15
	},
  
	checkedCircle: {
		width: 14,
		height: 14,
		borderRadius: 7,
		backgroundColor: Colors.secondary,
	},
})
