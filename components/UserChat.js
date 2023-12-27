import { StyleSheet, Text, View, Pressable, Image } from 'react-native'
import React, { useState, useContext, useEffect } from 'react'
import { useNavigation } from '@react-navigation/native'
import { UserType } from '../UserContext';

const UserChat = ({ item }) => {

  const navigation = useNavigation()
  const { userId, setUserId,baseUrl,imgDpUrl} = useContext(UserType);
  const [messages, setMessages] = useState([])

  const fetchMessages = async () => {

    try {
      const response = await fetch(`${baseUrl}/messages/${userId}/${item._id}`)
      const data = await response.json();

      if (response.ok) {
        setMessages(data);
      }
    }
    catch (error) {
      console.log("error fetch the message")
    }
  }

  useEffect(() => {
    fetchMessages()
  }, [messages])

 
 const getLastMessage=()=>{
      const userMessages=messages.filter((message)=>message.messageType ==='text');
      const n=userMessages.length;
      return userMessages[n-1]
 }
 const lastMessage=getLastMessage();

 const formateTime = (time) => {
  const options = { hour: 'numeric', minute: 'numeric' };
  return new Date(time).toLocaleString("en-IN", options);
};

const source = { uri: `${imgDpUrl}/${item.image}` };

  return (
    <Pressable
      onPress={() => navigation.navigate("Messages", {
        recepientId: item._id
      })}
      style={

        {
          flexDirection: 'row',
          alignItems: 'center',
          gap: 10,
          borderWidth: 1,
          borderColor: "#D0D0D0",
          borderTopWidth: 0,
          borderLeftWidth: 0,
          borderRightWidth: 0,
          padding: 10
        }}>

      <Image
        style={{
          height: 50,
          width: 50,
          borderRadius: 25,
          resizeMode: 'cover'
        }}
        source={source} />

      <View style={{ flex: 1 }}>
         
           <Text style={{ fontWeight: "700", fontSize: 15 }}>{item?.name}</Text>
        
         {lastMessage &&
         
          <Text style={{ marginTop: 3, color: 'gray', fontWeight: '500' }}>{lastMessage?.message}</Text>
         }

        
      </View>

      <View>

        <Text style={{ fontSize: 12, fontWeight: "500", color: '#585858' }}>{lastMessage && formateTime(lastMessage?.timeStamp)}</Text>
      </View>


    </Pressable>
  )
}

export default UserChat

const styles = StyleSheet.create({})