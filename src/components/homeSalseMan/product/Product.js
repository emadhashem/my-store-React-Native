import React, { useState, useEffect } from 'react'
import { View, StyleSheet, Text , ScrollView, ActivityIndicator, Modal} from 'react-native'
import { Header, Icon, Button, Input, Image } from 'react-native-elements'
import { TouchableOpacity } from 'react-native';
import {v4 , v5} from 'uuid'
import { addFromCamera, deleteSomePhoto} from '../../../helpers/commonFuntions';
import { auth, db } from '../../../services/firebase';
import { FlatList } from 'react-native-gesture-handler';

const Product = ({navigation , route}) => {
    //console.warn(route.params.prs)
    // const {imgs , prName , prPrice , description , id , add} = route.params;
    const prNameProp = route.params.prName ? route.params.prName : '';
    const prPriceProp = route.params.prPrice ? route.params.prPrice : '';
    const imgsProp = route.params.imgs ? route.params.imgs : [];
    const descriptionProp = route.params.description ? route.params.description : '';
    const idProp = route.params.id ? route.params.id : ''
    const add = route.params.add ? "add" : null
    const prsProp = route.params.prs ? route.params.prs : []
    const [imgs , setImgs] = useState(imgsProp);
    const [prName , setPrName] = useState(prNameProp);
    const [prPrice , setPrPrice] = useState(prPriceProp);
    const [description , setDescription] = useState(descriptionProp)
    const [loading , setLoading] = useState(false)
    useEffect(() => {
        setLoading(false);
    } , [imgs])
    const MakeImg = ({uri , id}) => {
        return (
            <View 
            style = {{margin : 5 , width : 50 , height : 110 , 
            }} 
            key = {id}>
                <Image 
                containerStyle = {{width : '100%' , height : '80%'}} source = {{uri : uri}} />
                <TouchableOpacity
                onPress = {() => deletePhoto(id) }
                style = {{width : '100%' , height  : '20%'}}>
                    <Icon name = "remove" type = "font-awesome"/>
                </TouchableOpacity>
            </View>
        )
    }
    const addMorePhoto = () => {
        setLoading(true)
        let id = v4();
        addFromCamera(`product/${auth.currentUser.uid}/${prName}/${id}`)
        .then(uri => {
            
            return uri
        })
        .then(uri => {
            setImgs([...imgs, {uri , id}])
            return uri
        }).then((uri) => {
            console.warn(uri)
        }).catch(e => {
            console.warn(e)
        })
    }
    const deletePhoto = (id) => {
        let path = `product/${auth.currentUser.uid}/${prName}/${id}`;
        let arr = [...imgs].filter(item => {
            return item.id !== id;
         })
         setImgs(arr);
         deleteSomePhoto(path);
    }
    const update = async (prs) => {
        let prsNew = await prs.map(item => {
            if(item.id == idProp) {
                // console.warn({imgs , prName , prPrice , description , id : idProp})
                return ({imgs , prName , prPrice , description , id : idProp})
                
            } else return item
        })
        return prsNew
    } 
    const remove = async (prs) => {
        let prsNew = prs.filter(item => {
            if(item.id != idProp) return item
        })
        return prsNew
    }
    const postProduct = () => { 
        
        if(add == 'add') {
            db.collection('product').doc(auth.currentUser.uid).set(
                {
                 prs :  [...(route.params.prs) ,  {imgs , prName , prPrice , description , id : v4()}]
                })
                 .then(() => navigation.navigate('profile'))
             .catch(e => console.warn(e + 'from set2'))
        } else {
            update(prsProp).then(prs => {
                db.collection('product').doc(auth.currentUser.uid)
                .set({
                    prs : prs
                })
            })
            .then(() => navigation.navigate('profile'))
        }

    } 
    return (
        <View style = {{flex : 1}}>
            {
                (loading === true) ? (
                    <Modal > 
                        <View style = {{flex : 1 , justifyContent : 'center' , alignItems : 'center'}}>
                            <Text>
                                Wait a minut
                            </Text>
                            <ActivityIndicator size = "large" />
                        </View>
                    </Modal>
                ) : (
                    null
                )
            }
            <Header 
                containerStyle = {{height : 70}}
                backgroundColor = "rgba(0,0,0,.3)"
                leftComponent = {<Button 
                    buttonStyle = {{backgroundColor : 'transparent' , marginBottom : 25}}
                    onPress = {() => {navigation.pop()}}
                    icon = {<Icon color = 'white' size = {39} name = "arrow-back" type = "material"/>} />}
                    rightComponent = {
                        <Button title =  {(add == 'add') ? "Post" : 'Update'}
                        onPress = {() => postProduct()}
                         buttonStyle = {{marginBottom : 25 , 
                            borderColor : 'transparent',
                            backgroundColor : "rgba(0,0,0,.5)" ,}} type = "outline"
                         titleStyle = {{color : "white"}}
                         />
                    }
                    centerComponent = {
                        (add == null) ? (
                            <Button title = "Remove" 
                            onPress = {() => {
                                remove(prsProp).then(prs => {
                                    db.collection('product').doc(auth.currentUser.uid)
                                    .set({
                                        prs : prs
                                    })
                                }).then(() => {
                                   deleteSomePhoto(`product/${auth.currentUser.uid}/${prNameProp}`)
                                }).then(() => {
                                    navigation.navigate('profile')
                                })
                            }}
                            buttonStyle = {{marginBottom : 25 , 
                                backgroundColor : "red"
                            }} />
                        ) : (
                            null
                        )
                    }
            />
            <View style = {styles.inputContainer}>
                <View style = {{flexDirection : "row" , justifyContent : 'space-between'}}>
                   <View style = {{width : '50%'}}>
                        <Text style = {{fontWeight : 'bold' , fontSize : 15 , textAlign : "center"}}>
                            Product Name
                        </Text>
                        <Input containerStyle = {styles.input}
                        value = {prName}
                            onChangeText = {(t) => setPrName(t)}
                        />
                   </View>
                    <View style = {{width : '50%'}}>
                        <Text style = {{fontWeight : 'bold' , fontSize : 15 , textAlign : "center"}}>
                            Product Price
                        </Text>
                        <Input containerStyle = {styles.input}
                        value = {prPrice}
                            onChangeText = {(t) => setPrPrice(t)}
                        />
                    </View>
                </View>
                <View>
                    <Text style = {{fontWeight : 'bold' , fontSize : 25 , textAlign : "center"}}>
                        Give Description
                    </Text>
                    <Input containerStyle = {styles.input}
                        value = {description}

                        onChangeText = {(t) => setDescription(t)}
                        multiline = {true}
                    />
                </View>
                <View style = {{height : '30%' , }}>
                    <Button 
                        containerStyle = {{ marginTop : 'auto'}}
                        onPress = {() => addMorePhoto()}
                        title = {(imgs.length == 0) ? "Add Photos" : "Add more Photos"}
                        titleStyle = {{marginHorizontal : 5}}
                        icon = {<Icon name = "camera" type = "feather" color = "white" />} type = "solid"/>
                <View style = {{flex : 1 ,}}>
                    <FlatList 
                        numColumns = {3}
                        data = {imgs}
                        renderItem = {({item}) => {
                            return (
                                <MakeImg key = {item.id} {...item}/>
                            )
                        }}
                        keyExtractor = {item => item.id}
                    />
                </View>
                </View>
            </View> 
        </View>
    )
}
const styles = StyleSheet.create({
    inputContainer : {
        flex : 1,
        justifyContent : "space-around",
        
    } , 
    input : {
        width : '100%',
        height : 50
    }

})
export default Product
