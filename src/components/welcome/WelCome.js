import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native'
import AsyncStorage from '@react-native-community/async-storage'
import {auth, db} from '../../services/firebase'
import { Button } from 'react-native-elements'
import {setUser} from '../../redux/actions/shared'
import { connect } from 'react-redux'
const WelCome = ({navigation , dispatch}) => {
    useEffect(() => {
        getDataFromStorage().then(authKey => {  
            db.collection('user').doc(authKey).get()
            .then(doc => {
                if(doc.exists) {
                    if(doc.data().cur == 'customer') {
                        move(doc.id).then(() => {
                            navigation.navigate('home')
                        })
                    } else {
                        move(doc.id).then(() => {
                            navigation.navigate('salesman')
                        })
                    }
                    dispatch(setUser(doc.id))
                } else {
                    navigation.navigate('signin')
                }
            }).catch(e => alert(e))
        })
    } , [])
    async function getDataFromStorage() {
        try {
            let authKey = JSON.parse(await AsyncStorage.getItem('auth_key'))
            if(authKey == null) navigation.navigate('signin')
            else return authKey
        } catch(e) {
            alert(e)
        }
    }
    async function move(authKey) {
        await setUser(authKey)
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
export default connect()(WelCome)
