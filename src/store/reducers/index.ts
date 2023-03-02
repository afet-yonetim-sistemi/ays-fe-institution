// Redux Persist
import { persistReducer } from "redux-persist";
import sessionStorage from "redux-persist/es/storage/session";

// Import Reducers
import loginReducer from "./loginReducer";

// Login Reducer Persist Config
const loginPersistConfig = {
	key: "root",
	storage: sessionStorage,
};

const login = persistReducer(loginPersistConfig, loginReducer);

const reducers = { login };

export default reducers;
