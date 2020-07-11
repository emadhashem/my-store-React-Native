import React, { useState, useEffect } from 'react'
import { View, Text } from 'react-native'
import { auth, db } from '../../services/firebase';
import {creatThread} from '../../helpers/commonFuntions'
import {v4} from 'uuid';
const ChatRoom = ({navigation , route}) => {
    const uid2 = route.params.userId;
    const uid1 = auth.currentUser.uid;
    const [thread , setThread] = useState('');
    const [msgs , setMsgs] = useState([])
    useEffect(() => {
        setThread(creatThread(uid1 , uid2))
        check();
        getMsgs();
    } , [] )
    function check() {
        db.collection('chat').doc(thread).get()
        .then(doc => {
            if(doc.exists == false) {
                db.collection('chat').doc(thread).set({
                    msgs : []
                })
            }
        }).catch(e => console.warn(e + 'from check'))
    }
    function getMsgs() {
        db.collection('chat').doc(thread).onSnapshot(doc => {
            setMsgs([...(doc.data().msgs)])
        })
    }
    function send(msg) {
        db.collection('chat').doc(thread).set({
            msgs : [...msgs , {id : v4() , msg}]
        }).catch(e => console.warn(e + 'from send'))
    }
    return (
        <View>
            <Text>
                this the ChatRoom
            </Text>
        </View>
    )
}

export default ChatRoom
