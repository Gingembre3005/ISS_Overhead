import React, { createContext, useContext, useState } from "react";
import * as Location from "expo-location"

type LocationContextType = {
  latitude: number | null;
  longitude: number | null;
  address: Location.LocationGeocodedAddress | null;
  setLocation: (latitude: number, longitude: number) => void;
  setAddress: (address: Location.LocationGeocodedAddress) => void
};

const LocationContext = createContext<LocationContextType | undefined>(
  undefined
);

export function LocationProvider({ children }: { children: React.ReactNode }) {
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [address, setAddress] = useState<Location.LocationGeocodedAddress | null>(null)


  const setLocation = (latitude: number, longitude: number) => {
    setLatitude(latitude);
    setLongitude(longitude);
  };

  return (
    <LocationContext.Provider
      value={{
        latitude,
        longitude,
        address,
        setLocation,
        setAddress,
      }}
    >
      {children}
    </LocationContext.Provider>
  );
}

export function useLocationContext() {
  const context = useContext(LocationContext);

  if (!context) {
    throw new Error(
      "useLocationContext must be used inside LocationProvider"
    );
  }

  return context;
}