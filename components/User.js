import { Pressable, StyleSheet, Text, View, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import { UserType } from '../UserContext';
import { useContext } from 'react'


const User = ({ item }) => {

    const {userId,setUserId,baseUrl,imgDpUrl}=useContext(UserType);
    const [requestSent,setRequestSent]=useState(false);
    const[friendRequests,setFriendRequests]=useState([]);
    const [userFriends,setUserFriends]=useState([]);
    
    useEffect(()=>{

        const fetchFriendRequests=async()=>{
            try{
             
                const response=await fetch(`${baseUrl}/friend-requests/sent/${userId}`)

                const data=await response.json();

                if(response.ok){
                     setFriendRequests(data);   
                                  
                }

            }
            catch(error){
                console.log("error fetching the friend requests",error)
            }
        }
        fetchFriendRequests();
    },[])

    useEffect(()=>{
         
          fetchUserFriends();
    },[])

    const fetchUserFriends=async()=>{
        try{
             const response=await fetch(`${baseUrl}/friends/${userId}`);

             const data=await response.json();

             if(response.ok){
                setUserFriends(data);
             }
        }
        catch(error){
            console.log("error in fetch the user friends",error)
        }
      }   
       

    const sentFriendRequest=async(currentUserId,selectedUserId)=>{   
        
        
       if(!requestSent){

        try {
            const response = await fetch(`${baseUrl}/friend-request`, {
                method: 'POST',
                headers: {
                    "content-type": "application/json"
                },
                body: JSON.stringify({ currentUserId, selectedUserId })
            })
         
            if(response.ok){
                setRequestSent(true);
                console.log("Request sent successfully")
            }

        }
        catch(error){
           console.log("Error while sent friend request ",error)
        }

       }
    }
   
        const source = { uri: `${imgDpUrl}/${item.image}` };
        
    return (
        <Pressable style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 10}}>
            <View>
                <Image
                    style={{
                        height: 50,
                        width: 50,
                        borderRadius: 25,
                        resizeMode: 'cover'
                    }}
                    source={source}/>
            </View>
            <View style={{ marginLeft: 12, flex: 1 }}>
                <Text style={{fontWeight:"bold",fontSize:15}}>{item?.name}</Text>
                <Text style={{marginTop:4,color:'gray'}}>{item?.email}</Text>
            </View>
            
            {
                userFriends.includes(item._id) ?(
                    <Pressable
                    style={{ backgroundColor: '#de9e4b', width: 105, padding: 10, borderTopLeftRadius: 20,borderBottomRightRadius:20 }}>
                      <Text style={{textAlign:'center',color:'white',fontSize:14}}>Friends</Text>
                  </Pressable>
                ): requestSent || friendRequests.some((friend)=>friend.id===item._id)?(
                    <Pressable
                    style={{ backgroundColor: '#c26606', width: 105, padding: 10, borderRadius: 5 }}>
                      <Text style={{textAlign:'center',color:'white',fontSize:14}}>Request Sent</Text>
                  </Pressable>
                ):(
                    <Pressable
                    onPress={()=>sentFriendRequest(userId,item._id)}
                    style={{ backgroundColor: '#95755F', width: 105, padding: 10, borderRadius: 5 }}>
                      <Text style={{textAlign:'center',color:'white',fontSize:14}}>Add Friends</Text>
                  </Pressable>
                )
            }

            
        </Pressable>
    )
}

export default User
 User.fetchUserFriends

const styles = StyleSheet.create({})