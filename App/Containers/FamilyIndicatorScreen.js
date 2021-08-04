import React, { Component } from 'react'
import { TouchableOpacity, ActivityIndicator, FlatList, ScrollView, Text, TextInput, View } from 'react-native'
import { connect } from 'react-redux'
import familyIndicatorSqlite from 'App/Database/familyIndicatorSqlite'
import Loader from 'App/Containers/Loader'
import { Colors, Fonts } from '../Theme'

// Styles
import styles from './Styles/FamilyScreenStyle'

class FamilyIndicatorScreen extends Component {
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

        const familyIndicatorDb = new familyIndicatorSqlite
        familyIndicatorDb.initDB().then(() => {
            familyIndicatorDb.totalFamilyIndicator(this.props.user.userid, this.state.filter)
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
                        let _rt = familyIndicatorDb.listFamilyIndicator(this.props.user.userid, this.state.filter, this.state.per_page, (this.state.page - 1) * this.state.per_page)
                        _rt.then((items) => {
                            this.setState({
                                loading: false,
                                items: items
                            })
                            setTimeout(() => {
                                familyIndicatorDb.closeDatabase()
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
                <Text style={[Fonts.style.h1, { alignSelf: "center" }]}>Indikator RT</Text>
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
                            keyExtractor={(item, index) => item.id}
                            data={this.state.items}
                            renderItem={({ item, index }) => (
                                <View style={styles.itemBoxFree}>
                                    <View style={styles.itemTextBox}>
                                        <View style={{ flexDirection: "row" }}>
                                            <Text style={[styles.itemTextSmallFree, { width: 50 }]}>id:</Text>
                                            <Text style={styles.itemTextSmallFree}>{item.id}</Text>
                                        </View>
                                        <View style={{ flexDirection: "row" }}>
                                            <Text style={[styles.itemTextSmallFree, { width: 50 }]}>nourut:</Text>
                                            <Text style={styles.itemTextSmallFree}>{item.nourut}</Text>
                                        </View>
                                        <View style={{ flexDirection: "row" }}>
                                            <Text style={[styles.itemTextSmallFree, { width: 50 }]}>nama:</Text>
                                            <Text style={styles.itemTextSmallFree}>{item.nama}</Text>
                                        </View>
                                        <View style={{ flexDirection: "row" }}>
                                            <Text style={[styles.itemTextSmallFree, { width: 50 }]}>label:</Text>
                                            <Text style={styles.itemTextSmallFree}>{item.label}</Text>
                                        </View>
                                        <View style={{ flexDirection: "row" }}>
                                            <Text style={[styles.itemTextSmallFree, { width: 50 }]}>jenis:</Text>
                                            <Text style={styles.itemTextSmallFree}>{item.jenis}</Text>
                                        </View>
                                        <View style={{ flexDirection: "row" }}>
                                            <Text style={[styles.itemTextSmallFree, { width: 50 }]}>detail:</Text>
                                            <Text style={styles.itemTextSmallFree}>{item.detail}</Text>
                                        </View>
                                        <View style={{ flexDirection: "row" }}>
                                            <Text style={[styles.itemTextSmallFree, { width: 50 }]}>foto:</Text>
                                            <Text style={styles.itemTextSmallFree}>{item.foto}</Text>
                                        </View>
                                        <View style={{ flexDirection: "row" }}>
                                            <Text style={[styles.itemTextSmallFree, { width: 50 }]}>opsi:</Text>
                                            <Text style={styles.itemTextSmallFree}>{item.opsi}</Text>
                                        </View>
                                        <View style={{ flexDirection: "row" }}>
                                            <Text style={[styles.itemTextSmallFree, { width: 50 }]}>value:</Text>
                                            <Text style={styles.itemTextSmallFree}>{item.value}</Text>
                                        </View>
                                    </View>
                                </View>
                            )}
                            ItemSeparatorComponent={() => <View style={styles.separator} />}
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

export default connect(mapStateToProps, mapDispatchToProps)(FamilyIndicatorScreen)
