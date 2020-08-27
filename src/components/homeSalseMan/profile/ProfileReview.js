import React, { useEffect, useState } from 'react'
import { View, Text, FlatList, SafeAreaView, Modal, StyleSheet, ScrollView,  } from 'react-native'
import { db, auth} from '../../../services/firebase';
import { Header , Button, Icon, Avatar, Image } from 'react-native-elements';
import { TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import firebase from 'firebase/app'

const pic = 'https://cdn1.iconfinder.com/data/icons/user-pictures/100/unknown-512.png'
const numberOfCol = 2;
const ProfileReview = ({navigation , route , user}) => {
    const [img , setImg] = useState(pic)
    const {docId} = route.params
    const [prs , setPrs] = useState([]);
    const [uName , setUName] = useState('');
    const [storeName , setStoreName] = useState('');
    const [email , setEmail] = useState('');
    const [follow , setFollow] = useState(false)
    const [uid1Flrs , setUid1FLrs] = useState(0)
    const [uid1Fling , setUid1Fling] = useState(0)
    const [uid2Flrs , setUid2FLrs] = useState(0)
    const [uid2Fling , setUid2Fling] = useState(0)
    useEffect(() => {
        db.collection('user').doc(docId).get()
        .then(doc => {
            if(typeof(doc.data().img) !== 'undefined') {
                setImg(doc.data().img)
            }
            setEmail(doc.data().email)
            setStoreName(doc.data().storeName)
            setUName(doc.data().uName)
            if(typeof(doc.data().flrs) == 'undefined') {
                db.collection('user').doc(docId).set({
                    flrs : 0
                } , 
                {merge : true}
                )
            } else {
                setUid2FLrs(doc.data().flrs)
            }
            if(typeof(doc.data().fling) == 'undefined') {
                db.collection('user').doc(docId).set({
                    fling : 0
                } , 
                {merge : true}
                )
            } else {
                setUid2Fling(doc.data().fling)
            }
        })
        db.collection('product').doc(docId).get()
        .then(doc => doc.data().prs)
        .then(prs => setPrs([...prs]))
    } , [])
    useEffect(() => {
        db.collection('user').doc(user).get()
        .then(doc => {
            if(typeof(doc.data().flrs) == 'undefined') {
                db.collection('user').doc(user).set({
                    flrs : 0
                } , 
                {merge : true}
                )
            } else {
                setUid1FLrs(doc.data().flrs)
            }
            if(typeof(doc.data().fling) == 'undefined') {
                db.collection('user').doc(user).set({
                    fling : 0
                } , 
                {merge : true}
                )
            } else {
                setUid1Fling(doc.data().fling)
            }
        })
    } , [])
    const [openModalProduct , setOpenModalProduct] = useState(false)
    const [productData , setProductdata] = useState()
    const openProduct = async (item) => {
        await setProductdata(item)
    }
    const ViewProduct = ({item}) => {
        return (
            <View style = {{flex : 1 , width : '100%' , 
            height : '100%' , margin : 5 , backgroundColor : 'rgba(0,0,0,.3)' ,
            borderRadius : 15

            }}>
                <TouchableOpacity onPress = {() => {
                    openProduct(item).then(() => setOpenModalProduct(true))
                }}>
                    <View style = {{height : '20%'}}>
                        <Text style = {{textAlign : 'center' , fontWeight : 'bold' , color : 'white'}}>{item.prName}</Text>            
                    </View>
                    <View style = {{height : '80%' , padding : 5}}>
                        {
                            (item.imgs.length > 0) ? (
                                <Image containerStyle = {{width : '100%' , height : '100%' , }} 
                                
                                source = {{uri : item.imgs[0].uri}} />
                            ) : (
                                <Text>
                                    {item.description}
                                </Text>
                            )
                        }
                    </View>
                </TouchableOpacity>
            </View>
        )
    }
    const addFollowToColl = (followId) => {
        console.warn(followId)
        db.collection('user').doc(user).collection('following').doc(followId).set({})
    }
    useEffect(() => {
        db.collection('follow').doc(user + docId).get()
        .then(doc => setFollow(doc.exists))
    } , [])
    // this how to add a new element to arr without get whole arr
    const addToCart = () => {
        db.collection('cart').doc(user).update({
            carts : firebase.firestore.FieldValue.arrayUnion({
                ...productData, owner : docId, ownerData : {
                    uName,email, storeName, img
                }
            })
        }).catch(e => alert(e))
    }
    return (
        <View style = {{flex : 1}}>
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
                                    <ScrollView contentContainerStyle = {styles.imgsHlder} horizontal = {true}>
                                    {
                                        productData.imgs.map((item , i) => (
                                            <Image containerStyle = {styles.imghlder}
                                            source = {{uri : item.uri}}
                                            
                                            />
                                        ))
                                    }
                                    </ScrollView>
                                    <View>
                                        <Button title = "Add to Cart" onPress = {() => addToCart()} />
                                    </View>
                            </View>
                        </View>
                        

                    </Modal>
                )
            }

            <View >
                <Header 
                backgroundColor = "transparent">
                    <Button
                    type = "clear"
                    icon = {<Icon name = "left" type = "antdesign" onPress = {() => navigation.pop()} />} />
                    <Text style = {{
                        textAlign : "center" , fontWeight : 'bold' , 
                        fontSize : 20 , width : '100%'
                        }}>
                        {storeName}
                     </Text>
                     <Button
                     onPress = {() => navigation.navigate('chatroom' , {
                         userId : docId
                     })}
                     type = "clear" icon = {<Icon name = "chat" type = "entypo"/>} />
                </Header>
                <View>
                    <View style = {{flexDirection : "row" , justifyContent : 'space-between'}}>
                        <View style = {{flexDirection : "row" , alignItems : "center" , marginLeft : 10}}>
                            <Avatar size = "large" source = {{uri : img}} rounded/>
                            <View style = {{marginLeft : 10}}>
                                <Text style = {{fontWeight : 'bold' , marginBottom : 15}}>
                                    {uName}
                                </Text>
                                <Text>
                                    {email}
                                </Text>
                            </View>
                        </View>
                        <View style = {{marginRight : 15}}>
                            <View  style = {{ marginTop : 15}}>
                                <Button
                                onPress = {() => {
                                    if(follow) {
                                        setFollow(false)
                                        db.collection('follow').doc(user + docId).delete()
                                        .then(() => {
                                            setUid2FLrs(uid2Flrs - 1)
                                            db.collection('user').doc(docId).set({
                                                flrs : uid2Flrs - 1
                                            } , {merge : true})
                                        }).then(() => {
                                            setUid1Fling(uid1Fling - 1)
                                            db.collection('user').doc(user).set({
                                                fling : uid1Fling - 1
                                            } , {merge : true})
                                        })
                                        .catch(e => console.warn(e + 'from unfollow'))
                                    } else {
                                        setFollow(true)
                                        db.collection('follow').doc(user + docId).set({})
                                        .then(() => {
                                            setUid2FLrs(uid2Flrs + 1)
                                            db.collection('user').doc(docId).set({
                                                flrs : uid2Flrs + 1
                                            } , {merge : true})
                                        }).then(() => {
                                            setUid1Fling(uid1Fling + 1)
                                            db.collection('user').doc(user).set({
                                                fling : uid1Fling + 1
                                            } , {merge : true})
                                        })
                                        .then(() => addFollowToColl(docId))
                                        .catch(e => console.warn(e + 'from follow'))
                                    }
                                }}
                                type = "clear"
                                icon = {(follow == true) ? (
                                    <Icon size = {35} name = "user-following" type = "simple-line-icon"/>
                                ) : (
                                    <Icon size = {35} name = "user-follow" type = "simple-line-icon"/>
                                )
                            
                            } />
                            </View>
                        </View>
                    </View>
                </View>
                <View style = {{ flexDirection : "row",
                                width : '100%',
                                marginVertical  : 20,
                                }}>
                    <View style = {{width : '49%' , borderRightWidth : 1}}>
                            <Text style = {{fontWeight : 'bold', textAlign : "center"}}>
                                Following
                            </Text>
                            <Text style = {{textAlign : 'center'}}>
                                {uid2Fling}
                            </Text>
                        </View>
                        <View style = {{width : '49%'}}>
                            <Text style = {{fontWeight : 'bold', textAlign : "center"}}>
                                Followers
                            </Text>
                            <Text style = {{textAlign : 'center'}}>
                                {uid2Flrs}
                            </Text>
                        </View>
                </View>
            </View>
            <View style = {{flex : 1 , marginTop : 15}}>
                <FlatList
                // horizontal = {true}
                numColumns = {numberOfCol}
                    data = {prs}
                    renderItem = {({item}) => {
                        return (
                            <SafeAreaView style = {{width : '45%'  , margin : 5 , height : 160}}>
                                <ViewProduct item = {item} />
                            </SafeAreaView>
                        )
                    }}
                    keyExtractor = {(item) => item.id}
                />
            </View>
            
        </View>
    )
}
const styles = StyleSheet.create({
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
export default connect(mapStateToProps)(ProfileReview)
