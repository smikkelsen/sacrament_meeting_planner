import {format, utcToZonedTime} from "date-fns-tz";

// export const csrfToken = $( 'meta[name="csrf-token"]' ).attr( 'content' )

export const formatDateString = (str, pattern='MMM do yyyy h:mm aaa') => {
    if (str) {
        const isoDate = Date.parse(str)
        const timeZone = 'MST'
        return format(utcToZonedTime(isoDate, timeZone), pattern);
    } else {
        return 'Never';
    }
};

export const findArrayElementByAttribute = (array, value, attributeType='id') => {
    return array.find((element) => {
        return element.id == value;
    })
}

