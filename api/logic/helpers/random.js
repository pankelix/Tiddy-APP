import mongoose from 'mongoose'

function name() {
    return `name-${Math.random()}`
}
function email() {
    return `email-${Math.random()}@mail.com`
}
function password() {
    return `password-${Math.random()}`
}

const { ObjectId } = mongoose.Types

function id() {
    return new ObjectId().toString()
}

function image() {
    return `image-${Math.random()}`
}

function text() {
    return `text-${Math.random()}`
}

function pincode() {
    const pincode = Math.random().toString().slice(2, 6)
    pincode.replace(0, 1)
    return pincode
}

function number() {
    return Math.floor(Math.random() * 9) + 1
}

const random = {
    name,
    email,
    password,
    id,
    image,
    text,
    pincode,
    number,
}

export default random