import { StyleSheet, Text, View } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { UserType } from '../UserContext'
import axios from 'axios';
import FriendRequest from '../components/FriendRequest';


const FriendsScreen = () => {
    
    const {userId,setUserId,baseUrl}=useContext(UserType);
    const [friendrequests,setFriendRequests]=useState([])

    useEffect(()=>{
        fetchFriendRequest()
    },[])

    const fetchFriendRequest=async()=>{
        try{
           const response=await axios.get(`${baseUrl}/friend-request/${userId}`)

           if(response.status===200){
                const friendRequestData=response.data.map((friendRequest)=>({
                       _id:friendRequest._id,
                       name:friendRequest.name,
                       email:friendRequest.email,
                       image:friendRequest.image

                }))
                      setFriendRequests(friendRequestData);

                     
           }
        }
        catch(err)
        {
          console.log("error fetch friend request", err)
        }
    }


  return (
    <View style={{padding:10,marginHorizontal:5}}>
        {friendrequests.length>0 && <Text>Your Friend Request's</Text>}
     
        {friendrequests.map((item,index)=>{
           
           return(
            <FriendRequest key={index} item={item} friendrequests={friendrequests} setFriendRequests={setFriendRequests}/>
           )
     })}
    </View>
  )
}

export default FriendsScreen

const styles = StyleSheet.create({})