import React from 'react'
import { View, Text } from 'react-native'
import { Header, Icon } from 'react-native-elements'
import { TouchableOpacity } from 'react-native-gesture-handler'

const HomeSalesMan = ({navigation}) => {
    return (
        <View style = {{flex : 1}}>
            <Header
                backgroundColor = "transparent"
                containerStyle = {{height : 'auto'}}
                leftComponent = {<TouchableOpacity onPress = {() => navigation.toggleDrawer()}>
                <Icon name = "menu"  type = "feather"/>
            </TouchableOpacity>}
            />
        </View>
    )
}

export default HomeSalesMan
