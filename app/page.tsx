"use client";

import largeCities from "./data/large-cities.json";
import React, { useMemo, useState } from "react";
import {
  GoogleMap,
  LoadScriptNext,
  Marker,
  useJsApiLoader,
} from "@react-google-maps/api";
import { useGeolocation as useBrowserGeolocation } from "react-use";
import { distance } from "@/app/utils/distance";

enum Location {
  EXACT,
  LANDMASS,
  LARGE_CITY,
}

const mapContainerStyle = {
  width: "400px",
  height: "400px",
};

const Home = () => {
  const { isLoaded: isGoogleMapsLoaded, loadError: googleMapsLoaderError } =
    useJsApiLoader({
      googleMapsApiKey:
        process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? "MISSING_API_KEY",
    });

  let {
    loading: isBrowserGeolocationLoading,
    error: browserGeolocationError,
    latitude,
    longitude,
  } = useBrowserGeolocation();

  latitude ??= 0;
  longitude ??= 0;

  const [selectedLocation, setSelectedLocation] = useState<Location>(
    Location.LARGE_CITY
  );

  console.log({ isGoogleMapsLoaded });
  console.log({ isBrowserGeolocationLoading });
  console.log([latitude, longitude]);

  let earthSandwichPosition = useMemo<google.maps.LatLngLiteral>(
    () => ({
      // @ts-ignore idk why typescript thinks this
      lat: latitude * -1,
      // @ts-ignore idk why typescript thinks this
      lng: longitude + 180,
    }),
    [latitude, longitude]
  );

  if (browserGeolocationError || googleMapsLoaderError) {
    return <div>Map cannot be loaded right now, sorry.</div>;
  }

  // switch (selectedLocation) {
  //   case Location.EXACT:
  //     // do nothing
  //     break;
  //   case Location.LANDMASS:
  //     // TODO
  //     break;
  //   case Location.LARGE_CITY:
  //     let currNearestDistance = Number.MAX_VALUE;
  //     largeCities.forEach((c) => {
  //       if (
  //         distance(
  //           earthSandwichPosition.lng,
  //           earthSandwichPosition.lat,
  //           c.loc.coordinates[1],
  //           c.loc.coordinates[0]
  //         ) < currNearestDistance
  //       ) {
  //         earthSandwichPosition = {
  //           lat: c.loc.coordinates[1],
  //           lng: c.loc.coordinates[0],
  //         };
  //       }
  //     });
  //     console.log(earthSandwichPosition);
  //     break;
  // }

  return (
    <>
      <h1>Earth Sandwich</h1>
      <form>
        <button onClick={() => setSelectedLocation(Location.EXACT)}>
          Exact Location
        </button>
        <button onClick={() => setSelectedLocation(Location.LANDMASS)}>
          Nearest Landmass
        </button>
        <button onClick={() => setSelectedLocation(Location.LARGE_CITY)}>
          Nearest Large City
        </button>
      </form>
      {isGoogleMapsLoaded && !isBrowserGeolocationLoading ? (
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          center={earthSandwichPosition}
          zoom={2}
        >
          <Marker position={earthSandwichPosition} />
        </GoogleMap>
      ) : (
        <div>Loading...</div>
      )}
    </>
  );
};

export default React.memo(Home);
