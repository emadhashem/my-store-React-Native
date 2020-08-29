import React, { useState, useEffect } from 'react'
import { View, Text, FlatList, StyleSheet, ScrollView } from 'react-native'
import { Header, Icon, Avatar, Card, Button, Image } from 'react-native-elements'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { NavigationContainer } from '@react-navigation/native'
import { db } from '../../../services/firebase'
import {connect} from 'react-redux'
const Cart = ({navigation , user}) => {
    const [carts , setCarts] = useState([])
    useEffect(() => {
        db.collection('cart').doc(user).get()
        .then(doc => doc.data())
        .then(data => {
            setCarts([...data.carts])
        }).catch(e => alert(e))
    }, [])

    const removeFromCart = async (id) => {
        //let arr = [...carts]
        let arr = [...carts].filter(item => item.id !== id)
        setCarts([...arr])
        return arr
    }
    return (
        <View style = {{flex : 1 }}>
            <Header 
                backgroundColor = "transparent"
                containerStyle = {{height : 'auto'}}
                leftComponent = {
                    <View 
                    style = {{justifyContent : 'space-around' , 
                    alignItems : "center" ,flexDirection : "row" , width : '150%'}}>
                    <Text style = {{fontWeight : "bold" , width  : '100%'}}>Your Carts </Text>
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
            <View style = {{borderWidth : .5 , width : '90%', alignSelf : "center" }}>
            </View>
            <View style = {{flex : 1 }}>
                <FlatList 
                    data = {carts}
                    renderItem = {({item}) => {
                        return(
                            <Card containerStyle = {styles.prdContent}>
                                <View style = {styles.ownerInfo}>
                                    <TouchableOpacity>
                                        <View style = {styles.owner_pic_txt} >
                                            <Avatar rounded size = "medium"  source = {{uri : item.ownerData.img}} />
                                            <View style = {styles.owner_txt}>
                                                <Text>{item.ownerData.uName}</Text>
                                                <Text>{item.ownerData.storeName}</Text>
                                            </View>
                                        </View>
                                    </TouchableOpacity>
                                    <Button
                                    type = "clear"
                                    onPress = {() => removeFromCart(item.id).then(data => {
                                        db.collection("cart").doc(user).set({
                                            carts : data
                                        })
                                    })}
                                    icon = {<Icon name = "shopping-basket-remove" type = "fontisto" />} />
                                </View>
                                <View style = {styles.prdInfo}>
                                    <View>
                                        <Text>{item.description}</Text>
                                        <Text style = {[styles.txt]}>{item.prName}</Text>
                                        <Text style = {[styles.txt]}>{item.prPrice} L.E</Text>
                                    </View>
                                    
                                        {
                                            (item.imgs.length > 0) ? (
                                                <ScrollView  horizontal>
                                                    {
                                                        item.imgs.map(pic => (
                                                            <View style = {styles.prdImg_hlder}>
                                                                <Image 
                                                                containerStyle = {styles.prdImg} 
                                                                source = {{uri : pic.uri}} />
                                                            </View>
                                                            ))
                                                    }
                                                </ScrollView>
                                            ) : null
                                        }
                                        
                                    
                                </View>
                            </Card>
                        )
                    }}
                    ItemSeparatorComponent = {() => <View style = {styles.separtor}></View>}
                    keyExtractor = {item => item.id}
                />
            </View>
        </View>
    )
}
const styles = StyleSheet.create({
    separtor : {
        width : '100%',
        height : 20
    },
    prdcontent : {

    },
    prdInfo : {

    },
    ownerInfo : {
        flexDirection : "row",
        justifyContent : 'space-between',
        alignItems : 'center'
    },
    owner_pic_txt : {
        flexDirection : "row"
    },
    owner_txt : {
        marginLeft : 10
    },
    txt : {
        textAlign : "center",
        fontWeight : 'bold'
    },
    prdImg : {
        width : '100%',
        height : '100%'
    },
    prdImg_hlder : {
        width : 200,
        height : 150,
        marginTop : 20
    }
})
const mapStateToProps = ({user}) => ({
    user
})
export default connect(mapStateToProps)(Cart)
