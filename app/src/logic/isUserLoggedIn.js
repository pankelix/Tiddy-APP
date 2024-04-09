import session from "./session"

function isUserLoggedIn() {
    return !!session.token
}

export default isUserLoggedIn