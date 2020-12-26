import React from "react";
import { View, Text, StyleSheet } from "react-native";
import MapView from "react-native-maps";
//The MapView package: https://docs.expo.io/versions/v40.0.0/sdk/map-view/

const MapScreen = props => {
  const mapRegion = {
    latitude: 45.5,
    longitude: -73.56,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421
  };

  return <MapView style={styles.map} region={mapRegion} />;
};

const styles = StyleSheet.create({
  map: {
    flex: 1
  }
});

export default MapScreen;
