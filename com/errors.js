// 401
class CredentialsError extends Error {
    constructor(message) {
        super(message)

        this.name = this.constructor.name
    }
}

class TokenError extends Error {
    constructor(message) {
        super(message)

        this.name = this.constructor.name
    }
}

class PermissionError extends Error {
    constructor(message) {
        super(message)

        this.name = this.constructor.name
    }
}

// 404
class NotFoundError extends Error {
    constructor(message) {
        super(message)

        this.name = this.constructor.name
    }
}

// 406
class ContentError extends Error {
    constructor(message) {
        super(message)

        this.name = this.constructor.name
    }
}

// 409
class DuplicityError extends Error {
    constructor(message) {
        super(message)

        this.name = this.constructor.name
    }
}

// 500
class SystemError extends Error {
    constructor(message) {
        super(message)

        this.name = this.constructor.name
    }
}

class TypeError extends Error {
    constructor(message) {
        super(message)

        this.name = this.constructor.name
    }
}

export {
    CredentialsError,
    TokenError,
    NotFoundError,
    ContentError,
    DuplicityError,
    SystemError,
    TypeError,
    PermissionError
}

const errors = {
    CredentialsError,
    TokenError,
    NotFoundError,
    ContentError,
    DuplicityError,
    SystemError,
    TypeError,
    PermissionError
}

export default errors