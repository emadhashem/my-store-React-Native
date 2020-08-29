import React, { useState, useEffect } from 'react'
import { View, Text , StyleSheet, ActivityIndicator, SafeAreaView, TouchableOpacity} from 'react-native'
import { Input, Icon , Button, CheckBox } from 'react-native-elements'
import { set } from 'react-native-reanimated';
import { auth, db } from '../../services/firebase'
import AsyncStorage from '@react-native-community/async-storage'
import { connect } from 'react-redux';
import {setUser} from '../../redux/actions/shared'
const SingUp = ({navigation , dispatch}) => {
    const [authInput , setAuthInput] = useState({email : '' , pass : '' , pass1 : '' , uName : ''});
    const [cur , setCur] = useState('customer');
    const [loading , setLoading] = useState(false)
    const [storeName , setStoreName] = useState('')
    function signUp(email , pass , pass1, uName , cur) {
        if(pass === pass1) {
            auth.createUserWithEmailAndPassword(email , pass).then(() => {
                setLoading(true)
                dispatch(setUser(auth.currentUser.uid))
                if(cur == 'customer') {
                    db.collection('user').doc(auth.currentUser.uid).set({
                        email,
                        uName,
                        cur
                    } , {merge : true})
                    .then(() =>{
                        db.collection('user').doc('cur').set({cur : auth.currentUser.uid})
                        setLoading(false);
                    }).catch(e => alert('from db.collection ' , e))
                } else {
                    db.collection('user').doc(auth.currentUser.uid).set({
                        email,
                        uName,
                        cur,
                        storeName
                    } , {merge : true})
                    .then(() =>{
                        db.collection('user').doc('cur').set({cur : auth.currentUser.uid})
                        setLoading(false);
                    }).catch(e => alert('from db.collection ' , e))
                }
                
            }).then(() =>  success(auth.currentUser.uid))            
            .catch(e => alert(e))
        } else alert('some in confirm password')
    }
    function success(userId) {
        saveToStorage(userId).then(() => {
            db.collection('user').doc(userId).get()
            .then(data => data.data())
            .then(data => {
                if(data.cur == 'customer') navigation.navigate('home');
                else navigation.navigate('salesman');
            }).then(() => {
                db.collection('cart').doc(userId).set({carts : []})
            })
        })
    }
    async function saveToStorage(userId) {
        try {   
            await AsyncStorage.setItem('auth_key' , JSON.stringify(userId));
        } catch(e) {
            alert(e , 'from save in signIn')
        }
    }
    return (loading == true) ? (
        <View style = {{flex : 1 , justifyContent : "center"}}>
            <ActivityIndicator color = "black" size = "large"/>
        </View>
    )
    : (
        
        <SafeAreaView style = {styles.container}>
            <TouchableOpacity 
            style = {{width : '100%' , height : 50 , marginTop : 3,
            alignItems : "center"  , justifyContent : "center"}}
                onPress = {() => navigation.pop()}
            >
                <Text style = {{textDecorationLine : 'underline' , fontSize : 20}}>
                    Back To SignIn
                </Text>
            </TouchableOpacity>
            <View style = {styles.dataContainer}>
                <Input inputContainerStyle = {styles.input} 
                placeholder = "User Name" 
                onChangeText = {(uName) => setAuthInput({...authInput , uName})}
                value = {authInput.uName}
                leftIcon = {<Icon name = "user" type = "evilicon" color = "black"/>}/>

                <Input inputContainerStyle = {styles.input} 
                placeholder = "Your Email" 
                onChangeText = {(email) => setAuthInput({...authInput , email})}
                value = {authInput.email}
                leftIcon = {<Icon name = "email" type = "MaterialIcons" color = "black"/>}/>

                <Input inputContainerStyle = {styles.input} 
                placeholder = "Your Password" value = {authInput.pass}
                secureTextEntry = {true}
                onChangeText = {(pass) => setAuthInput({...authInput , pass})}
                leftIcon = {<Icon name = "locked" type = "fontisto" color = "black"/> }/>

                <Input inputContainerStyle = {styles.input} 
                placeholder = "Confirm Your Password" value = {authInput.pass1}
                secureTextEntry = {true}
                onChangeText = {(pass1) => setAuthInput({...authInput , pass1})}
                leftIcon = {<Icon name = "locked" type = "fontisto" color = "black"/> }/>
                {
                (cur === 'salesMan') ? (
                    <Input  
                    placeholder = "Store Name"
                    value = {storeName}
                    onChangeText = {(storeName) => setStoreName(storeName)}
                    leftIcon = {<Icon type = "font-awesome-5" name = "store-alt" />} />
                ) : null
                }
            </View>
            <Button title = "SIGN UP" 
            onPress = {() => signUp(authInput.email , authInput.pass , authInput.pass1, authInput.uName , cur)}/>
            <View style = {{flexDirection : 'row'}}>
                <CheckBox 
                title='Sales Man'
                checkedIcon='dot-circle-o'
                checked = {cur === 'salesMan'}
                onPress = {() => setCur('salesMan')}
                />
                <CheckBox 
                title='Customer'
                checkedIcon='dot-circle-o'
                checked = {cur === 'customer'}
                onPress = {() => setCur('customer')}
                />
            </View>
            
        </SafeAreaView>
    )
}
const styles = StyleSheet.create({
    container : {
        flex : 1,
        justifyContent : 'space-between',
        alignItems : "center",
    },
    dataContainer : {
        alignItems : "center",
        justifyContent : "space-around",
        borderColor : 'black',
        width : '85%',
        height : '60%',
        // borderWidth : 2,
        // borderColor : '',
        
    },
    input : {
        width : '100%',
        height : 40
    },
})

export default connect()(SingUp)
