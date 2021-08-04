import React, { Component } from 'react'
import { TouchableOpacity, ActivityIndicator, FlatList, ScrollView, Text, View } from 'react-native'
import { connect } from 'react-redux'
import familySqlite from 'App/Database/familySqlite'
import Loader from 'App/Containers/Loader'
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Colors, Fonts } from '../Theme'
import NavigationDrawerStructure from '../Components/NavigationDrawerStructure'
import NavigationService from '../Services/NavigationService'
// Styles
import styles from './Styles/RespondentScreenStyle'

class RwScreen extends Component {
    constructor(props) {
        super(props);
        const { navigation } = this.props;
        const param = navigation.getParam('param', {});
        this.state = {
            dusun: param.dusun,
            items: [],
            loading: false,
            filter: '',
            typing: false,
            typingTimeout: 0,
        }
    }

    static navigationOptions = ({ navigation }) => ({
        title: 'SensusKu',
        headerRight: <NavigationDrawerStructure navigationProps={navigation} />,
        headerStyle: {
            backgroundColor: Colors.secondary,
        },
        headerTintColor: Colors.primary,
    });

    componentDidMount() {
        const { navigation } = this.props;
        this.focusListener = navigation.addListener("didFocus", () => {
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

        const familyDb = new familySqlite
        familyDb.initDB().then(() => {

            let _data = familyDb.listRw(this.props.user.userid, this.state.dusun)
            _data.then((items) => {
                console.log(JSON.stringify(items))
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

        }).catch(() => {
            this.setState({
                loading: false
            })
        })

    }

    onFilterChange = text => {
        const self = this;

        if (self.state.typingTimeout) {
            clearTimeout(self.state.typingTimeout);
        }

        self.setState({
            filter: text,
            typing: false,
            typingTimeout: setTimeout(function () {
                self._getData();
            }, 1000)
        });
    }

    openRt = param => {
        NavigationService.navigate('Rt', { param: param });
    }
    render() {
        return (
            <ScrollView style={styles.container}>
                <Loader loading={this.state.loading} />
                <Text style={[Fonts.style.h2, { alignSelf: "center" }]}>Daftar RW</Text>
                <Text style={[Fonts.style.h4, { alignSelf: "center" }]}>Dusun {this.state.dusun}</Text>
                {/* <View style={styles.searchBox}>
                    <TextInput
                        style={styles.searchInput}
                        placeholder='Pencarian responden'
                        onChangeText={this.onFilterChange}></TextInput>
                </View> */}

                {this.props.isLoading ? (
                    <ActivityIndicator size="large" />
                ) : (
                        <FlatList
                            style={{ width: '100%', marginTop: 20 }}
                            keyExtractor={(item, index) => item.rw}
                            data={this.state.items}
                            renderItem={({ item, index }) => (
                                <TouchableOpacity onPress={() => this.openRt(item)}>
                                    <View style={styles.itemBox2}>
                                        <View style={styles.itemTextBox}>
                                            <Text style={styles.itemText}>Rw: {item.rw}</Text>
                                            <Text style={styles.itemTextSmall}>Jumlah KK  :  {item.family_count}</Text>
                                            <Text style={styles.itemTextSmall}>KK selesai :  {item.family_status_count >= 1000 ? item.family_status_count / 1000 : 0}</Text>
                                            <Text style={styles.itemTextSmall}>Jumlah Pend:  {item.resident_count}</Text>
                                            <Text style={styles.itemTextSmall}>Pend. selesai:{item.resident_status_count >= 1000 ? item.resident_status_count / 1000 : 0}</Text>
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
                                <View style={{ marginBottom: 40 }}>

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

export default connect(mapStateToProps, mapDispatchToProps)(RwScreen)
