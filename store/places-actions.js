import * as FileSystem from "expo-file-system";
//expo-file-system provides access to a file system stored locally on the device
//see: https://docs.expo.io/versions/v40.0.0/sdk/filesystem/

import { insertPlace, fetchPlaces } from "../helpers/db";
import ENV from "../envVar";

export const ADD_PLACE = "ADD_PLACE";
export const SET_PLACES = "SET_PLACES";

//title, image, location dispatched from NewPlaceScreen.js
export const addPlace = (title, image, location) => {
  //use redux thunk
  return async dispatch => {
    //using Google geocoding for address reverse lookup:
    //https://developers.google.com/maps/documentation/geocoding/start#reverse
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${location.lat},${location.lng}&key=${ENV.googleApiKey}`
    );

    if (!response.ok) {
      throw new Error("Something went wrong");
    }

    const resData = await response.json();
    if (!resData.results) {
      throw new Error("Something went wrong");
    }

    const address = resData.results[0].formatted_address;

    //using the auto-generated image name for the files
    const fileName = image.split("/").pop();

    const newPath = FileSystem.documentDirectory + fileName;

    //move the file to const newPath
    //https://docs.expo.io/versions/v40.0.0/sdk/filesystem/#filesystemmoveasyncoptions
    try {
      await FileSystem.moveAsync({
        from: image,
        to: newPath
      });
      const dbResult = await insertPlace(
        title,
        newPath,
        address,
        location.lat,
        location.lng
      );
      dispatch({
        type: ADD_PLACE,
        placeData: {
          id: dbResult.insertId,
          title: title,
          image: newPath,
          address: address,
          coords: { lat: location.lat, lng: location.lng }
        }
      });
    } catch (err) {
      console.log(err);
      throw err;
    }
  };
};

export const loadPlaces = () => {
  return async dispatch => {
    try {
      const dbResult = await fetchPlaces();
      //console.log(dbResult)
      //dbResult.rows._array is where the data is
      dispatch({ type: SET_PLACES, places: [dbResult.rows._array] });
    } catch (err) {
      throw err;
    }
  };
};
