import {format, utcToZonedTime} from "date-fns-tz";

export const formatDateString = (str, pattern = 'MMM do yyyy h:mm aaa', nullStr = 'Never') => {
    if (str) {
        const isoDate = Date.parse(str)
        const timeZone = 'America/Denver'
        return format(utcToZonedTime(isoDate, timeZone), pattern);
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
