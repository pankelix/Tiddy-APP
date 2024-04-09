import session from './session'

function logoutUser() {
    session.token = null
    session.homeId = null
    session.profileToken = null
    session.profileId = null
    session.profileRole = null

    return
}

export default logoutUser