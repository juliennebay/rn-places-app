import React, { useState } from "react";
import { View, Button, Image, Text, StyleSheet, Alert } from "react-native";
import * as ImagePicker from "expo-image-picker";
//ImagePicker official docs: https://docs.expo.io/versions/v40.0.0/sdk/imagepicker/
//note: there's also the "camera" option in expo
//reminder: need to install -> expo install expo-permissions
import * as Permissions from "expo-permissions";

import Colors from "../../rn-shopping-app/constants/Colors";

const ImgPicker = props => {
  const [pickedImage, setPickedImage] = useState();

  const verifyPermissions = async () => {
    //returns a promise
    const result = await Permissions.askAsync(
      Permissions.CAMERA,
      Permissions.CAMERA_ROLL
    );
    //permission types - official doc - https://docs.expo.io/versions/v40.0.0/sdk/permissions/#permission-types
    if (result.status !== "granted") {
      Alert.alert(
        "Camera not allowed",
        "make sure camera access for this device is turned on",
        [{ text: "OK" }]
      );
      return false;
    }
    return true;
  };

  const takePicHandler = async () => {
    const hasPermission = await verifyPermissions();
    if (!hasPermission) {
      return;
    }
    //this will open up the camera (it returns a promise - object)
    const image = await ImagePicker.launchCameraAsync({
      //see official docs for different options
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.5
    });

    //console.log(image) - see what's inside the object that we get back

    setPickedImage(image.uri);
  };

  return (
    <View style={styles.imagePicker}>
      <View style={styles.imagePreview}>
        {!pickedImage ? (
          <Text>No image selected</Text>
        ) : (
          <Image style={styles.image} source={{ uri: pickedImage }} />
        )}
      </View>
      <Button
        title="Take a pic"
        color={Colors.primary}
        onPress={takePicHandler}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  imagePicker: {
    alignItems: "center"
  },
  imagePreview: {
    width: "100%",
    height: 200,
    marginBottom: 10,
    justifyContent: "center",
    alignItems: "center",
    borderColor: "#ccc",
    borderWidth: 1
  },
  image: {
    width: "100%",
    height: "100%"
  }
});

export default ImgPicker;
