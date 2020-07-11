import React, { useEffect } from 'react'
import AsyncStorage from '@react-native-community/async-storage'
import { View, Text,  } from 'react-native'
import { Button } from 'react-native-elements'
import { auth } from '../../services/firebase';

const Home = ({navigation}) => {
    
    async function getDataFromStorage() {
        try {
            return (await AsyncStorage.getItem('auth_key'))
        } catch(e) {
            alert('some wrong with get data storage')
        }
    }
    function logOut() {
        auth.signOut()
        .then(() => {
            navigation.navigate('signin');
            deleteStorage();
        })
        .catch(() => {
            alert('something wrong');
            navigation.navigate('home')
        })
    }
    async function deleteStorage() {
        try {
            await AsyncStorage.setItem('auth_key' , 'null');
        } catch(e) {
            alert('some wrong with delete storage' , e)
        }
    }
    return (
        <View style = {{marginTop : 100}}>
            <Button title = "LOG OUT" onPress = {() => logOut()} />
        </View>
    )
}

export default Home
