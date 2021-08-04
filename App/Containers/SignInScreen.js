import React, { Component } from 'react'
import { Button, TouchableOpacity, ScrollView, Text, TextInput, KeyboardAvoidingView, Image, View } from 'react-native'
import { connect } from 'react-redux'
import Icon from 'react-native-vector-icons/MaterialIcons';
import Loader from 'App/Containers/Loader'
import AuthActions from 'App/Stores/Auth/Actions'

// Styles
import styles from './Styles/SignInScreenStyle'
import { Images, Metrics } from '../Theme'

class SignInScreen extends Component {
  constructor(props) {
    super(props)
    this.state = {
      username: 'petirsari-pracimantoro-wng',
      password: 'Wonogiri2019',
      visibleHeight: Metrics.screenHeight
    }
  }

  handlePressLogin = () => {
    const { username, password } = this.state
    // attempt a login - a saga is listening to pick it up from here.
    this.props.attemptLogin(username, password)
  }

  handleChangeUsername = (text) => {
    this.setState({ username: text })
  }

  handleChangePassword = (text) => {
    this.setState({ password: text })
  }

  render() {
    const { username, password } = this.state
    const { isLoading } = this.props
    const editable = !isLoading
    const textInputStyle = editable ? styles.textInput : styles.textInputReadonly
    return (
      <ScrollView contentContainerStyle={{ justifyContent: 'center' }} style={[styles.container, { height: this.state.visibleHeight }]} keyboardShouldPersistTaps='always'>
        <Loader loading={this.props.isLoading} />
        <View style={styles.headForm}>

        </View>

        <View style={styles.form}>

          <View style={styles.row}>
            {/* <Text style={styles.rowLabel}>Username</Text> */}
            <TextInput
              style={textInputStyle}
              value={username}
              editable={editable}
              keyboardType='default'
              returnKeyType='next'
              autoCapitalize='none'
              autoCorrect={false}
              onChangeText={this.handleChangeUsername}
              underlineColorAndroid='transparent'
              onSubmitEditing={() => this.refs.password.focus()}
              placeholder='Username' />
          </View>

          <View style={styles.row}>
            {/* <Text style={styles.rowLabel}>Password</Text> */}
            <TextInput
              style={textInputStyle}
              value={password}
              editable={editable}
              keyboardType='default'
              returnKeyType='go'
              autoCapitalize='none'
              autoCorrect={false}
              secureTextEntry
              onChangeText={this.handleChangePassword}
              underlineColorAndroid='transparent'
              onSubmitEditing={this.handlePressLogin}
              placeholder='Password' />
          </View>

          <View style={[styles.loginRow]}>
            <TouchableOpacity testID='loginScreenLoginButton' style={styles.loginButtonWrapper} onPress={this.handlePressLogin}>
              <View style={styles.loginButton}>
                <Text style={styles.loginText}>Login</Text>
              </View>
            </TouchableOpacity>
          </View>
          <View style={styles.iconForm}>
            <Icon
              name="power-settings-new"
              size={54}
              color="black"
            />
          </View>
        </View>
        <View style={{ alignSelf: "center" }}>
          {this.props.errorMessage && this.props.errorMessage.message && <Text>{this.props.errorMessage.message}</Text>}
        </View>
      </ScrollView>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    isLoading: state.auth.loginIsLoading,
    userToken: state.auth.userToken,
    user: state.auth.user,
    errorMessage: state.auth.loginErrorMessage
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    attemptLogin: (username, password) => dispatch(AuthActions.loginRequest(username, password))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SignInScreen)
