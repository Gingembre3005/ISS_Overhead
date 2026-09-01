import { Link } from "expo-router";
import { StyleSheet, Text, View } from 'react-native';
import * as satelitte from "satellite.js"
import { useLocationContext } from "../context/LocationContext";
import React, {useEffect, useState} from "react";

const TLE_URL = "https://celestrak.org/NORAD/elements/gp.php?CATNR=25544&FORMAT=TLE";


const Index = () => {
  const { latitude, longitude } = useLocationContext();

  const [tleLine1, setTleLine1] = useState<string | null>(null);
  const [tleLine2, setTleLine2] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [issLatitude, setIsslatitude] = useState<number | null>(null)
  const [issLongitude, setIsslongitude] = useState<number | null>(null)
  useEffect(() => {
    const getISSData = async () => {
      try {
        const response = await fetch(TLE_URL);
        if(!response.ok){
          throw new Error("could not access the URL")

        }
        const text = await response.text()
        console.log("URL response")
        console.log(text)
        const lines = text
          .split("\n")
          .map((line) => line.trim())
          .filter((line) => line.length > 0);


        const line1 = lines.find((line) => line.startsWith("1 "))
        const line2 = lines.find((line) => line.startsWith("2 "))
        if (!line1 || !line2){

          throw new Error("invalid data")

        }
        setTleLine1(line1);
        setTleLine2(line2);
        const satrec = satelitte.twoline2satrec(line1, line2);
        const updateISSposition = () => {
        const now = new Date();
        const positionAndVellocity = satelitte.propagate(satrec,now);
        if (!positionAndVellocity || ! positionAndVellocity.position){
            throw new Error("could not calculate the position")

        }
        const position = positionAndVellocity.position;
        if (!position || typeof position == "boolean"){
            throw new Error("could not calculate the position")

        }
        const gmst = satelitte.gstime(now);
        const geodetic = satelitte.eciToGeodetic(position,gmst);
        const isslatitude = satelitte.degreesLat(geodetic.latitude)
        const isslongitude = satelitte.degreesLat(geodetic.longitude)
        setIsslatitude(isslatitude)
        setIsslongitude(isslongitude)
        console.log("Iss Latitude:", isslatitude);
        console.log("Iss Longitude:", isslongitude);
      };

        updateISSposition();
        const interval = setInterval(
          updateISSposition,5000
        )
        return () => {
        clearInterval(interval);
        };
      } catch (err){
        console.error(err)
        if(err instanceof Error){

          setError(err.message)
        }else{

          setError("unknow error")
        }


      }finally{

        setLoading(false)
      }
      };
      getISSData()

    }, []);



  

  return (
    <View style={styles.container}>
      <Text style={styles.moon}>index</Text>
      <Text style={styles.moon}>Your latitude: {latitude}</Text>
      <Text style={styles.moon}>Your longitude: {longitude }</Text>
      <Text style={styles.moon}>ISS latitude: {issLatitude}</Text>
      <Text style={styles.moon}>ISS longitude: {issLongitude }</Text>
      <Text style={styles.moon}>{loading 
        ? "Getting ISS data"
        : error
        ? `Error : ${error}`
        : "ISS Data Loaded"}</Text>
     {/* <Text style={styles.moon}>{!loading && !error && (
        <>
         <Text style={styles.moon}>Tle Line 1: {tleLine1 }</Text>
          <Text style={styles.moon}>Tle Line 2: {tleLine2 }</Text>
        
        
        </>
      )}</Text>*/}
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