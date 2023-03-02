// Import Redux
import { createStore, combineReducers, applyMiddleware, compose } from "redux";
import ReduxThunk, { ThunkAction } from "redux-thunk";
import { persistStore } from "redux-persist";

// Import Reducers
import reducers from "./reducers";

// Combine Reducers
const reducer = combineReducers(reducers);

// Redux Thunk
declare module "redux" {
	interface Dispatch<A extends Action = AnyAction> {
		<S, E, R>(asyncAction: ThunkAction<R, S, E, A>): R;
	}
}

// Devtools
const devTools =
	window && (window as any).__REDUX_DEVTOOLS_EXTENSION__
		? window && (window as any).__REDUX_DEVTOOLS_EXTENSION__()
		: (f: any) => f;

// Apply Middlewares
const enhancer = compose(applyMiddleware(ReduxThunk), devTools);

// Create Store
export const store = createStore(reducer, enhancer);
export const persistor = persistStore(store);

// RootState Type
export type RootState = ReturnType<typeof store.getState>;
