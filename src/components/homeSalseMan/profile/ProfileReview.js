import React, { useEffect, useState } from 'react'
import { View, Text, FlatList, SafeAreaView,  } from 'react-native'
import { db, auth } from '../../../services/firebase';
import { Header , Button, Icon, Avatar, Image } from 'react-native-elements';
import { TouchableOpacity } from 'react-native';


const pic = 'https://cdn1.iconfinder.com/data/icons/user-pictures/100/unknown-512.png'
const numberOfCol = 3;
const ProfileReview = ({navigation , route}) => {
    const {docId} = route.params
    const [prs , setPrs] = useState([]);
    const [uName , setUName] = useState('');
    const [storeName , setStoreName] = useState('');
    const [email , setEmail] = useState('');
    useEffect(() => {
        db.collection('user').doc(docId).get()
        .then(doc => {
            setEmail(doc.data().email)
            setStoreName(doc.data().storeName)
            setUName(doc.data().uName)
        })
        db.collection('product').doc(docId).get()
        .then(doc => doc.data().prs)
        .then(prs => setPrs([...prs]))
    } , [])
    const ViewProduct = ({item}) => {
        return (
            <View style = {{flex : 1 , width : '100%' , 
            height : '100%' , margin : 5 , backgroundColor : 'rgba(0,0,0,.3)' ,
            borderRadius : 15

            }}>
                <TouchableOpacity>
                    <View style = {{height : '20%'}}>
                        <Text style = {{textAlign : 'center' , fontWeight : 'bold' , color : 'white'}}>{item.prName}</Text>            
                    </View>
                    <View style = {{height : '80%'}}>
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
    return (
        <View style = {{flex : 1}}>
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
                            <Avatar size = "large" source = {{uri : pic}} />
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
                                type = "clear"
                                icon = {<Icon size = {35} name = "user-follow" type = "simple-line-icon"/>} />
                            </View>
                        </View>
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
                            <SafeAreaView style = {{width : '33%'  , margin : 5 , height : 160}}>
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

export default ProfileReview
