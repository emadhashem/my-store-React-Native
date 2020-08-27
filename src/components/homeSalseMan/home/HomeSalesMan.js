import React, { useEffect, useState } from 'react'
import { View, Text, FlatList, Image, Modal, StyleSheet } from 'react-native'
import { Header, Icon, Avatar, Card, Button } from 'react-native-elements'
import { TouchableOpacity } from 'react-native-gesture-handler'
import firebase from 'firebase/app'
import {db} from '../../../services/firebase'
import { connect } from 'react-redux'
const HomeSalesMan = ({navigation , user = ''}) => {
    const [prs , setPrs] = useState([])
    const [openModalProduct , setOpenModalProduct] = useState(false)
    const [productData , setProductdata] = useState()
    useEffect(() => {
        db.collection('user').doc(user).collection('following').get()
        .then(docs => {
            docs.forEach(doc => {
                db.collection('follow').doc(user + doc.id).get()
                .then(fDoc => {
                    if(fDoc.exists) {
                        db.collection('product').doc(doc.id).get()
                        .then(doc => {
                            let arr = [];
                            if(doc.exists) {
                                db.collection('user').doc(doc.id).get()
                                .then(docId => {
                                    fill(doc.id , doc.data().prs , docId.data()).then(arr => {
                                        setPrs([...prs , ...arr])
                                    })
                                })
                            }
                        })
                    }
                    
                })
            })
        })
        return () => setPrs([])
    } , [])
    const fill = async (owner , arr = [] , data = {}) => {
        let ret = await arr.map(item => {
            return Object.assign(item , {owner} , data)
        })
        return ret
    }
    const openProduct = async (item) => {
        setProductdata(item)
    }
    // this how to add a new element to arr without get whole arr
    const addToCart = () => {
        db.collection('cart').doc(user).update({
            carts : firebase.firestore.FieldValue.arrayUnion({
                ...productData, owner : productData.owner, ownerData : {
                    uName : productData.uName,email : productData.email, 
                    storeName : productData.storeName, img : productData.img
                }
            })
        }).catch(e => alert(e))
    }
    // console.warn(productData.imgs)
    return (
        <View style = {{flex : 1}}>
            <Header
                backgroundColor = "transparent"
                leftComponent = {<TouchableOpacity
                    onPress = {() => navigation.toggleDrawer()}>
                    <Icon  size = {30} name = "menu"  type = "feather"/>
                    </TouchableOpacity>}
                centerComponent = {
                    <View style = {{marginBottom : 15}}>
                        <Text style = {{fontSize : 25 , letterSpacing : 3 , color : "gray"}}>Explor</Text>
                        <Icon color = "rgba(0,0,0,.5)" name = "explore" type = "material" size = {30} />
                    </View>
                }
            />
            {
                (openModalProduct == true) ? (
                    <Modal
                        transparent = {true}
                        animationType = "slide"
                    >
                        <View style = {{flex : 1  , backgroundColor : "rgba(0,0,0,.8)" , height : '100%'}}>
                            <Header 
                                leftComponent = {<Button
                                    titleStyle = {{fontSize : 20}} 
                                    containerStyle = {{width : '100%'}}
                                    title = "back" onPress = {() => setOpenModalProduct(false)}/>}
                                    leftContainerStyle = {{width : '150%'}}
                            />
                            <View style = {{flex : 1 , marginTop : 15 , padding : 15}}>
                                <View style = {{flexDirection : 'row' , 
                                justifyContent : 'space-between' , alignItems : 'center'}}>
                                    <View
                                    style = {{flexDirection : 'row' , alignItems : 'center'}}>
                                        <Avatar
                                        onPress = {() => {
                                            setOpenModalProduct(false)
                                            navigation.navigate('profileRvw' , {
                                                docId : productData.owner
                                            })
                                        }}
                                        size = 'small' source = {{uri : productData.img}} rounded />
                                        <Text 
                                       onPress = {() => {
                                        setOpenModalProduct(false)
                                        navigation.navigate('profileRvw' , {
                                            docId : productData.owner
                                        })
                                    }}
                                        style = {[styles.colorTxt , {marginLeft : 5}]}>
                                            {productData.uName}
                                        </Text>
                                    </View>
                                    <View>
                                        <Text style = {styles.colorTxt}>
                                            {productData.storeName}
                                        </Text>
                                    </View>
                                </View>
                                <View style = {{marginTop : 15}}>
                                    <Text style = {[styles.colorTxt , {textAlign : 'center'}]}>
                                        {productData.description}
                                    </Text>
                                    <View style = {{marginTop : 15}}>
                                        
                                        <Text style = {[styles.colorTxt , {textAlign : 'center'}]}>
                                            {productData.prName}
                                        </Text>
                                        <Text style = {[styles.colorTxt , {textAlign : 'center'}]}>
                                            {productData.prPrice} L.E
                                        </Text>
                                    </View>
                                </View>
                                <View style = {{marginTop : 50 , flex : 1}}>
                                    <FlatList 
                                        horizontal = {true}
                                        data = {productData.imgs}
                                        renderItem = {({item}) => {
                                            return (
                                                <Card containerStyle = {{height : 120 , width : 140 , padding : 0 , borderWidth : 0}}>
                                                    <Image style = {{height : '100%' , width : '100%'}} 
                                                    source = {{uri : item.uri}}/>
                                                </Card>
                                            )
                                        }}
                                        keyExtractor = {item => item.id}
                                    />
                                </View>   
                            </View>
                            <Button title = "Add to Cart"onPress = {() => addToCart()} />
                        </View>
                    </Modal>
                ) : (null)
            }
            <View style = {{marginTop : 5 , flex : 1 , width : '100%'}}>
                <FlatList 
                    data = {prs}
                    renderItem = {({item}) => {
                        return (
                            <Card containerStyle = {{width : '90%' , height : 250 , 
                                  borderRadius : 50
                            }}>
                               <View style = {{flexDirection : "row" , justifyContent : "space-between"}}>
                                    <View style = {{width : '70%' ,
                                        alignItems : 'center',
                                        flexDirection : 'row'
                                    }}>
                                        <Avatar
                                        onPress = {() => {
                                            setOpenModalProduct(false)
                                            navigation.navigate('profileRvw' , {
                                                docId : item.owner
                                            })
                                        }}
                                        size = "medium" rounded source = {{uri : item.img}}/>
                                        <Text
                                            onPress = {() => {
                                                setOpenModalProduct(false)
                                                navigation.navigate('profileRvw' , {
                                                    docId : item.owner
                                                })
                                            }}
                                            style = {{fontSize : 15 , fontWeight : 'bold' , marginLeft : 10}}
                                        >{item.uName}</Text>
                                    </View>
                                   <View>
                                        <Text style = {{textAlign : 'center'}}>
                                            {item.prName}
                                        </Text>
                                        <Text style = {{textAlign : 'center'}}>
                                            {item.prPrice} L.E
                                        </Text> 
                                    </View>
                               </View>
                               <TouchableOpacity style = {{
                                   marginTop : 10,
                                   width : '100%',
                                   height : '90%'
                               }}
                               onPress = {() => {openProduct(item).then(() => setOpenModalProduct(true))}}
                               >
                                   {
                                       (item.imgs.length > 0) ? (
                                           <View style = {{flexDirection : 'row' , alignItems : 'center',
                                           justifyContent : 'space-between'
                                           }}>
                                               <Image
                                                style = {{width : '50%' , height : 130 , borderRadius : 15}}
                                               source = {{uri : item.imgs[0].uri}} />
                                               <Text style = {{fontWeight : 'bold'}}>
                                                   {item.description}
                                               </Text>
                                           </View>
                                       ) :
                                       (
                                           <Text style = {{fontWeight : 'bold'}}>
                                               {item.description}
                                           </Text>
                                       )
                                   }
                               </TouchableOpacity>
                            </Card>
                        )
                    }}
                    ItemSeparatorComponent = {() => (
                    <View style = {{height : 10 ,}}></View>)}
                    keyExtractor = {item => item.id}
                />
            </View>
        </View>
    )
}
const styles = StyleSheet.create({
    colorTxt : {
        color : 'white'
    }
})
const mapStateToProps = ({user}) => ({user})
export default connect(mapStateToProps)(HomeSalesMan)
