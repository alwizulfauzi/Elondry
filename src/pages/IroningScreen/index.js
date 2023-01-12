import React, {onPress} from 'react';
import {Text, View, Button, StyleSheet, Image, Pressable, TouchableOpacity} from 'react-native';
import iconArrowBack from '../../assets/icons/iconArrowBack.png';
import iconIroning from '../../assets/icons/iconIroning.png';

const IroningScreen = ({navigation}) => {
    return (
        <View style={{flex: 1, backgroundColor: '#0083FF'}}>
          <View>
              <Pressable onPress={() => navigation.push('Utama')}>
                <Image source={iconArrowBack} style={{ position: 'absolute', width: 30, height: 30, marginTop: 40, marginLeft: 20}} />
              </Pressable>
            <View style={{paddingHorizontal: 20, paddingTop: 40, alignItems: 'center'}}>
              <View style={{borderRadius: 50, width: 80, height: 80, backgroundColor: 'white', marginBottom: 10,}}></View>
            </View>
    
            <View style={{alignItems: 'center'}}>
              <Text style={{color: 'white', fontSize: 20, fontFamily: 'Lato', fontWeight: 'bold',}}>
                Alwi Zulfauzi
              </Text>
              <Text style={{color: 'white', fontSize: 12, fontFamily: 'Lato', marginBottom: 50,}}>
              Jl. Sukabirus, Kos Vtongs no. 6
              </Text>
            </View>
    
            <View style={{alignItems: 'center'}}>
              <View style={styles.mainBox}>
                <Image source={iconIroning} style={styles.iconMain}/>
                <Text style={styles.textIconMain}>Setrika</Text>
              </View>
            </View>
    
            <View style={{marginTop: 30}}>
              <Text style={styles.orderTitle}>Tanggal Pemesanan : </Text>
              <View style={styles.orderBox}>
                <Text style={styles.orderOptions}>20 - Desember - 2022</Text>
              </View>
              <Text style={styles.orderTitle}>Metode Pengambilan : </Text>
              <View style={styles.orderBox}>
                <Text style={styles.orderOptions}>Dijemput</Text>
                <Text style={styles.orderOptions}>Antar Sendiri</Text>
              </View>
              <Text style={styles.orderTitle}>Durasi Pemesanan : </Text>
              <View style={styles.orderBox}>
                <Text style={styles.orderOptions}>Normal</Text>
                <Text style={styles.orderOptions}>Cepat</Text>
              </View>
            </View>
            
            <TouchableOpacity style={{width: '90%', alignSelf: 'center', backgroundColor: 'white', alignItems: 'center', borderRadius: 15, paddingVertical: 15, marginTop: 25}}>
              <Text style={{color:'black', fontFamily: 'Roboto'}}>Proses</Text>
            </TouchableOpacity>
          </View>
        </View>
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
        alignSelf: 'center',
        width: '90%',
        marginBottom: 10
      },
      orderOptions: {
        color: 'black',
        paddingVertical: 15,
      }
    });

export default IroningScreen;


