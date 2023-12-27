import { StyleSheet, Text, View ,Pressable,TextInput,KeyboardAvoidingView, Alert} from 'react-native'
import React, { useState } from 'react'
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { EvilIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import user from '../api/Models/user';
import 'react-native-get-random-values';

const RegisterScreen = () => {

    const[name,setName]=useState("")
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigation=useNavigation();
    const [imageUri,setImageUri]=useState('');
    const[uniqueName,setUniqueName]=useState('')
    const [fileType,setFileType]=useState('')
    const navigator=useNavigation();
      
    // const baseUrl='https://shy-gold-salmon-toga.cyclic.app';
    // const baseUrl="http://192.168.1.157:8000"
    const baseUrl='https://chat-api-gkq5.onrender.com'

 
    const handleRegister = async () => {

        if (!name || !email || !password) {
            Alert.alert("Validation Error", "Please fill in all required fields.");
            return;
        }
    
       
        if (imageUri !== '') {
            const uriParts = imageUri.split('.');
            const fileType = uriParts[uriParts.length - 1];
            setFileType(fileType);
    
            const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1E9)}.${fileType}`;
            setUniqueName(uniqueName);
        } else {
            // If no image is selected, use a default or handle accordingly
           const uniqueName = '1703251826016-655341227.jpeg';
            setUniqueName(uniqueName);
        }
    
        const user = {
            "name": name,
            "email": email,
            "password": password,
            "image": uniqueName
        };
         
        try {
            const response = await fetch(`${baseUrl}/register`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(user)
            });
    
            if (response.ok) {
                Alert.alert(
                    "Registration successful",
                    "You have been registered successfully",
                    [
                        {
                            text: "OK",
                            onPress: () => {
                                // Navigate to the Login screen
                                navigation.navigate('Login'); // Assuming the screen name is 'Login'
                            }
                        }
                    ]
                );
                setName('');
                setEmail('');
                setPassword('');
            }
    
        } catch (error) {
            Alert.alert("Registration failed", 'Failed to register');
            console.log("Error registering:", error);
        }
    
        const formDataa= new FormData();

        const imageFormData = {
            uri: imageUri,
            name: uniqueName,  // Use the same unique name for both MongoDB and image storage
            type: `image/${fileType}`,
        };
        
    
        formDataa.append("dpImg", imageFormData);
          
        try {
            const response = await fetch(`https://cwptraining.ntplstaging.com/chat-img/upload.php`, {
                method: "POST",
                body: formDataa,
            });
    
            if (response.ok) {
                console.log("Image uploaded successfully");
                setImageUri('');
            } else {
                console.log("Error uploading image:", response.statusText);
            }
        } catch (error) {
            console.log("Error uploading image:", error);
        }

      

    };
    


            const selectImage=async () => {
                try {
                    const result = await ImagePicker.launchImageLibraryAsync({
                        mediaTypes: ImagePicker.MediaTypeOptions.All,
                        allowsEditing: true,
                        aspect: [4, 3],
                        quality: 1,
                    });
        
                    if (result) {
                        setImageUri(result.assets[0].uri);
        
                    }
                } catch (error) {
                    console.error("image error :", error); // Log the error for debugging
                    // Show an error message to the user
                }
            };


  return (
      <View style={{ flex: 1, backgroundColor: 'white', padding: 10, alignItems: 'center' }}>

          <KeyboardAvoidingView>

              <View style={{ marginTop: 100, alignItems: 'center', justifyContent: 'center' }}>
                  <Text style={{ color: '#4a55a2', fontSize: 17, fontWeight: 900 }}>Register</Text>
                  <Text style={{ fontSize: 17, fontWeight: 700, marginTop: 15 }}>Register to Your Account</Text>
              </View>

              <View style={{ marginTop:30 }}>

              <View>
                      <Text style={{ fontSize: 18, fontWeight: 600, color: "gray" }}>Name</Text>

                      <TextInput
                          value={name}
                          onChangeText={(text) => { setName(text) }}
                          placeholder='Enter your name'
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


                  <View style={{marginTop:10}}>
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

                  <View style={{ marginTop: 10 }}>
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


                   {/* image url is commented due to storage issue */}

                  <View style={{marginTop:10}}>
                    <Text style={{ fontSize: 18, fontWeight: 600, color: "gray" }}>Select Image</Text>

                      <View>
                          <EvilIcons name="image" size={35} 
                                onPress={selectImage}
                                color={imageUri !== '' ? 'blue' : 'black'}
                                style={{marginTop:10,
                               
                                marginVertical:10,
                                width:300
                            }}
                          />
                         {imageUri===''?
                                <Text  onPress={selectImage} 
                                          style={{ borderBottomWidth:1,
                                               borderBottomColor:'gray',
                                               color:'gray',
                                               fontSize:18,
                                               fontWeight:600}}>Click to Select</Text>:
                                    <Text style={{ borderBottomWidth:1,
                                                   borderBottomColor:'gray',
                                                   color:'blue',
                                                   fontSize:18,
                                                   fontWeight:600}}>Selected</Text>}
                      </View>
                  </View>




                  <Pressable
                      onPress={handleRegister}
                      style={{
                          width: 200,
                          padding: 15,
                          backgroundColor: '#4a55a2',
                          marginTop: 50,
                          marginLeft: 'auto',
                          marginRight: 'auto',
                          borderRadius: 6
                      }}>

                      <Text
                          style={{
                              color: "white",
                              fontSize: 16,
                              fontWeight: "bold",
                              textAlign: "center"
                          }}>Register</Text>

                  </Pressable>


                  <Pressable style={{ marginTop: 15 }}
                      onPress={() => {navigation.goBack()}}>

                      <Text style={{ textAlign: 'center', color: 'gray', fontSize: 16 }}>Already have an Account? Sign In</Text>
                  </Pressable>

              </View>
          </KeyboardAvoidingView>

      </View>
  )
}

export default RegisterScreen

const styles = StyleSheet.create({})