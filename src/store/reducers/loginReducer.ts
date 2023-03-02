// Import Type
import { USER_LOGIN, USER_LOGOUT } from "../types/types";

// Initial State
const initialState = {
	user: null,
};

export default function loginReducer(
	state: Record<string, any> = initialState,
	action: { type: string; payload?: Record<string, any> }
) {
	switch (action.type) {
		case USER_LOGIN:
			return {
				user: action.payload,
			};
		case USER_LOGOUT:
			return {
				user: null,
			};

		default:
			return state;
	}
}
