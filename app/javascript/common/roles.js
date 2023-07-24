const USER_ROLES = {
    admin: ['admin'],
    bishopric: ['bishopric', 'bishop', 'admin'],
    clerk: ['clerk', 'bishopric', 'bishop', 'admin'],
    music: ['music', 'clerk', 'bishopric', 'bishop', 'admin']
}

export const hasRole = (role, currentRole) => {
    return USER_ROLES[role].includes(currentRole)
}