// Import date-fns
import {
	subDays,
	addDays,
	format,
	startOfDay,
	endOfDay,
	getHours as getHoursFNS,
	getMinutes,
	getDate as getDateFNS,
	addMonths,
	addYears,
	toDate,
	isDate as isDateFNS,
	isBefore,
	isWithinInterval,
	formatISO,
	isAfter as isAfterFNS,
	parseISO,
} from "date-fns";

import { tr, enUS } from "date-fns/locale";

// Import date formats
import {
	dateTimeSecondFormatFileName,
	dateFormat,
	dateTimeFormat,
	dateHour,
	monthYearFormat,
	dateFormatBackend,
	dateTimeMiliSecondFormatBackend,
	monthFormatToBackend,
	dateTimeSecondFormat,
	dateTimeSecondMiliFormat,
	dayMonthYearTimeFormat,
	timeFormat,
} from "../contants/dateFormats";

// Import i18n
import i18n from "../locales/i18n";

// GetDays
export const getYesterday = () => subDays(new Date(), 1);
export const getToday = () => new Date();
export const getTomorrow = () => addDays(new Date(), 1);
export const getTodayFileName = () => format(new Date(), dateTimeSecondFormatFileName);
export const getSubtractDays = (count: number) => subDays(new Date(), count);
export const getStartOfDay = () => startOfDay(new Date());
export const getEndOfDay = () => endOfDay(new Date());

// Get Now
export const getNowHour = () => getHoursFNS(new Date());
export const getNowMinutes = () => getMinutes(new Date());

// Get Specific Moments
export const getDate = (date: Date) => getDateFNS(date);
export const getMinute = (date: Date) => getMinutes(date);
export const getHours = (date: Date) => getHoursFNS(date);

// Add Date
export const addDay = (count: number) => addDays(new Date(), count);
export const addMonth = (count: number) => addMonths(new Date(), count);
export const addYear = (count: number) => addYears(new Date(), count);

// Formatted to Dates
export const getFormattedDate = (date: Date, dateformat?: string) =>
	format(date, dateformat || dateFormat);
export const getFormattedDateTime = (date: Date, dateformat?: string) =>
	format(date, dateformat || dateTimeFormat);
export const getFormattedHour = (date: Date, dateformat?: string) =>
	format(date, dateformat || dateHour);
export const getFormattedHourAndMinute = (date: Date, dateformat?: string) =>
	format(date, dateformat || timeFormat);
export const getFormattedMonth = (date: Date, dateformat?: string) =>
	format(date, dateformat || monthYearFormat);

// Backend To Component
export const backendToDate = (date: string) => parseISO(date);
export const lastUpdateFormat = (date: string) => format(parseISO(date), dayMonthYearTimeFormat);
export const lastUpdateTimeStampFormat = (date: Date) =>
	format(date, dayMonthYearTimeFormat, { locale: i18n?.language === "en" ? enUS : tr });
export const formattedDate = (date: string) => format(parseISO(date), dayMonthYearTimeFormat);

// To Backend Formatters
export const dateToBackend = (date: Date) => format(date, dateFormatBackend);
export const dateTimeToBackend = (date: Date) => formatISO(date);
export const dateTimeMiliSecondToBackend = (date: Date) =>
	format(date, dateTimeMiliSecondFormatBackend);
export const monthToBackend = (date: Date) => format(date, monthFormatToBackend);

// Stamp
export const stampToString = (date: number, dateformat?: string) =>
	format(date, dateformat || dateTimeFormat);
export const stampToStringSeconds = (date: number, dateformat?: string) =>
	format(date, dateformat || dateTimeSecondFormat);
export const stampToStringMiliSeconds = (date: number, dateformat?: string) =>
	format(date, dateformat || dateTimeSecondMiliFormat);
export const stampToDate = (date: number) => toDate(date);

// Controls
export const isDate = (value: unknown) => isDateFNS(value);
export const isBeforeToday = (value: Date) => isBefore(value, getStartOfDay());
export const isBetween = (date: Date, startDate: Date, endDate: Date) =>
	isWithinInterval(date, { start: startDate, end: endDate });
export const isAfter = (date: Date, date2: Date) => isAfterFNS(date, date2);
export const sortDate = (a: Date, b: Date) => new Date(a).valueOf() - new Date(b).valueOf();
