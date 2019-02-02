import { createStore, applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga';

import reducer from './joke.ducks';
import jokeSagas from './joke.sagas';

const sagaMiddleware = createSagaMiddleware();

// init Redux store
const store = createStore(reducer, applyMiddleware(sagaMiddleware));

// Run Sagas
sagaMiddleware.run(jokeSagas);

export default store;
