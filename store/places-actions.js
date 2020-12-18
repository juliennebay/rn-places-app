import * as FileSystem from "expo-file-system";
//expo-file-system provides access to a file system stored locally on the device
//see: https://docs.expo.io/versions/v40.0.0/sdk/filesystem/

export const ADD_PLACE = "ADD_PLACE";

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
    } catch (err) {
      console.log(err);
      throw err;
    }

    dispatch({ type: ADD_PLACE, placeData: { title: title, image: newPath } });
  };
};
