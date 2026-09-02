import { Link } from "expo-router";
import React, { useState } from "react";


import { Alert, Button, StyleSheet, Text, TextInput, View } from 'react-native';
import useLocation from '../hooks/useLocation';
import { useLocationContext } from "@/context/LocationContext";
//import { Button } from "@react-navigation/elements";

export default function LocationScreen() {


  const {
  latitude,
  longitude,
  errorMsg,
  address,
  getUserLocation,
} = useLocation();

const [latitudeInput, setLatitudeInput] = useState("")
const [longitudeInput, setLongitudeInput] = useState("")

const {setLocation} = useLocationContext()

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
    
<View style={styles.container}>
      
      
<Text style={styles.moon}>Actual location:</Text>
<Button title="set location automaticly" onPress={()=>{getUserLocation(); setShowText(true);}}/>
{showText&&(
<Text style= {styles.moon}>Setting Location, this may take a few seconds</Text>
)}
<Text style={styles.moon}>
  City: {address?.city || "Loading..."}
</Text>

<Text style={styles.moon}>
  Region: {address?.region ?? "Loading..."}
</Text>

<Text style={styles.moon}>
  Country: {address?.country ?? "Loading..."}
</Text>

<Text style={styles.moon}>
  Postal Code: {address?.postalCode ?? "Loading..."}
</Text>
      

<Text style={styles.moon}>
  Latitude: {latitude ?? "Loading..."}
</Text>
< TextInput
placeholder = "Manually set latitude"
value={latitudeInput}
onChangeText={setLatitudeInput}
keyboardType="decimal-pad"
/>
<Text style={styles.moon}>
  Longitude: {longitude ?? "Loading..."}
</Text>
< TextInput
placeholder = "Manually set longitude"
value={longitudeInput}
onChangeText={setLongitudeInput}
keyboardType="decimal-pad"
/>
<Link style={styles.moon} href = "/"> Back to main screen</Link>


{errorMsg ? (
  <Text style={styles.moon}>{errorMsg}</Text>
) : null}
    </View>
  )
}




const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'black',
        alignItems: 'center',
        justifyContent: 'center'
    },


    moon: {

    

        color: 'white'

    },
    test: {

    
        
        color: 'white',
        alignItems: 'center',
        justifyContent: 'center'

    }

})