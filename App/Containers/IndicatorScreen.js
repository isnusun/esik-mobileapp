import React, { Component } from 'react'
import { Image, TouchableOpacity, ScrollView, Text, TextInput, View } from 'react-native'
import { connect } from 'react-redux'
import FamilyActions from 'App/Stores/Family/Actions'
import ResidentActions from 'App/Stores/Resident/Actions'
import familyIndicatorSqlite from 'App/Database/familyIndicatorSqlite'
import familyAnswerSqlite from 'App/Database/familyAnswerSqlite'
import residentAnswerSqlite from 'App/Database/residentAnswerSqlite'
import residentIndicatorSqlite from 'App/Database/residentIndicatorSqlite'
import familySqlite from 'App/Database/familySqlite'
import residentSqlite from 'App/Database/residentSqlite'
import Loader from 'App/Containers/Loader'
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Colors, Fonts } from '../Theme'
import * as RNFS from 'react-native-fs';
import DatePicker from 'react-native-datepicker';
import ImagePicker from 'react-native-image-picker';
import NavigationDrawerStructure from '../Components/NavigationDrawerStructure'
// Styles
import styles from './Styles/RespondentScreenStyle'

class IndicatorScreen extends Component {
  constructor(props) {
    super(props);
    const { navigation } = this.props;
    const type = navigation.getParam('type', '');
    const id = navigation.getParam('id', '');
    const name = navigation.getParam('name', '');
    const family = navigation.getParam('family', {});
    const resident = navigation.getParam('resident', {});
    this.state = {
      total: 0,
      per_page: 1,
      page_last: 1,
      page: 1,
      item: {},
      itemFoto: {},
      answer: '',
      tempFoto: {},
      lat: null,
      lng: null,
      name: name,
      loading: false,
      finished: false,
      family: family,
      resident: resident,
      type: type,
      id: id,
      inputError: false,
      photoError: false,
    }
  }

  static navigationOptions = ({ navigation }) => ({
    title: navigation.getParam('name', '') + '(' + navigation.getParam('id', '') + ')',
    headerRight: <NavigationDrawerStructure navigationProps={navigation} />,
    headerStyle: {
      backgroundColor: '#ff0030',
    },
    headerLeft: null,
    headerTintColor: Colors.primary,
  });

  componentDidMount() {
    const { navigation } = this.props;
    this.focusListener = navigation.addListener("didFocus", () => {
      this.props.resetFamily()
      this.props.resetResident()
      // The screen is focused
      if (this.state.type === 'family') {
        this._getFamilyData()
      } else {
        this._getResidentData()
      }
    });
  }

  componentWillUnmount() {
    // Remove the event listener
    this.focusListener.remove();
  }

  componentDidUpdate() {

  }

  _prevPage = () => {
    // ** uat1
    // if (this.state.answer === '' && this.state.item.rule === 'required') {
    //   this.setState({
    //     inputError: true
    //   })
    //   return
    // } else {
    //   this.setState({
    //     inputError: false
    //   })
    // }
    // if (this.state.item.foto === "1" && JSON.stringify(this.state.tempFoto) === '{}' && JSON.stringify(this.state.itemFoto) === '{}') {
    //   this.setState({
    //     photoError: true
    //   })
    //   return
    // } else {
    //   this.setState({
    //     photoError: false
    //   })
    // }
    this.setState({
      photoError: false,
      inputError: false
    })
    if (this.state.page > 1) {
      this.setState({
        page: this.state.page - 1
      })
    }
    setTimeout(() => {
      if (this.state.type === 'family') {
        this._getFamilyData()
      } else {
        this._getResidentData()
      }
    }, 200)
  }

  _nextPage = () => {
    if (this.state.answer === '' && this.state.item.rule === 'required') {
      this.setState({
        inputError: true
      })
      return
    } else {
      this.setState({
        inputError: false
      })
    }
    if (this.state.page < this.state.page_last) {
      this.setState({
        page: this.state.page + 1
      })
      setTimeout(() => {
        if (this.state.type === 'family') {
          this._getFamilyData()
        } else {
          this._getResidentData()
        }
      }, 200)
    } else {
      setTimeout(() => {
        if (this.state.type === 'family') {
          this._getFamilyData()
        } else {
          this._getResidentData()
        }
      }, 200)
      setTimeout(() => {
        this.setState({
          finished: true
        })
      }, 100)
    }
  }

  _getFamilyData = () => {
    const tempFoto = JSON.stringify(this.state.tempFoto)
    const itemFoto = JSON.stringify(this.state.itemFoto)
    const data = {
      answer: this.state.answer,
      foto: tempFoto === "{}" ? itemFoto : tempFoto,
      lat: this.state.lat,
      lng: this.state.lng
    }
    this.setState({
      loading: true
    })
    if (this.state.item.id) {
      const familyAnswerDb = new familyAnswerSqlite
      familyAnswerDb.initDB().then(() => {
        familyAnswerDb.findByIdIndicator(this.props.user.userid, this.state.item.id, this.state.id)
          .then((find) => {
            if (!find) {
              familyAnswerDb.insertRow(this.props.user.userid, this.state.item.id, this.state.id, data)
                .then(() => {
                  const status = this.state.page < this.state.page_last ? 1 : 1000
                  this._updateStatusFamily(this.props.user.userid, this.state.id, status)
                  this._getFamilyIndicator()
                })
            } else {
              familyAnswerDb.updateById(this.props.user.userid, this.state.item.id, this.state.id, data)
                .then(() => {
                  this._getFamilyIndicator()
                })
            }
          })
      })
    } else {
      this._getFamilyIndicator()
    }
  }

  _getResidentData = () => {
    const tempFoto = JSON.stringify(this.state.tempFoto)
    const itemFoto = JSON.stringify(this.state.itemFoto)
    const data = {
      answer: this.state.answer,
      foto: tempFoto === "{}" ? itemFoto : tempFoto,
      lat: this.state.lat,
      lng: this.state.lng
    }
    this.setState({
      loading: true
    })
    if (this.state.item.id) {
      const residentAnswerDb = new residentAnswerSqlite
      residentAnswerDb.initDB().then(() => {
        residentAnswerDb.findByIdIndicator(this.props.user.userid, this.state.item.id, this.state.id)
          .then((find) => {
            if (!find) {
              residentAnswerDb.insertRow(this.props.user.userid, this.state.item.id, this.state.id, data)
                .then(() => {
                  const status = this.state.page < this.state.page_last ? 1 : 1000
                  this._updateStatusResident(this.props.user.userid, this.state.id, status)
                  this._getResidentIndicator()
                })
            } else {
              residentAnswerDb.updateById(this.props.user.userid, this.state.item.id, this.state.id, data)
                .then(() => {
                  this._getResidentIndicator()
                })
            }
          })
      })
    } else {
      this._getResidentIndicator()
    }
  }

  _getFamilyIndicator = () => {
    const familyIndicatorDb = new familyIndicatorSqlite
    familyIndicatorDb.initDB().then(() => {
      familyIndicatorDb.totalFI(this.props.user.userid)
        .then(total => {
          this.setState({
            total: total,
            page_last: Math.ceil(total / this.state.per_page),
          })
          if (total === 0) {
            this.setState({
              loading: false,
              item: {},
              answer: '',
              itemFoto: {},
              tempFoto: {},
            })
          } else {
            let _rt = familyIndicatorDb.listFI(this.props.user.userid, this.state.per_page, (this.state.page - 1) * this.state.per_page)
            _rt.then((items) => {
              const item = items[0]
              let type = 'pilihan';
              let maxLength = 100;
              let rule = 'optional';
              if (item.jenis !== 'pilihan') {
                if (item.jenis === "") {
                  type = 'varchar';
                  maxLength = 100;
                  rule = 'optional';
                } else {
                  const x = item.detail.replace('"', '').replace('"', '');
                  const detail = x.split(",");
                  type = detail[0].trim();
                  maxLength = parseInt(detail[1].trim());
                  rule = detail[2].trim();
                }
              }
              updated_item = {
                ...item,
                type: type,
                maxLength: maxLength,
                rule: rule
              }

              this.setState({
                loading: false,
                item: updated_item,
              })
              const familyAnswerDb = new familyAnswerSqlite
              familyAnswerDb.initDB().then(() => {
                familyAnswerDb.findByIdIndicator(this.props.user.userid, this.state.item.id, this.state.id)
                  .then((result) => {
                    if (result) {
                      this.setState({
                        answer: result.answer,
                        itemFoto: JSON.parse(result.foto),
                        tempFoto: {},
                      })
                    } else {
                      this.setState({
                        answer: item.value,
                        itemFoto: {},
                        tempFoto: {},
                      })
                      if (item.query === '1') {
                        this.setState({
                          answer: this.state.family[this.state.item.id],
                        })
                      }
                    }
                  }).catch((err) => {
                    this.setState({
                      answer: '',
                      itemFoto: {},
                      tempFoto: {},
                    })
                  })
              })
            }).catch(() => {
              this.setState({
                loading: false,
                item: {},
                answer: '',
                itemFoto: {},
                tempFoto: {},
              })
            })
          }
        }).catch(() => {
          this.setState({
            loading: false,
            item: {},
            answer: '',
            itemFoto: {},
            tempFoto: {},
          })
        })
    }).catch(() => {
      this.setState({
        loading: false
      })
    })
  }

  _getResidentIndicator = () => {
    const residentIndicatorDb = new residentIndicatorSqlite
    residentIndicatorDb.initDB().then(() => {
      residentIndicatorDb.totalRI(this.props.user.userid)
        .then(total => {
          this.setState({
            total: total,
            page_last: Math.ceil(total / this.state.per_page),
          })
          if (total === 0) {
            this.setState({
              loading: false,
              item: {},
              answer: '',
              itemFoto: {},
              tempFoto: {},
            })
          } else {
            let _rt = residentIndicatorDb.listRI(this.props.user.userid, this.state.per_page, (this.state.page - 1) * this.state.per_page)
            _rt.then((items) => {
              const item = items[0]
              let type = '';
              let maxLength = 0;
              let rule = 'optional';
              if (item.jenis !== 'pilihan') {
                if (item.jenis === "") {
                  type = 'varchar';
                  maxLength = 100;
                  rule = 'optional';
                } else {
                  const x = item.detail.replace('"', '').replace('"', '');
                  const detail = x.split(",");
                  type = detail[0].trim();
                  maxLength = parseInt(detail[1].trim());
                  rule = detail[2].trim();
                }
              }
              updated_item = {
                ...item,
                type: type,
                maxLength: maxLength,
                rule: rule
              }
              this.setState({
                loading: false,
                item: updated_item,
              })
              const residentAnswerDb = new residentAnswerSqlite
              residentAnswerDb.initDB().then(() => {
                residentAnswerDb.findByIdIndicator(this.props.user.userid, this.state.item.id, this.state.id)
                  .then((result) => {
                    if (result) {
                      this.setState({
                        answer: result.answer,
                        itemFoto: JSON.parse(result.foto),
                        tempFoto: {},
                      })
                    } else {
                      this.setState({
                        answer: item.value,
                        itemFoto: {},
                        tempFoto: {},
                      })
                      if (item.query === '1') {
                        this.setState({
                          answer: this.state.resident[this.state.item.id],
                        })
                      }
                    }
                  }).catch((err) => {
                    this.setState({
                      answer: '',
                      itemFoto: {},
                      tempFoto: {},
                    })
                  })
              })
            }).catch(() => {
              this.setState({
                loading: false,
                item: {},
                answer: '',
                itemFoto: {},
                tempFoto: {},
              })
            })
          }
        }).catch(() => {
          this.setState({
            loading: false,
            item: {},
            answer: '',
            itemFoto: {},
            tempFoto: {},
          })
        })
    }).catch(() => {

    })
  }

  kembali = () => {
    this.setState({
      finished: false
    })
  }

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
        const path = `${RNFS.PicturesDirectoryPath}/jersus/${this.props.user.userid}/${this.state.type}/${this.state.id}`
        const file_path = path + `/${this.state.item.id}.jpg`
        RNFS.mkdir(path).then(() => {
          RNFS.writeFile(file_path, response.data, 'base64').then(() => {
            this.setState({
              tempFoto: {
                fileName: `${this.state.item.id}.jpg`,
                path: file_path,
                type: response.type,
                latitude: response.latitude,
                longitude: response.longitude
              }
            })
          })
            .catch((error) => {
              alert(JSON.stringify(error));
            })
        });
      }
    });
  }

  _updateStatusFamily = (userid, id, status) => {
    const familyDb = new familySqlite
    familyDb.initDB().then(() => {
      familyDb.updateStatusByIdbdt(userid, id, status).then(() => {

      })
    })
  }

  _updateStatusResident = (userid, id, status) => {
    const residentDb = new residentSqlite
    residentDb.initDB().then(() => {
      residentDb.updateStatusByIdartbdt(userid, id, status).then(() => {

      })
    })
  }

  _uploadData = () => {
    if (this.state.type === 'family') {
      const familyAnswerDb = new familyAnswerSqlite
      familyAnswerDb.initDB().then(() => {
        familyAnswerDb.findByFamilyId(this.props.user.userid, this.state.id)
          .then((data) => {
            this.props.postFamily(
              this.props.userToken,
              this.state.id,
              data
            )
          })
      })

    } else {
      const residentAnswerDb = new residentAnswerSqlite
      residentAnswerDb.initDB().then(() => {
        residentAnswerDb.findByResidentId(this.props.user.userid, this.state.id)
          .then((data) => {
            this.props.postResident(
              this.props.userToken,
              this.state.family.idbdt,
              this.state.id,
              data
            )
          })
      })
    }
  }

  onNumberChanged = (text) => {
    var newText = '';
    var numbers = '0123456789';
    if (text.length < 1) {
      this.setState({ answer: '' });
      return false;
    }
    for (var i = 0; i < text.length; i++) {
      if (numbers.indexOf(text[i]) > -1) {
        newText = newText + text[i];
      }
      this.setState({ answer: newText });
    }
  }

  onDecimalChanged = (text) => {
    var newText = '';
    var numbers = '.0123456789';
    if (text.length < 1) {
      this.setState({ answer: '' });
      return false;
    }
    for (var i = 0; i < text.length; i++) {
      if (numbers.indexOf(text[i]) > -1) {
        newText = newText + text[i];
      }
      this.setState({ answer: newText });
    }

  }
  render() {
    const checked = this.state.answer;
    return (
      <ScrollView style={styles.container}>
        <Loader loading={this.state.loading} />
        {
          this.props.familyIsLoading &&
          <View>
            <Loader text={'sedang upload data, tunggu...'} loading={true} />
          </View>
        }

        {
          this.props.residentIsLoading &&
          <View>
            <Loader text={'sedang upload data, tunggu...'} loading={true} />
          </View>
        }

        {this.state.finished === true &&
          <View>
            <View transparent style={{ alignItems: "center", padding: 20 }}>
              <Text style={{ fontSize: 24, color: "grey" }}>Terima Kasih</Text>
              {this.state.type === 'family' &&
                <View style={{ alignItems: "center" }}>
                  <Text style={{ fontSize: 24, color: "grey" }}>data dari KK</Text>
                  <Text style={{ fontSize: 24, color: "grey" }}>{this.state.family.nama_krt}</Text>
                </View>
              }
              {this.state.type === 'memberFamily' &&
                <View style={{ alignItems: "center" }}>
                  <Text style={{ fontSize: 24, color: "grey" }}>data dari ART</Text>
                  <Text style={{ fontSize: 24, color: "grey" }}>{this.state.name}</Text>
                </View>
              }
              <Text style={{ fontSize: 24, color: "grey" }}>Telah Tersimpan</Text>
              <TouchableOpacity onPress={() => this._uploadData()} style={{ borderRadius: 50, backgroundColor: "#cdd7db", marginTop: 30, marginBottom: 30 }}>
                <Icon style={{ fontSize: 64, color: "grey", margin: 20 }} name='cloud' />
              </TouchableOpacity>
              {
                this.props.residentErrorMessage !== null &&
                <View>
                  <Text style={{ color: "red" }}>{JSON.stringify(this.props.residentErrorMessage.message.problem)}</Text>
                </View>
              }
              {
                this.props.familyErrorMessage !== null &&
                <View>
                  <Text style={{ color: "red" }}>{JSON.stringify(this.props.familyErrorMessage.message.problem)}</Text>
                </View>
              }

              <Text style={{ fontSize: 24, color: "grey" }}>Klik</Text>
              <Text style={{ fontSize: 24, color: "grey" }}>untuk mengunggah</Text>
              <Text style={{ fontSize: 24, color: "grey" }}>ke server</Text><Text></Text>
              {/* <TouchableOpacity onPress={() => this.kembali()} style={styles.buttonNav} >
                <Text style={{ color: Colors.snow }}>Kembali</Text>
              </TouchableOpacity> */}

            </View>
          </View>
        }
        {this.state.finished === false &&
          <View>
            {
              JSON.stringify(this.state.item) !== "{}" &&
              <View>
                {/* <Text>{this.state.item.type + '=' + this.state.item.rule + '=' + this.state.item.maxLength}</Text> */}
                <View style={{ minHeight: 390 }}>
                  <View style={{ marginBottom: 30 }}>
                    <Text style={Fonts.style.h6}>{this.state.item.label}</Text>
                  </View>
                  <View>
                    {this.state.item.jenis === "pilihan" &&
                      <View>
                        {eval(this.state.item.opsi).map(item => {
                          return (
                            <TouchableOpacity
                              onPress={() => {
                                let jwb = item.nama
                                if (checked === item.nama) {
                                  jwb = ''
                                }
                                this.setState({
                                  answer: jwb
                                });
                              }}
                              key={item.nama} style={styles.buttonContainer}>
                              <View
                                style={styles.circle}
                              >
                                {checked === item.nama && <View style={styles.checkedCircle} />}
                              </View>
                              <Text style={this.state.inputError ? styles.indicatorOptionError : styles.indicatorOption}>{item.label}</Text>
                            </TouchableOpacity>
                          );
                        })}
                      </View>
                    }
                    {this.state.item.type === "number" &&
                      <TextInput
                        style={this.state.inputError ? styles.indicatorInputError : styles.indicatorInput}
                        keyboardType='number-pad'
                        onChangeText={answer => this.onNumberChanged(answer)}
                        value={this.state.answer}
                        maxLength={this.state.item.maxLength}
                      />
                    }
                    {this.state.item.type === "decimal" &&
                      <TextInput
                        style={this.state.inputError ? styles.indicatorInputError : styles.indicatorInput}
                        keyboardType='number-pad'
                        onChangeText={answer => this.onDecimalChanged(answer)}
                        value={this.state.answer}
                        maxLength={this.state.item.maxLength}
                      />
                    }
                    {this.state.item.type === 'datetime' &&
                      <DatePicker
                        style={{ width: 200 }}
                        date={this.state.answer} //initial date from state
                        mode="date" //The enum of date, datetime and time
                        placeholder="select date"
                        format="DD-MM-YYYY"
                        minDate="01-01-1900"
                        maxDate="01-01-2025"
                        confirmBtnText="Confirm"
                        cancelBtnText="Cancel"
                        customStyles={{
                          dateIcon: {
                            position: 'absolute',
                            left: 0,
                            top: 4,
                            marginLeft: 0
                          },
                          dateInput: {
                            marginLeft: 36
                          }
                        }}
                        onDateChange={(date) => { this.setState({ answer: date }) }}
                      />
                    }
                    {(this.state.item.type === 'varchar' && this.state.item.id !== 'foto_art') &&
                      <TextInput
                        style={this.state.inputError ? styles.indicatorInputError : styles.indicatorInput}
                        onChangeText={(answer) => this.setState({ answer })}
                        value={this.state.answer}
                        // multiline={true}
                        // numberOfLines={4}
                        maxLength={this.state.item.maxLength}
                      />
                    }

                  </View>
                  {this.state.item.rule === 'required' &&
                    <Text style={{ fontSize: 10, color: this.state.inputError ? "red" : "black" }}>*harus diisi</Text>
                  }
                  {(this.state.item.rule === 'optional' && this.state.item.id !== 'foto_art') &&
                    <Text style={{ fontSize: 10 }}>*opsional</Text>
                  }
                  {(this.state.item.type === 'number' || this.state.item.type === 'decimal') &&
                    <Text style={{ fontSize: 10 }}>maks. {this.state.item.maxLength} digit</Text>
                  }
                  {this.state.item.type === 'varchar' &&
                    <Text style={{ fontSize: 10 }}>maks. {this.state.item.maxLength} huruf</Text>
                  }
                  {this.state.photoError &&
                    <View>
                      <Text style={{ color: "red" }}>foto harus ada</Text>
                    </View>
                  }
                  {JSON.stringify(this.state.itemFoto) !== '{}' &&
                    <View>
                      <Text>Foto:</Text>
                      <Image style={{ width: 66, height: 58 }} source={{ uri: 'file://' + this.state.itemFoto.path }} ></Image>
                      {/* <Text>latitude: {this.state.itemFoto.latitude}</Text>
<Text>longitude: {this.state.itemFoto.longitude}</Text>
<Text>fileName: {this.state.itemFoto.fileName}</Text> */}
                    </View>
                  }

                  {this.state.item.foto === "1" &&
                    <View>
                      <TouchableOpacity onPress={() => this.getImage()} >
                        <Icon style={{ fontSize: 64, color: "grey", margin: 0 }} name='camera-alt' />
                      </TouchableOpacity>
                    </View>
                  }

                  {JSON.stringify(this.state.tempFoto) !== '{}' &&
                    <View>
                      <Text>Foto Baru:</Text>
                      <Image style={{ width: 66, height: 58 }} source={{ uri: 'file://' + this.state.tempFoto.path }} ></Image>
                      {/* <Text>lat: {this.state.tempFoto.latitude}</Text>
                <Text>lng: {this.state.tempFoto.longitude}</Text>
                <Text>fileName: {this.state.tempFoto.fileName}</Text> */}
                    </View>
                  }

                </View>
                {
                  this.state.loading === false &&
                  <View>
                    <View style={[styles.itemBox, { paddingLeft: 0, paddingRight: 0, backgroundColor: 'white', marginBottom: 20, marginTop: 20 }]}>
                      <TouchableOpacity disabled={this.state.page === 1} onPress={() => this._prevPage()} style={[styles.buttonNav, { opacity: this.state.page === 1 ? 0.5 : 1 }]} >
                        <Text style={{ color: Colors.snow }}>prev</Text>
                      </TouchableOpacity>

                      <TouchableOpacity onPress={() => this._nextPage()} style={styles.buttonNav}>
                        <Text style={{ color: Colors.snow }}>next</Text>
                      </TouchableOpacity>
                    </View>
                    <View style={{ alignItems: "center" }}>
                      <Text>Indikator {this.state.page} dari {this.state.page_last}</Text>
                    </View>
                  </View>
                }
              </View>
            }
          </View>
        }

      </ScrollView>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    userToken: state.auth.userToken,
    user: state.auth.user,
    familyIsLoading: state.family.isLoading,
    familyErrorMessage: state.family.errorMessage,
    residentIsLoading: state.resident.isLoading,
    residentErrorMessage: state.resident.errorMessage
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    postFamily: (userToken, idbdt, data) => dispatch(FamilyActions.postFamily(userToken, idbdt, data)),
    postResident: (userToken, idbdt, idartbdt, data) => dispatch(ResidentActions.postResident(userToken, idbdt, idartbdt, data)),
    resetFamily: () => dispatch(FamilyActions.resetFamily()),
    resetResident: () => dispatch(ResidentActions.resetResident())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(IndicatorScreen)
