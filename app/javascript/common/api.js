export const fetchPrograms = (search_type=null, search_value=null) => {
    const url = new URL("/api/v1/programs", document.baseURI);
    if(search_type || search_value) {
        url.searchParams.set('search_type', search_type);
        url.searchParams.set('search_value', search_value);
    }
    return(
        fetch(url)
        .then(res => res.json())
    )
}

export const fetchUsers = () => {
    return(
    fetch("/api/v1/users")
        .then(res => res.json())
    )
}

export const fetchHymns = () => {
    return(
    fetch("/api/v1/hymns")
        .then(res => res.json())
    )
}
