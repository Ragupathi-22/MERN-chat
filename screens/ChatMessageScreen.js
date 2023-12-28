import { Pressable, ScrollView, StyleSheet, Text, Image, TextInput, View, Alert } from 'react-native'
import React, { useContext, useEffect, useRef, useLayoutEffect, useState } from 'react'
import { KeyboardAvoidingView } from 'react-native'
import { Entypo } from '@expo/vector-icons';
import { EvilIcons } from '@expo/vector-icons';
import { FontAwesome5 } from '@expo/vector-icons';
import EmojiSelector from 'react-native-emoji-selector'
import { useNavigation, useRoute } from '@react-navigation/native';
import { UserType } from '../UserContext';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { MaterialIcons } from '@expo/vector-icons';
import user from '../api/Models/user';



const ChatMessageScreen = () => {

    const [showEmojiSelector, setShowEmojiSelector] = useState(false)
    const [message, setMessage] = useState('');
    const [selectMessages, setSelectMessages] = useState([])
    const [recepientData, setRecepientData] = useState('');
    const [selectedImage, setSelectedImage] = useState('');
    const [messages, setMessages] = useState([]);
    const route = useRoute();
    const { recepientId } = route.params;
    const { userId, setUserId,baseUrl,imgDpUrl } = useContext(UserType)
    const navigation = useNavigation();
    const scrollViewRef = useRef();
    const [image,setImage]=useState('');



    useEffect(() => {

        fetchMessages();

    }, [messages])

    const fetchMessages = async () => {

        try {

            const response = await fetch(`${baseUrl}/messages/${userId}/${recepientId}`)
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
        const fetchRecpientData = async () => {
            try {
                const response = await fetch(`${baseUrl}/user/${recepientId}`)
                const data = await response.json();
                setRecepientData(data);
                setImage(data.image);
            }
            catch (error) {
                console.log("Error retrieve the detail of recepient")
            }
        }

        fetchRecpientData()

    }, [recepientData])




    const handleEmojiPress = () => {
        setShowEmojiSelector(!showEmojiSelector);
    }

    const handleSend = async (messageType, imageUri) => {
            
          if(message!='' && messageType==='text'){
               formatAndSentMessage(messageType,imageUri);  
          }

          else if(messageType==='image'){
            formatAndSentMessage(messageType,imageUri);
          }
          else{
            console.log("not allowed to sent empty message",)
          }
         
    }

    const formatAndSentMessage=async(messageType,imageUri)=>{

        
            if (messageType==='text'){

                  const user={
                        "senderId":userId,
                        "recepientId":recepientId,
                        "messageType":"text",
                        "message":message,
                        "imageFile":''
                    }
                    
                    try{
                    const response = await fetch(`${baseUrl}/messages`, {
                        method: "POST",
                        headers:{
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(user)
                    })
                    if (response.ok) {
                        setMessage("");
                        setSelectedImage("")
                        fetchMessages();
                    }
                
                  }
                  catch (error) {
                    console.log("Error in sending the message", error);
                  }

            }
            //for image
            if (messageType === "image") {
                 
                const uriParts = imageUri.split('.');
                const fileType = uriParts[uriParts.length - 1];
                const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1E9)}.${fileType}`;

                
             const  user={
                    "senderId":userId,
                    "recepientId":recepientId,
                    "messageType":"image",
                    "message":message,
                    "imageFile":uniqueName
                }
                
                try{
                    const response = await fetch(`${baseUrl}/messages`, {
                        method: "POST",
                        headers:{
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(user)
                    })
                    if (response.ok) {
                        setMessage("");
                        setSelectedImage("")
                        fetchMessages();
                    }
                
                  }
                  catch (error) {
                    console.log("Error in sending the message", error);
                  }
                  
                //store the image in staging server
                const imageData=new FormData();
                imageData.append("imageFile", {
                    uri: imageUri,
                    name: uniqueName,
                    type: "image/jpeg"
                })
               
                try {
                    const response = await fetch(`https://cwptraining.ntplstaging.com/chat-img/upload.php`, {
                        method: "POST",
                        body: imageData,
                    });
            
                    if (response.ok) {
                        console.log("Image uploaded successfully");
                        setSelectedImage("")
                    } else {
                        console.log("Error uploading image:", response.statusText);
                    }
                } catch (error) {
                    console.log("Error uploading image:", error);
                }

            }
           
    }


    const deleteMessages = async (messagesId) => {
        try {
            const response = await fetch(`${baseUrl}/deleteMessages`, {
                method: 'POST',
                headers:
                {
                    'content-Type': 'application/json'
                },
                body: JSON.stringify({ messages: messagesId })
            })

            if (response.ok) {
                console.log("message deleted successfully");

                setSelectMessages((previousMessage) =>
                    previousMessage.filter((id) => !messagesId.includes(id)))
                fetchMessages();
            }
        }
        catch (error) {
            console.log("delete messages error", error)
        }
    }

    useLayoutEffect(() => {

        const source = { uri: `${imgDpUrl}/${image}` };

        navigation.setOptions({
            headerTitle: "",
            headerLeft: () => (
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                    {/* <Ionicons name="chevron-back-sharp" size={32} color="black" onPress={() => { navigation.goBack() }} /> */}
                    <Pressable onPress={() => { navigation.goBack() }} ><Image source={require('../assets/icons8-back-50.png')} style={{marginLeft:5, width: 25, height: 25}}/></Pressable>
                    {selectMessages.length > 0 ?

                        <View>
                            <Text style={{ fontSize: 16, fontWeight: "500" }}>{selectMessages.length}</Text>
                        </View>

                        :

                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Image
                                source={source}
                                style={{ width: 32, height: 32, resizeMode: 'cover', borderRadius: 15 }} />

                            <Text style={{ marginLeft: 5, fontSize: 17, fontWeight: 'bold' }}>{recepientData?.name}</Text>
                        </View>

                    }

                </View>
            ),
            headerRight: () => selectMessages.length > 0 ?

                <View style={{ flexDirection: "row", gap: 20, alignItems: 'center' }}>
                    {/* <Ionicons name="md-arrow-undo" size={24} color="black" />
                    <Ionicons name="md-arrow-redo-sharp" size={24} color="black" />
                    <Ionicons name="ios-star" size={24} color="black" /> */}

                    {/* <MaterialIcons onPress={() => deleteMessages(selectMessages)} name="delete-outline" size={24} style={{marginRight:30}} color="black" /> */}
                    <Pressable  onPress={() => deleteMessages(selectMessages)} ><Image source={require('../assets/icons8-delete-30.png')} style={{marginRight:10, width: 25, height: 25}}/></Pressable>
                </View>

                : null
        })
    }, [recepientData, selectMessages])

    const formateTime = (time) => {
        const options = {
                          hour: 'numeric',
                          minute: 'numeric',
                          month: 'short', // or 'short' for abbreviated month names
                          day: 'numeric'};

        return new Date(time).toLocaleString("en-IN", options);
    };


    const pickImage = async () => {
        try {
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.All,
                allowsEditing: true,
                aspect: [4, 3],
                quality: 1,
            });

            if (!result.canceled) {
                handleSend("image", result.assets[0].uri)

            }
        } catch (error) {
            console.error("image error :", error); // Log the error for debugging
            // Show an error message to the user
        }
    };



    const handleSelectMessage = (message) => {

        const isSelected = selectMessages.includes(message._id);

        if (isSelected) {
            setSelectMessages((previousMessage) => previousMessage.filter((id) => (id !== message._id)))
        }
        else {
            setSelectMessages((previousMessage) =>
                [...previousMessage, message._id]
            )
        }
    }
   
  
    return (

        <KeyboardAvoidingView style={{ flex: 1, backgroundColor: '#f0f0f0' }}>

            <ScrollView
                ref={scrollViewRef}
                onContentSizeChange={() => {
                    scrollViewRef.current.scrollToEnd({ animated: true });
                }}>

                {messages.map((item, index) => {

                    const isSelected = selectMessages.includes(item._id);

                    if (item.messageType === 'text') {
                        return (

                            <Pressable
                                onLongPress={() => { handleSelectMessage(item) }}

                                key={index}
                                style={
                                    [item?.senderId?._id === userId ?
                                        {
                                            alignSelf: 'flex-end',
                                            backgroundColor: '#ECE5E1',
                                            padding: 8,
                                            maxWidth: '60%',
                                            borderRadius: 7,
                                            margin: 10
                                        }
                                        : {
                                            alignSelf: 'flex-start',
                                            backgroundColor: 'white',
                                            padding: 8,
                                            margin: 10,
                                            borderRadius: 7,
                                            maxWidth: '60%'
                                        },
                                    isSelected && { width: "50%", backgroundColor: '#D9CCC4' }
                                    ]
                                }>

                                <Text
                                    style={
                                        {
                                            color: 'black',
                                            fontSize: 13,
                                            fontWeight: '500',
                                            textAlign: isSelected ? 'center' : 'left'
                                        }
                                    }>{item?.message}</Text>


                                <Text style={{ textAlign: 'right', marginTop: 5, fontSize: 10, color: 'gray' }}>{formateTime(item.timeStamp)}</Text>
                            </Pressable>
                        )
                    }
                    if (item.messageType === 'image') {

                        const imageUrl = item.imageUrl;
                        const source = { uri: `https://cwptraining.ntplstaging.com/chat-img/mess-img/${imageUrl}` };


                        return (
                            <Pressable

                                onLongPress={() => { handleSelectMessage(item) }}
                                key={index}
                                style={[
                                    item?.senderId?._id === userId ?
                                        {
                                            alignSelf: 'flex-end',
                                            backgroundColor: '#128c73',
                                            margin: 10,
                                            borderRadius: 7,
                                            maxWidth: '60%'
                                        }
                                        : {
                                            alignSelf: 'flex-start',
                                            backgroundColor: 'white',
                                            margin: 10,
                                            borderRadius: 7,
                                            maxWidth: '60%'
                                        },

                                    {
                                        backgroundColor: isSelected ? '#D9CCC4' : null,
                                        width: isSelected ? '55%' : null,
                                        alignItems: isSelected ? 'center' : null
                                    }
                                ]}>

                                <View >

                                    <Image source={source}
                                        style=
                                        {{ width: 200, height: 200, borderRadius: 7 }} />

                                    <Text style={{
                                        textAlign: 'right',
                                        position: 'absolute',
                                        fontSize: 10,
                                        color: 'white',
                                        right: 19,
                                        bottom: 7,
                                        marginTop: 9
                                    }}>
                                        {formateTime(item?.timeStamp)}

                                    </Text>

                                </View>


                            </Pressable>
                        )
                    }
                })}
            </ScrollView>

            <View
                style={
                    {
                        flexDirection: 'row',
                        alignItems: 'center',
                        paddingHorizontal: 10,
                        paddingVertical: 10,
                        borderTopWidth: 1,
                        borderTopColor: '#dddddd',
                        marginBottom: showEmojiSelector ? 0 : 25
                    }}>

                {/* <Entypo name="emoji-happy" size={24} color={'gray'} onPress={handleEmojiPress} /> */}
                <Pressable   onPress={handleEmojiPress} ><Image source={require('../assets/happy-icon.webp')} style={{ width: 25, height: 25}}/></Pressable>
                <TextInput
                    value={message}
                    onChangeText={(text) => { setMessage(text) }}
                    placeholder='Type your message...'
                    style=
                    {{
                        flex: 1,
                        height: 40,
                        borderWidth: 1,
                        borderColor: '#dddddd',
                        borderRadius: 20,
                        paddingHorizontal: 10
                    }} />

                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>

                    {/* <EvilIcons onPress={pickImage} name="camera" size={26} color="gray" /> */}
                    <Pressable  onPress={pickImage}><Image source={require('../assets/icons8-camera-25.png')} style={{ width: 27, height: 27}}/></Pressable>

                    {/* <FontAwesome5 name="microphone" size={20} color="gray" /> */}

                </View>

                <Pressable
                    onPress={() => handleSend("text")}
                    style={{ backgroundColor: "#007bff", paddingVertical: 8, paddingHorizontal: 12, borderRadius: 15, marginLeft: 10 }}>
                    <Text style={{ fontSize: 15, fontWeight: '900', color: 'white' }}>Send</Text>
                </Pressable>

            </View>

            {showEmojiSelector && (<EmojiSelector
                onEmojiSelected={(emoji) => {
                    setMessage((preMessage) => preMessage + emoji)
                }} style={{ height: 250 }} />)}

        </KeyboardAvoidingView>
    )
}

export default ChatMessageScreen

const styles = StyleSheet.create({})