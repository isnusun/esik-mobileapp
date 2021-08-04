import React from 'react';
import { StyleSheet, Text, View, Modal, ActivityIndicator } from 'react-native';

const Loader = (props) => {
    const { loading, text } = props;

    return (
        <Modal
            transparent={true}
            animationType={'none'}
            visible={loading}
            onRequestClose={() => { console.log('close modal') }}>
            <View style={styles.modalBackground}>

                <View style={styles.activityIndicatorWrapper}>
                    <Text style={{ marginLeft: 5, marginRight: 5 }}>{text}</Text>
                    <ActivityIndicator size="large" color="#0000ff" animating={loading} />
                </View>
            </View>
        </Modal>
    )
}

const styles = StyleSheet.create({
    modalBackground: {
        flex: 1,
        alignItems: 'center',
        flexDirection: 'column',
        justifyContent: 'space-around',
        backgroundColor: '#00000040'
    },
    activityIndicatorWrapper: {
        backgroundColor: '#FFFFFF',
        height: 100,
        minWidth: 100,
        borderRadius: 10,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around'
    }
});

export default Loader;