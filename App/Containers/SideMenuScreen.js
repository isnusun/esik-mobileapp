import React from 'react'
import { Text, TouchableOpacity, View, Button, ScrollView, Image } from 'react-native'
import { connect } from 'react-redux'
import styles from './Styles/SideMenuScreenStyle'
import { Images, Colors } from '../Theme'
import NavigationService from '../Services/NavigationService'
import AuthActions from '../Stores/Auth/Actions'
import Icon from "react-native-vector-icons/MaterialIcons";

class SideMenuScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false
    };
  }
  componentDidMount() {
  }

  _logout = () => {
    this.props.logout()
  }

  _navigate = (screen) => {
    this.props.navigation.closeDrawer()
    NavigationService.navigate(screen)
  }

  toggleOpen = () => {
    this.setState({
      open: !this.state.open
    })
  }

  render() {
    return (

      <ScrollView style={styles.sideMenuContainer}>
        <View style={{ width: '100%', height: 190, backgroundColor: Colors.secondary, paddingTop: 20, alignItems: 'center', }}>
          <Image source={Images.logo}
            style={styles.sideMenuProfileIcon} />


        </View>
        <View style={{ width: '100%', height: 1, backgroundColor: '#e2e2e2', marginTop: 15 }} />

        <View style={{ height: '100%', width: '100%', backgroundColor: Colors.primary }}>

          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>

            <Icon name="home" size={25} style={styles.sideMenuIcon} />

            <Text style={styles.menuText} onPress={() => { this._navigate('Home') }} > Home </Text>

          </View>

          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>

            <Icon name="person" size={25} style={styles.sideMenuIcon} />

            <Text style={styles.menuText} onPress={() => { this._navigate('Profile') }} > Profile </Text>

          </View>

          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>

            <Icon name="people" size={25} style={styles.sideMenuIcon} />

            <Text style={styles.menuText} onPress={() => { this._navigate('Respondent') }} > Responden </Text>

          </View>
          <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }} onPress={this.toggleOpen}>
            <Icon name="view-list" size={25} style={styles.sideMenuIcon} />
            <Text style={{fontSize: 16}}> Testing Purpose </Text>
          </TouchableOpacity>
          <View style={[this.state.open ? {} : { display: "none" }, { paddingLeft: 40 }]}>

            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>

              <Icon name="label" size={25} style={styles.sideMenuIcon} />

              <Text style={styles.menuText} onPress={() => { this._navigate('Family') }} > Rumah Tangga </Text>

            </View>

            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>

              <Icon name="label" size={25} style={styles.sideMenuIcon} />

              <Text style={styles.menuText} onPress={() => { this._navigate('Resident') }} > Penduduk </Text>

            </View>

            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>

              <Icon name="label" size={25} style={styles.sideMenuIcon} />

              <Text style={styles.menuText} onPress={() => { this._navigate('FamilyIndicator') }} > Indikator RT</Text>

            </View>

            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>

              <Icon name="label" size={25} style={styles.sideMenuIcon} />

              <Text style={styles.menuText} onPress={() => { this._navigate('ResidentIndicator') }} > Indikator Pend</Text>

            </View>

            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>

              <Icon name="label" size={25} style={styles.sideMenuIcon} />

              <Text style={styles.menuText} onPress={() => { this._navigate('FamilyAnswer') }} > Jawaban RT</Text>

            </View>

            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>

              <Icon name="label" size={25} style={styles.sideMenuIcon} />

              <Text style={styles.menuText} onPress={() => { this._navigate('ResidentAnswer') }} > Jawaban Pend</Text>

            </View>
          </View>

          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10}}>

            <Icon name="exit-to-app" size={25} style={styles.sideMenuIcon} />

            <Text style={styles.menuText} onPress={this._logout} > Logout </Text>

          </View>

        </View>

      </ScrollView>
    );
  }
}

SideMenuScreen.propTypes = {
}

const mapStateToProps = (state) => ({
})

const mapDispatchToProps = (dispatch) => ({
  logout: () => dispatch(AuthActions.logout())
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SideMenuScreen)
