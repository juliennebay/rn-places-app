import { ADD_PLACE, SET_PLACES } from "./places-actions";
import Place from "../models/place";
import { overflowMenuPressHandlerActionSheet } from "react-navigation-header-buttons";

const initialState = {
  places: []
};

export default (state = initialState, action) => {
  switch (action.type) {
    case SET_PLACES:
      //fetch saved data
      return {
        //action.places because in places-actions.js, that's the key that was set (line 50)
        places: action.places.map(
          place => new Place(place.id.toString(), place.title, place.imageUri)
          //no need for lat/lng for now
        )
      };

    case ADD_PLACE:
      //create a new place
      const newPlace = new Place(
        action.placeData.id.toString(),
        action.placeData.title,
        action.placeData.image
      );
      return {
        places: state.places.concat(newPlace)
      };
    default:
      return state;
  }
};
