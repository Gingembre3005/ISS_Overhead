import { Link } from "expo-router";
import React, { useState } from "react";


import {ScrollView, Pressable, Alert,Keyboard, Button, StyleSheet, Text,TouchableWithoutFeedback, TextInput, View } from 'react-native';
import useLocation from '../hooks/useLocation';
import { useLocationContext } from "@/context/LocationContext";
//import { Button } from "@react-navigation/elements";

export default function LocationScreen() {


  const {
  latitude,
  longitude,
  errorMsg,
  
  getUserLocation,
} = useLocation();

const [latitudeInput, setLatitudeInput] = useState("")
const [longitudeInput, setLongitudeInput] = useState("")

const {latitude: savedLatitude,
       longitude: savedLongitude,
       address,
       
       setLocation} = useLocationContext()

const saveManuallLocation = ()=>{
const lat = parseFloat(latitudeInput)
const long = parseFloat(longitudeInput)
if(Number.isNaN(lat)||Number.isNaN(long)||lat < -90||lat>90||long <-180||long>180){
  Alert.alert("Invalid location","The location is invalid")
  return
}
setLocation(lat,long)
Alert.alert("Location saved","Location was saved")
}

const [showText, setShowText] = useState(false);


return (
<TouchableWithoutFeedback onPress={Keyboard.dismiss} >
<ScrollView style={styles.scrollview} contentContainerStyle={styles.container}>

<Text>  </Text>
<Text>  </Text>
<Text>  </Text>
<Text style={styles.title}>Location Screen</Text>
<Text>  </Text>
      
      
<Text style={styles.moon}>Actual location:</Text>

<Pressable
style={({ pressed }) => [
  styles.coolButton,
  pressed && styles.coolButtonPressed,
]}
onPress={() => {
  getUserLocation(); setShowText(true);
  
}}>
  <Text style={styles.coolButtonText}>set location automatically</Text>
</Pressable>
<Text>  </Text>
{showText&& !address?.country &&(
<Text style= {styles.moon}>Setting Location, this may take a few seconds</Text>
)}

{address?.country && (
<Text style={styles.moon}>
  Country: {address.country }
</Text>)}

{address?.region && (
<Text style={styles.moon}>
  Region: {address.region }
</Text>)}

{address?.city && (
<Text style={styles.moon}>
  City: {address.city}
</Text>)}

{address?.postalCode && (
<Text style={styles.moon}>
  Postal Code: {address.postalCode }
</Text>)}

{address?.street && (
<Text style={styles.moon}>
  Street: {address.street}
</Text>)}

{address?.streetNumber && (      
<Text style={styles.moon}>
  Streetnumber: {address.streetNumber }  {"\n"}
  
</Text>)}

<Text style={styles.moon}>
  Latitude: {savedLatitude ?? "Waiting for it to be set..."}
</Text>
< TextInput style={styles.manual}
placeholder = "Manually set latitude"
value={latitudeInput}
onChangeText={setLatitudeInput}
keyboardType="numbers-and-punctuation"
/>
<Text style={styles.moon}>
  Longitude: {savedLongitude ?? "Waiting for it to be set..."}
</Text>
< TextInput style={styles.manual}
placeholder = "Manually set longitude"
value={longitudeInput}
onChangeText={setLongitudeInput}
keyboardType="numbers-and-punctuation"
/>

<Text style={styles.attention}>
  Don't forget to save!
</Text>

<Pressable 
style={({pressed}) => [
  styles.coolButton,
  pressed && styles.coolButtonPressed,

]}
onPress={()=>{
  Keyboard.dismiss();
  saveManuallLocation();
}}>
  <Text style={styles.coolButtonText}>manually save your location</Text>


</Pressable>

<View style={styles.buttonContainer}>

<Link style={styles.ButtonStyle} href = "/"> <Text style={styles.moon}>Back to main screen</Text></Link>

</View>
<Text>  </Text>
<Text>  </Text>
<Text>  </Text>


{errorMsg ? (
  <Text style={styles.moon}>{errorMsg}</Text>
) : null}
    
    </ScrollView>
    </TouchableWithoutFeedback>
  )
}




const styles = StyleSheet.create({
    container: {
        
        backgroundColor: 'black',
        alignItems: 'flex-start',
        justifyContent: 'flex-start'
    },
    coolButtonPressed: {
      opacity: 0.5,
      transform: [{ scale: 0.97}],
    },
    scrollview: {
      flex: 1,
      backgroundColor: "black"
    },
    coolButton: {
      width: 260,
      alignSelf: "flex-start",
      marginTop: 30,
      paddingVertical: 16,
      borderWidth: 1,
      borderColor: "white",
      borderRadius: 4,
      alignItems: "center",
      justifyContent: "center"

    },
    coolButtonText: {
      fontFamily: "Orbitron",
      fontSize: 15,
      color: "white",
      letterSpacing: 2,
      textAlign: "center"

    },
    buttonContainer: {
      width: "100%",
      alignItems: "center"
    },
    ButtonStyle: {
      marginTop: 35,
      width: 250,
      paddingVertical: 16,
      borderWidth: 1,
      borderColor: "white",
      borderRadius: 3,
      textAlign: "center",
      fontFamily: "Orbitron",
      fontSize: 15,
      color: "white",
      letterSpacing: 2,
    },
    manual: {
        width: 280,
        height: 50,
        backgroundColor: "#1e1e1e",
        borderColor: "white",
        borderWidth: 1,
        borderRadius: 10,
        color: "white",
        paddingHorizontal: 15,
        fontSize: 16,
        marginBottom: 15, 
},

    moon: {

        fontFamily: "Orbitron",
        fontSize: 22,
        color: 'white',
        letterSpacing: 2

    },
    title: {
      fontFamily: "Orbitron",
      fontSize: 35,
      color: "white",
      letterSpacing: 2,
      textDecorationLine: "underline"
    },
    attention:{
      fontFamily: "Orbitron",
      fontSize: 22,
      color: 'red',
      letterSpacing: 2
    },
    test: {

    
        
        color: 'white',
        alignItems: 'center',
        justifyContent: 'center'

    }

})