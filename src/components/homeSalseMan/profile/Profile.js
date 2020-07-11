import React, { useState, useEffect } from 'react'
import { View, Text , TouchableOpacity, StyleSheet , ScrollView, Modal} from 'react-native'
import { Header , Icon, Avatar, Button, Input, Image} from 'react-native-elements'
import { db, auth } from '../../../services/firebase';
import { SafeAreaView } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
// import {  } from 'react-native-vector-icons/Icon'
const Profile = ({navigation}) => {
    const [prs , setPrs] = useState([])
    useEffect(() => {
        db.collection('product').doc(auth.currentUser.uid)
        .get().then(doc => {
            if(doc.exists !== true) {
                db.collection('product').doc(auth.currentUser.uid)
                .set({prs : []})
                .catch(e => alert(e + 'from useffect 2 '))
            } else {
                db.collection('product').doc(auth.currentUser.uid)
                .onSnapshot(doc => setPrs([...(doc.data().prs)]))
            }
        }).catch(e => alert(e + 'from useffect 1 '))
    } , [])
    const MakeProduct = ({imgs = [] , prName , prPrice , description , id = ''}) => {
        console.warn(imgs[0].uri)
        return <TouchableOpacity 
        onPress = {() => updateProduct(imgs , prName , prPrice , description , id)}
        style = {{width : '100%' , height : '100%'}}>
            {
                (imgs.length == 0) ? (
                    <Text style = {{textAlign : "center"}}>
                        {description}
                    </Text>
                ) : 
                    
                    (
                        
                        <View>
                            <Text style = {{textAlign : "center" , fontWeight : 'bold'}}>
                                {prPrice}$
                            </Text>
                            <Image containerStyle = {{width : '100%' , height: '100%'}} source = {{uri : imgs[0].uri}} />
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
    return (
        <ScrollView contentContainerStyle = {{flex : 1 ,}}>
            <Header
                backgroundColor = "transparent"
                containerStyle = {{height : 'auto'}}
                leftComponent = {<TouchableOpacity onPress = {() => navigation.toggleDrawer()}>
                                <Icon name = "menu"  type = "feather"/>
                                </TouchableOpacity>}
                centerComponent = {
                <Text style = {{width : '100%' , fontWeight : 'bold' , 
                fontSize : 30 , textAlign : 'center'}}>
                    User Name
                </Text>}
            />
            <SafeAreaView style = {styles.dataContaainer}>
                <View>
                    <Avatar 
                    size = {150}
                    source = {{
                        uri : 'https://cdn1.iconfinder.com/data/icons/user-pictures/100/unknown-512.png'
                    }} />
                    <Text style = {{textAlign : "center"}}>
                        email@example.com
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
                           20 
                        </Text>
                    </View>
                    <View style = {{width : '33%' , borderRightWidth : 1}}>
                        <Text style = {styles.title}>
                            Followers
                        </Text>
                        <Text style = {styles.number}>
                            56
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
            <View style = {{flex : 1 ,  width : '100%'  , 
            marginTop : 15 , justifyContent: "center"}}>
                <FlatList
                    contentContainerStyle = {{ flex : 1 ,}}
                    data = {prs}
                    numColumns = {3}
                    renderItem = {({item}) => {
                        return (
                            <SafeAreaView style = {{width : '30%'  , margin : 5 , height : 100}}>
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
export default Profile
