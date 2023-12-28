import { Pressable, StyleSheet, Text, View ,Image} from 'react-native'
import React, { useContext, useEffect, useLayoutEffect, useState } from 'react'
import { useNavigation } from '@react-navigation/native'
import { Ionicons } from '@expo/vector-icons';
import { SimpleLineIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AntDesign } from '@expo/vector-icons';
import { EvilIcons } from '@expo/vector-icons';

//import for properly decode the token from asyncStorage
import { decode } from 'js-base64';
global.atob = decode;
import { jwtDecode } from "jwt-decode";
import axios from 'axios';
import { UserType } from '../UserContext';
import User from '../components/User';

const HomeScreen = () => {

    const navigation=useNavigation();
    const {userId,setUserId,baseUrl}=useContext(UserType);
    const [users,setUsers]=useState([])


    useLayoutEffect(() => {
        navigation.setOptions({
          headerTitle: "",
          headerLeft: () => (
            <Text style={{ marginLeft: 10, fontSize: 18,fontWeight:'bold'}}>Swift Chat</Text>
          ),
          headerRight: () => (
            <View style={{ flexDirection: "row",alignItems:"center",gap:17,marginRight:15}}>
              {/* <Ionicons  onPress={()=>{navigation.navigate("Chats")}} name="chatbubble-ellipses-outline" size={25} color="black" />
              <AntDesign  onPress={()=>{navigation.navigate("Friend Request")} } name="addusergroup" size={24} color="black" />
              <EvilIcons name="user" size={33} color="black"  onPress={()=>{navigation.navigate("Profile")}}/> */}
              <Pressable onPress={() => navigation.navigate("Chats")}><Image source={require('../assets/icons8-chat-48.png')} style={{ width: 25, height: 25}} /></Pressable>
              <Pressable onPress={() => navigation.navigate("Friend Request")} ><Image source={require('../assets/icons8-request-feedback-48.png')} style={{ width: 25, height: 25}}/></Pressable>
              <Pressable onPress={() => navigation.navigate("Profile")}><Image source={require('../assets/profile-picture-male-icon.webp')} style={{ width: 28, height: 28 }}  /></Pressable>
    
            </View>
          ),
        });
      }, []);

      useEffect(()=>{
        const fetchUsers = async () => {
          try {
            const token = await AsyncStorage.getItem('authToken');
            const decodedToken = jwtDecode(token);
            const userId = decodedToken.userId;
            setUserId(userId);
            const response = await axios.get(`${baseUrl}/users/${userId}`);
            setUsers(response.data);
          } catch (error) {
            console.log('Error retrieving users:', error);
          }
        };
            fetchUsers()
      },[])
      

  return (
    <View>
      <View style={{padding:10}}>
          {users.map((item, index) => {
            return (
              <User item={item} key={index} />
            );
          })}
       </View>

    </View>
  )
}

export default HomeScreen

const styles = StyleSheet.create({})