import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistStore } from "redux-persist";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import reducers from "./reducers";

const rootReducer = combineReducers(reducers);

export const store = configureStore({
  reducer: rootReducer,
  // Add other store configuration options here
});

export const useAppDispatch = () => useDispatch<typeof store.dispatch>();

export const persistor = persistStore(store);
export type RootState = ReturnType<typeof store.getState>;

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
