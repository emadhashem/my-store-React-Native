import React from 'react'
import { View, Text } from 'react-native'
import {createDrawerNavigator} from '@react-navigation/drawer'
import Profile from './profile/Profile';
import DrawerContent from './DrawerContent';
import Home from './home/HomeSalesMan'
import Search from './serach/Search'
import Chat from './chat/Chat'
import { connect } from 'react-redux'

const drawer = createDrawerNavigator();
const HomeSalesMan = () => {
    return (
        <drawer.Navigator drawerContent = {props => <DrawerContent {...props } />}>
            <drawer.Screen name = "home" component = {Home} />
            <drawer.Screen name = "profile" component = {Profile}/>
            <drawer.Screen name = "search" component = {Search}/>   
            <drawer.Screen name = "chat" component = {Chat}/>
        </drawer.Navigator>
    )
}

export default HomeSalesMan
