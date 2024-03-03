import {format, utcToZonedTime} from "date-fns-tz";
import _ from "lodash";

// export const csrfToken = $( 'meta[name="csrf-token"]' ).attr( 'content' )

export const findArrayElementByAttribute = (array, value, attributeType = 'id') => {
    return array.find((element) => {
        return element[attributeType] == value;
    })
}

export const humanize = (str) => {
    if(str) {
        let i, frags = str.split('_');
        for (i = 0; i < frags.length; i++) {
            frags[i] = frags[i].charAt(0).toUpperCase() + frags[i].slice(1);
        }
        return frags.join(' ');
    } else {
        return ''
    }
}

export const scrollIntoViewWithOffset = (selector, offset) => {
    if (document.querySelector(selector)) {
        window.scrollTo({
            behavior: 'smooth',
            top:
                document.querySelector(selector).getBoundingClientRect().top -
                document.body.getBoundingClientRect().top -
                offset,
        })
    }
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

export const boolToStr = (bool) => {
    return (
        bool ? 'Yes' : 'No'
    )
}
