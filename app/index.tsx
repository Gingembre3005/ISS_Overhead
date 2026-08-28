import { Link } from "expo-router";
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import * as satelitte from "satellite.js"
import { useLocationContext } from "../context/LocationContext";

const tleLine1 = "..."
const tleLine2 = "..."

const satres = satelitte.twoline2satrec(tleLine1,tleLine2)

const Index = () => {
  const { latitude, longitude } = useLocationContext();
  return (
    <View style={styles.container}>
      <Text style={styles.moon}>index</Text>
      <Text style={styles.moon}>Your latitude: {latitude}</Text>
      <Text style={styles.moon}>Your longitude: {longitude }</Text>
      <Link style={styles.moon} href = "/location"> location settings</Link>
    </View>
  )
}

export default Index

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