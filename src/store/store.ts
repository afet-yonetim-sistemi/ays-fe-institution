import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import UIReducer from './reducers/UIReducer';
import authReducer from './reducers/authReducer';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';

const persistConfig1 = {
  key: 'reducer1',
  storage,
  // Add any additional configuration options here for reducer1
};

const persistConfig2 = {
  key: 'reducer2',
  storage,
  // Add any additional configuration options here for reducer2
};

const rootReducer = combineReducers({
  ui: persistReducer(persistConfig1, UIReducer),
  auth: persistReducer(persistConfig2, authReducer),
  // Add other persisted reducers here
});

export const store = configureStore({
  reducer: rootReducer,
  // Add other store configuration options here
});

export const useAppDispatch = () => useDispatch<typeof store.dispatch>();

export const persistor = persistStore(store);
export type RootState = ReturnType<typeof store.getState>;

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;