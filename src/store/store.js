import { thunk } from 'redux-thunk'
import { createStore, applyMiddleware } from "redux";

//reducer
import reducers from './reducers';

const store = createStore(reducers, applyMiddleware(thunk));

export default store;
