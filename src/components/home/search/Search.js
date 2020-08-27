import React, { useState , useEffect } from 'react'
import { View, Text , StyleSheet, 
    Keyboard ,TouchableWithoutFeedback, FlatList, TouchableOpacity } from 'react-native'
import { Header, SearchBar, Card , Avatar } from 'react-native-elements'
import {db} from '../../../services/firebase'
import { contain } from '../../../helpers/commonFuntions'
const pic = 'https://cdn1.iconfinder.com/data/icons/user-pictures/100/unknown-512.png'
const Search = ({navigation}) => {
    const [textSearch , setTextSearch] = useState('')
    const [searchRes , setSearchRes] = useState([])
    useEffect(() => {

        return setSearchRes([])
    }
    ,[])
    const getRes = (text) => {
        db.collection('user').where('cur' , "==" , "salesMan").get()
        .then(qureySnap => {
            let arr = []
            qureySnap.forEach(doc => {
                if(contain(doc.data().uName , text) || contain(doc.data().storeName , text)) {
                    arr.push({...doc.data() , salesManId : doc.id})
                }
            })
            setSearchRes([...arr])
        })
        
    }
    return (
        <View style = {styles.root}> 
            <Header 
                containerStyle = {styles.headerContent}
                centerComponent = {
                    <SearchBar 
                        value = {textSearch}
                        placeholder = "SEARCH ABOUT STORES"
                        containerStyle = {styles.search}
                        onChangeText = {(text) => {
                            setTextSearch(text)
                            getRes(text)
                        }}
                        inputContainerStyle = {{borderWidth : 0 , backgroundColor : 'white'}}
                    />
                }
            />
             <TouchableWithoutFeedback onPress = {() => Keyboard.dismiss()}> 
                <View style = {styles.res_content}>
                    <FlatList 
                        data = {searchRes}
                        renderItem = {({item}) => {
                            return (
                                <Card containerStyle = {styles.salesManData}>
                                    <TouchableOpacity
                                    onPress = {() => {
                                        navigation.navigate("profileRvw" , {
                                            docId : item.salesManId
                                        })
                                    }}
                                    style = {styles.salesManDataContent}>
                                        <View style = {styles.pic_name}>
                                            <Avatar source = {{
                                                uri : (item.img && "a") ? item.img : pic ,}}
                                                rounded
                                                size = "medium"
                                            
                                            />
                                            <Text style = {[styles.txtName , styles.txtColor]}>{item.uName}</Text>
                                        </View>
                                        <View>
                                            <Text style = {styles.txtColor}>{item.storeName}</Text>
                                        </View>
                                    </TouchableOpacity>
                                </Card>
                            )
                        }}
                        keyExtractor = {item => item.salesManId}
                        ItemSeparatorComponent = {() => <View style = {styles.seprator}></View>}
                    />
                </View>
            </TouchableWithoutFeedback>
        </View>
    )
}
const styles = StyleSheet.create({
    root : {
        flex : 1
    },
    search : {
        width : 350,
        backgroundColor : 'white',
        padding : 0,
        marginBottom : 9,
        borderTopWidth : 0,
        borderBottomWidth : 0,
        
    },
    headerContent : {
        backgroundColor : 'transparent',
        elevation : 1
    },
    res_content : {
        flex : 1,
        
    },
    seprator : {
        width : '100%',
        height : 10
    },
    salesManData : {
        backgroundColor : 'rgba(0,0,0,.3)',
        borderRadius : 50,
        
    },
    pic_name : {
        flexDirection : 'row',
        alignItems : 'center',
        justifyContent : 'space-between',
        width : '40%'
    },
    salesManDataContent : {
        flexDirection : 'row',
        alignItems : 'center',
        justifyContent : 'space-between'
    },
    txtName : {
        fontSize : 25
    },
    txtColor : {
        color : 'white'
    }

})
export default Search
