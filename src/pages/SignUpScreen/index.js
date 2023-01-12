import React, {onPress, useEffect, useState} from 'react';
import {Text, View, Button, TextInput, ImageBackground, StyleSheet, Image, Pressable, TouchableOpacity, onChangeText, Modal, Alert} from 'react-native';
import imageLogo from '../../assets/images/Artboard1.png';
import { auth } from '../../../firebase';
import { createUserWithEmailAndPassword, updateProfile, getAuth, updatePhoneNumber } from 'firebase/auth';
import firestore from '@react-native-firebase/firestore';
import LinearGradient from 'react-native-linear-gradient';

const SignUpScreen = ({navigation}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [username, setUserName] = useState('')
  const [email, setEmail] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [password, setPassword] = useState('')
  const [password2, setPassword2] = useState('')

  const handleSignUp = () => {
    createUserWithEmailAndPassword(auth, email, password)
    .then((userCredentials)  => {
      const user = userCredentials.user;
      //uploadData(user.uid);
      firestore().collection('users').doc(user.uid)
      .set({
        user_nama: username, 
        user_email: email, 
        user_phone: phoneNumber, 
        user_alamat: '', 
        user_photoURL: null
      })
      .catch(error => {console.log('Something went wrong with added user to firestore: ', error)})

      const authentication = getAuth();
      updateProfile(authentication.currentUser, {
        displayName: username,
        photoURL: 'https://firebasestorage.googleapis.com/v0/b/elondry-3f70e.appspot.com/o/IconProfil.png?alt=media&token=40505de9-47ea-4733-9513-f499fe175369',
      }).then(() => {
        updatePhoneNumber(authentication.currentUser)
        console.log(auth);
        navigation.replace('SignIn');
      }).catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode);
        console.log(errorMessage);
      });
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log(errorCode);
      console.log(errorMessage);
    });

  };

  // const handleSetting = () => {
  //   setDetails({from_signUp: true, user_username: username, user_email: email, user_phoneNumber: phoneNumber});
  //   console.log();
  // };

  return (
    <View style={styles.container}>
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
              <Text style={{color: 'black'}}>Apakah anda sudah yakin?</Text>
            </View>
            <TouchableOpacity 
              style={{backgroundColor: '#0083FF', width: 100, alignItems: 'center', borderRadius: 50, paddingVertical: 3}}
              onPress={() => {
                if(password == password2){
                  handleSignUp()
                }
                else{
                  Alert.alert("Kedua password tidak cocok!")
                }
              }}
              >
              <Text style={{color: 'white'}}>Ya</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={{borderWidth: 1, width: 100, alignItems: 'center', borderRadius: 50, borderColor: 'grey',paddingVertical: 3}}
              onPress={() => setModalVisible(false)}
              >
              <Text>Tidak</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <LinearGradient 
        style={{flex: 1.5, borderRadius: 30, justifyContent: 'center', bottom: 20, paddingTop: 20}}
        colors={['#5879CF', '#50bcfc']}
        start={{x: -1, y: 1}} end={{x: 1, y: 1}}
      >
        <Pressable style={{flex: 4, alignItems: 'center', justifyContent: 'center'}}>
          <Image 
            source = {imageLogo}
            style = {{height: 80, width: 65}}
          />
          <Text style={{fontSize: 25, fontFamily: 'Poppins', fontWeight: 'bold', color: 'white', marginTop: 20}}>E-Londry</Text>
        </Pressable> 
        <View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-around', alignItems: 'flex-end', align: 'center', paddingHorizontal: 20}}>
          <View style={styles.markerContainer}>
            <Pressable 
              onPress = {() => navigation.push('SignIn')}
            >
                <Text style={styles.headText}>Masuk</Text>
            </Pressable>
          </View>
          <View style={styles.markerContainer}>
            <Text style={styles.headText}>Daftar</Text>
            <View style={styles.bottomMarker}></View>
          </View>
        </View>
      </LinearGradient>

      <View style={{flex: 4, paddingHorizontal: 40, justifyContent: 'center',}}>
        <View style={{flex: 3, marginTop: 20,}}>
          <Text style={styles.inputText}>Username</Text>
          <TextInput 
            style={styles.inputLog}
            value={username}
            onChangeText={text => setUserName(text)}
          />
          <Text style={styles.inputText}>Email</Text>
          <TextInput 
            style={styles.inputLog}
            value={email}
            onChangeText={text => setEmail(text)}
          />
          <Text style={styles.inputText}>Nomor Telepon</Text>
          <TextInput 
            style={styles.inputLog}
            value={phoneNumber}
            onChangeText={text => setPhoneNumber(text)}
          />
          <Text style={styles.inputText}>Kata Sandi</Text>
          <TextInput 
            style={styles.inputLog}
            value={password}
            onChangeText={text => setPassword(text)}
          />
          <Text style={styles.inputText}>Konfirmasi Kata San</Text>
          <TextInput 
            style={styles.inputLog}
            value={password2}
            onChangeText={text => setPassword2(text)}
          />
        </View>
        <View style={{flex: 0.8 }}>
          <LinearGradient
              style={{borderRadius: 30}}
              colors={['#5879CF', '#50bcfc']}
              start={{x: -1, y: 1}} end={{x: 1, y: 1}}
          >
          <TouchableOpacity 
            style={{
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 30,
              width: 'auto',
              height: 70,
              fontFamily: 'arial',
              fontWeight: 'bold',
              color: 'white'
            }}
            onPress={() => {setModalVisible(true);}}
            >
            
            <Text style={{color: 'white', fontWeight: 'bold', fontSize: 15}}>Sign Up</Text>
          </TouchableOpacity>
          </LinearGradient>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#F2F3F5',
  },
  paragraph: {
    margin: 24,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  headText: {
    fontFamily: 'Arial',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: 'white'
  },
  markerContainer: {
    alignItems: 'center'
  },
  bottomMarker: {
    backgroundColor: 'white',
    borderRadius: 100,
    width: 100,
    height: 3
  },
  inputLog: {
    borderBottomColor: 'black',
    borderBottomWidth: 1,
    marginTop: 0,
    marginBottom: 0,
  },
  inputText: {
    color: 'gray',
    fontSize: 15,
    fontWeight: 'bold',
    marginTop: 10,
  }
});

export default SignUpScreen;