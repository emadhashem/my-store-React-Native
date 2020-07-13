import * as permissions from 'expo-permissions'
import * as imagePicker from 'expo-image-picker'
import { db, storage } from '../services/firebase'
const _getPermission = async () => {
    let {status} = await permissions.getAsync(permissions.CAMERA_ROLL)
    if(status == 'granted') console.warn('good')
    else console.warn('not good')
}
const getPermission = async () => {
    let {status} = await permissions.getAsync(permissions.CAMERA)
    if(status == 'granted') console.warn('good')
    else console.warn('not good')
}
const TakePhotoCamera = async () => {
    getPermission();
    let {granted} = await imagePicker.getCameraPermissionsAsync();
    if(granted== true) {
        let res = await imagePicker.launchCameraAsync({
            allowsEditing : true,
            aspect : [4 , 3],
            mediaTypes : "All"
        });
        if(res.cancelled) return;
        return res.uri;
    } else {
        alert('permission not accepted')
    }
}
const uploadImg = async (uri , path = '') => {
    let res = await fetch(uri)
    let blob = await res.blob();
    let ref = storage.ref().child(path)
    return ref.put(blob);
}
const downloadImg = (path) => { 
    return storage.ref().child(path).getDownloadURL();

}
const TakePhotoGallery  = async () => {
    _getPermission()
    let {granted} = await imagePicker.getCameraRollPermissionsAsync();
    if(granted== true) {
        let res = await imagePicker.launchImageLibraryAsync({
            allowsEditing : true,
            aspect : [4 , 3],
            mediaTypes : "All"
        });
        if(res.cancelled) return;
        return res.uri;
    } else {
        alert('permission not accepted')
    }
}
export const addFromCamera = async (path = '') => {
    let uri = await TakePhotoCamera();
    let up = await uploadImg(uri , path).then(() => {
        console.warn('uplaod is done')
    }).catch(e => console.warn('upload failed'))
    return downloadImg(path);
}
export const addFromGallery  = async (path = '') => {
    let uri = await TakePhotoGallery();
    let up = await uploadImg(uri , path).then(() => {
        console.warn('uplaod is done')
    }).catch(e => console.warn('upload failed'))
    return downloadImg(path);
}
export const deleteSomePhoto = (path) => {
    storage.ref().child(path).delete()
    .then(() => alert('delete is done'))
    //.catch(e => console.warn(e))
}
export const contain = (txt = '' , oTxt = '') => {
    return (txt.toLowerCase().trim()).includes((oTxt.toLowerCase().trim()))
}
export const creatThread = (uid1 = '' , uid2 = '') => {
    if(uid1 < uid2) return uid1 + uid2
    else return uid2 + uid1;
}