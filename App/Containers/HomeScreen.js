import React, { Component } from 'react'
import { ScrollView, Text, TouchableOpacity, View } from 'react-native'
import { connect } from 'react-redux'
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Avatar } from 'react-native-elements';

import NavigationService from '../Services/NavigationService'
import AuthActions from 'App/Stores/Auth/Actions'
import SyncActions from 'App/Stores/Sync/Actions'

// Styles
import styles from './Styles/HomeScreenStyle'
import { Images, Metrics } from '../Theme'

class HomeScreen extends Component {
  constructor(props) {
    super(props)
    this.state = {
      visibleHeight: Metrics.screenHeight
    }
  }
  _logout = () => {
    this.props.logout()
  }

  _startSync = () => {
    this.props.startSync(this.props.user.userid, this.props.userToken)
  }

  _openWilayah = () => {
    NavigationService.navigate('Village');
  }
  render() {
    return (
      <ScrollView contentContainerStyle={{ justifyContent: 'center' }} style={[styles.container, { height: this.state.visibleHeight }]} keyboardShouldPersistTaps='always'>
        <View style={styles.profileContainer}>
          <Avatar
            size="large"
            rounded
            source={{
              uri:
                this.props.user.foto.s,
            }}
          />
          <Text style={styles.nama}>{this.props.user.nama}</Text>
          <Text style={styles.alamat}>{this.props.user.wilayah_kerja["Desa/Kelurahan"].nama}</Text>
          <Text style={styles.alamat}>{this.props.user.wilayah_kerja.Kecamatan.nama}</Text>
          <Text style={styles.alamat}>{this.props.user.wilayah_kerja["Kabupaten/Kota"].nama}</Text>
        </View>
        <View style={{flex: 1, flexDirection: 'row'}}>
          <TouchableOpacity style={styles.syncButton} onPress={this._startSync}>
            <Icon
              style={{ fontSize: 54, marginTop: 20, marginBottom: 10 }}
              name="autorenew"
            />
            <Text>Sinkronkan</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.syncButton} onPress={this._openWilayah}>
            <Icon
              style={{ fontSize: 54, marginTop: 20, marginBottom: 10 }}
              name="map"
            />
            <Text>Wilayah</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    userToken: state.auth.userToken,
    user: state.auth.user
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    logout: () => dispatch(AuthActions.logout()),
    startSync: (userid, userToken) => dispatch(SyncActions.startSync(userid, userToken))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(HomeScreen)
