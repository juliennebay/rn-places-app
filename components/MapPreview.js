import React from "react";
import { View, Image, StyleSheet } from "react-native";

import ENV from "../envVar";

const MapPreview = props => {
  let imagePreviewUrl;

  if (props.location) {
    //Google maps platform, static maps: https://developers.google.com/maps/documentation/maps-static/overview
    imagePreviewUrl = `https://maps.googleapis.com/maps/api/staticmap?center=${props.location.lat},${props.location.lng}&zoom=14&size=400x200&maptype=roadmap&markers=color:red%7Clabel:A%7C${props.location.lat},${props.location.lng}&key=${ENV.googleApiKey}`;
  }

  return (
    <View style={{ ...props.style, ...styles.mapPreview }}>
      {props.location ? (
        <Image style={styles.mapImage} source={{ uri: imagePreviewUrl }} />
      ) : (
        props.children
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  mapPreview: {
    justifyContent: "center",
    alignItems: "center"
  },
  mapImage: {
    width: "100%",
    height: "100%"
  }
});

export default MapPreview;
