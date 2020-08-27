import React, { useEffect } from 'react'
import AsyncStorage from '@react-native-community/async-storage'
import { View, Text,  } from 'react-native'
import { Button, Icon } from 'react-native-elements'
import { auth } from '../../services/firebase';
import {createMaterialBottomTabNavigator} from '@react-navigation/material-bottom-tabs'
import Explor from './explor/Explor';
import Search from './search/Search';
import Cart from './profile/Cart';

const bottomTab = createMaterialBottomTabNavigator();
const Home = ({navigation}) => {
    
    // async function getDataFromStorage() {
    //     try {
    //         return (await AsyncStorage.getItem('auth_key'))
    //     } catch(e) {
    //         alert('some wrong with get data storage')
    //     }
    // }
    // function logOut() {
    //     auth.signOut()
    //     .then(() => {
    //         navigation.navigate('signin');
    //         deleteStorage();
    //     })
    //     .catch(() => {
    //         alert('something wrong');
    //         navigation.navigate('home')
    //     })
    // }
    // async function deleteStorage() {
    //     try {
    //         await AsyncStorage.setItem('auth_key' , 'null');
    //     } catch(e) {
    //         alert('some wrong with delete storage' , e)
    //     }
    // }
    // return (
    //     <View style = {{marginTop : 100}}>
    //         <Button title = "LOG OUT" onPress = {() => logOut()} />
    //     </View>
    // )
    return (
        <bottomTab.Navigator>
            <bottomTab.Screen name = "explor" component = {Explor}
            options = {{
                tabBarLabel : 'Explor',
                tabBarIcon : () => (
                <Icon 
                    name = "home" type = "antdesign" color = "white"   
                />)
            }}
            />
            <bottomTab.Screen name = "search" component = {Search} 
            options = {{
                tabBarLabel : 'Search',
                tabBarIcon : () => (
                <Icon 
                    name = "search1" type = "antdesign" color = "white"   
                />)
            }}
            />
            <bottomTab.Screen name = "cart" component = {Cart} 
            options = {{
                tabBarLabel : 'Cart',
                tabBarIcon : () => (
                <Icon 
                    name = "shoppingcart" type = "antdesign" color = "white"   
                />)
            }}
            />
        </bottomTab.Navigator>
    )
}

export default Home
