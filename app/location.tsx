import { Link } from "expo-router";
import React, { useState } from "react";

import { Button, StyleSheet, Text, View } from 'react-native';
import useLocation from '../hooks/useLocation';
//import { Button } from "@react-navigation/elements";

export default function Index() {


  const {
  latitude,
  longitude,
  errorMsg,
  address,
  getUserLocation,
} = useLocation();



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

<Text style={styles.moon}>
  Longitude: {longitude ?? "Loading..."}
</Text>
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