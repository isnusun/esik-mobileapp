import React, { Component } from 'react'
import { TouchableOpacity, ActivityIndicator, FlatList, ScrollView, Text, TextInput, View } from 'react-native'
import { connect } from 'react-redux'
import residentSqlite from 'App/Database/residentSqlite'
import Loader from 'App/Containers/Loader'
import { Colors, Fonts } from '../Theme'

// Styles
import styles from './Styles/FamilyScreenStyle'

class ResidentScreen extends Component {
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

        const residentDb = new residentSqlite
        residentDb.initDB().then(() => {
            residentDb.totalResident(this.props.user.userid, this.state.filter)
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
                        let _rt = residentDb.listResident(this.props.user.userid, this.state.filter, this.state.per_page, (this.state.page - 1) * this.state.per_page)
                        _rt.then((items) => {
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
    render() {
        return (
            <ScrollView style={styles.container}>
                <Loader loading={this.state.loading} />
                <Text style={[Fonts.style.h1, { alignSelf: "center" }]}>Daftar Penduduk</Text>
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
                            keyExtractor={(item, index) => item.idartbdt.toString()}
                            data={this.state.items}
                            renderItem={({ item, index }) => (
                                <View style={styles.itemBoxFree}>
                                    <View style={{ flexDirection: "row" }}>
                                        <View style={[styles.itemTextBox, { width: 130 }]}>
                                            <Text style={styles.itemTextFree}>nama: </Text>
                                            <Text style={styles.itemTextSmallFree}>nik: </Text>
                                            <Text style={styles.itemTextSmallFree}>nokk: </Text>
                                            <Text style={styles.itemTextSmallFree}>tmplahir: </Text>
                                            <Text style={styles.itemTextSmallFree}>tgllahir: </Text>
                                            <Text style={styles.itemTextSmallFree}>jnskel: </Text>
                                            <Text style={styles.itemTextSmallFree}>idartbdt: </Text>
                                            <Text style={styles.itemTextSmallFree}>pendataan_status: </Text>
                                            <Text style={styles.itemTextSmallFree}>upload_status: </Text>
                                            <Text style={styles.itemTextSmallFree}>pendataan_tanggal: </Text>
                                            <Text style={styles.itemTextSmallFree}>kode_wilayah: </Text>
                                            <Text style={styles.itemTextSmallFree}>dusun: </Text>
                                            <Text style={styles.itemTextSmallFree}>rw: </Text>
                                            <Text style={styles.itemTextSmallFree}>rt: </Text>
                                        </View>
                                        <View style={styles.itemTextBox}>
                                            <Text style={styles.itemTextFree}>{item.nama}</Text>
                                            <Text style={styles.itemTextSmallFree}>{item.nik}</Text>
                                            <Text style={styles.itemTextSmallFree}>{item.nokk}</Text>
                                            <Text style={styles.itemTextSmallFree}>{item.tmplahir}</Text>
                                            <Text style={styles.itemTextSmallFree}>{item.tgllahir}</Text>
                                            <Text style={styles.itemTextSmallFree}>{item.jnskel}</Text>
                                            <Text style={styles.itemTextSmallFree}>{item.idartbdt}</Text>
                                            <Text style={styles.itemTextSmallFree}>{item.pendataan_status}</Text>
                                            <Text style={styles.itemTextSmallFree}>{item.upload_status}</Text>
                                            <Text style={styles.itemTextSmallFree}>{item.pendataan_tanggal}</Text>
                                            <Text style={styles.itemTextSmallFree}>{item.kode_wilayah}</Text>
                                            <Text style={styles.itemTextSmallFree}>{item.dusun}</Text>
                                            <Text style={styles.itemTextSmallFree}>{item.rw}</Text>
                                            <Text style={styles.itemTextSmallFree}>{item.rt}</Text>
                                        </View>
                                    </View>
                                </View>
                            )}
                            ItemSeparatorComponent={() => <View style={styles.separator} />}
                            // ListFooterComponent={this.renderFooter.bind(this)}
                            //Adding Load More button as footer component
                            ListFooterComponent={
                                <View>
                                    <View style={[styles.itemBox, { paddingLeft: 0, paddingRight: 0, backgroundColor: 'white', marginBottom: 50, marginTop: 50 }]}>
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
    return {}
}

export default connect(mapStateToProps, mapDispatchToProps)(ResidentScreen)
