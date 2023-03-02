// Import Types
import * as TYPES from "../../types/types";

export const userLoginAction = (user: Record<string, any>) => {
	return { type: TYPES.USER_LOGIN, payload: user };
};
