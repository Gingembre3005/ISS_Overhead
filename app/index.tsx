import { Link } from "expo-router";
import { StyleSheet,ScrollView, Text, View } from 'react-native';
import * as satelitte from "satellite.js"
import { useLocationContext } from "../context/LocationContext";
import React, {useEffect, useState} from "react";
import { Orbitron_400Regular, Orbitron_700Bold} from "@expo-google-fonts/orbitron";
import { useFonts} from "expo-font"

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
          const currentTime = new Date()
          const timetonextpass = foundPassStart.getTime() - currentTime.getTime()
          setTimeUntilNextPass(Math.max(0,timetonextpass))
          

          

          }
        },1000)
        
        return () => {
        clearInterval(interval);
        clearInterval(nextPassMathInterval)
        };
      
      

      





    }, [latitude,longitude,satrec]);

  const totalseconds = Math.floor((TimeUntilNextPass ?? 0)/1000)
  const hours = Math.floor(totalseconds / 3600)
  const minutes = Math.floor((totalseconds % 3600)/60)
  const seconds = totalseconds % 60
  
  const [fontsLoaded] = useFonts({
    Orbitron: Orbitron_400Regular,
    ObitronBold: Orbitron_700Bold,
    DSEG7: require("../assets/fonts/DSEG7ModernMini-Bold.ttf")
  })
  
  if(!fontsLoaded){
    return(
      <View style={styles.container}>
        <Text style={styles.moon}>Loading</Text>
      </View>
    )
  }
  return (
    <ScrollView style={styles.scrollView} contentContainerStyle={styles.container}>
      <Text style={styles.moon}>User coordinates:</Text>
      <Text style={styles.moon}>-------------------</Text>
      <Text style={styles.moon}>Your latitude: <Text style={styles.countdown}>{latitude?.toFixed(2)}</Text></Text>
      <Text style={styles.moon}>Your longitude: <Text style={styles.countdown}>{longitude?.toFixed(2) }</Text></Text>
      <Text>  </Text>
      <Text style={styles.moon}>ISS coordinates:</Text>
      <Text style={styles.moon}>-------------------</Text>
      <Text style={styles.moon}>ISS latitude: <Text style={styles.countdown}>{issLatitude?.toFixed(2)}</Text></Text>
      <Text style={styles.moon}>ISS longitude: <Text style={styles.countdown}>{issLongitude?.toFixed(2) }</Text></Text>
      <Text style={styles.moon}>ISS elevation over the horizon: <Text style={styles.countdown}>{MaxMaxElevation?.toFixed(1)}</Text></Text>
      <Text>   </Text>
      <Text style={styles.moon}>Informations about next ISS pass:</Text>
      <Text style={styles.moon}>-------------------</Text>
      <Text style={styles.moon}>Start of next ISS pass in: <Text style={styles.countdown}>
        {hours.toString().padStart(2,"0")}:
        {minutes.toString().padStart(2,"0")}:
        {seconds.toString().padStart(2,"0")}</Text></Text>
      
      <Text style={styles.moon}>Start of next pass: {
      nextPassTime
      ?<Text style={styles.countdown}> {nextPassTime.toLocaleString()} </Text>
      : "calculating..."}</Text>
      <Text style={styles.moon}>End of next pass:{
      nextPassTimeEnd
      ?<Text style = {styles.countdown}>{nextPassTimeEnd.toLocaleString()}</Text>
      :"calculating..."}</Text>
      <Text style={styles.moon}>Highest point during pass at: <Text style={styles.countdown}>{MaxMaxElevation?.toFixed(1)}</Text> degrees over the horizon</Text>
      <Text style = {styles.moon}>Highest point will be reached at: <Text style={styles.countdown}>{MaxMaxElevationTime?.toLocaleString()}</Text></Text>
      <Text>    </Text>
      <Text style={styles.moon}>ISS data status:</Text>
      <Text style={styles.moon}>-------------------</Text>
      <Text style={styles.dataLoaded}>{loading 
        ? "Getting ISS data"
        : error
        ? `Error : ${error} 
Try again in a few hours`
        : "ISS Data Loaded"}</Text>
     {/* <Text style={styles.moon}>{!loading && !error && (
        <>
         <Text style={styles.moon}>Tle Line 1: {tleLine1 }</Text>
          <Text style={styles.moon}>Tle Line 2: {tleLine2 }</Text>
        
        
        </>
      )}</Text>*/}
      <View style = {styles.buttonContainer}>
      <Link style={styles.ButtonStyle} href = "/location">location settings</Link>
      </View>
    </ScrollView> 
  )
}

export default Index

const styles = StyleSheet.create({
    container: {
      alignItems: 'flex-start',
      justifyContent: 'flex-start'
    },
    buttonContainer: {
      width: "100%",
      alignItems: "center"


    },
    scrollView: {
        flex: 1,
        backgroundColor: 'black',
        
    },
    dataLoaded: {
      fontSize: 22,
      color: 'white',
      fontFamily: "Orbitron",
      letterSpacing: 2,
      alignItems: 'center'
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

    buttonText: {
      fontFamily: "Orbitron",
      fontSize: 15,
      color: "white",
      letterSpacing: 2,
      textAlign: "center"
      




    },


    moon: {

    
        fontSize: 22,
        color: 'white',
        fontFamily: "Orbitron",
        letterSpacing: 2

    },
    countdown: {

    
        
      color: 'white',
      fontFamily: "DSEG7",
      fontSize: 22,
      letterSpacing: 2,
      textAlign: "center",

    }

})