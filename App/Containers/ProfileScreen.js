import React, { Component } from 'react'
import { Image, ScrollView, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, View } from 'react-native'
import { connect } from 'react-redux'
import ImagePicker from 'react-native-image-picker';
import * as RNFS from 'react-native-fs';
import { Avatar } from 'react-native-elements';
import AuthActions from 'App/Stores/Auth/Actions'
import { Fonts } from '../Theme'

// Styles
import styles from './Styles/ProfileScreenStyle'

class ProfileScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      editMode: false,
      nama: this.props.user.nama,
      email: this.props.user.email,
      nohp: this.props.user.nohp,
      foto: this.props.user.foto,
      _photo: {},
    }
  }
  static navigationOptions = {
    title: 'Home',
    headerStyle: {
      backgroundColor: '#f4511e',
    },
    headerTintColor: '#fff',
    headerTitleStyle: {
      fontWeight: 'bold',
    },
  };

  getImage = () => {
    const options = {
      title: 'Select Avatar',
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };
    ImagePicker.showImagePicker(options, (response) => {
      console.log('Response = ', response);

      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {
        //   const source = { uri: response.uri };

        // You can also display the image using data:
        // const source = { uri: 'data:image/jpeg;base64,' + response.data };
        const path = `${RNFS.PicturesDirectoryPath}/jersus/${this.props.user.userid}/profile`
        const file_path = path + '/avatar.jpg'
        RNFS.mkdir(path).then(() => {
          RNFS.writeFile(file_path, response.data, 'base64').then(() => {
            this.setState({
              _photo: {
                fileName: response.fileName,
                path: file_path,
                type: response.type,
                latitude: response.latitude,
                longitude: response.longitude
              }
            })
            // RNFS.readFile(file_path, 'base64').then((data) => {

            // })

          })
            .catch((error) => {
              alert(JSON.stringify(error));
            })
        });
      }
    });
  }

  updateProfile = () => {
    this.setState({ editMode: false })
    this.props.updateProfile(
      this.props.userToken,
      this.state.nama,
      this.state.email,
      this.state.nohp,
      this.state._photo
    )
  }

  editProfile = () => {
    this.setState({ editMode: true })
    this.setState({
      nama: this.props.user.nama,
      email: this.props.user.email,
      nohp: this.props.user.nohp,
      _photo: {}
    })
  }

  onEmailChange = text => {
    this.setState({
      email: text
    });
  };

  onNamaChange = text => {
    this.setState({
      nama: text
    });
  };

  onNohpChange = text => {
    this.setState({
      nohp: text
    });
  };
  render() {
    const { nama, email, nohp } = this.state
    const editable = this.state.editMode
    const textInputStyle = editable ? styles.textInput : styles.textInputReadonly
    return (
      <ScrollView style={styles.container}>
        <KeyboardAvoidingView behavior='position'>
          <View style={{ alignItems: "center" }}>
            <View>
              <Text style={[Fonts.style.h2, { alignSelf: "center" }]}>Profil</Text>

            </View>
            <View style={{ marginTop: 30 }}>
              <Avatar
                size="large"
                rounded
                source={{
                  uri:
                    this.props.user.foto.s,
                }}
              />
            </View>
          </View>

          <View>
            {
              this.state.editMode &&
              <View>
                <TouchableOpacity style={styles.buttonWrapper} onPress={this.getImage}>
                  <View style={styles.saveButton}>
                    <Text style={styles.buttonText}>Ambil Gambar</Text>
                  </View>
                </TouchableOpacity>
                {
                  this.state._photo.path &&
                  <Image style={{ width: 66, height: 58 }} source={{ uri: 'file://' + this.state._photo.path }} ></Image>
                }

                {/* <Text>{this.state._photo.latitude}</Text>
                <Text>{this.state._photo.longitude}</Text>
                <Text>{this.state._photo.fileName}</Text> */}

                {/* <Text>{this.state._photo.path}</Text>
                <Text>{this.state._photo.uri}</Text> */}
              </View>
            }
          </View>
          <View style={[styles.row, { marginTop: 10 }]}>
            <Text style={styles.rowLabel}>Nama</Text>
            <TextInput
              style={textInputStyle}
              value={nama}
              editable={editable}
              keyboardType='default'
              returnKeyType='next'
              autoCapitalize='none'
              autoCorrect={false}
              onChangeText={this.onNamaChange}
              underlineColorAndroid='transparent'
              placeholder='Nama' />
          </View>
          <View style={styles.row}>
            <Text style={styles.rowLabel}>Email</Text>
            <TextInput
              style={textInputStyle}
              value={email}
              editable={editable}
              keyboardType='default'
              returnKeyType='next'
              autoCapitalize='none'
              autoCorrect={false}
              onChangeText={this.onEmailChange}
              underlineColorAndroid='transparent'
              placeholder='Nama' />
          </View>
          <View style={styles.row}>
            <Text style={styles.rowLabel}>No HP</Text>
            <TextInput
              style={textInputStyle}
              value={nohp}
              editable={editable}
              keyboardType='default'
              returnKeyType='next'
              autoCapitalize='none'
              autoCorrect={false}
              onChangeText={this.onNohpChange}
              underlineColorAndroid='transparent'
              placeholder='Nama' />
          </View>
          {
            !this.state.editMode &&

            <View>
              <TouchableOpacity style={styles.buttonWrapper} onPress={this.editProfile}>
                <View style={styles.editButton}>
                  <Text style={styles.buttonText}>Edit</Text>
                </View>
              </TouchableOpacity>
            </View>
          }
          {
            this.state.editMode &&
            <View style={[styles.buttonRow]}>
              <TouchableOpacity style={styles.buttonWrapper} onPress={() => { this.setState({ editMode: false }) }}>
                <View style={styles.cancelButton}>
                  <Text style={styles.buttonText}>Cancel</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity style={styles.buttonWrapper} onPress={this.updateProfile}>
                <View style={styles.saveButton}>
                  <Text style={styles.buttonText}>Save</Text>
                </View>
              </TouchableOpacity>
            </View>
          }

        </KeyboardAvoidingView>
      </ScrollView >
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
    getProfile: (userToken) => dispatch(AuthActions.getProfile(userToken)),
    updateProfile: (userToken, nama, email, nohp, foto) => dispatch(AuthActions.updateProfile(userToken, nama, email, nohp, foto))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ProfileScreen)
