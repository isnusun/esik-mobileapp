import React, { Component } from 'react'
import { createStackNavigator, createDrawerNavigator, createAppContainer } from 'react-navigation'
import AuthLoadingScreen from '../Containers/AuthLoadingScreen'
import ProfileScreen from '../Containers/ProfileScreen'
import HomeScreen from '../Containers/HomeScreen'
import SignInScreen from '../Containers/SignInScreen'
import { Dimensions, TouchableOpacity, View } from 'react-native'
import SideMenuScreen from '../Containers/SideMenuScreen'
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Images, Colors } from '../Theme'

import VillageScreen from '../Containers/VillageScreen'
import RwScreen from '../Containers/RwScreen'
import RtScreen from '../Containers/RtScreen'
import RespondentScreen from '../Containers/RespondentScreen'
import FamilyScreen from '../Containers/FamilyScreen'
import ResidentScreen from '../Containers/ResidentScreen'
import FamilyCardScreen from '../Containers/FamilyCardScreen'
import IndicatorScreen from '../Containers/IndicatorScreen'

import FamilyIndicatorScreen from '../Containers/FamilyIndicatorScreen'
import ResidentIndicatorScreen from '../Containers/ResidentIndicatorScreen'
import FamilyAnswerScreen from '../Containers/FamilyAnswerScreen'
import ResidentAnswerScreen from '../Containers/ResidentAnswerScreen'
import SyncDataScreen from '../Containers/SyncDataScreen'
import NavigationDrawerStructure from '../Components/NavigationDrawerStructure'
import styles from './Styles/NavigationStyles'

const HomeStack = createStackNavigator({
  Home: {
    screen: HomeScreen,
    navigationOptions: ({ navigation }) => ({
      title: 'Sensus Ku',
      headerRight: <NavigationDrawerStructure navigationProps={navigation} />,
      headerStyle: {
        backgroundColor: Colors.secondary,
      },
      headerTintColor: Colors.primary,
    }),
  }
})

const ProfileStack = createStackNavigator({
  Profile: {
    screen: ProfileScreen,
    navigationOptions: ({ navigation }) => ({
      title: 'Profile',
      headerRight: <NavigationDrawerStructure navigationProps={navigation} />,
      headerStyle: {
        backgroundColor: Colors.secondary,
      },
      headerTintColor: Colors.primary,
    }),
  }
})

const VillageStack = createStackNavigator({
  Village: {
    screen: VillageScreen,
  },
  Rw: {
    screen: RwScreen,
  },
  Rt: {
    screen: RtScreen,
  },
  Respondent: {
    screen: RespondentScreen,
    navigationOptions: ({ navigation }) => ({
      title: 'SensusKu',
      headerRight: <NavigationDrawerStructure navigationProps={navigation} />,
      headerStyle: {
        backgroundColor: Colors.secondary,
      },
      headerTintColor: Colors.primary,
    }),
  },
  FamilyCard: {
    screen: FamilyCardScreen,
  },
  Indicator: {
    screen: IndicatorScreen,
  }
}, {
    initialRouteName: 'Village'
  })

const RespondentStack = createStackNavigator({
  Village: {
    screen: VillageScreen,
  },
  Rw: {
    screen: RwScreen,
  },
  Rt: {
    screen: RtScreen,
  },
  Respondent: {
    screen: RespondentScreen,
    navigationOptions: ({ navigation }) => ({
      title: 'SensusKu',
      headerRight: <NavigationDrawerStructure navigationProps={navigation} />,
      headerStyle: {
        backgroundColor: Colors.secondary,
      },
      headerTintColor: Colors.primary,
    }),
  },
  FamilyCard: {
    screen: FamilyCardScreen,
  },
  Indicator: {
    screen: IndicatorScreen,
  }
}, {
    initialRouteName: 'Respondent'
  })

const FamilyStack = createStackNavigator({
  Family: {
    screen: FamilyScreen,
    navigationOptions: ({ navigation }) => ({
      title: 'FamilytStack',
      headerRight: <NavigationDrawerStructure navigationProps={navigation} />,
      headerStyle: {
        backgroundColor: Colors.secondary,
      },
      headerTintColor: Colors.primary,
    }),
  }
})

const ResidentStack = createStackNavigator({
  Resident: {
    screen: ResidentScreen,
    navigationOptions: ({ navigation }) => ({
      title: 'ResidentStack',
      headerRight: <NavigationDrawerStructure navigationProps={navigation} />,
      headerStyle: {
        backgroundColor: Colors.secondary,
      },
      headerTintColor: Colors.primary,
    }),
  }
})

const FamilyIndicatorStack = createStackNavigator({
  Resident: {
    screen: FamilyIndicatorScreen,
    navigationOptions: ({ navigation }) => ({
      title: 'FamilyIndicatorStack',
      headerRight: <NavigationDrawerStructure navigationProps={navigation} />,
      headerStyle: {
        backgroundColor: Colors.secondary,
      },
      headerTintColor: Colors.primary,
    }),
  }
})

const ResidentIndicatorStack = createStackNavigator({
  Resident: {
    screen: ResidentIndicatorScreen,
    navigationOptions: ({ navigation }) => ({
      title: 'ResidentIndicatorStack',
      headerRight: <NavigationDrawerStructure navigationProps={navigation} />,
      headerStyle: {
        backgroundColor: Colors.secondary,
      },
      headerTintColor: Colors.primary,
    }),
  }
})

const FamilyAnswerStack = createStackNavigator({
  Resident: {
    screen: FamilyAnswerScreen,
    navigationOptions: ({ navigation }) => ({
      title: 'FamilyAnswerStack',
      headerRight: <NavigationDrawerStructure navigationProps={navigation} />,
      headerStyle: {
        backgroundColor: Colors.secondary,
      },
      headerTintColor: Colors.primary,
    }),
  }
})

const ResidentAnswerStack = createStackNavigator({
  Resident: {
    screen: ResidentAnswerScreen,
    navigationOptions: ({ navigation }) => ({
      title: 'ResidentAnswerStack',
      headerRight: <NavigationDrawerStructure navigationProps={navigation} />,
      headerStyle: {
        backgroundColor: Colors.secondary,
      },
      headerTintColor: Colors.primary,
    }),
  }
})



const DrawerNavigator = createDrawerNavigator({
  Home: HomeStack,
  Profile: ProfileStack,
  Respondent: RespondentStack,
  Village: VillageStack,
  Family: FamilyStack,
  Resident: ResidentStack,
  FamilyIndicator: FamilyIndicatorStack,
  ResidentIndicator: ResidentIndicatorStack,
  FamilyAnswer: FamilyAnswerStack,
  ResidentAnswer: ResidentAnswerStack,
},
  {
    initialRouteName: "Home",
    contentComponent: props => <SideMenuScreen {...props} />,
    drawerWidth: Dimensions.get('window').width - 80,
    drawerPosition: "right"
  })

const PrimaryNav = createStackNavigator({
  AuthLoading: { screen: AuthLoadingScreen, navigationOptions: { header: null } },
  AppStack: {
    screen: DrawerNavigator,
  },
  SyncData: { screen: SyncDataScreen, navigationOptions: { header: null } },
  SignIn: { screen: SignInScreen, navigationOptions: { header: null } }
}, {
    initialRouteName: 'AuthLoading',
    headerMode: "none"
  })

export default createAppContainer(PrimaryNav)