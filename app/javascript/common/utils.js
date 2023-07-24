import {format, utcToZonedTime} from "date-fns-tz";
import _ from "lodash";

// export const csrfToken = $( 'meta[name="csrf-token"]' ).attr( 'content' )

export const findArrayElementByAttribute = (array, value, attributeType = 'id') => {
    return array.find((element) => {
        return element.id == value;
    })
}

export const humanize = (str) => {
    let i, frags = str.split('_');
    for (i = 0; i < frags.length; i++) {
        frags[i] = frags[i].charAt(0).toUpperCase() + frags[i].slice(1);
    }
    return frags.join(' ');
}

export const scrollIntoViewWithOffset = (selector, offset) => {
    window.scrollTo({
        behavior: 'smooth',
        top:
            document.querySelector(selector).getBoundingClientRect().top -
            document.body.getBoundingClientRect().top -
            offset,
    })
}

export const sortProgramsByDate = (programs, direction) => {
    let sorted = programs.sort((a, b) => new Date(a.date) - new Date(b.date));
    if (direction === 'desc') {
        sorted = sorted.reverse;
    }
    return (sorted)
}

export const dedupPrograms = (programs) => {
    return (
        [...new Map(programs.map((m) => [m.id, m])).values()]
    )
}
