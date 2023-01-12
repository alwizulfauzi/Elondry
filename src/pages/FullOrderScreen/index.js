import React, {onPress, useState, useEffect} from 'react';
import {Text, View, Button, StyleSheet, Image, Pressable, TouchableOpacity, ScrollView, Platform, FlatList} from 'react-native';
import iconArrowBack from '../../assets/icons/iconArrowBack.png';
import notifIcon from '../../assets/icons/notifications_none.png';
import iconRegular from '../../assets/icons/iconRegular.png';
import arrowChevron from '../../assets/icons/arrowChevron.png';
import { db } from '../../../firebase';
import { collection, getDocs } from 'firebase/firestore/lite';
import firestore from '@react-native-firebase/firestore';
import LinearGradient from 'react-native-linear-gradient';

const FullOrders = ({navigation}) => {
  const [posts, setPosts] = useState(null);
  const [orders, setOrders] = useState([]);
  const docRef = collection(db, 'orders');
  const [loading, setLoading] = useState(true);

  const fetchPosts = async () => {
    try {
      const list = [];

      await firestore()
        .collection('orders')
        .get()
        .then((querySnapshot) => {
          // console.log('Total Posts: ', querySnapshot.size);

          querySnapshot.forEach((doc) => {
            const {
              tipe_layanan,
              jenis_order
            } = doc.data();
            list.push({
              id: doc.id,
              tipe_layanan: tipe_layanan,
              jenis_order: jenis_order
            });
          });
        });

      setPosts(list);

      if (loading) {
        setLoading(false);
      }

      //console.log('Posts: ', posts);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <LinearGradient 
      style={{ backgroundColor: '#0083FF', flex: 1}}
      colors={['#5495E1', '#36D7D7']}
      start={{x: 1, y: 1}} end={{x: -1, y: 1}}
    >
      <Pressable onPress={() => navigation.replace('Utama')}>
        <Image source={iconArrowBack} style={{ position: 'absolute', width: 30, height: 30, top: 51, left: 20}} />
      </Pressable>
      <View style={{justifyContent: 'center', alignItems: 'center', padding: 10}}>
        <Text style={styles.pageTitle}>Status Pemesanan</Text>
        <View style={{backgroundColor: 'white', borderRadius: 20, marginTop: 40, padding: 30}}>
          <FlatList
            data={posts}
            renderItem={({item}) => (
              <Pressable onPress={() => navigation.push('OrderDetails', {order_id : item.id})}>
                <View style={{flexDirection: 'row', justifyContent: 'space-evenly'}}>
                  <Text style={styles.orderID}>ID Pemesanan: #{item.id}</Text>
                  <Text style={styles.orderStatus}>Pesanan Diterima</Text>
                </View>
              </Pressable>
            )}
            keyExtractor={(item) => item.id}
          />
        </View>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  iconMain: {
    width: 40,
    height: 40
  },
  textIconMain: {
    fontFamily: 'Roboto'
  },
  pageTitle: {
    color: 'white',
    fontSize: 25,
    fontWeight: 'bold',
    marginHorizontal: 30,
    marginVertical: 40,
    top: 55
  },
  mainBox: {
    flex: 0,
    backgroundColor: 'white',
    borderRadius: 15,
    paddingHorizontal: 20,
    paddingVertical: 12,
    marginBottom: 10
  },
  orderOptions: {
    color: 'black',
    paddingVertical: 15
  },
  orderID: {
    //color: '#55D9E1'
    marginBottom: 15,
    paddingRight: 70,
    fontSize: 15
  },
  orderStatus: {
    color: '#0083FF',
    fontSize: 15
  }
});

export default FullOrders;
