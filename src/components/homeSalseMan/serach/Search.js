import React, { useState, useEffect } from 'react'
import { View, Text, SafeAreaView, Keyboard , FlatList} from 'react-native'
import { Header, Icon, SearchBar, Card, ListItem, Avatar } from 'react-native-elements'
import { TouchableOpacity , } from 'react-native-gesture-handler'
import constants from 'expo-constants'
import { ActivityIndicator } from 'react-native'
import {db} from '../../../services/firebase'
import { contain } from '../../../helpers/commonFuntions'
const pic = 'https://cdn1.iconfinder.com/data/icons/user-pictures/100/unknown-512.png'
const Search = ({navigation}) => {
    const [txtSrch , setTxtsrch] = useState('')
    const [res , setRes] = useState([])
    useEffect(() => {
        if(txtSrch.trim().length > 0) {
            getRes()
            // console.warn(res)
        }
    } , [txtSrch])
    function getRes(txt) {
        let arr = []
        db.collection('user').where('cur' , '==' , 'salesMan')
        .get().then(querySnapshot => {
            querySnapshot.forEach(doc => {
                if(contain(doc.data().uName , txtSrch) || contain(doc.data().storeName , txtSrch)) {
                    arr.push(Object.assign({id : doc.id} , doc.data()))
                }
            })
            return arr;
        }).then(arr => setRes([...arr]))
    }
    return (
        <SafeAreaView style = {{flex : 1 , marginTop : constants.statusBarHeight + 5}}>
            <View style = {{flexDirection : 'row'  , justifyContent : 'space-between' ,
            alignItems : "center" , marginBottom : 20}}>
                <TouchableOpacity style = {{marginLeft : 5}} onPress = {() => navigation.toggleDrawer()}>
                        <Icon name = "menu"  type = "feather"/>
                    </TouchableOpacity>
                <SearchBar
                placeholder = "Search About SalesMan..."
                value = {txtSrch}
                onChangeText = {(t) => setTxtsrch(t)}
                round containerStyle = {{backgroundColor : 'transparent' , borderWidth : 0 , 
                    width : '87%', marginRight : 10, borderWidth : 1,
                    borderRadius : 50
                }} 
                inputContainerStyle = {{backgroundColor : 'transparent'}}
                cancelIcon = {<Icon name = "left" type = "antdesign" />}
                loadingProps = {<ActivityIndicator />}
                />
                
            </View>
            <View style = {{flex : 1}}>
                <FlatList
                    data = {res}
                    renderItem = {({item} , i) => (
                        <Card containerStyle = {{borderRadius : 50}} >
                            <TouchableOpacity
                            onPress = {() => navigation.navigate('profileRvw' , {
                                docId : item.id
                            })}>
                            <View style = {{flex : 1 ,
                                justifyContent : 'space-between',
                                flexDirection : 'row',
                                height : '100%',
                                alignItems : 'center'
                            }}>
                                <View style = {{flex : 1 , flexDirection : 'row', alignItems : 'center' , width : '80%'}}>
                                    <Avatar size = {"medium"} rounded
                                    source = {{uri : (typeof(item.img) !== 'undefined') ? item.img : pic}}/>
                                    <Text style = {{fontWeight : 'bold' , width : '50%' , marginLeft : 15}}>
                                        {item.uName}
                                    </Text>
                                </View>
                                <Text>
                                    {item.storeName}
                                </Text>
                            </View>
                            </TouchableOpacity>
                        </Card>
                    )}
                    keyExtractor = {(item , i) => item.id + '' + i}
                />
            </View>
        </SafeAreaView>
    )
}

export default Search
