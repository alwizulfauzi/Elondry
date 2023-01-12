import React, {onPress, useEffect, useState} from 'react';
import {Text, View, Button, TouchableOpacity} from 'react-native';
import { db } from '../../../firebase';
import { collection, addDoc, getFirestore, doc, Firestore, getDocs } from 'firebase/firestore';
import firestore from '@react-native-firebase/firestore'

  // const alovelaceDocumentRef = collection(db, 'users');
  // const data = await getDocs(alovelaceDocumentRef)
  // console.log(data.docs.map((doc) => ({...doc.data(), id: doc.id})))
  // try {
  //   const docRef = addDoc(collection(db, "users"), {
  //     first: "Alan",
  //     middle: "Mathison",
  //     last: "Turing",
  //     born: 1912
  //   });
  
  //   console.log("Document written with ID: ", docRef.id);
  // } catch (e) {
  //   console.error("Error adding document: ", e);
  // }

const BookingScreen = ({navigation}) => {
  // const [users, setUsers] = useState([]);

  // const docREF = collection(db, "users");

  // const uploading = async () => {
  //   console.log(users)
  //   await setDoc(doc(citiesRef, "SF"), {
  //     name: "San Francisco", state: "CA", country: "USA",
  //     capital: false, population: 860000,
  //     regions: ["west_coast", "norcal"] });
  //   const querySnapshot = await getDocs(collection(db, "users"));
  //   querySnapshot.forEach((doc) => {
  //     console.log(`${doc.id} => ${doc.data()}`);
  //   });
  // }

  function onResult(QuerySnapshot) {
    console.log('Got Users collection result.');
  }
  
  function onError(error) {
    console.error(error);
  }
  
  const tampil = firestore().collection('users').onSnapshot(onResult, onError);
  console.log(tampil)

  // useEffect(() => {
  //   const uploading = async () => {
  //     const data = await getDocs(docREF);
  //     setUsers(data.docs.map((doc) => ({...doc.data(), id: doc.id})))
  //   }
  //   uploading();
  // }, [])

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>
            Pilih Tanggal Order :
        </Text>
        <Button title='Upload' 
        onPress={() => navigation.pop()}
        />
  </View>
  );
}

export default BookingScreen;