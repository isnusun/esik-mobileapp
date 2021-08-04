import React, { Component } from 'react'
import { TouchableOpacity, ActivityIndicator, FlatList, ScrollView, Text, TextInput, View, Picker } from 'react-native'
import { connect } from 'react-redux'
import FamilyActions from 'App/Stores/Family/Actions'
import familySqlite from 'App/Database/familySqlite'
import Loader from 'App/Containers/Loader'
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Colors, Fonts } from '../Theme'

import NavigationService from '../Services/NavigationService'
// Styles
import styles from './Styles/RespondentScreenStyle'

class RespondentScreen extends Component {
    constructor(props) {
        super(props);
        const { navigation } = this.props;
        const dusun = navigation.getParam('dusun', '');
        const rw = navigation.getParam('rw', '');
        const rt = navigation.getParam('rt', '');
        this.state
        this.state = {
            total: 0,
            per_page: 10,
            page_last: 1,
            page: 1,
            items: [],
            loading: false,
            filter: '',
            dusun: dusun,
            rw: rw,
            rt: rt,
            typing: false,
            typingTimeout: 0,
            villages: [],
            rws: [],
            rts: []
        }
    }
    componentDidMount() {
        const { navigation } = this.props;

        this.focusListener = navigation.addListener("didFocus", () => {
            // The screen is focused
            this._getData()
            this._getVillages()
        });
    }

    componentWillUnmount() {
        // Remove the event listener
        this.focusListener.remove();
    }

    _prevPage = () => {
        if (this.state.page > 1) {
            this.setState({
                page: this.state.page - 1
            })
        }
        this._getData()
    }

    _nextPage = () => {
        if (this.state.page < this.state.page_last) {
            this.setState({
                page: this.state.page + 1
            })
            this._getData()
        }
    }


    _getVillages = () => {
        const familyDb = new familySqlite
        familyDb.initDB().then(() => {

            let _data = familyDb.listVillages(this.props.user.userid, this.state.filter)
            _data.then((items) => {
                this.setState({
                    villages: items,
                })
                this._getRw()
            }).catch((err) => {
            })
        }).catch((err) => {
        })
    }
    _getRw = () => {
        const familyDb = new familySqlite
        familyDb.initDB().then(() => {

            let _data = familyDb.listRw(this.props.user.userid, this.state.dusun)
            _data.then((items) => {
                console.log(JSON.stringify(items))
                this.setState({
                    rws: items
                })

                this._getRt()
            }).catch((err) => {
            })
        }).catch((err) => {
        })
    }

    _getRt = () => {
        const familyDb = new familySqlite
        familyDb.initDB().then(() => {

            let _data = familyDb.listRt(this.props.user.userid, this.state.dusun, this.state.rw)
            _data.then((items) => {
                this.setState({
                    rts: items
                })
            }).catch((err) => {
            })
        }).catch((err) => {
        })

    }

    _getData = () => {
        this.setState({
            loading: true
        })

        const familyDb = new familySqlite
        familyDb.initDB().then(() => {
            familyDb.totalFamily(this.props.user.userid, this.state.filter, this.state.dusun, this.state.rw, this.state.rt)
                .then(total => {
                    this.setState({
                        total: total,
                        page_last: Math.ceil(total / this.state.per_page),
                    })
                    if (total === 0) {
                        this.setState({
                            loading: false,
                            page: 1,
                            items: [],
                        })
                    } else {
                        let _rt = familyDb.listFamily(this.props.user.userid, this.state.filter, this.state.dusun, this.state.rw, this.state.rt, this.state.per_page, (this.state.page - 1) * this.state.per_page)
                        _rt.then((items) => {
                            this.setState({
                                loading: false,
                                items: items
                            })
                        }).catch(() => {
                            this.setState({
                                loading: false
                            })
                        })
                    }
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

    _getDetail = (item) => {
        Alert.alert('test', JSON.stringify(item));
    }

    onFilterChange = text => {
        const self = this;

        if (self.state.typingTimeout) {
            clearTimeout(self.state.typingTimeout);
        }

        self.setState({
            filter: text,
            page: 1,
            typing: false,
            typingTimeout: setTimeout(function () {
                self._getData();
            }, 1000)
        });
    }

    openFamilyCard = family => {
        NavigationService.navigate('FamilyCard', { family: family });
    }
    render() {
        return (
            <ScrollView style={styles.container}>
                <Loader loading={this.state.loading} />
                <Text style={[Fonts.style.h2, { alignSelf: "center" }]}>Daftar Responden</Text>
                <View style={styles.filterWilayahBox}>
                    <View style={styles.filterWilayahItemLabel}>
                        <Text>Dusun: </Text>
                    </View>
                    <View>
                        <Picker
                            selectedValue={this.state.dusun}
                            style={styles.filterWilayahItemPicker}
                            onValueChange={(itemValue, itemIndex) => {
                                this.setState({ dusun: itemValue })
                                setTimeout(() => {
                                    this._getRw()
                                }, 500)
                            }
                            }>
                            <Picker.Item key='all' label="Semua" value='' />
                            {

                                this.state.villages.map((v) => {
                                    return <Picker.Item key={v.dusun} label={v.dusun} value={v.dusun} />
                                })
                            }
                        </Picker>
                    </View>

                </View>
                <View style={styles.filterWilayahBox}>
                    <View style={styles.filterWilayahItemLabel}>
                        <Text>Rw: </Text>
                    </View>
                    <View>
                        <Picker
                            selectedValue={this.state.rw}
                            style={styles.filterWilayahItemPicker}
                            onValueChange={(itemValue, itemIndex) => {
                                this.setState({ rw: itemValue })
                                setTimeout(() => {
                                    this._getRt()
                                }, 500)
                            }
                            }>
                            <Picker.Item key='all' label="Semua" value='' />
                            {
                                this.state.rws.map((v) => {
                                    return <Picker.Item key={v.rw} label={v.rw} value={v.rw} />
                                })
                            }
                        </Picker>
                    </View>
                </View>
                <View style={styles.filterWilayahBox}>
                    <View style={styles.filterWilayahItemLabel}>
                        <Text >Rt: </Text>
                    </View>
                    <View>
                        <Picker
                            selectedValue={this.state.rt}
                            style={styles.filterWilayahItemPicker}
                            onValueChange={(itemValue, itemIndex) =>
                                this.setState({ rt: itemValue })
                            }>
                            <Picker.Item key='all' label="Semua" value='' />
                            {
                                this.state.rts.map((v) => {
                                    return <Picker.Item key={v.rt} label={v.rt} value={v.rt} />
                                })
                            }
                        </Picker>
                    </View>

                </View>
                <TouchableOpacity onPress={() => this._getData()} style={styles.buttonFull}>
                    <Text style={{ color: Colors.snow }}>Filter</Text>
                </TouchableOpacity>
                <View style={styles.searchBox}>
                    <TextInput
                        style={styles.searchInput}
                        placeholder='Pencarian responden'
                        onChangeText={this.onFilterChange}></TextInput>
                </View>

                {this.props.isLoading ? (
                    <ActivityIndicator size="large" />
                ) : (
                        <FlatList
                            style={{ width: '100%' }}
                            keyExtractor={(item, index) => item.idbdt.toString()}
                            data={this.state.items}
                            renderItem={({ item, index }) => (
                                <TouchableOpacity onPress={() => this.openFamilyCard(item)} >
                                    <View style={styles.itemBox}>
                                        <View style={[styles.iconBox, (item.pendataan_status === 0 && item.status_count === 0 ? styles.iconBoxDefault : ((item.pendataan_status === 1000 && (item.status_count === item.resident_count * 1000) ? styles.iconBoxGreen : styles.iconBoxYellow)))]}>
                                            <Icon
                                                name="home"
                                                size={34}
                                                color="black"
                                            />
                                        </View>
                                        <View style={styles.itemTextBox}>
                                            <Text style={styles.itemText}>{item.nama_krt.substring(0, 12)}{item.nama_krt.length > 12 ? ' ...' : ''}</Text>
                                            <Text style={styles.itemTextSmall}>{item.idbdt}</Text>
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
                            ListFooterComponent={
                                <View>
                                    <View style={[styles.itemBox, { paddingLeft: 0, paddingRight: 0, backgroundColor: 'white', marginBottom: 20, marginTop: 20 }]}>
                                        <TouchableOpacity onPress={() => this._prevPage()} style={styles.buttonNav} >
                                            <Text style={{ color: Colors.snow }}>prev</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity onPress={() => this._nextPage()} style={styles.buttonNav}>
                                            <Text style={{ color: Colors.snow }}>next</Text>
                                        </TouchableOpacity>
                                    </View>
                                    <View style={{ marginBottom: 40, alignItems: "center" }}>
                                        <Text>halaman {this.state.page} dari {this.state.page_last}</Text>
                                    </View>
                                </View>
                            }
                        />
                    )}
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
        fetchFamily: (page, userToken) => dispatch(FamilyActions.fetchFamily(page, userToken))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(RespondentScreen)
