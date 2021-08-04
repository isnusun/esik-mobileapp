import Fonts from './Fonts'
import Metrics from './Metrics'
import Colors from './Colors'

// This file is for a reusable grouping of Theme items.
// Similar to an XML fragment layout in Android

const ApplicationStyles = {
  screen: {
    mainContainer: {
      flex: 1,
      backgroundColor: Colors.transparent
    },
    backgroundImage: {
      position: 'absolute',
      top: 0,
      left: 0,
      bottom: 0,
      right: 0
    },
    container: {
      flex: 1,
      // paddingTop: Metrics.baseMargin,
      backgroundColor: Colors.transparent
    },
    section: {
      margin: Metrics.section,
      padding: Metrics.baseMargin
    },
    sectionText: {
      ...Fonts.style.normal,
      paddingVertical: Metrics.doubleBaseMargin,
      color: Colors.snow,
      marginVertical: Metrics.smallMargin,
      textAlign: 'center'
    },
    subtitle: {
      color: Colors.snow,
      padding: Metrics.smallMargin,
      marginBottom: Metrics.smallMargin,
      marginHorizontal: Metrics.smallMargin
    },
    titleText: {
      ...Fonts.style.h2,
      fontSize: 14,
      color: Colors.text
    }
  },
  darkLabelContainer: {
    padding: Metrics.smallMargin,
    paddingBottom: Metrics.doubleBaseMargin,
    borderBottomColor: Colors.border,
    borderBottomWidth: 1,
    marginBottom: Metrics.baseMargin
  },
  darkLabel: {
    fontFamily: Fonts.type.bold,
    color: Colors.snow
  },
  groupContainer: {
    margin: Metrics.smallMargin,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center'
  },
  sectionTitle: {
    ...Fonts.style.h4,
    color: Colors.coal,
    backgroundColor: Colors.ricePaper,
    padding: Metrics.smallMargin,
    marginTop: Metrics.smallMargin,
    marginHorizontal: Metrics.baseMargin,
    borderWidth: 1,
    borderColor: Colors.ember,
    alignItems: 'center',
    textAlign: 'center'
  },
  button : {
    buttonRow: {
      flexDirection: 'row'
    },
    buttonWrapper: {
      flex:1
    },
    editButton: {
      marginTop: 8,
      marginBottom: 8,
      flex: 1,
      borderWidth: 1,
      borderColor: Colors.charcoal,
      backgroundColor: Colors.edit,
      padding: 6
    },
    cancelButton: {
      marginTop: 8,
      marginBottom: 8,
      flex: 1,
      borderWidth: 1,
      borderColor: Colors.charcoal,
      backgroundColor: Colors.cancel,
      padding: 6
    },
    saveButton: {
      marginTop: 8,
      marginBottom: 8,
      flex: 1,
      borderWidth: 1,
      borderColor: Colors.charcoal,
      backgroundColor: Colors.save,
      padding: 6
    },
    buttonText: {
      alignSelf: "center",
      color: Colors.snow
    }
  }
}

export default ApplicationStyles
