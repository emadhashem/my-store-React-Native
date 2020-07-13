import React, { useState, useEffect } from 'react'
import { View, Text , TouchableOpacity, StyleSheet , ScrollView, Modal, ActivityIndicator} from 'react-native'
import { Header , Icon, Avatar, Button, Input, Image} from 'react-native-elements'
import { db, auth } from '../../../services/firebase';
import { SafeAreaView } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import { connect } from 'react-redux';
import { addFromCamera, addFromGallery } from '../../../helpers/commonFuntions';
const pic = 'https://cdn1.iconfinder.com/data/icons/user-pictures/100/unknown-512.png'
const Profile = ({navigation , user}) => {
    const [prs , setPrs] = useState([])
    const [ProfileImg , setProfileImg] = useState(pic);
    const [openModal , setOpenModal] = useState(false)
    const [email , setEmail] = useState('')
    const [uName , setUName] = useState('')
    const [loading , setLoading] = useState(false)
    const [flrs , setFlrs] = useState(0)
    const [fling , setFling] = useState(0)
    useEffect(() => {
        db.collection('product').doc(user + "")
        .get().then(doc => {
            if(doc.exists !== true) {
                db.collection('product').doc(user + "")
                .set({prs : []})
                .catch(e => alert(e + 'from useffect 2 '))
            } else {
                db.collection('product').doc(user + "")
                .onSnapshot(doc => {
                    setPrs([...(doc.data().prs)])
                })
            }
        }).then(() => getProfileImg())
        .catch(e => alert(e + 'from useffect 1 '))
    } , [])
    useEffect(() => {
        db.collection('user').doc(user).get()
        .then(doc => {
            // console.warn(doc.data().flrs)
            setFlrs(doc.data().flrs)
            setFling(doc.data().fling)
        })
    } , [])
    const MakeProduct = ({imgs = [] , prName , prPrice , description , id = ''}) => {
        return <TouchableOpacity 
        onPress = {() => updateProduct(imgs , prName , prPrice , description , id)}
        style = {{width : '100%' , height : '100%' }}>
            {
                (imgs.length == 0) ? (
                    <View>
                        <Text style = {{textAlign : "center" , fontWeight : 'bold'}}>
                            {prPrice}$
                         </Text>
                        <View style = {{backgroundColor : 'rgba(0,0,0,.5)' , width : '100%' , 
                                height : '100%', borderRadius : 15, padding : 5
                            }} >
                            <Text style = {{ alignSelf: 'center' , color : 'white'}}>
                                {description}
                            </Text>
                        </View>
                    </View>
                ) : 
                    
                    (
                        
                        <View>
                            <Text style = {{textAlign : "center" , fontWeight : 'bold'}}>
                                {prPrice}$
                            </Text>
                            <Image containerStyle = {{width : '100%' , height: '100%'
                            , borderRadius : 15
                        }} source = {{uri : imgs[0].uri}} />
                        </View>

                    )
                
            }
        </TouchableOpacity>
    }
    const updateProduct = (imgs , prName , prPrice , description , id) => {
        alert('u can change any thing in the product but u cant change the name')
        alert('if u want change the name delete it, then add it agian with new one')
        navigation.navigate('product' , {
            imgs , prName , prPrice , description , id , prs
        })
    }
    const getProfileImg = () => {
        db.collection('user').doc(user + '').get()
        .then(doc => {
            if(typeof(doc.data().img) !== 'undefined') {
                setProfileImg(doc.data().img)
            }
            setEmail(doc.data().email)
            setUName(doc.data().uName)
        });
    }
    const takeProfileImg_Camera = () => {
        let path = `profile/${user}`
        setLoading(true);
        addFromCamera(path).then(uri => {
            setProfileImg(uri)
            return uri
        }).then(uri=> {
            db.collection('user').doc(user + '').set({
                img : uri
            } , {merge : true})
            setLoading(false)
        }) 
    }
    const takeProfileImg_Gallery = () => {
        let path = `profile/${user}`
        setLoading(true);
        addFromGallery(path).then(uri => {
            setProfileImg(uri)
            return uri
        }).then(uri=> {
            db.collection('user').doc(user + '').set({
                img : uri
            } , {merge : true})
            setLoading(false)
        }) 
    }
    return (
        <ScrollView contentContainerStyle = {{flex : 1}}>
            {
                (openModal == true) ? (
                    <Modal transparent = {true} animationType = "slide">
                        
                        <View style = {{backgroundColor : 'rgba(0,0,0,.5)' , width : '100%' , height : '100%' , 
                            justifyContent : 'center' , alignItems : 'center'
                        }}>
                            <Button 
                            containerStyle = {{marginBottom : 30}}
                            onPress = {() => setOpenModal(false)}
                            title = "Cancle" />
                            <View style = {{
                                justifyContent : 'space-around' , alignItems : 'center' , 
                                 flexDirection : 'row',
                                width : '100%'
                                }}>
                                <Button 
                                onPress = {() => {
                                    takeProfileImg_Camera()
                                }}
                                containerStyle = {{margin : 5}}
                                 icon = {<Icon color = "white" name = "camera" type = "evilicon" />} />
                                <Button 
                                onPress = {() => takeProfileImg_Gallery()}
                                containerStyle = {{margin : 5}}
                                 icon = {<Icon color = "white" name = "photo-library" type = "material" />} />
                            </View>
                        </View>
                    </Modal>
                ) : (null)
            }
            {
                (loading == true) ? ( 
                    <Modal>
                        <View style = {{flex : 1 , justifyContent : 'center',
                            alignItems : 'center'
                        }}>
                            <Text>Wait a moment for uploadIng the pic</Text>
                            <ActivityIndicator size = "large" />
                        </View>
                    </Modal>
                ) : (null)
            }
            <Header
                backgroundColor = "transparent"
                containerStyle = {{height : 'auto'}}
                leftComponent = {<TouchableOpacity onPress = {() => navigation.toggleDrawer()}>
                                <Icon name = "menu"  type = "feather"/>
                                </TouchableOpacity>}
                centerComponent = {
                <Text style = {{width : '100%' , fontWeight : 'bold' , 
                fontSize : 30 , textAlign : 'center'}}>
                    {uName}
                </Text>}
                rightComponent = {
                    <TouchableOpacity onPress = {() => {
                        setOpenModal(true)
                    }}>
                        <Text 
                        
                        style = {{textDecorationLine : 'underline'}}>
                            ChangePic 
                        </Text>
                    </TouchableOpacity>
                }

            />
            <SafeAreaView style = {styles.dataContaainer}>
                <View>
                    <Avatar 
                    rounded
                    size = {150}
                    source = {{
                        uri : ProfileImg
                    }} />
                    <Text style = {{textAlign : "center"}}>
                        {email}
                    </Text>
                </View>
                <View style = {{borderWidth : .5 , width : '90%' , marginTop : 15 , marginBottom : 15}}>

                </View>
                <View style = {styles.infodata}>
                    <View style = {{width : '33%' , borderRightWidth : 1}}>
                        <Text style = {styles.title}>
                            Following
                        </Text>
                        <Text style = {styles.number}>
                           {fling}
                        </Text>
                    </View>
                    <View style = {{width : '33%' , borderRightWidth : 1}}>
                        <Text style = {styles.title}>
                            Followers
                        </Text>
                        <Text style = {styles.number}>
                            {flrs}
                        </Text>
                    </View>
                    <View style = {{width : '33%' , }}>
                        <Text style = {styles.title}>
                            Rate
                        </Text>
                        <Text style = {styles.number}>
                            3.5
                        </Text>
                    </View>
                </View>
                <View style = {{width : '80%' }}>
                    <TouchableOpacity style = {{backgroundColor : 'gray' , borderRadius : 50 }}
                        onPress = {() => navigation.navigate('product' , {prs : prs , add : 'add'})
                    }
                    >
                        <Text style = {{textAlign : "center" , fontSize : 20 ,color : 'white'}}>
                            ADD PRODUCT
                        </Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
            <View style = {{flex : 1  ,
            marginTop : 15 , justifyContent: "center"}}>
                <FlatList
                    data = {prs}
                    numColumns = {3}
                    renderItem = {({item}) => {
                        return (
                            <SafeAreaView style = {{width : '30%'  , margin : 5 , height : 100 , marginVertical : 25}}>
                                <MakeProduct {...item} />
                            </SafeAreaView>
                        )
                    }}
                />
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    dataContaainer : {
        flex : 1,
        alignItems : "center",
        
    },
    infodata : {
        flexDirection : "row",
        // justifyContent : 'space-between',
        width : '100%',
        marginBottom  : 20,
        // height : 10,
    } ,
    title : {
        fontWeight : 'bold',
        textAlign : "center"
    },
    number : {
        textAlign : 'center'
    }
    
})
const mapStateToProps = ({user}) => ({
    user
})
export default connect(mapStateToProps)(Profile)
