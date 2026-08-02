import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { useEffect } from 'react';
import useLocation from '../hooks/useLocation';




const RootLayout = () => {

  const {
  latitude,
  longitude,
  errorMsg,
  address,
  getUserLocation,
} = useLocation();

useEffect(() => {
  getUserLocation();
}, []);
  return (
    <View style={styles.container}>
      <Text style={styles.moon}>Wesh le sang</Text>
      <Text style={styles.moon}>Actual location:</Text>
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

{errorMsg ? (
  <Text style={styles.moon}>{errorMsg}</Text>
) : null}
    </View>
  )
}

export default RootLayout


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