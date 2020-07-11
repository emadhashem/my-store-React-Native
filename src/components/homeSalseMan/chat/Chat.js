import React from 'react'
import { View, Text } from 'react-native'
import { Header, Icon, Avatar } from 'react-native-elements'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { NavigationContainer } from '@react-navigation/native'
const Chat = ({navigation}) => {
    return (
        <View style = {{flex : 1 , alignItems : "center"}}>
            <Header 
                backgroundColor = "transparent"
                containerStyle = {{height : 'auto'}}
                leftComponent = {
                    <View 
                    style = {{justifyContent : 'space-around' , 
                    alignItems : "center" ,flexDirection : "row" , width : '150%'}}>
                    <Text style = {{fontWeight : "bold" , width  : '100%'}}>Recent Chats</Text>
                </View>
                }
                centerComponent = {
                    <View style = {{width : 0}}>
                    </View>
                }
                rightComponent = {<TouchableOpacity onPress = {() => navigation.toggleDrawer()}>
                    <Icon name = "menu"  type = "feather"/>
                </TouchableOpacity>}
            />
            <View style = {{borderWidth : .5 , width : '90%' }}>
            </View>
            <View>
                
            </View>
        </View>
    )
}

export default Chat
