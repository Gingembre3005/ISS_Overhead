import { StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import * as Location from 'expo-location'
import { useLocationContext } from "../context/LocationContext";



const useLocation = () => {
  const { setLocation } = useLocationContext();
  const[errorMsg, setErrorMsg] = useState("")
  const [longitude, setLongitude] = useState<number | null>(null);
const [latitude, setLatitude] = useState<number | null>(null);
  const [address, setAddress] =
  useState<Location.LocationGeocodedAddress | null>(null);
  

  const getUserLocation = async ()=>{

    let{status} = await Location.requestForegroundPermissionsAsync()
    
    if( status != "granted"){
      setErrorMsg("userlocation was not granted")
      return
    }
    let {coords} = await Location.getCurrentPositionAsync()
    if (coords){
      const{longitude, latitude} = coords
  


      console.log("lat and long",latitude, longitude)
      setLatitude(latitude)
      setLongitude(longitude)
      setLocation(latitude, longitude);


      let response = await Location.reverseGeocodeAsync({
        latitude,
        longitude

      })
      if (response.length > 0) {
    setAddress(response[0]);
       }
      console.log("USER LOCATION IS",response)

    }





  }
  

  return {
    latitude,
    longitude,
    errorMsg,
    address, 
    getUserLocation,

  }
    
  
}

export default useLocation

const styles = StyleSheet.create({})