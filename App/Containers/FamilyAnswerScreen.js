import React, { Component } from 'react'
import { TouchableOpacity, ActivityAnswer, FlatList, Image, ScrollView, Text, TextInput, View } from 'react-native'
import { connect } from 'react-redux'
import familyAnswerSqlite from 'App/Database/familyAnswerSqlite'
import Loader from 'App/Containers/Loader'
import { Colors, Fonts } from '../Theme'

// Styles
import styles from './Styles/FamilyScreenStyle'

class FamilyAnswerScreen extends Component {
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

        const familyAnswerDb = new familyAnswerSqlite
        familyAnswerDb.initDB().then(() => {
            familyAnswerDb.totalFamilyAnswer(this.props.user.userid, this.state.filter)
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
                        let _rt = familyAnswerDb.listFamilyAnswer(this.props.user.userid, this.state.filter, this.state.per_page, (this.state.page - 1) * this.state.per_page)
                        _rt.then((items) => {
                            this.setState({
                                loading: false,
                                items: items
                            })
                            setTimeout(() => {
                                familyAnswerDb.closeDatabase()
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
                <Text style={[Fonts.style.h1, { alignSelf: "center" }]}>Jawaban RT</Text>
                <View style={styles.searchBox}>
                    <TextInput
                        style={styles.searchInput}
                        placeholder='Pencarian responden'
                        onChangeText={this.onFilterChange}></TextInput>
                </View>

                {this.props.isLoading ? (
                    <ActivityAnswer size="large" />
                ) : (
                        <FlatList
                            style={{ width: '100%' }}
                            keyExtractor={(item, index) => item.id}
                            data={this.state.items}
                            renderItem={({ item, index }) => (
                                <View style={styles.itemBoxFree}>
                                    <View style={styles.itemTextBox}>
                                        <View style={{ flexDirection: "row" }}>
                                            <Text style={[styles.itemTextSmallFree, { width: 70 }]}>id:</Text>
                                            <Text style={styles.itemTextSmallFree}>{item.id}</Text>
                                        </View>
                                        <View style={{ flexDirection: "row" }}>
                                            <Text style={[styles.itemTextSmallFree, { width: 70 }]}>rt:</Text>
                                            <Text style={styles.itemTextSmallFree}>{item.idbdt}</Text>
                                        </View>
                                        <View style={{ flexDirection: "row" }}>
                                            <Text style={[styles.itemTextSmallFree, { width: 70 }]}>indicator:</Text>
                                            <Text style={styles.itemTextSmallFree}>{item.fi_id}</Text>
                                        </View>
                                        <View style={{ flexDirection: "row" }}>
                                            <Text style={[styles.itemTextSmallFree, { width: 70 }]}>answer:</Text>
                                            <Text style={styles.itemTextSmallFree}>{item.answer}</Text>
                                        </View>
                                        <View style={{ flexDirection: "row" }}>
                                            <Text style={[styles.itemTextSmallFree, { width: 70 }]}>updated_at:</Text>
                                            <Text style={styles.itemTextSmallFree}>{item.updated_at}</Text>
                                        </View>
                                        <View style={{ flexDirection: "row" }}>
                                            <Text style={[styles.itemTextSmallFree, { width: 70 }]}>foto:</Text>
                                            {item.foto !== '{}' &&
                                                <Image style={{ width: 66, height: 58 }} source={{ uri: 'file://'+JSON.parse(item.foto).path }} ></Image>
                                            }
                                        </View>
                                        <View style={{ flexDirection: "row" }}>
                                            <Text style={[styles.itemTextSmallFree, { width: 70 }]}>data foto:</Text>
                                            <Text style={styles.itemTextSmallFree}>{item.foto}</Text>
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

export default connect(mapStateToProps, mapDispatchToProps)(FamilyAnswerScreen)
