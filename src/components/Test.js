import React, { useEffect } from 'react'
import { View, SafeAreaView, Text, Button } from 'react-native'
import { db, storage } from '../services/firebase'
import AsyncStorage  from '@react-native-community/async-storage'
const Test = () => {
    const add = () => {
        getDataFromStorage().then(authKey => console.warn(authKey))
    }
    
    async function getDataFromStorage() {
        try {
            let authKey = await JSON.parse(await AsyncStorage.getItem('auth_key'))
            return authKey
        } catch(e) {
            alert(e)
        }
    }
    return (
        <SafeAreaView style = {{flex : 1 ,justifyContent : "center" , alignItems : "center"}}>
            <Button title = "add" onPress = {() => add()}/>
        </SafeAreaView>
    )
}

export default Test
