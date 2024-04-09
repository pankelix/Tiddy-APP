const session = {
    set homeId(homeId) {
        if (homeId) // session.homeId = '123' entrará aqui
            sessionStorage.homeId = homeId
        else // si pongo session.homeId = null, entrará aqui
            delete sessionStorage.homeId
    },

    get homeId() {
        // sessionStorage.homeId
        return sessionStorage.homeId ? sessionStorage.homeId : null
    },

    set token(token) {
        if (token) // session.token = '123' entrará aqui
            sessionStorage.token = token
        else // si pongo session.token = null, entrará aqui
            delete sessionStorage.token
    },

    get token() {
        // sessionStorage.token
        return sessionStorage.token ? sessionStorage.token : null
    },

    set profileId(profileId) {
        if (profileId) // session.profileId = '123' entrará aqui
            sessionStorage.profileId = profileId
        else // si pongo session.profileId = null, entrará aqui
            delete sessionStorage.profileId
    },

    get profileId() {
        // sessionStorage.profileId
        return sessionStorage.profileId ? sessionStorage.profileId : null
    },

    set profileToken(profileToken) {
        if (profileToken) // session.profileToken = '123' entrará aqui
            sessionStorage.profileToken = profileToken
        else // si pongo session.profileToken = null, entrará aqui
            delete sessionStorage.profileToken
    },

    get profileToken() {
        // sessionStorage.profileToken
        return sessionStorage.profileToken ? sessionStorage.profileToken : null
    },

    set profileRole(profileRole) {
        if (profileRole) // session.profileRole = '123' entrará aqui
            sessionStorage.profileRole = profileRole
        else // si pongo session.profileRole = null, entrará aqui
            delete sessionStorage.profileRole
    },

    get profileRole() {
        // sessionStorage.profileRole
        return sessionStorage.profileRole ? sessionStorage.profileRole : null
    },
}

export default session