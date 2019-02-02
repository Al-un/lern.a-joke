// ---------- Actions
export const JOKE_REQUEST = 'chuck/joke/REQUEST';
export const JOKE_LOADED = 'chuck/joke/LOADED';
export const JOKE_CLEAR = 'chuck/joke/CLEAR';

// ---------- Actions creator
export const requestJokes = () => ({ type: JOKE_REQUEST });
export const clearJokes = () => ({ type: JOKE_CLEAR });

// ---------- Reducer
export const jokeReducer = (state = {}, action = {}) => {
  switch (action.type) {
    case JOKE_CLEAR:
      return { ...state, jokes: undefined };
    case JOKE_LOADED:
      console.log('Received jokes:', action.payload);
      return { ...state, jokes: action.payload };
    default:
      return state;
  }
};
export default jokeReducer;
