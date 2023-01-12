import React, {onPress, useState, useEffect} from 'react';
import {Text, View, Button, StyleSheet, Image, Pressable, TouchableOpacity, ScrollView, Platform, FlatList} from 'react-native';
import iconArrowBack from '../../assets/icons/iconArrowBack.png';
import notifIcon from '../../assets/icons/notifications_none.png';
import iconRegular from '../../assets/icons/iconRegular.png';
import arrowChevron from '../../assets/icons/arrowChevron.png';
import { db } from '../../../firebase';
import { collection, getDocs } from 'firebase/firestore/lite';
import firestore from '@react-native-firebase/firestore';
import MapView, { Marker } from 'react-native-maps';
import LinearGradient from 'react-native-linear-gradient';

const OrderDetails = ({navigation, route}) => {
  const { order_id } = route.params;
  const [posts, setPosts] = useState(null);
  const [orders, setOrders] = useState([]);
  const [detail, setDetail] = useState([])
  const docRef = collection(db, 'orders');
  const [loading, setLoading] = useState(true);
  const [pin, setPin] = useState({
    region: null,
    marker: null
  },
  );
  const [setted, setSetted] = useState(null)

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
              jenis_order,
              tanggal_order,
              alamat_order,
              email_user,
              koordinat_latitude,
              koordinat_longitude,
              berat_order,
              biaya_order,
              totalBiaya_order,
              order_status
            } = doc.data();
            list.push({
              id: doc.id,
              tipe_layanan: tipe_layanan,
              jenis_order: jenis_order,
              tanggal_order: tanggal_order,
              alamat_order: alamat_order,
              email_user: email_user,
              koordinat_latitude: parseFloat(koordinat_latitude),
              koordinat_longitude: parseFloat(koordinat_longitude),
              berat_order: berat_order,
              biaya_order: biaya_order,
              totalBiaya_order: totalBiaya_order,
              order_status: order_status
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

  useEffect(() => {
    getDetails();
  }, [posts]);

  useEffect(() => {
    try {
      setPin({
        region: {
          latitude: detail.koordinat_latitude,
          longitude: detail.koordinat_longitude,
          latitudeDelta: 0.0050,
          longitudeDelta: 0.0060,
        }
      })
      //console.log(pin);
    } catch (e) {
      console.log(e);
    }
    if(pin.region != null){
      setSetted('Yes');
    }
  }, [detail]);

  const getDetails = async () => {
    try {
      const userData = await posts.find(obj => {return obj.id == order_id});
      setDetail(userData);
      // const latNum = parseFloat(detail.koordinat_latitude)
      // console.log(typeof detail.koordinat_latitude)
    } catch (e) {
      console.log(e);
    }
  }

  return (
    <ScrollView style={{ flex: 1}}>
      <LinearGradient 
        colors={['#5495E1', '#36D7D7']}
        start={{x: 1, y: 1}} end={{x: -1, y: 1}}
      >
      <Pressable onPress={() => navigation.pop()}>
        <Image source={iconArrowBack} style={{ position: 'absolute', width: 30, height: 30, top: 35, left: 20}} />
      </Pressable>
      <View style={{justifyContent: 'center', alignItems: 'center', padding: 10}}>
        <Text style={styles.pageTitle}>Detail Pesanan</Text>
        <View style={{marginTop: 50, width: '95%'}}>
          <Text style={styles.detailText}>Rincian : </Text>
          <View style={{backgroundColor: 'white', borderRadius: 20, padding: 25}}>
            <Text style={styles.innerText}>Status : {detail.order_status}</Text>
            <Text style={styles.innerText}>ID Pesanan : {detail.id}</Text>
            <Text style={styles.innerText}>pendingMessageCountMap : {detail.email_user}</Text>
            <Text style={styles.innerText}>Tipe Layanan : {detail.tipe_layanan}</Text>
            <Text style={styles.innerText}>Jenis Order : {detail.jenis_order}</Text>
            <Text style={styles.innerText}>Tanggal Order : {detail.tanggal_order}</Text>
            <Text style={styles.innerText}>Alamat : {detail.alamat_order}</Text>
          </View>
        </View>
      </View>

      <View style={{justifyContent: 'center', alignItems: 'center', padding: 10}}>
        <View style={{width: '95%'}}>
          <Text style={styles.detailText}>Lokasi Di Map : </Text>
          <View style={{backgroundColor: 'white', borderRadius: 20, overflow: 'hidden'}}>
            { 
              setted && <MapView
                loadingEnabled
                style={{width: 350, height: 300, borderRadius: 50}}
                initialRegion={pin.region}
                >
                  <Marker coordinate={pin.region}/>
              </MapView>
            }
          </View>
        </View>
      </View>

      <View style={{justifyContent: 'center', alignItems: 'center', padding: 10}}>
        <View style={{width: '95%'}}>
          <Text style={styles.detailText}>Biaya : </Text>
          <View style={{backgroundColor: 'white', borderRadius: 20, padding: 20}}>
            <Text style={styles.innerText}>Berat : {detail.berat_order} Kg</Text>
            <Text style={styles.innerText}>Biaya : Rp. {detail.biaya_order},-</Text>
            <Text style={styles.innerText}>Total Biaya : Rp. {detail.berat_order * detail.biaya_order},-</Text>
          </View>
        </View>
      </View>
      </LinearGradient>
    </ScrollView>
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
    fontSize: 23,
    fontWeight: 'bold',
    top: 23
  },
  mainBox: {
    flex: 1,
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
    paddingRight: 70
  },
  orderStatus: {
    color: '#0083FF'
  },
  detailText: {
    color: 'white',
    marginBottom: 10,
    fontWeight: 'bold'
  },
  innerText: {
    color: 'black',
    marginBottom: 15,
    borderBottomWidth: 1,
    borderColor: '#CFCFCF',
    paddingBottom: 10
  }
});

export default OrderDetails;
