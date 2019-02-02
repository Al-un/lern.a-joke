import { call, put, takeEvery } from 'redux-saga/effects';

import { JOKE_LOADED, JOKE_REQUEST, JOKE_CLEAR } from './joke.ducks';

// ---------- Saga
export default function* watchJokes() {
  yield takeEvery(JOKE_REQUEST, loadJokes);
}

// ---------- generators

function* loadJokes() {
  yield put({ type: JOKE_CLEAR });
  console.log('Loading jokes');
  const jokes = yield call(getJokes);
  yield put({ type: JOKE_LOADED, payload: jokes });
}

// ---------- API
const getJokes = async () => {
  const jokesResp = await fetch('http://api.icndb.com/jokes/random/8');
  const jokesJson = await jokesResp.json();
  return jokesJson.value.map(joke => ({
    id: joke.id,
    content: joke.joke,
    misc: joke.categories.join(',')
  }));
};
