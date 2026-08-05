import { Stack } from 'expo-router'
import React from 'react'
import { StyleSheet } from 'react-native'

const _layout = () => {
  return (
    <Stack>

      <Stack.Screen  name = "index" ></Stack.Screen>
      <Stack.Screen  name = "location" ></Stack.Screen>
      
    </Stack>
  )
}

export default _layout

const styles = StyleSheet.create({})