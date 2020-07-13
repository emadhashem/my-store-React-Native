import React, { useState, useEffect } from 'react'
import { View, Text, TouchableOpacity, FlatList, Dimensions, TextInput } from 'react-native'
import { auth, db } from '../../services/firebase';
import {creatThread} from '../../helpers/commonFuntions'
import {v4} from 'uuid';
import { Header, Button, Icon, Avatar} from 'react-native-elements';
import { connect } from 'react-redux';
const pic = 'https://cdn1.iconfinder.com/data/icons/user-pictures/100/unknown-512.png'
const heightD = Dimensions.get('window').height;
const widthD = Dimensions.get('window').width;
const tst = [
    'omda',
    'omda',
    'omda',
    'omda',
    'omda',
    'omda',
    'omda',
    'omda',
    'omda',
    'omda',
    'omda',
    'omda',
    'omda',
    'omda',
    'omda',
    'omda',
    'omda',
    'omda',
    'omda',
    'omda',
    'omda',
    'omda',
    'omdafvdfvd',
    
]
const ChatRoom = ({navigation , route , user}) => {
    const uid2 = route.params.userId;
    const uid1 = user;
    const [thread , setThread] = useState(creatThread(uid1 , uid2) + '');
    const [msgs , setMsgs] = useState([])
    const [uid2Img , setUid2Img] = useState(pic)
    const [uid1Img , setUid1Img] = useState(pic)
    const [msg , setMsg] = useState('')
    const [uid2Name , setUid2Name] = useState('')
    useEffect(() => {
        check().then(() => {
            getMsgs();
        }).then(() => {
            db.collection('user').doc(uid2).get()
            .then(doc => {
                if(typeof(doc.data().img) !== 'undefined') {   
                    setUid2Img(doc.data().img + '') 
                }
                setUid2Name(doc.data().uName)
            })
        })
        
    } , [] )
    async function check() {
       await db.collection('chat').doc(thread).get()
        .then(doc => {
            if(doc.exists == false) {
                db.collection('chat').doc(thread).set({
                    msgs : []
                }).catch(e => console.warn(e + 'from chaeck 2'))
            }
        }).catch(e => console.warn(e + 'from check'))
    }
    function getMsgs() {
        try {
            db.collection('chat').doc(thread).onSnapshot(doc => {
                setMsgs([...(doc.data().msgs)])
            })
        } catch(e) {
            console.warn(e + 'from get msgs')
        }
    }
    function sendMsg(msg) {
        db.collection('chat').doc(thread).set({
            msgs : [{id : v4() , msg , sender : uid1} , ...msgs]
        }).catch(e => console.warn(e + 'from send'))
    }
    return (
        <View style = {{flex : 1}}>
            
            <Header 
            containerStyle = {{height : heightD * 0.1 , width : '100%'}}
            backgroundColor = "rgba(0,0,0,.3)"
            >
            <View style = {{flexDirection : 'row' , justifyContent : "space-between" , marginBottom : 15}}>
                <Button 
                type = "clear"
                icon = {<Icon name = "left" type = "antdesign" onPress = {() =>{
                    navigation.pop()
                }} />} />
                <TouchableOpacity
                style = {{flexDirection : 'row' , alignItems : "center" , width : '200%', 
                justifyContent : 'space-around'
                }}
                onPress = {() => {
                    navigation.navigate('profileRvw' , {
                        docId : uid2
                    })
                    console.warn('kfnvodf')
                }}>
                    <Avatar size = {40} source = {{uri : uid2Img}} />
                    <Text style = {{textAlign : 'center',
                    fontSize : 25,
                    color : 'white'
                     
                     }}>{uid2Name}</Text>
                </TouchableOpacity>
            </View>
            </Header>
            <View style = {{flex : 1 , height : heightD * 0.8}}>
            <FlatList 
            inverted
                data = {msgs}
                renderItem = {({item}) => (
                    <View style = {{
                        alignSelf : (item.sender == uid1) ? 'flex-end' : 'flex-start',
                        backgroundColor : (item.sender == uid1) ? '#A9A9A9' : '#DCDCDC',
                        marginVertical : 15,
                        marginHorizontal : 5,
                        borderRadius : 30
                    }}>
                        <Text style = {{alignSelf : 'center' , marginHorizontal : 5, marginVertical : 3}}>
                            {item.msg}
                        </Text>
                    </View>
                )}
                keyExtractor = {(item) => item.id}
            />
            </View>
            <View style = {{ width : widthD , marginBottom : 3 , height : heightD * 0.1 , 
            flexDirection : 'row',
            alignItems : 'center'
            }}>
                <TextInput 
                onChangeText = {(t) => setMsg(t)}
                value = {msg}
                style = {{
                    width : (msg == '') ? widthD : widthD * 0.8,
                    paddingHorizontal : 5,
                    alignSelf : "flex-start",
                    borderColor : 'rgba(0,0,0,.5)',
                    borderWidth : .6,
                    height : '100%',
                   borderRadius : 50,
                   paddingHorizontal : 15
                }}
                placeholder = "Send..." />
               {
                   (msg == '') ? null : (
                    <Button
                    onPress = {() => {
                        sendMsg(msg);
                        setMsg('')
                    }}
                    type = "clear" icon = {<Icon size = {35} name = "send" type = "feather" />} 
                        containerStyle = {{marginLeft : 8}}
                    />
                   )
               }
            </View>
        </View>
    )
}
const mapStateToProps = ({user}) => ({
    user
})
export default connect(mapStateToProps)(ChatRoom)
