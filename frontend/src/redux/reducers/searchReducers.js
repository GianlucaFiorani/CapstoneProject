import { SET_SEARCH } from "../action";

const initialState = {
  lat: null,
  lon: null,
};

const searchReducers = (state = initialState, action) => {
  switch (action.type) {
    case SET_SEARCH:
      return {
        ...state,
        lat: action.payload.lat,
        lon: action.payload.lon,
      };

    default:
      return state;
  }
};

export default searchReducers;
