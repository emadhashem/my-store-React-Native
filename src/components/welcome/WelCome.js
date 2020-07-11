import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native'
import AsyncStorage from '@react-native-community/async-storage'
import {auth, db} from '../../services/firebase'
import { Button } from 'react-native-elements'
const WelCome = ({navigation}) => {
    useEffect(() => {
        getDataFromStorage().then(authKey => {
            db.collection('user').doc(authKey).get()
            .then(doc => {
                if(doc.exists) {
                    if(doc.data().cur == 'customer') {
                        navigation.navigate('home')
                    } else navigation.navigate('salesman')
                } else {
                    navigation.navigate('signin')
                }
            }).catch(e => alert(e))
        })
    })
    async function getDataFromStorage() {
        try {
            let authKey = JSON.parse(await AsyncStorage.getItem('auth_key'))
            if(authKey == null) navigation.navigate('signin')
            else return authKey
        } catch(e) {
            alert(e)
        }
    }
    return (
        <View style = {{flex : 1, justifyContent : "center" , alignItems : "center"}}>
            <Text>
                welcome
            </Text>
            <ActivityIndicator size = "large" />
        </View>
    )
}
export default WelCome
