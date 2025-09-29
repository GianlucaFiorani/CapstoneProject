import { SET_COURTS } from "../action";

const initialState = {
  data: [],
};

const courtsReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_COURTS: {
      return {
        ...state,
        data: action.payload,
      };
    }
    default:
      return state;
  }
};

export default courtsReducer;
