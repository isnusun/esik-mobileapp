import React, { Component } from 'react'
import { TouchableOpacity, ActivityIndicator, Button, FlatList, ScrollView, Text, TextInput, View, KeyboardAvoidingView } from 'react-native'
import { Images, Colors } from '../Theme'
import Icon from 'react-native-vector-icons/MaterialIcons';
export default class NavigationDrawerStructure extends Component {
    constructor(props) {
        super(props);
    }
    toggleDrawer = () => {
        this.props.navigationProps.toggleDrawer();
    };
    render() {
        return (
            <View style={{ flexDirection: 'row' }}>
                <TouchableOpacity onPress={this.toggleDrawer.bind(this)}>
                    <Icon name="menu" size={40} style={{ marginRight: 10, color: Colors.headerColor }} />
                </TouchableOpacity>
            </View>
        );
    }
}