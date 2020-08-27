import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet, FlatList, ScrollView ,  } from 'react-native'
import { Avatar, Icon, Header, Card, Button, Image } from 'react-native-elements'
import { connect } from 'react-redux'
import {db} from '../../../services/firebase'
import { TouchableOpacity } from 'react-native-gesture-handler'
const pic = 'https://cdn1.iconfinder.com/data/icons/user-pictures/100/unknown-512.png'
const Cart = ({user}) => {
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
        <View style = {styles.root}>
            <Header 
                
                backgroundColor = "transparent"
                containerStyle = {{height : 'auto' , marginBottom : 10}}
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
                
            />
            <View style = {{borderWidth : .5 , width : '90%' , alignSelf : "center" }}>
            </View>
            <View style = {{flex : 1 }}>
                <FlatList 
                    data = {carts}
                    renderItem = {({item}) => {
                        return(
                            <Card containerStyle = {{marginBottom : 5 , marginTop : 10}}>
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
    root : {
        flex : 1
    },
    separtor : {
        width : '100%',
        height : 20
    },
    prdcontent : {
        backgroundColor : 'red'
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
