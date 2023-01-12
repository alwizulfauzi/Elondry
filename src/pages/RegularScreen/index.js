import React, {onPress, useState, useEffect} from 'react';
import {Text, View, Button, StyleSheet, Image, Pressable, TouchableOpacity, ScrollView, TouchableNativeFeedback, Platform} from 'react-native';
import iconArrowBack from '../../assets/icons/iconArrowBack.png';
import notifIcon from '../../assets/icons/notifications_none.png';
import iconRegular from '../../assets/icons/iconRegular.png';
import iconDryClean from '../../assets/icons/iconDryClean.png';
import iconIroning from '../../assets/icons/iconIroning.png';
import arrowChevron from '../../assets/icons/arrowChevron.png';
import RadioForm, {RadioButton, RadioButtonInput, RadioButtonLabel} from 'react-native-simple-radio-button';
import DateTimePicker from '@react-native-community/datetimepicker';
import { auth } from '../../../firebase';
import { FirebaseError } from 'firebase/app';
import LinearGradient from 'react-native-linear-gradient';

const RegularScreen = ({route, navigation}) => {
  const { serviceType } = route.params;
  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const [date, setDate] = useState(new Date())
  const [mode, setMode] = useState('date')
  const [show, setShow] = useState(false)
  const [dateText, setDateText] = useState('5 - January - 2022')
  const [pickupMethod, setPickupMethod] = useState('')
  const [orderDuration, setOrderDuration] = useState('')
  const [details, setDetails] = useState({pickup_method: '', order_duration: '', order_date: '', service_type: ''})

  const onChanges = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(Platform.OS === 'ios');
    setDate(currentDate);

    let tempDate = new Date(currentDate);
    let fDate = tempDate.getDate() + ' - ' + (months[tempDate.getMonth()]) + ' - ' + tempDate.getFullYear();
    setDateText(fDate)
    console.log(fDate)
  };

  const proceedHandler = () => {
    navigation.push('Maps', details); 
    console.log(details)
  };

  useEffect(() => {
    setDetails({pickup_method: pickupMethod, order_duration: orderDuration, order_date: dateText, service_type: serviceType})
  }, [pickupMethod, orderDuration, dateText])

  var pickup_props = [
    {label: 'Door Pickup', value: 'Door Pickup'},
    {label: 'Office Drop Off', value: 'Office Drop Off'}
  ]; 
   
  var duration_props = [
    {label: 'Normal', value: 'Normal'},
    {label: 'Express', value: 'Express'}
  ]

  const showMode = (currentMode) => {
    setShow(true);
    setMode(currentMode);
  };

  const getServiceIcon = () => {
    switch(serviceType){
      case 'Regular':
        return(<Image source={iconRegular} style={styles.iconMain}/>)
        break;
      case 'Dry Clean':
        return(<Image source={iconDryClean} style={styles.iconMain}/>)
        break;
      case 'Ironing':
        return(<Image source={iconIroning} style={{width: 49, height: 35}}/>)
        break;
      default: 
        return(<Image source={iconRegular} style={styles.iconMain}/>)
        break;
    }
  } ;

  const getCost = () => {
    switch(serviceType){
      case 'Regular':
        return(
          <View>
            <Text style={{marginBottom: 15}}>Rp. 7500/kg</Text>
            <Text>Rp. 10000/kg</Text>
          </View>
        )
        break;
      case 'Dry Clean':
        return(
          <View>
            <Text style={{marginBottom: 15}}>Rp. 10000/kg</Text>
            <Text>Rp. 13000/kg</Text>
          </View>
        )
        break;
      case 'Ironing':
        return(
          <View>
            <Text style={{marginBottom: 15}}>Rp. 5000/kg</Text>
            <Text>Rp. 7000/kg</Text>
          </View>
        )
        break;
      default: 
        return(<Image source={iconRegular} style={styles.iconMain}/>)
        break;
    }
  }

  return (
    <ScrollView style={{flex: 1}}>
      <LinearGradient
        colors={['#5879CF', '#50bcfc']}
        start={{x: -1, y: 1}} end={{x: 1, y: 1}}
      >
          <Pressable onPress={() => navigation.push('Utama')}>
            <Image source={iconArrowBack} style={{ position: 'absolute', width: 30, height: 30, marginTop: 40, marginLeft: 20}} />
          </Pressable>
        <View style={{paddingHorizontal: 20, paddingTop: 40, alignItems: 'center'}}>
          <View style={{borderRadius: 50, width: 80, height: 80, backgroundColor: 'transparent', marginBottom: 10,}}>
            <Image source={{uri : auth.currentUser.photoURL}} style={{width: 80, height: 80, borderRadius: 50, borderWidth: 2, borderColor: 'white'}}/>
          </View>
        </View>
        <View style={{alignItems: 'center'}}>
          <Text style={{color: 'white', fontSize: 20, fontFamily: 'Lato', fontWeight: 'bold',}}>
            {auth.currentUser.displayName}
          </Text>
          <Text style={{color: 'white', fontSize: 12, fontFamily: 'Lato', marginBottom: 50,}}>
            {auth.currentUser.email}
          </Text>
        </View>

        <Pressable style={{alignItems: 'center'}} onPress={() => {console.log(serviceType)}}>
          <View style={styles.mainBox}>
            {getServiceIcon()}
            <Text style={styles.textIconMain}>{serviceType}</Text>
          </View>
        </Pressable>

          <View style={{marginTop: 10}}>
            <Text style={styles.orderTitle}>Tanggal Pemesanan : </Text>
            <Pressable style={[styles.orderBox, {flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}]} onPress={() => showMode('date')}>
              <Text style={styles.orderOptions}>{dateText}</Text>
              <Image 
                source={arrowChevron} style={{width: 8, height: 15}}
              />
            </Pressable>

            <Text style={styles.orderTitle}>Metode Pengambilan : </Text>
            <View style={styles.orderBox}>
              <RadioForm 
                radio_props={pickup_props}
                initial={0}
                onPress={(value) => {setPickupMethod(value); }}
                buttonSize={10}
              />
            </View>
            <Text style={styles.orderTitle}>Durasi Pemesanan : </Text>
            <View style={[styles.orderBox, {flexDirection: 'row'}]}>
              <RadioForm 
                radio_props={duration_props}
                initial={0}
                onPress={(value) => {setOrderDuration(value); }}
                buttonSize={10}
              />
              <View style={{justifyContent: 'space-around', marginLeft: '50%', bottom: 2}}>
                {getCost()}
              </View>
            </View>
          </View>
        
          <TouchableOpacity 
            style={{width: '90%', alignSelf: 'center', backgroundColor: 'white', alignItems: 'center', borderRadius: 15, paddingVertical: 15, marginTop: 25, marginBottom: 50, elevation: 5}}
            onPress = {() => proceedHandler()}>
            <Text style={{color:'black', fontFamily: 'Roboto'}}>Proses</Text>
          </TouchableOpacity>
      </LinearGradient>
      {show && (
        <DateTimePicker
          testID="dateTimePicker"
          value={date}
          mode={mode}
          is24Hour={true}
          display="default"
          onChange={onChanges}
      />)}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  mainBox: {
    width: 80,
    height: 100,
    backgroundColor: 'white',
    borderRadius: 10,
    marginHorizontal: 5,
    elevation: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconMain: {
    width: 40,
    height: 40
  },
  textIconMain: {
    fontFamily: 'Roboto'
  },
  orderTitle: {
    color: 'white',
    marginHorizontal: 30,
    marginBottom: 10
  },
  orderBox: {
    backgroundColor: 'white',
    borderRadius: 15,
    paddingHorizontal: 20,
    paddingVertical: 12,
    alignSelf: 'center',
    width: '90%',
    marginBottom: 10,
    elevation: 5,
  },
  orderOptions: {
    color: 'black',
    paddingVertical: 15
  }
});

export default RegularScreen;
