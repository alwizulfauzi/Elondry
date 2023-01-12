import React, {useState, useEffect, useCallback} from 'react'
import { View, Text, StyleSheet, TextInput, ScrollView, TouchableOpacity, Image, Pressable, Modal, Alert, RefreshControl, Platform } from 'react-native'
import iconArrowBack from '../../assets/icons/iconArrowBack.png';
import iconProfil from '../../assets/icons/iconProfil.png';
import { auth } from '../../../firebase';
import { getAuth, updateProfile } from 'firebase/auth'
import { db } from '../../../firebase';
import { collection, doc, getDocs, updateDoc } from 'firebase/firestore/lite';
//import ImagePicker from 'react-native-image-crop-picker';
import storage from '@react-native-firebase/storage';
import firestore from '@react-native-firebase/firestore'
import { utils } from '@react-native-firebase/app';
import LinearGradient from 'react-native-linear-gradient';

const wait = (timeout) => {
  return new Promise(resolve => setTimeout(resolve, timeout));
}

const EditAccountScreen = ({navigation}) => {
  const [refreshing, setRefreshing] = useState(false);
  const [userInfo, setUserInfo] = useState([])
  const [modalVisible, setModalVisible] = useState(false);
  const [image, setImage] = useState(null)
  const [userName, setUserName] = useState(auth.currentUser.displayName)
  const [userAddress, setUserAddress] = useState(null)
  const [userEmail, setUserEmail] = useState('')
  const [userPhone, setUserPhone] = useState(null)
  const [userPassword, setUserPassword] = useState(null)
  const [userPassword2, setUserPassword2] = useState(null)
  const [docID, setDocID] = useState('')
  const [userData, setUserData] = useState(null);
  const [setted, setSetted] = useState(null);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    wait(2000).then(() => setRefreshing(false));
  }, []);

  const getUser = async() => {
    try {
      const currentUser = await firestore()
      .collection('users')
      .doc(auth.currentUser.uid)
      .get()
      .then((documentSnapshot) => {
        if(documentSnapshot.exists) {
          //console.log('User Data', documentSnapshot.data());
          setUserData(documentSnapshot.data());
          setUserPhone(userData.user_phone);
          setUserAddress(userData.user_alamat);
        }
      })
    } catch (e) {
      console.log(e);
    }
  }

  useEffect(() => {
    getUser();
  }, [refreshing]);

  const handleUpdate = async() => {
    let imgUrl = await uploadImage();

    if( imgUrl == null && userData.userImg ) {
      imgUrl = userData.userImg;
    }

    firestore()
    .collection('users')
    .doc(auth.currentUser.uid)
    .update({
      user_nama: userName, 
      user_phone: userPhone, 
      user_alamat: userAddress, 
      user_photoURL: imgUrl
    })
    .then(() => {
      const authentication = getAuth();
      updateProfile(authentication.currentUser, {
        displayName: userName,
        photoURL: imgUrl,
      })
      // if(userPassword != null){
      //   if(userPassword == userPassword2){
      //     updatePassword(user, userPassword2).then(() => {
      //       // Update successful.
      //     }).catch((error) => {
      //       console.log(error)
      //       // An error ocurred
      //       // ...
      //     });
      //   } else{Alert.alert('Kedua password tidak cocok!')}
      // }
      console.log('User Updated!');
      Alert.alert(
        'Profile Updated!',
        'Your profile has been updated successfully.'
      );
    })
  }

  const uploadImage = async () => {
    if( image == null ) {
      return null;
    }
    const uploadUri = image;
    let filename = uploadUri.substring(uploadUri.lastIndexOf('/') + 1);

    // Add timestamp to File Name
    const extension = filename.split('.').pop(); 
    const name = filename.split('.').slice(0, -1).join('.');
    filename = name + Date.now() + '.' + extension;

    const storageRef = storage().ref(`photos/${filename}`);
    const task = storageRef.putFile(uploadUri);

    try {
      await task;

      const url = await storageRef.getDownloadURL();

      setImage(null);

      // Alert.alert(
      //   'Image uploaded!',
      //   'Your image has been uploaded to the Firebase Cloud Storage Successfully!',
      // );
      return url;

    } catch (e) {
      console.log(e);
      return null;
    }

  };

  // const takeFromCamera = () => {
  //   ImagePicker.openCamera({
  //     width: 300,
  //     height: 300,
  //     cropping: true,
  //   }).then(image => {
  //     //console.log(image);
  //     const imageUri = Platform.OS === 'ios' ? image.sourceURL : image.path;
  //     setImage(imageUri);
  //   });
  // }

  // const takeFromLibrary = () => {
  //   ImagePicker.openPicker({
  //     width: 300,
  //     height: 300,
  //     cropping: true
  //   }).then(image => {
  //     //console.log(image);
  //     const imageUri = Platform.OS === 'ios' ? image.sourceURL : image.path;
  //     setImage(imageUri);
  //     setModalVisible(false);
  //   });
  // }

    // const getInfo = () => {
  //   const userData = userInfo.find(obj => {return obj.user_email = auth.currentUser.email})
  //   var displayTemp = userData.user_phone
  //   setUserPhone(displayTemp)
  //   console.log(displayTemp)
  //   setDisplayName(displayTemp)
  // };

  // const updateHandler = async () => {
  //   const authentication = getAuth();
  //   updateProfile(authentication.currentUser, {
  //     displayName : userName,
  //   })
  //   const userData = userInfo.find(obj => {return obj.user_email == auth.currentUser.email})
  //   setDocID(userData.id)
  //   const userDoc = doc(db, 'users', docID)
  //   await updateDoc(userDoc, {
  //     user_nama: userName,
  //     user_phone: userPhone,
  //     user_alamat: userAddress
  //   })
  //   await uploadImage();
  // }

  // const consoleDebug = () => {
  //   const userCheck = userInfo.find(obj => {return obj.user_email == auth.currentUser.email})
  //   console.log(userCheck)
  // }

  // const handleUploadStorage = async () => {
  //   const uploadUri = image;
  //   const reference = storage().ref('testing.png');
  //   try{
  //     await reference.putFile(uploadUri);
  //   }catch(e){
  //     console.log(e);
  //   }

    // const mountainsRef = ref(storage, 'Artboard1.png');
    // const mountainImagesRef = ref(storage, '/files/test2.png');
    // const metadata = {
    //   contentType: 'image/jpeg',
    // };
    // const img = await fetch(iconProfil);
    // console.log(img)
    // const bytes = await img.blob
    // console.log(bytes)
    // const uploadTask = () => {
    //   uploadBytes(mountainImagesRef, iconProfil, metadata)
    // }  
    // uploadTask();

  // const uploadImage = async () => {
  //   if (image == null){
  //     return null
  //   }
  //   const uploadUri = image;
  //   const reference = storage().ref('/profile/profil1.png');
  //   const task = reference.putFile(uploadUri);
  //   try{
  //     await task;
  //     const url = await reference.getDownloadURL();
  //       const authentication = getAuth();
  //       console.log(authentication.currentUser.photoURL)
  //       await updateProfile(authentication.currentUser, {
  //         photoURL : url,
  //       })
  //       console.log(authentication.currentUser.photoURL);
  //     setImage(null);
  //   }catch(e){
  //     console.log(e);
  //     return null;
  //   }
  // }

  return (
    <ScrollView style={{flex: 1 }}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
        />
      }
    >
      <LinearGradient
        colors={['#5879CF', '#50bcfc']}
        start={{x: -1, y: 1}} end={{x: 1, y: 1}}
      >
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert("Dibatalkan");
          setModalVisible(!modalVisible);
        }}
      >
        <View style={{alignSelf: 'center', top: '35%'}}>
          <View style={{width: 250, height: '45%', justifyContent: 'space-evenly', alignItems: 'center', backgroundColor: 'white', borderRadius: 20, elevation: 10,}}>
            <View style={{backgroundColor: '#EEEEEE', width: '80%', height: '28%', alignItems: 'center', justifyContent: 'center', borderRadius: 50, paddingVertical: 5}}>
              <Text style={{color: 'black'}}>Pilih Gambar Dari</Text>
            </View>
            <TouchableOpacity 
              style={{backgroundColor: '#0083FF', width: 100, alignItems: 'center', borderRadius: 50, paddingVertical: 3}}
              onPress={() => takeFromCamera()}
              >
              <Text style={{color: 'white'}}>Kamera</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={{borderWidth: 1, width: 100, alignItems: 'center', borderRadius: 50, borderColor: 'grey',paddingVertical: 3}}
              onPress={() => takeFromLibrary()}
              >
              <Text>Galeri</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={{borderWidth: 1, width: 100, alignItems: 'center', borderRadius: 50, borderColor: 'grey',paddingVertical: 3}}
              onPress={() => setModalVisible(false)}
              >
              <Text>Kembali</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <View style={styles.container}>
        <View style={{flexDirection: 'row'}}>
          <Pressable onPress={() => navigation.push('Utama')}>
            <Image source={iconArrowBack} style={{width: 30, height: 30}}/>
          </Pressable>
          <Text style={{color: 'white', paddingVertical: 5, paddingHorizontal: 10}}>Edit Account</Text>
        </View>
        <View style={{alignItems: 'center', paddingVertical: 20}}>
          <Pressable 
            //onPress={() => handleUploadStorage()}
          >
            <Text style={{color: 'white', fontSize: 20, paddingBottom: 10, fontWeight: 'bold'}}>Profile Image</Text>
          </Pressable>
          <View style={{borderRadius: 100, justifyContent: 'center'}}>
            <Image 
              source={{uri: image ? image : auth.currentUser.photoURL}} 
              style={{width: 80, height: 80, borderRadius: 100, borderWidth: 2, borderColor: 'white'}}
            />
          </View>
          <TouchableOpacity onPress={() => setModalVisible(true)}>
            <Text style={{color: 'white', paddingTop: 5}}>Ganti</Text>
          </TouchableOpacity>
        </View>
        <Text style={[styles.textTitle, {marginTop: 25}]}>Nama</Text>
        <TextInput 
          style={styles.textBox} 
          defaultValue = {userData ? userData.user_nama : ''}
          value={userName}
          onChangeText={text => setUserName(text)}
        />
        <Text style={styles.textTitle}>Alamat</Text>
        <TextInput 
          style={styles.textBox} 
          defaultValue={userAddress ? userAddress : ''}
          value={userAddress}
          onChangeText={text => setUserAddress(text)}
        />
        <Text style={styles.textTitle}>Email</Text>
        <TextInput style={styles.textBox} defaultValue = {auth.currentUser.email}/>
        <Text style={styles.textTitle}>Nomor Telepon</Text>
        <TextInput 
          style={styles.textBox} 
          defaultValue = {userPhone ? userPhone : ''}
          value={userPhone}
          onChangeText={text => setUserPhone(text)}
        />
        {/* <Text style={styles.textTitle}>Password</Text>
        <TextInput 
          style={styles.textBox}
          value={userPassword}
          onChangeText={text => setUserPassword(text)}
        />
        <Text style={styles.textTitle}>Confirm Password</Text>
        <TextInput 
          style={styles.textBox}
          value={userPassword2}
          onChangeText={text => setUserPassword2(text)}
        /> */}
        <TouchableOpacity style={{width: '50%', height: '5%', backgroundColor: 'white', borderRadius: 20, justifyContent: 'center',alignItems: 'center', alignSelf: 'center', marginTop: 50, marginBottom: 110, elevation: 5}}
          onPress={() => {
              handleUpdate()
          }}
        >
          <Text>Simpan</Text>
        </TouchableOpacity>
      </View>
      </LinearGradient>
    </ScrollView>
)}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    padding: 20,
  },
  textBox: {
    backgroundColor: 'white',
    borderRadius: 15,
    paddingHorizontal: 20,
    paddingVertical: 15,
    alignSelf: 'center',
    width: '100%',
    marginBottom: 15,
    elevation: 5
  },
  textTitle: {
      color: 'white',
      marginBottom: 10
  }
})


export default EditAccountScreen;
