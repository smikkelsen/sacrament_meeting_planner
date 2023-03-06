import {format, utcToZonedTime} from "date-fns-tz";
import _ from "lodash";

// export const csrfToken = $( 'meta[name="csrf-token"]' ).attr( 'content' )

export const formatDateString = (str, pattern='MMM do yyyy h:mm aaa') => {
    if (str) {
        const isoDate = Date.parse(str)
        const timeZone = 'UTC'
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

export const humanize = (str) => {
    let i, frags = str.split('_');
    for (i=0; i<frags.length; i++) {
        frags[i] = frags[i].charAt(0).toUpperCase() + frags[i].slice(1);
    }
    return frags.join(' ');
}

export const renderInputValue = (program, attributeId) => {
    let val = _.get(program, attributeId)
    if (val) {
        return (val)
    } else {
        return ('')
    }
}