import { createStore, applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga';

import { jokeReducer } from 'shared-components';
import jokeSagas from './joke.sagas';

const sagaMiddleware = createSagaMiddleware();

// init Redux store
const store = createStore(jokeReducer, applyMiddleware(sagaMiddleware));

// Run Sagas
sagaMiddleware.run(jokeSagas);

export default store;
