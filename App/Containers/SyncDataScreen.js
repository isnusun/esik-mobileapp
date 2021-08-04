import React, { Component } from 'react'
import { TouchableOpacity, Animated, Easing, ProgressBarAndroid, ScrollView, Text, View } from 'react-native'
import { connect } from 'react-redux'
import Icon from 'react-native-vector-icons/MaterialIcons';

import SyncActions from 'App/Stores/Sync/Actions'

// Styles
import styles from './Styles/SyncDataScreenStyle'
import { Colors, Fonts } from '../Theme/'

class SyncDataScreen extends Component {
  constructor(props) {
    super(props)
    this.state = {
      finished: false,
      progress: 0,
    }
  }
  spinValue = new Animated.Value(0);

  componentDidMount() {
    this.spin();
    this.setState({
      finished: false
    })
  };

  spin = () => {
    if (this.state.finished == false) {
      this.spinValue.setValue(0);
      Animated.timing(
        this.spinValue,
        {
          toValue: 1,
          duration: 1000,
          easing: Easing.linear,
          useNativeDriver: true
        }
      ).start(() => this.spin());
    }
  };
  componentDidUpdate(prevProps, prevState, snapshot) {
    if ((this.props.isFamilyDone && this.props.isResidentDone && this.props.isFamilyIndicatorDone && this.props.isResidentIndicatorDone) === true && (prevProps.isFamilyDone && prevProps.isResidentDone && prevProps.isFamilyIndicatorDone && prevProps.isResidentIndicatorDon) === false) {
      this.setState({
        finished: true
      })
    }
  }


  render() {
    const rotate = this.spinValue.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });
    return (
      <ScrollView style={styles.container}>
        <View style={styles.headForm}>
          <View>
            <Text style={{ color: this.props.isFamilyDone ? "green" : "red" }}>Data Rumah Tangga</Text>
            <ProgressBarAndroid
              styleAttr="Horizontal"
              indeterminate={false}
              progress={this.props.syncFamilyProgress}
            />
          </View>
          <View>
            <Text style={{ color: this.props.isResidentDone ? "green" : "red" }}>Data Anggota Rumah Tangga</Text>
            <ProgressBarAndroid
              styleAttr="Horizontal"
              indeterminate={false}
              progress={this.props.syncResidentProgress}
            />
          </View>
          <View>
            <Text style={{ color: this.props.isFamilyIndicatorDone ? "green" : "red" }}>Indikator RT</Text>
            <ProgressBarAndroid
              styleAttr="Horizontal"
              indeterminate={false}
              progress={this.props.syncFamilyIndicatorProgress}
            />
          </View>
          <View>
            <Text style={{ color: this.props.isResidentIndicatorDone ? "green" : "red" }}>Indikator Anggota RT</Text>
            <ProgressBarAndroid
              styleAttr="Horizontal"
              indeterminate={false}
              progress={this.props.syncResidentIndicatorProgress}
            />
          </View>
        </View>
        <View style={styles.bodyForm}>
          <View style={styles.left}>
            <View style={styles.iconForm}>
              <Animated.View style={{ transform: [{ rotate }] }}>
                <Icon
                  name="autorenew"
                  size={54}
                  color="black"
                />
              </Animated.View>
            </View>
          </View>
          <View style={styles.right}>
            <Text style={[Fonts.style.h4, { color: Colors.silver }]}>Tunggu ya ...</Text>
            <Text style={[Fonts.style.normal, { color: Colors.silver }]}>sedang sinkronisasi data</Text>
          </View>
        </View>
        <View style={styles.errorBox}>
          {this.props.familyErrorMessage && <Text>rt error: {this.props.familyErrorMessage.message}</Text>}
          {this.props.residentErrorMessage && <Text>art error: {this.props.residentErrorMessage.message}</Text>}
          {this.props.familyIndicatorErrorMessage && <Text>rt indikator error: {this.props.familyIndicatorErrorMessage.message}</Text>}
          {this.props.residentIndicatorErrorMessage && <Text>art indikator error: {this.props.residentIndicatorErrorMessage.message}</Text>}
        </View>
        {this.state.finished &&
          <TouchableOpacity style={styles.buttonWrapper} onPress={() => {
            this.props.stopSync()
          }}>
            <View style={styles.cancelButton}>
              <Text style={styles.buttonText}>Tutup</Text>
            </View>
          </TouchableOpacity>
        }
      </ScrollView>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    isFamilyDone: state.sync.isFamilyDone,
    isResidentDone: state.sync.isResidentDone,
    isFamilyIndicatorDone: state.sync.isFamilyIndicatorDone,
    isResidentIndicatorDone: state.sync.isResidentIndicatorDone,
    userToken: state.auth.userToken,
    user: state.auth.user,
    syncFamilyProgress: state.syncFamily.progress,
    syncResidentProgress: state.syncResident.progress,
    syncFamilyIndicatorProgress: state.syncFamilyIndicator.progress,
    syncResidentIndicatorProgress: state.syncResidentIndicator.progress,
    familyErrorMessage: state.family.errorMessage,
    residentErrorMessage: state.resident.errorMessage,
    familyIndicatorErrorMessage: state.familyIndicator.errorMessage,
    residentIndicatorErrorMessage: state.residentIndicator.errorMessage,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    stopSync: () => dispatch(SyncActions.stopSync())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SyncDataScreen)
