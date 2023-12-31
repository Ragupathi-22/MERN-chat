import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import HomeScreen from './screens/HomeScreen';
import FriendsScreen from './screens/FriendsScreen';
import ChatScreen from './screens/ChatScreen';
import ChatMessageScreen from './screens/ChatMessageScreen';
import ProfileScreen from './screens/ProfileScreen';

const StackNavigator = () => {

    const Stack = createNativeStackNavigator();


  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Login" component={LoginScreen} options={{headerShown:false}}/>
        <Stack.Screen name="Register" component={RegisterScreen} options={{headerShown:false}}/>
        <Stack.Screen name="Home" component={HomeScreen}/>
        <Stack.Screen name="Friend Request" component={FriendsScreen}/>
        <Stack.Screen name="Chats" component={ChatScreen}/>
        <Stack.Screen name="Messages" component={ChatMessageScreen}/>
        <Stack.Screen name="Profile" component={ProfileScreen} options={{headerShown:false}}/>
      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default StackNavigator

const styles = StyleSheet.create({})