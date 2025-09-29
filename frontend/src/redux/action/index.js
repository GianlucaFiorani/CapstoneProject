export const SET_DATA = "SET_DATA";
export const SET_COURTS = "SET_COURTS";
export const SET_REVIEW = "SET_REVIEW";
export const SET_SEARCH = "SET_SEARCH";

export const reviewAction = (id, rating, comment, img) => ({
  type: SET_REVIEW,
  payload: { id, rating, comment, img },
});

export const searchAction = (lat, lon) => ({
  type: SET_SEARCH,
  payload: { lat, lon },
});

export const fetchReviewAction = (token, id, loading) => {
  return async (dispatch) => {
    loading(true);
    try {
      const resp = await fetch(`http://localhost:3001/reviews/${id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (resp.ok) {
        const data = await resp.json();
        dispatch({ type: SET_DATA, payload: data });
      }
    } catch (error) {
      console.log(error);
    } finally {
      loading(false);
    }
  };
};

export const fetchCourtsAction = (token, loading, error) => {
  return async (dispatch) => {
    loading(true);
    try {
      const resp = await fetch("http://localhost:3001/courts", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (resp.ok) {
        const data = await resp.json();
        dispatch({ type: SET_COURTS, payload: data });
      }
    } catch (error) {
      error(error.message);
    } finally {
      loading(false);
    }
  };
};
