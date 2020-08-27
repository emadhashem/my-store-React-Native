import React, { useState , useEffect} from 'react'
import { View, Text, StyleSheet, Keyboard , FlatList, TouchableOpacity, ScrollView , Modal } from 'react-native'
import { Header, Button, Icon, SearchBar, Card, Avatar, Image } from 'react-native-elements'
import { TouchableWithoutFeedback } from 'react-native-gesture-handler'
import AsyncStorage from '@react-native-community/async-storage'
import { auth, db } from '../../../services/firebase'
import { connect } from 'react-redux'
import {creatThread} from '../../../helpers/commonFuntions'
import firebase from 'firebase/app'
const Explor = ({navigation , user}) => {
    function logOut() {
        auth.signOut()
        .then(() => {
            navigation.navigate('signin');
            deleteStorage();
        })
        .catch(() => {
            alert('something wrong');
            navigation.navigate('explor')
        })
    }
    async function deleteStorage() {
        try {
            await AsyncStorage.setItem('auth_key' , 'null');
        } catch(e) {
            alert('some wrong with delete storage' , e)
        }
    }
    const [textSearch , setTextSearch] = useState('')
    const [prds , setPrds] = useState([]);
    useEffect(() => {
        db.collection('user').doc(user).collection('following').get()
        .then(docs => {
            docs.forEach(doc_user => {
                
                db.collection('follow').doc(user + doc_user.id).get()
                .then(doc => {
                    if(doc.exists) {
                        db.collection('product').doc(doc_user.id).get()
                        
                        .then(doc => {
                            return doc.data()
                        })
                        .then(data => {
                            db.collection('user').doc(doc_user.id).get()
                            .then(doc => doc.data())
                            .then(docInfo => {
                                setPrds(prds => [...prds , ...fill(data.prs , docInfo , doc_user.id)])
                            })
                        }).catch((e) => console.warn(e , 'from get useeffect explor '))
                    }
                })
            })
        })
        return () => setPrds([])
    }, [] ) 
    const fill = (dataPrs = [] , docInfo = {} , id = '') => {
        return [...dataPrs].map(item => ({
            ...item,
            owner : id,
            ...docInfo
        }))
    }
    const [openModalProduct , setOpenModalProduct] = useState(false)
    const [productData , setProductdata] = useState()
    const openProduct = async (item) => {
        await setProductdata(item)
    }
    // this how to add a new element to arr without get whole arr
    const addToCart = (docId  = '') => {
        db.collection('cart').doc(user).update({
            carts : firebase.firestore.FieldValue.arrayUnion({
                ...productData, owner : docId, ownerData : {
                    uName : productData.uName, email : productData.email, 
                    storeName : productData.storeName, img : productData.img
                }
            })
        }).catch(e => alert(e))
    }
    return (
        <View style = {styles.root}>
            <Header
                containerStyle = {styles.headerContent}
                rightComponent = {
                    <Button
                    onPress = {() => logOut()}
                    buttonStyle = {{padding : 3 , borderWidth : 0 , height : 50 ,}}
                    type = "outline"
                    containerStyle = {styles.btn_out}
                    titleStyle = {{marginLeft : 5 , color : 'white'}}
                    title = "LOG OUT" icon = {<Icon color = "white" name = "logout" type = "antdesign"/>} />
                }
                leftComponent = {
                    <SearchBar
                    value = {textSearch}
                    onChangeText = {(text) => setTextSearch(text)}
                    placeholder = "EXPLOR PRODUCTS"
                    containerStyle = {styles.search}
                    inputContainerStyle = {{borderWidth : 0 , backgroundColor : 'white'}}
                    
                    />
                }
            />
            {
                (openModalProduct == false) ? null : (
                    <Modal
                        transparent = {true}
                        animationType = "slide"
                    >
                        <View style = {{flex : 1  , backgroundColor : "rgba(0,0,0,.8)" , height : '100%'}}>
                            <Header 
                                leftComponent = {<Button
                                    titleStyle = {{fontSize : 20 }} 
                                    containerStyle = {{width : '100%'}}
                                    title = "back" onPress = {() => setOpenModalProduct(false)}/>}
                                    leftContainerStyle = {{width : '150%'}}
                            />
                            <View style = {styles.prInfo}>
                                    <View style = {styles.txtHlder}>
                                        <Text style = {[styles.txt_info]}>{productData.description}</Text>
                                        <Text style = {[styles.txt_info , styles.txtBold]}>{productData.prName}</Text>
                                        <Text style = {[styles.txt_info , styles.txtBold]}>{productData.prPrice} L.E</Text> 
                                    </View>
                                    <ScrollView key = "1" contentContainerStyle = {styles.imgsHlder} horizontal = {true}>
                                    {
                                        productData.imgs.map((item , i) => (
                                            <Image containerStyle = {styles.imghlder}
                                            source = {{uri : item.uri}}
                                            
                                            />
                                        ))
                                    }
                                    </ScrollView>
                                    <View>
                                        <Button title = "Add to Cart" onPress = {() => addToCart(productData.owner)} />
                                    </View>
                            </View>
                        </View>
                        

                    </Modal>
                )
            }
            <View style = {{flex : 1}}>
                <FlatList 
                    ListFooterComponent = {() => <View style = {{height : 20}}></View>}
                    data = {prds}
                    renderItem = {({item}) => {
                        return (
                            <Card>
                                <TouchableOpacity onPress = {() => navigation.navigate('profileRvw' , {
                                    docId : item.owner
                                })}>
                                    <View style = {styles.ownerData}>
                                        <Avatar source = {{uri : item.img}} rounded size = "medium" />
                                        <View style = {{marginLeft : 15}}>
                                            <Text>{item.uName}</Text>
                                            <Text>{item.storeName}</Text>
                                        </View>
                                    </View>
                                </TouchableOpacity>
                                <TouchableOpacity 
                                onPress = {() => openProduct(item)
                                .then(() => setOpenModalProduct(true))}>
                                    <View>
                                        <View>
                                            <Text style = {{marginVertical : 15}}>
                                                {item.description}</Text>
                                            <Text style = {{textAlign : 'center' , fontWeight : "bold"}}>
                                                {item.prName}</Text>
                                            <Text style = {{textAlign : 'center' , fontWeight : 'bold'}}>{item.prPrice} L.E</Text>

                                        </View>
                                        <View>
                                            <ScrollView key = "2" contentContainerStyle = {{marginVertical : 15}} horizontal = {true}>
                                                {
                                                    item.imgs.map(img => (
                                                        <Image
                                                            source = {{uri : img.uri}}
                                                            containerStyle = {styles.imgPrd}
                                                        />
                                                    ))
                                                }
                                            </ScrollView>
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            </Card>
                        )
                    }}
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
    headerContent : {
        backgroundColor : "transparent",
        height : 70,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.8,
        elevation: 1
    } , 
    btn_out : {
        width : 100,
        backgroundColor : 'gray',
        marginBottom : 9
    },
    search : {
        width : 230,
        backgroundColor : 'white',
        padding : 0,
        marginBottom : 9,
        borderTopWidth : 0,
        borderBottomWidth : 0,
        
    },
    imgPrd : {
        height : 150,
        width : 200,
        
    },
    ownerData : {
        flexDirection : 'row',
        alignItems : "center"
    },
    prInfo : {
        flex : 1,
        padding : 10
        
    },
    txt_info : {
        color : 'white',
        
    },
    txtBold : {
        fontSize : 25,
        fontWeight : "bold",
        width : '100%',
        textAlign : "center"
        
    },
    txtHlder : {
        width : '100%',
        
    },
    imgsHlder : {
        width : 200,
        height : 150,
        marginTop : 50
    },
    imghlder :{
        width : '100%',
        height : '100%'
    }
})
const mapStateToProps = ({user}) => ({
    user
})
export default connect(mapStateToProps)(Explor)
