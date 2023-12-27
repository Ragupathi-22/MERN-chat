import { Alert, KeyboardAvoidingView, Pressable, StyleSheet, Text, TextInput, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage'

 
const LoginScreen = () => {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigation=useNavigation();
    // const baseUrl='https://shy-gold-salmon-toga.cyclic.app';
    // const baseUrl="http://192.168.1.157:8000"
    const baseUrl='https://chat-api-gkq5.onrender.com'

    useEffect( ()=>{
        const checkLoginStatus=async()=>{
           try{
            const token=await AsyncStorage.getItem("authToken");

            if(token){
                navigation.replace("Home");
            }
            else{
                //token not found .. show the login screen
            }
           }catch(error){
                  console.log("error",error)
           }
        }

        checkLoginStatus()
    },[])

    handleLogin=()=>{
        const user={
            email:email,
            password:password
        }

        axios.post(`${baseUrl}/login`,user).then((res)=>{
           const token=res.data.token;
           AsyncStorage.setItem("authToken",token);

           navigation.replace("Home")
        }).catch((err)=>{
            Alert.alert("Login error","Invalid user or password");
            console.log("Login error :",err)
        })
    }

    return (
        <View style={{ flex: 1, backgroundColor: 'white', padding: 10, alignItems: 'center' }}>
            <KeyboardAvoidingView>

                <View style={{ marginTop: 100, alignItems: 'center', justifyContent: 'center' }}>
                    <Text style={{ color: '#4a55a2', fontSize: 17, fontWeight: 900 }}>Sign In</Text>
                    <Text style={{ fontSize: 17, fontWeight: 700, marginTop: 15 }}>Sign In to Your Account</Text>
                </View>

                <View style={{ marginTop: 50 }}>

                    <View>
                        <Text style={{ fontSize: 18, fontWeight: 600, color: "gray" }}>Email</Text>

                        <TextInput
                            value={email}
                            onChangeText={(text) => { setEmail(text) }}
                            placeholder='Enter your email'
                            placeholderTextColor="#36454f"
                            style={{
                                fontSize: email ? 16 : 16,
                                borderBottomColor: "gray",
                                borderBottomWidth: 1,
                                marginVertical: 10,
                                width: 300
                            }}
                        />
                    </View>

                    <View style={{ marginTop: 20 }}>
                        <Text style={{ fontSize: 18, fontWeight: 600, color: "gray" }}>Password</Text>

                        <TextInput
                            value={password}
                            onChangeText={(text) => { setPassword(text) }}
                            secureTextEntry={true}
                            placeholder='Enter your Password'
                            placeholderTextColor="#36454f"
                            style={{
                                fontSize: password ? 16 : 16,
                                borderBottomColor: "gray",
                                borderBottomWidth: 1,
                                marginVertical: 10,
                                width: 300
                            }}
                        />
                    </View>

                    <Pressable 
                        onPress={handleLogin}
                        style={{ width: 200,
                                 padding: 15, 
                                 backgroundColor: '#4a55a2',
                                 marginTop: 50, 
                                 marginLeft: 'auto', 
                                 marginRight: 'auto',
                                 borderRadius:6 }}>

                        <Text
                        style={{color:"white",
                                fontSize:16,
                                fontWeight:"bold",
                                textAlign:"center"}}>Login</Text>

                    </Pressable>


                    <Pressable style={{marginTop:15}}
                               onPress={()=>{navigation.navigate("Register")}}>

                        <Text style={{textAlign:'center', color:'gray', fontSize:16}}>Don't have an Account? Sign Up</Text>
                    </Pressable>

                </View>
            </KeyboardAvoidingView>
        </View>
    )
}

export default LoginScreen

const styles = StyleSheet.create({})