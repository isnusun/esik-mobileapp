import React, { Component } from 'react'
import { TouchableOpacity, ActivityIndicator, FlatList, ScrollView, Text, TextInput, View } from 'react-native'
import { connect } from 'react-redux'
import FamilyActions from 'App/Stores/Family/Actions'
import familySqlite from 'App/Database/familySqlite'
import Loader from 'App/Containers/Loader'
import { Colors, Fonts } from '../Theme'

import NavigationService from '../Services/NavigationService'
// Styles
import styles from './Styles/FamilyScreenStyle'

class FamilyScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            total: 0,
            per_page: 10,
            page_last: 1,
            page: 1,
            items: [],
            loading: false,
            filter: '',
            typing: false,
            typingTimeout: 0
        }
    }
    componentDidMount() {
        const { navigation } = this.props;
        this.focusListener = navigation.addListener("didFocus", () => {
            // The screen is focused
            this._getRt()
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
        this._getRt()
    }

    _nextPage = () => {
        if (this.state.page < this.state.page_last) {
            this.setState({
                page: this.state.page + 1
            })
            this._getRt()
        }
    }

    _getRt = () => {
        this.setState({
            loading: true
        })

        const familyDb = new familySqlite
        familyDb.initDB().then(() => {
            familyDb._totalFamily(this.props.user.userid, this.state.filter)
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
                        let _rt = familyDb._listFamily(this.props.user.userid, this.state.filter, this.state.per_page, (this.state.page - 1) * this.state.per_page)
                        _rt.then((items) => {
                            this.setState({
                                loading: false,
                                items: items
                            })
                            setTimeout(() => {
                                familyDb.closeDatabase()
                            }, 100)
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
                self._getRt();
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
                <Text style={[Fonts.style.h2, { alignSelf: "center" }]}>Data Family</Text>
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
                                <View style={styles.itemBoxFree}>
                                    <View style={{ flexDirection: "row" }}>
                                        <View style={[styles.itemTextBox, { width: 130 }]}>
                                            <Text style={styles.itemTextFree}>nama_krt: </Text>
                                            <Text style={styles.itemTextSmallFree}>idbdt: </Text>
                                            <Text style={styles.itemTextSmallFree}>nopesertapbdt: </Text>
                                            <Text style={styles.itemTextSmallFree}>pendataan_status: </Text>
                                            <Text style={styles.itemTextSmallFree}>pendataan_tanggal: </Text>
                                            <Text style={styles.itemTextSmallFree}>kode_wilayah: </Text>
                                            <Text style={styles.itemTextSmallFree}>dusun: </Text>
                                            <Text style={styles.itemTextSmallFree}>rt: </Text>
                                            <Text style={styles.itemTextSmallFree}>rw: </Text>
                                            <Text style={styles.itemTextSmallFree}>koordinat_rumah: </Text>
                                            <Text style={styles.itemTextSmallFree}>foto: </Text>
                                            <Text style={styles.itemTextSmallFree}>jumlah_art: </Text>
                                            {/* <Text style={styles.itemTextSmallFree}>resident_count: </Text>
                                            <Text style={styles.itemTextSmallFree}>status_count: </Text> */}
                                        </View>
                                        <View style={styles.itemTextBox}>
                                            <Text style={styles.itemTextFree}>{item.nama_krt.substring(0, 15)}{item.nama_krt.length > 15 ? ' ...' : ''}</Text>
                                            <Text style={styles.itemTextSmallFree}>{item.idbdt}</Text>
                                            <Text style={styles.itemTextSmallFree}>{item.nopesertapbdt}</Text>
                                            <Text style={styles.itemTextSmallFree}>{item.pendataan_status}</Text>
                                            <Text style={styles.itemTextSmallFree}>{item.pendataan_tanggal}</Text>
                                            <Text style={styles.itemTextSmallFree}>{item.kode_wilayah}</Text>
                                            <Text style={styles.itemTextSmallFree}>{item.dusun}</Text>
                                            <Text style={styles.itemTextSmallFree}>{item.rt}</Text>
                                            <Text style={styles.itemTextSmallFree}>{item.rw}</Text>
                                            <Text style={styles.itemTextSmallFree}>{item.koordinat_rumah}</Text>
                                            <Text style={styles.itemTextSmallFree}>{item.foto}</Text>
                                            <Text style={styles.itemTextSmallFree}>{item.jumlah_art}</Text>
                                            {/* <Text style={styles.itemTextSmallFree}>{item.resident_count}</Text>
                                            <Text style={styles.itemTextSmallFree}>{item.status_count}</Text> */}
                                        </View>
                                    </View>

                                </View>
                            )}
                            ItemSeparatorComponent={() => <View style={styles.separator} />}
                            // ListFooterComponent={this.renderFooter.bind(this)}
                            //Adding Load More button as footer component
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

export default connect(mapStateToProps, mapDispatchToProps)(FamilyScreen)
