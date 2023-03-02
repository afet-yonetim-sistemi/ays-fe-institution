// Import Antd
import { notification } from "antd";

// Import Utils
import { translate } from "./translateUtils";

// Types
export type NotificationStatus = "success" | "info" | "warning" | "error";

export const notificationUtil = (
	title: string,
	description?: string,
	type?: NotificationStatus
) => {
	notification?.[type ? type : "info"]({
		message: translate(title),
		description: translate(description),
		placement: "bottomLeft",
		duration: 3,
	});
};
