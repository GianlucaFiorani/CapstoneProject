import { SET_DATA } from "../action";

const initialState = {
  data: [],
};

const reviewDataReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_DATA: {
      return {
        ...state,
        data: action.payload,
      };
    }
    default:
      return state;
  }
};

export default reviewDataReducer;
