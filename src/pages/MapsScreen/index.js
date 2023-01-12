import React, {useState, useEffect} from 'react';
import {StyleSheet, Text, View, Image, TouchableOpacity, Modal, Alert} from 'react-native';
import MapView, {Marker} from 'react-native-maps';
import iconArrowBackBlack from '../../assets/icons/iconArrowBackBlack.png';
import { auth } from '../../../firebase';
import { db } from '../../../firebase';
import { addDoc, collection, setDoc, doc } from 'firebase/firestore/lite';
import Geolocation from '@react-native-community/geolocation';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';

Geolocation.setRNConfiguration({
  config: {
    authorizationLevel: 'auto',
    locationProvider: 'auto',
  }}
)

const MapsScreen = ({route, navigation}) => {
  const numberID = 256;
  const orderID = ('001-' + numberID);
  const { pickup_method } = route.params;
  const { order_duration } = route.params;
  const { order_date } = route.params;
  const { service_type } = route.params;
  const [alamat, setAlamat] = useState(null)
  const [modalVisible, setModalVisible] = useState(false);
  const [pin, setPin] = useState({
    region: {
      latitude: -6.9024634,
      longitude: 106.9331214,
      latitudeDelta: 0.0050,
      longitudeDelta: 0.0060,
    },
    marker: null
  },
  );

  const serviceCost = () => {
    switch(service_type){
      case 'Regular':
        switch(order_duration){
          case 'Normal':
            return(7500);
            break;
          case 'Express':
            return(10000);
            break;
          default:
            return(1000);
            break;
        }
        break;
      case 'Dry Clean':
        switch(order_duration){
          case 'Normal':
            return(10000);
            break;
          case 'Express':
            return(13000);
            break;
          default:
            return(1000);
            break;
        }
        break;
      case 'Ironing':
        switch(order_duration){
          case 'Normal':
            return(5000);
            break;
          case 'Express':
            return(7000);
            break;
          default:
            return(1000);
            break;
        }
        break;
      default: 
        return(1000);
        break;
    }
  }

  useEffect(() => {
    Geolocation.getCurrentPosition(
      info => {
        //console.log(info);
        const { latitude, longitude } = info.coords;
        setPin({
          region: {
            latitude,
            longitude,
            latitudeDelta: 0.0050,
            longitudeDelta: 0.0060,
          }
        })
      }, 
      error => console.log("ERROR", error),
      { 
        enableHighAccuracy: false,
        timeout: 2000
      }
    )
  }, [])

  const confirmHandler = () => {
    Alert.alert("Order Placed !");
    uploadData();
    navigation.replace('Utama');
  };

  const uploadData = async () => {
    const docRef = collection(db, 'orders');
    const latitudeStr = pin.marker.latitude;
    const longitudeStr = pin.marker.longitude;
    //await addDoc(docRef, {jenis_order: pickup_method, durasi_order: order_duration})
    const service_cost = serviceCost();
    await setDoc(doc(db, "orders", orderID.toString()), {
      email_user: auth.currentUser.email,
      tipe_layanan: service_type, 
      jenis_order: pickup_method, 
      durasi_order: order_duration, 
      tanggal_order: order_date,
      alamat_order: alamat,
      koordinat_latitude: latitudeStr.toString(),
      koordinat_longitude: longitudeStr.toString(),
      berat_order: 1,
      biaya_order: service_cost,
      totalBiaya_order: 0,
      order_status: 'Order Confirmed'
    });
  };

  return (
    <View style={[styles.container]}>
      <GooglePlacesAutocomplete 
        placeholder='Search'
        fetchDetails={true}
        onPress={(data, details = null) => {
          //console.log(details.geometry.location);
          setAlamat(data.description);
          setPin({
            marker: {
              latitude: details.geometry.location.lat,
              longitude: details.geometry.location.lng,
              latitudeDelta: 0.0050,
              longitudeDelta: 0.0060,
            } 
          })
        }}
        query={{
          key: 'AIzaSyCxxArfq67PyUtTTZnO-dwdLZOrdmV0aOg',
          language: 'en',
        }}
        
        styles={{
          container: {flex: 0, position: 'absolute', width: '100%', zIndex: 1},
          listView: {backgroundColor: 'white'}
        }}
      />
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
              onPress={() => {confirmHandler()}}
              >
              <Text style={{color: 'white'}}>Ya</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={{borderWidth: 1, width: 100, alignItems: 'center', borderRadius: 50, borderColor: 'grey',paddingVertical: 3}}
              onPress={() => [setModalVisible(false), console.log(orderID)]}
              >
              <Text>Tidak</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <MapView style={styles.maps}
        loadingEnabled
        initialRegion={pin.region}
        showsUserLocation
        onPress={(e) => setPin({marker: e.nativeEvent.coordinate})}
        onPoiClick={(even) => console.log(even.nativeEvent.name)}
      >
        {
          pin.marker && <Marker coordinate={pin.marker}/>
        }
      </MapView>
      <TouchableOpacity style={{position: 'absolute'}} onPress={() => navigation.pop()}>
        <Image source={iconArrowBackBlack} style={{top: 50, left: 20, width: 25, height: 25}}/>
      </TouchableOpacity>
      <View style={styles.footer}>
      
        <Text style={{color: 'black'}}>Alamat Laundry : </Text>
        <View style={styles.opsi}>
            <Text style={{color: 'black'}}>{alamat ? alamat : 'Pilih Tempat'}</Text>
        </View>
        <TouchableOpacity 
          style={styles.button} 
          onPress={() => [
            setModalVisible(true), 
          ]} >
            <Text style={{color: 'white'}}>Mengkonfirmasi</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    maps: {
        flex: 4
    },
    footer: {
        flex: 1.2,
        width: '100%',
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 20,
        justifyContent: 'space-between'
    },
    opsi: {
        height: 60,
        backgroundColor: '#EEEEEE',
        borderRadius: 20,
        justifyContent: 'center',
        padding: 20
    },
    button: {
        height: 40,
        backgroundColor: '#0083FF',
        padding: 10,
        borderRadius: 20,
        alignItems: 'center'
    }
});

export default MapsScreen;


