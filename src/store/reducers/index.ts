// Redux Persist
import { persistReducer } from "redux-persist";
import sessionStorage from "redux-persist/es/storage/session";

// Import Reducers
import authReducer from "./authReducer";
import UIReducer from "./UIReducer";
import usersReducer from "./usersReducer";

// Persist Config
const persistConfig = {
  key: "root",
  storage: sessionStorage,
};

const auth = persistReducer(persistConfig, authReducer);
const UI = persistReducer(persistConfig, UIReducer);
const users = persistReducer(persistConfig, usersReducer);

const reducers = { auth, UI, users };

export default reducers;
