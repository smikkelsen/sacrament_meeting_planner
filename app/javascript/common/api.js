export const csrfToken = document.querySelector('meta[name="csrf-token"]').content;
export const fetchPrograms = (params = {}) => {
    const url = new URL("/api/v1/programs", document.baseURI);
    Object.keys(params).forEach(function (key) {
        url.searchParams.set(key, params[key]);
    });
    return (
        fetch(url)
            .then(res => res.json())
    )
}

export const fetchUsers = () => {
    return (
        fetch("/api/v1/users")
            .then(res => res.json())
    )
}

export const fetchCurrentUser = () => {
    return (
        fetch("/api/v1/users/current")
            .then(res => res.json())
    )
}

export const fetchHymns = () => {
    return (
        fetch("/api/v1/hymns")
            .then(res => res.json())
    )
}

export const fetchTemplates = () => {
    return (
        fetch("/api/v1/templates")
            .then(res => res.json())
    )
}

export const fetchProgramTemplate = (programId, templateId) => {
    return (
        fetch(`/api/v1/programs/${programId}}/templates/${templateId}/generate`)
            .then(res => res.json())
    )
}


export const upsertTemplate = (payload) => {
    let url = "/api/v1/templates/"
    let method = "POST"
    if (payload.id) {
        url = url + payload.id
        method = "PUT"
    }
    return (
        fetch(url, {
            method: method,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        })
            .then(res => res.json())
    )
}
