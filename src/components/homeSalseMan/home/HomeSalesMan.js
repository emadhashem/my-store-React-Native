import React, { useEffect, useState } from 'react'
import { View, Text, FlatList, Image } from 'react-native'
import { Header, Icon, Avatar } from 'react-native-elements'
import { TouchableOpacity } from 'react-native-gesture-handler'

import {db} from '../../../services/firebase'
import { connect } from 'react-redux'
const HomeSalesMan = ({navigation , user = ''}) => {
    const [prs , setPrs] = useState([])
    const [ownerImg , setOwnerImg] = useState('')
    const [ownerUName , setOwnerUName] = useState('')
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
                                fill(doc.id , doc.data().prs).then(arr => {
                                    setPrs([...prs , ...arr])
                                })
                            }
                        })
                    }
                    
                })
            })
        })
        return () => setPrs([])
    } , [])
    const fill = async (owner , arr = []) => {
        let ret = await arr.map(item => {
            return Object.assign(item , {owner})
        })
        return ret
    }
     const getOwner = (owner) => {
         db.collection('user').doc(owner).get()
        .then(doc => {
            if(typeof(doc.data().img) !== 'undefined') {
                setOwnerImg(doc.data().img)
            }
            setOwnerUName(doc.data().uName)
        })
    }
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
            <View style = {{marginTop : 5 , flex : 1 , width : '100%'}}>
                <FlatList 
                    data = {prs}
                    renderItem = {({item}) => {
                        getOwner(item.owner)
                        return (
                            <View style = {{width : '100%' , height : 200 , padding : 15,
                            borderTopWidth : 0.6
                            }}>
                               <View style = {{flexDirection : "row" , justifyContent : "space-between"}}>
                                    <View style = {{width : '70%' 
                                     ,
                                        alignItems : 'center',
                                        flexDirection : 'row'
                                    }}>
                                        <Avatar size = "medium" rounded source = {{uri : ownerImg}}/>
                                        <Text
                                            style = {{fontSize : 25 , fontWeight : 'bold' , marginLeft : 10}}
                                        >{ownerUName}</Text>
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
                               }}>
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
                            </View>
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
const mapStateToProps = ({user}) => ({user})
export default connect(mapStateToProps)(HomeSalesMan)
