import { combineReducers, configureStore } from "@reduxjs/toolkit";

import reviewReducers from "../reducers/reviewReducers";
import reviewDataReducer from "../reducers/reviewDataReducers";
import courtsReducer from "../reducers/CourtsReducers";
import searchReducers from "../reducers/searchReducers";

const rootReducers = combineReducers({
  reviewData: reviewDataReducer,
  review: reviewReducers,
  courts: courtsReducer,
  search: searchReducers,
});

const store = configureStore({
  reducer: rootReducers,
});

export default store;
