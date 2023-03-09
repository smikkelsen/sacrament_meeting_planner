export const fetchPrograms = (params={}) => {
    const url = new URL("/api/v1/programs", document.baseURI);
    Object.keys(params).forEach(function(key) {
        url.searchParams.set(key, params[key]);
    });
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
