import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import Colors from "../constants/Colors";
//The MapView package: https://docs.expo.io/versions/v40.0.0/sdk/map-view/

const MapScreen = props => {
  //initialLocation & readonly - set in PlaceDetailScreen.js (line 21)
  //they might be undefined or set (if the location has been saved and the user is accessing the map screen from the PlaceDetailScreen.js)
  const initialLocation = props.navigation.getParam("initialLocation");
  const readonly = props.navigation.getParam("readonly");

  const [selectedLocation, setSelectedLocation] = useState(initialLocation);

  const mapRegion = {
    latitude: initialLocation ? initialLocation.lat : 45.5,
    longitude: initialLocation ? initialLocation.lng : -73.56,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421
  };

  const selectLocationHandler = event => {
    //the "event" here is when the user clicks on the map
    //it returns an object, which includes the coordinates (of the location that the user clicked)

    if (readonly) {
      //if it's read only (see notes on line 15), then the user can't select another new location
      return;
    }

    setSelectedLocation({
      lat: event.nativeEvent.coordinate.latitude,
      lng: event.nativeEvent.coordinate.longitude
    });
  };

  const saveLocationHandler = useCallback(() => {
    if (!selectedLocation) {
      //"save" (line 78) doesn't work if a location hasn't been selected
      return;
    }
    props.navigation.navigate("NewPlace", {
      //goes back a page (to the "NewPlaceScreen") and sends back the selectedLocation (so that it can update the map preview)
      pickedLocation: selectedLocation
    });
  }, [selectedLocation]);

  useEffect(() => {
    props.navigation.setParams({ saveLocation: saveLocationHandler });
  }, [saveLocationHandler]);

  let markerCoordinates;

  if (selectedLocation) {
    markerCoordinates = {
      //the keys HAVE to be named "latitude" (not lat)/ "longitude" (not lng)
      latitude: selectedLocation.lat,
      longitude: selectedLocation.lng
    };
  }

  return (
    <MapView
      style={styles.map}
      region={mapRegion}
      onPress={selectLocationHandler}
    >
      {markerCoordinates && (
        <Marker
          title="Selected Location"
          coordinate={markerCoordinates}
        ></Marker>
      )}
    </MapView>
  );
};

MapScreen.navigationOptions = navData => {
  const saveFn = navData.navigation.getParam("saveLocation");
  //readonly - see notes on line 15
  const readonly = props.navigation.getParam("readonly");
  if (readonly) {
    //if readonly is set, then we won't show the "save" button
    return {};
  }
  return {
    headerRight: (
      <TouchableOpacity style={styles.headerButton} onPress={saveFn}>
        <Text style={styles.headerButtonText}>Save</Text>
      </TouchableOpacity>
    )
  };
};

const styles = StyleSheet.create({
  map: {
    flex: 1
  },
  headerButton: {
    marginHorizontal: 20
  },
  headerButtonText: {
    fontSize: 16,
    color: Platform.OS === "android" ? "white" : Colors.primary
  }
});

export default MapScreen;
