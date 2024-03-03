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

export const fetchLastUsedHymnProgram = (hymn_id) => {
    if(hymn_id) {
        const url = new URL("/api/v1/programs", document.baseURI);
        url.searchParams.set('per_page', '5');
        url.searchParams.set('date_order', 'desc');
        url.searchParams.set('search_type', 'hymns');
        url.searchParams.set('search_value', hymn_id);
        return (
            fetch(url)
                .then(res => res.json())
        )
    }
}

export const fetchUsers = () => {
    return (
        fetch("/api/v1/users")
            .then(res => res.json())
    )
}

export const fetchBulletinItems = () => {
    return (
        fetch("/api/v1/bulletin_items")
            .then(res => res.json())
    )
}

export const fetchUserRoles = () => {
    return (
        fetch("/api/v1/users/user_roles")
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
                'Content-Type': 'application/json',
                'X-CSRF-Token': csrfToken
            },
            body: JSON.stringify(payload)
        })
            .then(res => res.json())
    )
}

export const fetchTrelloListCards = (listType) => {
    return (
        fetch(`/api/v1/trello/list_cards/${listType}`)
            .then(res => res.json())
    )
}


export const fetchTemplateVars = (templateType) => {
    return (
        fetch(`/api/v1/templates/list_vars/${templateType}`)
            .then(res => res.json())
    )
}

export const bulkEditProgram = (payload) => {
    let url = "/api/v1/programs/bulk_edit/"
    let method = "POST"
    return (
        fetch(url, {
            method: method,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'X-CSRF-Token': csrfToken
            },
            body: JSON.stringify(payload)
        })
            .then(res => res.json())
    )
}

export const updateUser = (userId, payload) => {
    let url = `/api/v1/users/${userId}`
    let method = "PUT"
    return (
        fetch(url, {
            method: method,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'X-CSRF-Token': csrfToken
            },
            body: JSON.stringify(payload)
        })
            .then(res => res.json())
    )
}

export const updateBulletinItem = (itemId, payload) => {
    let url = `/api/v1/bulletin_items/${itemId}`
    let method = "PUT"
    return (
        fetch(url, {
            method: method,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'X-CSRF-Token': csrfToken
            },
            body: JSON.stringify(payload)
        })
            .then(res => res.json())
    )
}

export const createBulletinItem = (payload) => {
    let url = '/api/v1/bulletin_items'
    let method = "POST"
    return (
        fetch(url, {
            method: method,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'X-CSRF-Token': csrfToken
            },
            body: JSON.stringify(payload)
        })
            .then(res => res.json())
    )
}

export const updateBulletinItemPositions = (payload) => {
    let url = '/api/v1/bulletin_items/update_positions'
    let method = "POST"
    return (
        fetch(url, {
            method: method,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'X-CSRF-Token': csrfToken
            },
            body: JSON.stringify({bulletin_items: payload})
        })
            .then(res => res.json())
    )
}

export const destroyBulletinItem = (bulletinItemId) => {
    return (
        fetch(`/api/v1/bulletin_items/${bulletinItemId}`,
            {method: 'delete',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'X-CSRF-Token': csrfToken
                }
            })
            .then(res => res.json())
    )
}

export const fetchBulletinItemTypes = () => {
    return (
        fetch(`/api/v1/bulletin_items/item_types`)
            .then(res => res.json())
    )
}