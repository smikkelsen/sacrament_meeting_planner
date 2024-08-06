import {format, formatInTimeZone, utcToZonedTime, toDate} from "date-fns-tz";

export const formatDateTimeString = (str, pattern = 'MMM do yyyy h:mm aaa', nullStr = 'Never') => {
    if (str) {
        const isoDate = toDate(str, { timeZone: 'UTC' })
        return format(isoDate, pattern);
    } else {
        return nullStr;
    }
};

export const formatDateString = (str, pattern = 'MMM do yyyy', nullStr = 'Never') => {
    if (str) {
        const isoDate = toDate(str)
        return format(isoDate, pattern);
    } else {
        return nullStr;
    }
};

export const daysAgo = (days) => {
    var d = new Date()
    d.setDate(d.getDate() - days)
    return(d)
}

export const startOfMonth = (monthOffset=0) => {
    var d = new Date()
    return(new Date(d.getFullYear(), d.getMonth() + monthOffset, 1));
}

export const endOfMonth = (monthOffset=0) => {
    var d = new Date()
    return(new Date(d.getFullYear(), d.getMonth() + 1 + monthOffset, 0));
}

export const startOfYear = (yearOffset=0) => {
    var d = new Date()
    return(new Date(d.getFullYear() + yearOffset, 0, 1));
}

export const endOfYear = (yearOffset=0) => {
    var d = new Date()
    return(new Date(d.getFullYear() + 1 + yearOffset, 0, 0));
}

export const parseDateFromString = (dateString) => {
    // Parse the date string using the Date constructor
    const parsedDate = new Date(dateString);

    // Check if the parsed date is valid
    if (isNaN(parsedDate)) {
        throw new Error('Invalid date string');
    }

    return parsedDate;
}