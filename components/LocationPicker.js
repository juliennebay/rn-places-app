//expo-location allows reading geolocation information from the device.
//https://docs.expo.io/versions/v40.0.0/sdk/location/

import React, { useState } from "react";
import {
  View,
  Button,
  Text,
  ActivityIndicator,
  Alert,
  StyleSheet
} from "react-native";

import * as Location from "expo-location";
import * as Permissions from "expo-permissions";
import Colors from "../constants/Colors";

const LocationPicker = props => {
  const [pickedLocation, setPickedLocation] = useState();
  const [isFetching, setIsFetching] = useState(false);

  const verifyPermissions = async () => {
    //returns a promise
    const result = await Permissions.askAsync(Permissions.LOCATION);
    //permission types - official doc - https://docs.expo.io/versions/v40.0.0/sdk/permissions/#permission-types
    if (result.status !== "granted") {
      Alert.alert(
        "Locating user not permitted",
        "You need to grant location permissions to use this app",
        [{ text: "OK" }]
      );
      return false;
    }
    return true;
  };

  const getLocationHandler = async () => {
    const hasPermission = await verifyPermissions();
    if (!hasPermission) {
      return;
    }
    try {
      setIsFetching(true);
      //returns a promise, which will resolve once we get the location
      //if we can't get the location in 5 seconds, we stop trying and just throw an error
      const location = await Location.getCurrentPositionAsync({
        timeout: 5000
      });
      //console.log(location);
      setPickedLocation({
        //const location returns an object
        lat: location.coords.latitude,
        lng: location.coords.longitude
      });
    } catch (err) {
      Alert.alert(
        "Could not fetch location",
        "Please try again or pick a location on the map",
        [{ text: "OK" }]
      );
    }
    setIsFetching(false);
  };

  return (
    <View style={styles.locationPicker}>
      <View style={styles.mapPreview}>
        {isFetching ? (
          <ActivityIndicator size="large" color={Colors.primary} />
        ) : (
          <Text>Location not selected</Text>
        )}
      </View>
      <Button
        title="Get User Location"
        color={Colors.primary}
        onPress={getLocationHandler}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  locationPicker: {
    marginBottom: 15
  },
  mapPreview: {
    marginBottom: 10,
    width: "100%",
    height: 150,
    borderColor: "#ccc",
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center"
  }
});

export default LocationPicker;
