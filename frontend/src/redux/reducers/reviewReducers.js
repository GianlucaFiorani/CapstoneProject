import { SET_REVIEW } from "../action";

const initialState = {
  id: null,
  rating: null,
  comment: "",
  img: null,
};

const reviewReducers = (state = initialState, action) => {
  switch (action.type) {
    case SET_REVIEW:
      return {
        ...state,
        id: action.payload.id,
        rating: action.payload.rating,
        comment: action.payload.comment,
        img: action.payload.img,
      };

    default:
      return state;
  }
};

export default reviewReducers;
