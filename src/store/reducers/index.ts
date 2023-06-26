// Redux Persist
import { persistReducer } from "redux-persist";
import sessionStorage from "redux-persist/es/storage/session";

// Import Reducers
import authReducer from "./authReducer";
import UIReducer from "./UIReducer";

// Persist Config
const persistConfig = {
	key: "root",
	storage: sessionStorage,
};

const auth = persistReducer(persistConfig, authReducer);
const UI = persistReducer(persistConfig, UIReducer);

const reducers = { auth, UI };

export default reducers;
