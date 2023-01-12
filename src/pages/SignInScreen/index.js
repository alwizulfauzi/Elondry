import React, {onPress, useEffect, useState} from 'react';
import {Text, View, Button, TextInput, ImageBackground, StyleSheet, Image, Pressable, TouchableOpacity, KeyboardAvoidingView, Alert} from 'react-native';
import imageLogo from '../../assets/images/Artboard1.png';
import { auth } from '../../../firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import LinearGradient from 'react-native-linear-gradient';

const SignInScreen = ({navigation}) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      if(user){
        navigation.replace("Utama")
      }
    })

    return unsubscribe;
  }, [])

  const handleSignIn = () => {
    signInWithEmailAndPassword(auth, email, password)
    .then((userCredentials)  => {
      const user = userCredentials.user;
      console.log(user.uid);
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log(errorCode);
      console.log(errorMessage);
    });
  }

  return (
    <View style={styles.container}>
      <LinearGradient 
        style={{flex: 2, backgroundColor: '#0083FF', borderRadius: 30, justifyContent: 'center', bottom: 20, paddingTop: 20}}
        colors={['#5879CF', '#50bcfc']}
        start={{x: -1, y: 1}} end={{x: 1, y: 1}}
      >
        <View style={{flex: 4, alignItems: 'center', justifyContent: 'center'}}>
          <Image 
            source = {imageLogo}
            style = {{height: 80, width: 65}}
          />
          <Text style={{fontSize: 25, fontFamily: 'Poppins', fontWeight: 'bold', color: 'white', marginTop: 20}}>E-Londry</Text>
        </View> 
        <View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-around', alignItems: 'flex-end', align: 'center', paddingHorizontal: 20}}>
          <View style={styles.markerContainer}>
            <Text style={styles.headText}>Masuk</Text>
            <View style={styles.bottomMarker}></View>
          </View>
          <View style={styles.markerContainer}>
            <Pressable 
              onPress = {() => navigation.push('SignUp')}
            >
              <Text style={styles.headText}>Daftar</Text>
            </Pressable>
          </View>
        </View>
      </LinearGradient>

      <View style={{flex: 4, paddingHorizontal: 40, justifyContent: 'center',}}>
        <View style={{flex: 3, marginTop: 20,}}>
          <Text style={styles.inputText}>Username atau Email</Text>
          <TextInput 
            style={styles.inputLog}
            value={email}
            onChangeText={text => setEmail(text)}
          >
          </TextInput>

          <Text style={styles.inputText}>Kata Sandi</Text>
          <TextInput 
            style={styles.inputLog}
            value={password}
            onChangeText={text => setPassword(text)}
            secureTextEntry
          >
          </TextInput>
          <TouchableOpacity onPress={() => Alert.alert("Silahkan kontak pihak CS untuk mengganti password", "Contact Person : 081324547472")}>
            <Text style={{marginTop: 20, fontFamily: 'arial', fontSize: 17, fontWeight: 'bold', color: '#0083FF'}}>Lupa Kata Sandi?</Text>
          </TouchableOpacity>
        </View>
          <View style={{flex: 1}}>
            <LinearGradient
              style={{borderRadius: 30}}
              colors={['#5879CF', '#50bcfc']}
              start={{x: -1, y: 1}} end={{x: 1, y: 1}}
            >
            <TouchableOpacity style={{
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 30,
              width: 'auto',
              height: 70,
              fontFamily: 'arial',
              fontWeight: 'bold',
              color: 'white'
              }}
              onPress={handleSignIn}
              >
              <Text style={{color: 'white', fontWeight: 'bold', fontSize: 15}}>Masuk</Text>
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
    backgroundColor: '',
    borderRadius: 100,
    width: 100,
    height: 3
  },
  inputLog: {
    borderBottomColor: 'black',
    borderBottomWidth: 1,
    marginTop: 5,
    marginBottom: 10,
  },
  inputText: {
    color: 'gray',
    fontSize: 15,
    fontWeight: 'bold',
    marginTop: 20,
  }
});

export default SignInScreen;