import React, {useLayoutEffect, useCallback, useEffect, useState} from 'react'
import {StyleSheet, Text, View, Image, TouchableOpacity, Modal, Alert, Pressable} from 'react-native';
import { auth } from '../../../firebase';
import { db } from '../../../firebase';
import { GiftedChat } from 'react-native-gifted-chat';
import { collection, doc, addDoc, setDoc, snap, getDocs, QuerySnapshot} from 'firebase/firestore/lite';
import firestore from '@react-native-firebase/firestore'
import iconArrowBackBlack from '../../assets/icons/iconArrowBackBlack.png';  

const CsScreen = ({navigation}) => {

    const [messages, setMessages] = useState([]);

    useEffect(() => {
      firestore()
      .collection('chats')
      .orderBy('createdAt', 'desc')
      .where('user._id', 'in', [auth?.currentUser?.email, 'csdev@gmail.com'])
      .get()
      .then(querySnapshot => setMessages(
        querySnapshot.docs.map(doc=>({
          _id: doc.data()._id,
          createdAt: doc.data().createdAt.toDate(), 
          text: doc.data().text, 
          user: doc.data().user,
        }))
        
        // querySnapshot.forEach(documentSnapshot => {
        //   console.log('User ID: ', documentSnapshot.id, documentSnapshot.data().text);
        // });
      ))
      //console.log(messages)
    }, [])

    const onSend = useCallback((messages = []) => {
      setMessages(previousMessages => GiftedChat.append(previousMessages, messages))
      const {_id, createdAt, text, user } = messages[0]
      firestore().collection('chats').doc()
      .set({
        _id, 
        createdAt, 
        text, 
        user,
      })
    }, [])


    return (
      <View style={{flex: 1}}>
        <TouchableOpacity style={{position: 'absolute', flex: 1}} onPress={() => navigation.push('Utama')}>
          <Image source={iconArrowBackBlack} style={{top: 28, left: 20, width: 20, height: 20}}/>
        </TouchableOpacity>
        <View style={{flex: 0.1, justifyContent: 'center', alignItems: 'center'}}>
          <Text style={{fontSize: 18, fontWeight: 'bold'}}>Layanan Pelanggan</Text>
        </View>
        <GiftedChat
          alwaysShowSend
          messages={messages}
          onSend={messages => onSend(messages)}
          user={{
            _id: auth?.currentUser?.email,
            name: auth?.currentUser?.displayName,
            avatar: auth?.currentUser?.photoURL
          }}
        />
      </View>
    )
}

export default CsScreen;
