import { Link } from "expo-router";
import { StyleSheet, Text, View } from 'react-native';
import * as satelitte from "satellite.js"
import { useLocationContext } from "../context/LocationContext";
import React, {useEffect, useState} from "react";

const TLE_URL = "https://celestrak.org/NORAD/elements/gp.php?CATNR=25544&FORMAT=TLE";


const Index = () => {
  const { latitude, longitude } = useLocationContext();
  const [satrec, setSatrec] = useState<any>(null);
  const [tleLine1, setTleLine1] = useState<string | null>(null);
  const [tleLine2, setTleLine2] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [issLatitude, setIsslatitude] = useState<number | null>(null)
  const [issLongitude, setIsslongitude] = useState<number | null>(null)
  const [issElevation, setIssElevation] = useState<number | null>(null)
  const [nextPassTime, setNextPassTime] = useState<Date | null>(null)
  const [nextPassTimeEnd, setNextPassTimeEnd] = useState<Date | null>(null)
  const [MaxMaxElevation, setMaxElevation] = useState<number | null>(null)
  const [MaxMaxElevationTime, setMaxElevationTime] = useState<Date | null>(null)
  const [TimeUntilNextPass, setTimeUntilNextPass] = useState<number | null>(null)
  useEffect(()=>{
     
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
        const newsatrec = satelitte.twoline2satrec(line1, line2);
        setSatrec(newsatrec)
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

    
  },[])
  useEffect(() => {
        if(satrec === null ||
          latitude === null ||
          longitude === null
        ){
          console.log("Waiting for something...")
          return
        }

        const getISSElevation = (date: Date) =>{
        const positionAndVelocity = satelitte.propagate(
        satrec,
        date
        )
        if(
          !positionAndVelocity?.position || typeof positionAndVelocity.position === "boolean"

        ){
        return null;
        }
        const positionPass = positionAndVelocity.position
        const gmstP = satelitte.gstime(date)

        const ecf = satelitte.eciToEcf(positionPass, gmstP)

        const observerGdP = {
          longitude: satelitte.degreesToRadians(longitude),
          latitude: satelitte.degreesToRadians(latitude),
          height: 0

        }
        const lookAngle = satelitte.ecfToLookAngles(
          observerGdP,
          ecf
        )
        return satelitte.radiansToDegrees(
          lookAngle.elevation
        )
        }
        // loop  for searching next pass
        const now = new Date()

        let previousElevation = getISSElevation(now)
        let foundPassStart: Date | null = null

        for(let seconds = 10; seconds <= 24 * 60*60 ; seconds+= 10){
          
          const futureDate = new Date(
            now.getTime() + seconds *1000
          )
          const currentElevation = getISSElevation(futureDate)

          if(
            previousElevation !== null &&
            currentElevation !== null&&
            previousElevation <= 0 &&
            currentElevation > 0){
              console.log("next pass was found")
              console.log("pass time:", futureDate)

              setNextPassTime(futureDate)
              foundPassStart = futureDate
              
              break
            }
            previousElevation = currentElevation
        }
          let foundPassEnd: Date | null = null
          if(foundPassStart !== null){
         let previousEndElevation = getISSElevation(foundPassStart)
          
        for(let seconds = 10; seconds <= 24*60*60; seconds+= 10){
          
          if (previousEndElevation == null){
            console.log("previousEnd is null somehow")
            break

          }
         
          const DateFuture = new Date(
            foundPassStart.getTime() + seconds*1000

          )

          const calcElevation = getISSElevation(DateFuture)
          if (calcElevation == null){
            console.log("calcElevation is null")
            break
          }

          if ( calcElevation < 0 && previousEndElevation >= 0){
            console.log("End of next pass was found")
            console.log("end of pass time:", DateFuture)

            foundPassEnd = DateFuture
            setNextPassTimeEnd(DateFuture)
            break

          }



            previousEndElevation = calcElevation
        }
      }

      if (foundPassEnd!== null && foundPassStart !== null ){
        let maxElevation = 0
        let maxElevationTime = new Date(foundPassStart.getTime())
        for (let seconds = 10; seconds <= 24*60*60; seconds +=10){
          const checkDate= new Date (foundPassStart.getTime() + seconds*1000)
          const checkElevation = getISSElevation(checkDate)
          if(checkDate > foundPassEnd){
            
            break
          }
          
          if( checkElevation !== null && checkElevation > maxElevation)  {
            maxElevation = checkElevation
            maxElevationTime = checkDate 

          }
        


        }
        setMaxElevation(maxElevation)
        setMaxElevationTime (maxElevationTime)
        console.log("MaxElevation during pass:", maxElevation)
        console.log("at:", maxElevationTime)
        




      }

        const updateISSposition = () => {
        const now = new Date();
        const positionAndVellocity = satelitte.propagate(satrec,now);
        if (!positionAndVellocity || ! positionAndVellocity.position){
            throw new Error("could not calculate the position")

        }
        const gmst = satelitte.gstime(now);
        const position = positionAndVellocity.position;
        if (!position || typeof position == "boolean"){
            throw new Error("could not calculate the position")

        }
        const ecf = satelitte.eciToEcf(position,gmst)
        
        
        const geodetic = satelitte.eciToGeodetic(position,gmst);
        
        const observerGd = {
            longitude: satelitte.degreesToRadians(longitude),
            latitude: satelitte.degreesToRadians(latitude),
            height: 0

        }
        const isslatitude = satelitte.degreesLat(geodetic.latitude)
        const isslongitude = satelitte.degreesLong(geodetic.longitude)
        const lookAngle = satelitte.ecfToLookAngles(observerGd,ecf)
        const elevation = satelitte.radiansToDegrees(lookAngle.elevation)
        setIssElevation(elevation)
        setIsslatitude(isslatitude)
        setIsslongitude(isslongitude)
        console.log("Iss Latitude:", isslatitude);
        console.log("Iss Longitude:", isslongitude);
      };

        updateISSposition();
        const interval = setInterval(
          updateISSposition,5000
        )
        const nextPassMathInterval = setInterval(()=>{
          if(foundPassStart != null){
          const timetonextpass = foundPassStart.getTime() - now.getTime()
          setTimeUntilNextPass(Math.max(0,timetonextpass))
          const totalseconds = Math.floor((timetonextpass ?? 0)/1000)

          const hours = 

          }
        },1000)
        return () => {
        clearInterval(interval);
        };
      
      

      





    }, [latitude,longitude,satrec]);



  

  return (
    <View style={styles.container}>
      <Text style={styles.moon}>index</Text>
      <Text style={styles.moon}>Your latitude: {latitude}</Text>
      <Text style={styles.moon}>Your longitude: {longitude }</Text>
      <Text style={styles.moon}>ISS latitude: {issLatitude}</Text>
      <Text style={styles.moon}>ISS longitude: {issLongitude }</Text>
      <Text style={styles.moon}>ISS elevation over the horizon: {issElevation }</Text>
      
      <Text style={styles.moon}>Start of next pass: {
      nextPassTime
      ?nextPassTime.toLocaleString()
      : "calculating..."}</Text>
      <Text style={styles.moon}>End of next pass:{
      nextPassTimeEnd
      ?nextPassTimeEnd.toLocaleString()
      :"calculating..."}</Text>
      <Text style={styles.moon}>Highest point during pass at: {MaxMaxElevation} degrees over the horizon</Text>
      <Text style = {styles.moon}> Highest point will be reached at: {MaxMaxElevationTime?.toLocaleString()}</Text>
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