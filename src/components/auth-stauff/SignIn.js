import React, { useState, useEffect } from 'react'
import { View, Text , StyleSheet , Keyboard, Modal } from 'react-native'
import { Input, Icon, Button } from 'react-native-elements'
import { TouchableWithoutFeedback } from 'react-native-gesture-handler'
import { auth, db } from '../../services/firebase'
import AsyncStorage from '@react-native-community/async-storage'
import { connect } from 'react-redux'
import {setUser} from '../../redux/actions/shared'
const SignIn = ({navigation , dispatch}) => {
    const [forgetPass, setForgetPass] = useState(false)
    const [authInput , setAuthInput] = useState({email : '' , pass : ''});
    const [emailReset , setEmailReset] = useState('');
    const signIn = (email , pass) => {
        auth.signInWithEmailAndPassword(email , pass + '')
        .then(() => success())
        .catch(e => failed(e));
    }
    // sign in done correct
    function success() {
        auth.onAuthStateChanged(user => {
            // console.warn(user)
            if(user !== null) {
                saveToStorage(user.uid).then(() => {
                    dispatch(setUser(user.uid))
                }).then(() => {
                    db.collection('user').doc('cur').set({cur : user.uid})
                }).then(() => {
                    db.collection('user').doc(user.uid).get()
                    .then(data => data.data())
                    .then(data => {
                        if(data.cur == 'customer') navigation.navigate('home');
                        else navigation.navigate('salesman');
                    })
                })
            }
        })
        
    }
    async function saveToStorage(userId) {
        try {   
            await AsyncStorage.setItem('auth_key' , JSON.stringify(userId));
        } catch(e) {
            alert(e , 'from save in signIn')
        }
    }
    // // sign in failed
    function failed(e) {
        alert(e);
    }
    function sendToResetPass(emailReset) {
        auth.sendPasswordResetEmail(emailReset).then(() => {
            alert('sending success')
        }).then(() => {
            setForgetPass(false);
        }).catch(e => alert(e));
    } 
    return (
         
        <View  style = {styles.container} >
            {/* modal for forgetpassword stuff */}
            <Modal visible = {forgetPass} animated = {true} animationType = "slide">
                <Button type = "clear" icon = {<Icon type = "ionicon" size = {39} name = "ios-arrow-round-back"/>} 
                onPress = {() => setForgetPass(false)}
                />
                <View>
                    <Input inputContainerStyle = {styles.input} 
                    value = {emailReset}
                    onChangeText = {(emailReset) => setEmailReset(emailReset)}
                    placeholder = "Your Email" 
                    leftIcon = {<Icon name = "email" type = "MaterialIcons" color = "black"/>}/>
                    <Button title = "SEND" onPress = {() => sendToResetPass(emailReset)}/>
                </View>
            </Modal>
            {/* input data conatiner */}
            <View style = {styles.dataContainer}>
                <View>
                    <Input inputContainerStyle = {styles.input} 
                    placeholder = "Your Email" 
                    onChangeText = {(email) => setAuthInput({...authInput , email})}
                    value = {authInput.email}
                    leftIcon = {<Icon name = "email" type = "MaterialIcons" color = "white"/>}/>

                    <Input inputContainerStyle = {styles.input} 
                    secureTextEntry = {true}
                    placeholder = "Your Password" value = {authInput.pass}
                    onChangeText = {(pass) => setAuthInput({...authInput , pass})}
                    leftIcon = {<Icon name = "locked" type = "fontisto" color = "white"/> }/>

                    <View style = {styles.btnHolder}>
                        <Button title = "SUBMIT" onPress = {() => signIn(authInput.email , authInput.pass)}/>
                        <Button title = "SIGN UP" onPress = {() => {navigation.navigate('signup')}}/>
                    </View>
                </View>
                <Button title = "FORGET YOUR PASSWORD !" onPress = {() => setForgetPass(true)}/>
            </View>
            
        </View>
        
        
    )
}
const styles = StyleSheet.create({
    container : {
        flex : 1,
        justifyContent : 'center',
        alignItems : "center",
        backgroundColor : 'rgba(0,0,0,.5)'
    },
    dataContainer : {
        alignItems : "center",
        justifyContent : "space-around",
        borderColor : 'black',
        width : '85%',
        height : '70%',
        // borderWidth : 2,
        // borderColor : '',
        padding : 10,
        // borderRadius : 15
    },
    input : {
        width : '100%',
        height : 40
    },
    btnHolder : {
        alignItems : 'center',
        justifyContent : 'space-around',
        flexDirection : 'row',
    },
    signUp : {
        height : '100%'
    }
})
export default connect()(SignIn)
