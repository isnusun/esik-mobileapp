import React, { Component } from 'react'
import { TouchableOpacity, ActivityIndicator, FlatList, ScrollView, Text, View } from 'react-native'
import { connect } from 'react-redux'
import residentSqlite from 'App/Database/residentSqlite'
import FamilyActions from 'App/Stores/Family/Actions'
import ResidentActions from 'App/Stores/Resident/Actions'
import Loader from 'App/Containers/Loader'
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Colors, Fonts } from '../Theme'

import NavigationDrawerStructure from '../Components/NavigationDrawerStructure'
import NavigationService from '../Services/NavigationService'

import familyAnswerSqlite from 'App/Database/familyAnswerSqlite'
import residentAnswerSqlite from 'App/Database/residentAnswerSqlite'
// Styles
import styles from './Styles/RespondentScreenStyle'

class FamilyCardScreen extends Component {
    constructor(props) {
        super(props);
        const { navigation } = this.props;
        const family = navigation.getParam('family', {});
        this.state = {
            items: [],
            family: {
                idbdt: family.idbdt,
                nama_krt: family.nama_krt,
                pendataan_status: family.pendataan_status
            },
            loading: false,
            filter: '',
            typing: false,
            typingTimeout: 0,
        }
    }

    static navigationOptions = ({ navigation }) => ({
        title: navigation.getParam('family').nama_krt + '(' + navigation.getParam('family').idbdt + ')',
        headerRight: <NavigationDrawerStructure navigationProps={navigation} />,
        headerStyle: {
            backgroundColor: Colors.secondary,
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
            this._getData()
        });
    }

    componentWillUnmount() {
        // Remove the event listener
        this.focusListener.remove();
    }

    _getData = () => {
        this.setState({
            loading: true
        })

        const residentDb = new residentSqlite
        residentDb.initDB().then(() => {
            let _data = residentDb.listFamilyMember(this.props.user.userid, this.state.family.idbdt)
            _data.then((items) => {
                this.setState({
                    loading: false,
                    items: items
                })
                setTimeout(() => {
                    residentDb.closeDatabase()
                }, 100)
            }).catch(() => {
                this.setState({
                    loading: false
                })
            })
        }).catch(() => {
            this.setState({
                loading: false
            })
        })

    }

    openIndicator = (type, id, name, resident) => {
        NavigationService.navigate('Indicator', { type: type, id: id, name: name, family: this.state.family, resident: resident });
    }

    _uploadData = (type, id) => {
        if (type === 'family') {

            const familyAnswerDb = new familyAnswerSqlite
            familyAnswerDb.initDB().then(() => {
                familyAnswerDb.findByFamilyId(this.props.user.userid, id)
                    .then((data) => {
                        this.props.postFamily(
                            this.props.userToken,
                            id,
                            data
                        )
                    })
            })

        } else {
            const residentAnswerDb = new residentAnswerSqlite
            residentAnswerDb.initDB().then(() => {
                residentAnswerDb.findByResidentId(this.props.user.userid, id)
                    .then((data) => {
                        this.props.postResident(
                            this.props.userToken,
                            this.state.family.idbdt,
                            id,
                            data
                        )
                    })
            })
        }
    }
    render() {
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
                    this.props.familyErrorMessage !== null &&
                    <View>
                        <Text style={{ color: "red" }}>{JSON.stringify(this.props.familyErrorMessage.message.problem)}</Text>
                    </View>
                }
                {
                    this.props.residentIsLoading &&
                    <View>
                        <Loader text={'sedang upload data, tunggu...'} loading={true} />
                    </View>
                }
                {
                    this.props.residentErrorMessage !== null &&
                    <View>
                        <Text style={{ color: "red" }}>{JSON.stringify(this.props.residentErrorMessage.message.problem)}</Text>
                    </View>
                }
                <Text style={Fonts.style.h4}>Kartu Keluarga</Text>

                {this.props.isLoading ? (
                    <ActivityIndicator size="large" />
                ) : (
                        <View>
                            <TouchableOpacity onPress={() => this.openIndicator('family', this.state.family.idbdt, 'KK', null)} >
                                <View style={styles.itemBox}>
                                    <View style={[styles.iconBox, (this.state.family.pendataan_status > 0 ? (this.state.family.pendataan_status < 1000 ? styles.iconBoxYellow : styles.iconBoxGreen) : styles.iconBoxDefault)]}>
                                        <Icon
                                            name="home"
                                            size={34}
                                            color="black"
                                        />
                                    </View>
                                    <View style={styles.itemTextBox}>
                                        <Text style={styles.itemText}>KK</Text>
                                        <Text style={styles.itemTextSmall}>{this.state.family.idbdt}</Text>
                                    </View>
                                    <View style={{ width: "10%" }}>
                                        {this.state.family.pendataan_status === 1000 &&
                                            <TouchableOpacity onPress={() => this._uploadData('family', this.state.family.idbdt)} >
                                                <Icon
                                                    name="cloud"
                                                    size={24}
                                                    color="black"
                                                />
                                            </TouchableOpacity>
                                        }
                                    </View>
                                    <View style={styles.rightBox} >
                                        <Icon
                                            name="chevron-right"
                                            size={24}
                                            color="black"
                                        />
                                    </View>

                                </View>
                            </TouchableOpacity>
                            <FlatList
                                style={{ width: '100%' }}
                                keyExtractor={(item, index) => item.idartbdt.toString()}
                                data={this.state.items}
                                renderItem={({ item, index }) => (
                                    <TouchableOpacity onPress={() => this.openIndicator('memberFamily', item.idartbdt, item.nama, item)} >
                                        <View style={styles.itemBox}>
                                            <View style={[styles.iconBox, (item.pendataan_status > 0 ? (item.pendataan_status < 1000 ? styles.iconBoxYellow : styles.iconBoxGreen) : styles.iconBoxDefault)]}>
                                                <Icon
                                                    name="person"
                                                    size={34}
                                                    color="black"
                                                />
                                            </View>
                                            <View style={styles.itemTextBox}>
                                                <Text style={styles.itemText}>{item.nama.substring(0, 12)}{item.nama.length > 12 ? ' ...' : ''}</Text>
                                                <Text style={styles.itemTextSmall}>{item.idartbdt}</Text>
                                            </View>
                                            <View style={{ width: "10%" }}>
                                                {item.pendataan_status === 1000 &&
                                                    <TouchableOpacity onPress={() => this._uploadData('resident', item.idartbdt)} >
                                                        <Icon
                                                            name="cloud"
                                                            size={24}
                                                            color="black"
                                                        />
                                                    </TouchableOpacity>
                                                }
                                            </View>
                                            <View style={styles.rightBox} >
                                                <Icon
                                                    name="chevron-right"
                                                    size={24}
                                                    color="black"
                                                />
                                            </View>
                                        </View>
                                    </TouchableOpacity>
                                )}
                                ItemSeparatorComponent={() => <View style={styles.separator} />}
                                // ListFooterComponent={this.renderFooter.bind(this)}
                                //Adding Load More button as footer component
                                ListFooterComponent={
                                    <View style={[styles.itemBox, { paddingLeft: 0, paddingRight: 0, backgroundColor: 'white', marginBottom: 50, marginTop: 50 }]}>

                                    </View>
                                }
                            />
                        </View>
                    )}
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

export default connect(mapStateToProps, mapDispatchToProps)(FamilyCardScreen)
