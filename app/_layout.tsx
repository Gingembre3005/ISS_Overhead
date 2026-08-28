import { Stack } from 'expo-router'
import React from 'react'
import { StyleSheet } from 'react-native'
import { LocationProvider } from "../context/LocationContext";

const _layout = () => {
  return (
    <Stack>

      <Stack.Screen  name = "index" ></Stack.Screen>
      <Stack.Screen  name = "location" ></Stack.Screen>
           <LocationProvider>   <Stack /></LocationProvider>
    </Stack>


    
  )
}

export default _layout

const styles = StyleSheet.create({})