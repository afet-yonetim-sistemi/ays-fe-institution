// Import i18n
import i18n from "../locales/i18n";

export const translate = (str?: string): string => {
	return str ? i18n.t(str) : "";
};
