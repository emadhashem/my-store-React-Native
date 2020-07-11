import React from 'react'
import { View, Text, StyleSheet, AsyncStorage } from 'react-native'
import {DrawerContentScrollView, DrawerItem} from '@react-navigation/drawer'
import { Icon, Button, Avatar } from 'react-native-elements'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { auth } from '../../services/firebase'
const DrawerContent = (props) => {
    function logOut() {
        auth.signOut()
        .then(() => {
            props.navigation.navigate('signin');
            deleteStorage();
        })
        .catch(() => {
            alert('something wrong');
            props.navigation.navigate('home')
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
        <View style = {styles.constainer}>
            <DrawerContentScrollView {...props}>
                <View style = {styles.usInfo}>
                    <View style = {{flexDirection : "row" , alignItems : "center" , marginBottom : 15}}>
                        <Avatar 
                        source = {{uri: 'https://cdn1.iconfinder.com/data/icons/user-pictures/100/unknown-512.png'}} 
                        size = {90}
                        rounded = {true}
                        />
                        <View style = {{marginLeft : 15}}>
                            <Text style = {styles.title}>
                                User Name
                            </Text>
                            <Text style = {styles.caption}>
                                Email@example.com
                            </Text>
                        </View>
                    </View>
                    <View style = {{flexDirection : 'row' , justifyContent : 'space-around'}}>
                        <View >
                            <Text style = {[styles.title , 
                                {textAlign : "center" , fontSize : 23 }]}>
                                80
                            </Text>
                            <Text style = {styles.caption}>
                                followers
                            </Text>
                        </View>
                        <View>
                            <Text style = {[styles.title , 
                                {textAlign : "center" , fontSize : 23 , }
                                ]}>
                                80
                            </Text>
                            <Text style = {styles.caption}>
                                following
                            </Text>
                        </View>
                    </View>
                </View>
                <View style = {styles.screens}>
                    <DrawerItem 
                        label = "Home"
                        icon = {() => <Icon name = "home" type = "antdesign" />}
                        onPress = {() => {props.navigation.navigate('home')}}
                    /> 
                    <DrawerItem 
                        label = "Profile"
                        icon = {() => <Icon name = "user" type = "antdesign" />}
                        onPress = {() => { props.navigation.navigate('profile') }}
                    />
                       
                    <DrawerItem 
                        label = "Search"
                        icon = {() => <Icon name = "search1" type = "antdesign" />}
                        onPress = {() => {props.navigation.navigate('search')}}
                    />
                    <DrawerItem 
                        label = "Chat"
                        icon = {() => <Icon name = "hipchat" type = "fontisto" />}
                        onPress = {() => {props.navigation.navigate('chat')}}
                    />
                </View>
            </DrawerContentScrollView>
            <TouchableOpacity style = {styles.footer}
                onPress = {() => {
                    logOut();
                }}
            >
                <Text style = {styles.txt}>
                    SIGN OUT
                </Text>
                <Icon name = "logout" type = "antdesign" />
            </TouchableOpacity>
        </View>
    )
}
const styles = StyleSheet.create({
    constainer : {
        flex : 1
    },
    usInfo : {
        flex : 1,
        margin : 10,
        borderBottomWidth : 1,
        paddingBottom : 5,
        borderBottomColor : 'rgba(0,0,0,.3)'
    },
    footer : {
        alignItems: "center",
        justifyContent : "flex-start",
        flexDirection : 'row',
        padding : 15,
    },
    txt : {
        marginRight : 10,
        fontWeight : "bold"
    },
    title : {
        fontWeight : "bold",
        // textAlign : "center",
        paddingBottom : 10,
        fontSize : 18
    },
    caption : {
        color : 'rgba(0,0,0,.5)',
        textAlign : "center"
    },
    screens : {

    }
})
export default DrawerContent
