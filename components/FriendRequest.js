import { Pressable, StyleSheet, Text, View, Image } from 'react-native'
import React, { useContext } from 'react'
import { UserType } from '../UserContext';
import { useNavigation } from '@react-navigation/native'
import User from '../components/User';

const FriendRequest = ({ item, friendrequests, setFriendRequests }) => {
    const { userId, setUserId ,baseUrl,imgDpUrl} = useContext(UserType);

    const navigation = useNavigation();
  
    const acceptRequest = (friendRequestId) => async () => {
      try {
        const response = await fetch(`${baseUrl}/friend-request/accept`, {
          method: "POST",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify({ senderId: friendRequestId, recepientId: userId }),
        });
  
        if (response.ok) {
          setFriendRequests(friendrequests.filter((request) => request._id !== friendRequestId));
          navigation.navigate("Chats");
        }
      } catch (err) {
        console.log("Error accepting the friend request", err);
      }
    };

    const source = { uri: `${imgDpUrl}/${item.image}` };

     
    return (
      <View>
        <Pressable
          style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginVertical: 10 }}
        >
          <Image style={{ width: 50, height: 50, borderRadius: 25 }} source={source} />
  
          <Text style={{ fontSize: 15, fontWeight: "bold", marginLeft: 10, flex: 1 }}>
            {item?.name} sent You a friend request
          </Text>
  
          <Pressable onPress={acceptRequest(item._id)} style={{ backgroundColor: "#0066b2", padding: 10, borderRadius: 5 }}>
            <Text style={{ color: "white", textAlign: "center" }}>Accept</Text>
          </Pressable>
        </Pressable>
      </View>
    );
  };
  
  export default FriendRequest;
  
const styles = StyleSheet.create({})