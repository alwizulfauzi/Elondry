import React, {onPress, useContext, useEffect, useRef, useState, useCallback} from 'react';
import {Text, View, Button, StyleSheet, Image, Pressable, DrawerLayoutAndroid, TouchableOpacity, FlatList, RefreshControl, Alert} from 'react-native';
import menuIcon from '../../assets/icons/menu.png';
import notifIcon from '../../assets/icons/notifications_none.png';
import iconCS from '../../assets/icons/iconCS.png';
import iconDryClean from '../../assets/icons/iconDryClean.png';
import iconIroning from '../../assets/icons/iconIroning.png';
import iconRegular from '../../assets/icons/iconRegular.png';
import iconArrowBack from '../../assets/icons/iconArrowBack.png';
import iconProfil from '../../assets/icons/iconProfil.png';
import iconHelp from '../../assets/icons/iconHelp.png';
import iconLogOut from '../../assets/icons/iconLogOut.png';
import { auth } from '../../../firebase';
import { db } from '../../../firebase';
import { signOut } from "firebase/auth";
import { getDocs } from 'firebase/firestore/lite';
import { collection } from 'firebase/firestore/lite';
import firestore from '@react-native-firebase/firestore';
import LinearGradient from 'react-native-linear-gradient';

const wait = (timeout) => {
  return new Promise(resolve => setTimeout(resolve, timeout));
}

const HomeScreen = ({navigation}) => {
  const [refreshing, setRefreshing] = useState(false);
  const [posts, setPosts] = useState(null);
  const [orders, setOrders] = useState([]);
  const [displayName, setDisplayName] = useState({nama: 'Alwi Zulfauzi'});
  const [activate, setActivate] = useState(0);
  // const docRef = collection(db, 'orders');

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    wait(2000).then(() => setRefreshing(false));
  }, []);

  const handleSignOut = async () => {
    await signOut(auth)
    .then((re)=> {
      navigation.replace("SignIn")
    })
    .catch((error)=> {
      const errorMessage = error.message;
      console.log(errorMessage);
    })
  }

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

      //console.log('Posts: ', posts);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [refreshing]);

  const getInfo = () => {
    // const userName = users.find(obj => {return obj.user_email = auth.currentUser.email})
    // var displayTemp = userName.user_nama
    console.log(auth)
    // setDisplayName(displayTemp)
  };

  // useEffect(() => {
  //   const getOders = async () => {
  //     const data = await getDocs(docRef);
  //     setOrders(data.docs.map((doc) => ({...doc.data(), id: doc.id})));
  //   }
  //   getOders();
  // }, []);

  const drawer = useRef(null);

  const navigationView = () => (
    <View style={styles.container}>
      <TouchableOpacity style={{alignSelf: 'flex-end'}} onPress={() => drawer.current.closeDrawer()}>
        <Image source={iconArrowBack} style={{width: 40, height: 40}}/>
      </TouchableOpacity>

      <View>
        <TouchableOpacity style={styles.drawerContainer} onPress={() => {drawer.current.closeDrawer(); navigation.push('EditAkun')}}>
          <Image source={iconProfil} style={styles.drawerIcon}/>
          <Text style={styles.drawerText}>Akun</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.drawerContainer} onPress={() => navigation.push('CsScreen')}>
          <Image source={iconHelp} style={styles.drawerIcon}/>
          <Text style={styles.drawerText}>Bantuan</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.drawerContainer} onPress={handleSignOut}>
          <Image source={iconLogOut} style={styles.drawerIcon}/>
          <Text style={styles.drawerText}>Keluar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

//   const pressHandler = async () => {
//     const querySnapshot = await getDocs(collection(db, "orders"));
//     querySnapshot.forEach((doc) => {
//     // doc.data() is never undefined for query doc snapshots
//     console.log(doc.id, " => ", doc.data());
// });
//   };

  return (
    <DrawerLayoutAndroid
      style={{flex: 1, backgroundColor: '#F2F3F5'}}
      ref={drawer}
      drawerWidth={300}
      renderNavigationView={navigationView}
    >
      <LinearGradient
        colors={['#5879CF', '#50bcfc']}
        start={{x: -1, y: -1}} end={{x: 1, y: 1}}
        style={{
          flex: 1.8,
          borderRadius: 20,
          justifyContent: 'center',
          bottom: 16
        }}
      >
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 55,}}>
          <Pressable onPress={() => drawer.current.openDrawer()}>
            <Image source={menuIcon} style={{width: 40, height: 40}} />
          </Pressable>
          <View style={{borderRadius: 50, width: 80, height: 80, backgroundColor: 'transparent',marginBottom: 10,}}>
            <Image source={{uri: auth.currentUser.photoURL}} style={{width: 80,height: 80, borderRadius: 50, borderWidth: 2, borderColor: 'white'}}/>
          </View>
          <Pressable 
            //onPress={navigation.push('Booking')}
          >
            <Image source={notifIcon} style={{width: 40, height: 40, opacity: 50}} />
          </Pressable>
        </View>
        <View style={{alignItems: 'center', flex: 1}}>
          <Text
            style={{
              color: 'white',
              fontSize: 20,
              fontFamily: 'Lato',
              fontWeight: 'bold',
            }}>
            {auth.currentUser.displayName}
          </Text>
          <Text
            style={{
              color: 'white',
              fontSize: 12,
              fontFamily: 'Lato',
              marginBottom: 50,
            }}>
            {auth.currentUser.email}
          </Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
            paddingTop: 250,
            position: 'absolute',
            paddingHorizontal: 17,
          }}>
          <Pressable style={styles.mainBox} onPress={() => navigation.push('Regular', {serviceType: 'Regular'})}>
            <Image source={iconRegular} style={styles.iconMain}/>
            <Text style={styles.textIconMain}>Reguler</Text>
          </Pressable>
          <Pressable style={styles.mainBox} onPress={() => navigation.push('Regular', {serviceType: 'Dry Clean'})}>
            <Image source={iconDryClean} style={styles.iconMain}/>
            <Text style={styles.textIconMain}>Dry-Clean</Text>
          </Pressable>
          <Pressable style={styles.mainBox} onPress={() => navigation.push('Regular', {serviceType: 'Ironing'})}>
            <Image source={iconIroning} style={{width: 47, height: 30}}/>
            <Text style={styles.textIconMain}>Setrika</Text>
          </Pressable>
          <Pressable style={styles.mainBox} 
            onPress={() => navigation.push('CsScreen')}>
            <Image source={iconCS} style={styles.iconMain}/>
            <Text style={styles.textIconMain}>Pelanggan</Text>
            <Text>Pelayanan</Text>
          </Pressable>
        </View>
      </LinearGradient>

      <View style={{flex: 3, paddingHorizontal: 20}}>
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <Text style={{marginTop: 50, fontSize: 20, fontWeight: 'bold'}}>
            Pesanan Aktif
          </Text>
          <Pressable
            style={{
              marginTop: 50,
              backgroundColor: '#0083FF',
              borderRadius: 50,
              width: 70,
              justifyContent: 'center',
              alignItems: 'center',
            }}
            onPress={() => navigation.push('FullOrders')}
          >
            <Text style={{color: 'white'}}>Lihat Semua</Text>
          </Pressable>
        </View>

        <View style={{ flex: 1, backgroundColor: 'white', borderRadius: 20, marginTop: 20, padding: 20}}>
          {orders.map((order) => {
            return(
              <View style={{flexDirection: 'row', justifyContent: 'space-evenly'}}>
                <Text style={styles.orderID}>Order ID : #{order.id}</Text>
                <Text style={styles.orderStatus}>Order Confirmed</Text>
              </View>
            )
          })}

          <FlatList 
            data={posts}
            renderItem={({item}) => (
              <View style={{flexDirection: 'row', justifyContent: 'space-evenly'}}>
                <Text style={styles.orderID}>ID Pesanan : #{item.id}</Text>
                <Text style={styles.orderStatus}>Pemesanan Diterima</Text>
              </View>
            )}
            keyExtractor={(item) => item.id}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
              />
            }
          />

        </View>
      </View>
    </DrawerLayoutAndroid>
  );
};

const styles = StyleSheet.create({
  mainBox: {
    width: 80,
    height: 100,
    backgroundColor: 'white',
    borderRadius: 10,
    marginHorizontal: 5,
    elevation: 10,
    justifyContent: 'center',
    alignItems: 'center'
  },
  iconMain: {
    width: 40,
    height: 40
  },
  textIconMain: {
    fontFamily: 'Roboto'
  },
  container: {
    flex: 1,
    padding: 30,
    backgroundColor: "#0083FF"
  },
  drawerContainer: {
    paddingTop: 60,
    flexDirection: 'row',
    marginHorizontal: 10,
  },
  drawerText: {
    fontSize: 30,
    fontWeight: 'bold',
    color: 'white'
  },
  drawerIcon: {
    width: 40, 
    height: 40,
    marginRight: 25
  },
  orderID: {
    //color: '#55D9E1'
    marginBottom: 15,
    paddingRight: 70
  },
  orderStatus: {
    color: '#0083FF'
  }
});

export default HomeScreen;
