import React, { Component } from 'react'
import { View, StatusBar, ActivityIndicator } from 'react-native'
import { connect } from 'react-redux'
import NavigationService from '../Services/NavigationService'

// Styles
import styles from './Styles/AuthLoadingScreenStyle'
import { Metrics } from '../Theme'

class AuthLoadingScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visibleHeight: Metrics.screenHeight
    }
    this._bootstrapAsync();
  }

  _bootstrapAsync = async () => {
    setTimeout(() => {
      const userToken = this.props.userToken
      NavigationService.navigateAndReset(userToken ? 'AppStack' : 'SignIn');
    }, 1000)

  };
  render() {
    return (
      <View contentContainerStyle={{ justifyContent: 'center' }} style={[styles.container, { height: this.state.visibleHeight }]}>
        <ActivityIndicator size="large" color="#0000ff" />
        <StatusBar barStyle="default" />
      </View>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    userToken: state.auth.userToken,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AuthLoadingScreen)
