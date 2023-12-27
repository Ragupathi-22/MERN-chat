import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useState,useContext, useEffect } from 'react'
import { UserType } from '../UserContext';
import { useNavigation } from '@react-navigation/native'
import UserChat from '../components/UserChat';

const ChatScreen = () => {

  const [acceptedFriends,setAcceptedFriends]=useState([])
  const {userId,setUserId,baseUrl}=useContext(UserType);
  const navigation=useNavigation();

  useEffect(()=>{

     const acceptedFriendsList=async ()=>{

      try{
         const response= await fetch(`${baseUrl}/accepted-friends/${userId}`)

        const data=await response.json();
        if(response.ok){
          setAcceptedFriends(data)
        }
      }
      catch(error){
              console.log("Error coming from accepted friends",error);
      }
     }

     acceptedFriendsList()

  },[])

  return (
      <ScrollView showsVerticalScrollIndicator={false}>
        <Pressable>
             {acceptedFriends.map((item,index)=>{
              return(<UserChat  key={index} item={item}/>)
             })}
        </Pressable>
      </ScrollView>
  )
}


export default ChatScreen

const styles = StyleSheet.create({})