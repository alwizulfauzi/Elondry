import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {Text} from 'react-native';
import HomeScreen from './pages/HomeScreen/';
import SignInScreen from './pages/SignInScreen';
import BookingScreen from './pages/BookingScreen';
import SignUpScreen from './pages/SignUpScreen';
import RegularScreen from './pages/RegularScreen';
import MapsScreen from './pages/MapsScreen';
import CsScreen from './pages/CsScreen';
import EditAkun from './pages/EditAccountScreen';
import FullOrders from './pages/FullOrderScreen';
import OrderDetails from './pages/OrderDetailsScreen';
import { Platform, PermissionsAndroid } from 'react-native';

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <NavigationContainer independent={true}>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          animationEnabled: false
        }}>
        <Stack.Screen 
          name = "SignIn" 
          component={SignInScreen}
        />
        <Stack.Screen 
          name = "SignUp" 
          component={SignUpScreen}
        />
        <Stack.Screen 
          name = "Utama" 
          component={HomeScreen}
        />
        <Stack.Screen 
          name = "FullOrders" 
          component={FullOrders}
        />
        <Stack.Screen 
          name = "Booking" 
          component={BookingScreen}
        />
        <Stack.Screen 
          name = "Regular" 
          component={RegularScreen}
        />
        <Stack.Screen 
          name = "Maps" 
          component={MapsScreen}
        />
        <Stack.Screen 
          name = "CsScreen"
          component={CsScreen}
        />
        <Stack.Screen 
          name = "EditAkun" 
          component={EditAkun}
        />
        <Stack.Screen 
          name = "OrderDetails" 
          component={OrderDetails}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;