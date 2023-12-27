import { StyleSheet, Text, View,Pressable,Image, ImageBackground} from 'react-native'
import React ,{useContext, useEffect, useState} from 'react'
import { AntDesign } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { UserType } from '../UserContext';
import { LinearGradient } from 'expo-linear-gradient';

const ProfileScreen = () => {

    const navigation=useNavigation();
    const {userId,setUserId,baseUrl,imgDpUrl}=useContext(UserType);
    const[user,setUser]=useState('');
    const[image,setImage]=useState('')



    useEffect(()=>{
          const fetchUser=async()=>{
            try{
              const response= await fetch(`${baseUrl}/log-user/${userId}`);
              const data=await response.json()
              if(response){
                setUser(data);
                setImage(data.image);
              }
            }
            catch(error){
              console.log("error fetch the user in profileScreen",error);
            }
          }
          fetchUser()
    },[])




    const back=()=>{
      navigation.goBack();
    }



  const logout = async () => {
    try {
      // Clear the authentication token from AsyncStorage
      await AsyncStorage.removeItem('authToken');

      // Navigate to the login screen
      navigation.replace('Login');
    } catch (error) {
      console.log('Error logging out:', error);
    }
  };

  const friends=()=>{
    const noOfFriends=user.friends?user.friends.length:0;
     return(
        noOfFriends<10? '0'+noOfFriends :noOfFriends
     )
  }

  const requestSent=()=>{
    const noOfFriends=user.senrFriendRequest?user.senrFriendRequest.length:0;
     return(
        noOfFriends<10? '0'+noOfFriends :noOfFriends
     )
  }

  const pendingRequest=()=>{
    const noOfFriends=user.friendRequest ? user.friendRequest.length : 0;
     return(
        noOfFriends<10? '0'+noOfFriends :noOfFriends
     )
  }

  
  const source = { uri: `${imgDpUrl}/${image}` };


  return (
    <>
    <LinearGradient
        // Background Linear Gradient
        colors={['#81999c','#c7d9db']}
        style={styles.background}
        // #D6FF7F – #00B3CC
      />
    
       {/* <ImageBackground source={require('../assets/bg.png')} style={{flex:1, resizeMode: 'cover'}}> */}
           
   <View>
          <Pressable style={{marginVertical:40,padding:20}}>

                  <View style={{flexDirection:'row',gap:10}}>

                      <Ionicons onPress={back} name="arrow-back-outline" size={28} />

                      <Text style={{fontSize:25,fontWeight:'bold'}}>Profile</Text>
                  </View>

                  
          </Pressable>

          <View style={{marginTop:30,alignItems:'center'}}>
                <View style={{justifyContent:'center',alignItems:'center'}}>
                  
                    <Image 
                        source={source}
                        style={{height:150,width:150,resizeMode:"cover",borderTopLeftRadius:30,borderRadius:10, borderBottomRightRadius:30,marginBottom:20}}/>

                    <Text style={{fontSize:19,fontWeight:'700',color:'#444444'}}>{user.name}</Text>
                    <Text style={{fontSize:15,fontWeight:'500',color:'#ffffff',marginTop:5}}>{user.email}</Text>
                </View>
          </View>


          <View style={{flexDirection:'row',justifyContent:"space-evenly",marginVertical:20}}>

              <View style={{alignItems:'center'}}>
                  <Text style={styles.textHeading}>Friends</Text>
                  <Text style={styles.text}>{friends()}</Text>
              </View>

              <View style={{alignItems:'center'}}>
                  <Text style={styles.textHeading}>Request Sent</Text>
                  <Text style={styles.text}>{requestSent()}</Text>
              </View>

              <View style={{alignItems:'center'}}>
                  <Text style={styles.textHeading}>Pending Request</Text>
                  <Text style={styles.text}>{pendingRequest()}</Text>
              </View>

          </View>


       {/* </ImageBackground> */}
       </View>

       <View style={{marginVertical:50,marginLeft:250}}>

           <View style={{flexDirection:'row',gap:8}}>

                  <Text style={{fontSize:20,fontWeight:'bold'}}>Log-out</Text>
                  <AntDesign onPress={logout} name="logout" size={24} color="black" />
                  
            </View>

       </View>
      
    </>
  )
}

export default ProfileScreen

const styles = StyleSheet.create({
    
    textHeading:{color:'#444444',fontSize:18,fontWeight:'700'},
    text:{color:'#ffffff',fontSize:17,fontWeight:'600'},
    background: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
   },

})