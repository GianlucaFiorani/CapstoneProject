import { combineReducers, configureStore } from "@reduxjs/toolkit";

import reviewReducers from "../reducers/reviewReducers";
import reviewDataReducer from "../reducers/reviewDataReducers";

const rootReducers = combineReducers({
  reviewData: reviewDataReducer,
  review: reviewReducers,
});

const store = configureStore({
  reducer: rootReducers,
});

export default store;
