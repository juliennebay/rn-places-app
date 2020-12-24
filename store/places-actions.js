import * as FileSystem from "expo-file-system";
//expo-file-system provides access to a file system stored locally on the device
//see: https://docs.expo.io/versions/v40.0.0/sdk/filesystem/

import { insertPlace, fetchPlaces } from "../helpers/db";

export const ADD_PLACE = "ADD_PLACE";
export const SET_PLACES = "SET_PLACES";

export const addPlace = (title, image) => {
  //use redux thunk
  return async dispatch => {
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
        "Dummy address",
        //using some random numbers for lat/lng for now
        15.6,
        12.3
      );
      dispatch({
        type: ADD_PLACE,
        placeData: { id: dbResult.insertId, title: title, image: newPath }
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
