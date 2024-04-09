import mongoose from 'mongoose'

const { Schema, model, ObjectId } = mongoose

const home = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minlength: 8
    }
})

const room = new Schema({
    home: {
        type: ObjectId,
        ref: 'Home'
    },
    name: {
        type: String,
        required: true,
        unique: true
    }
})

const profile = new Schema({
    home: {
        type: ObjectId,
        ref: 'Home'
    },
    name: {
        type: String,
        required: true,
        unique: true
    },
    pincode: {
        type: String,
        required: true,
        length: 4
    },
    color: {
        name: {
            type: String,
            unique: true
        },
        code: {
            type: String,
            unique: true
        }
    },
    role: {
        type: String,
        default: 'user'
    },
    points: {
        type: Number,
        default: 0
    }/*,
    avatar: {
        name: {
            type: String,
            unique: true
        },
        type: {
            type: String
        }
    },
     avatar: {
        data: Buffer,
        contentType: String
    } */
})

const template = new Schema({
    home: {
        type: ObjectId,
        ref: 'Home'
    },
    name: {
        type: String,
        required: true
    },
    rooms: [{
        type: ObjectId,
        ref: 'Room'
    }],
    periodicity: {
        type: Number
    },
    points: {
        type: Number
    }
})

const task = new Schema({
    home: {
        type: ObjectId,
        ref: 'Home'
    },
    template: {
        type: ObjectId,
        ref: 'Template'
    },
    assignee: {
        type: ObjectId,
        ref: 'Profile'
    },
    done: {
        type: Boolean,
        default: false
    },
    date: {
        type: Date,
        default: new Date()
    },
    delay: {
        type: Number,
        default: 0
    },
    oldId: {
        type: String
    }
})

const Home = model('Home', home)
const Room = model('Room', room)
const Profile = model('Profile', profile)
const Template = model('Template', template)
const Task = model('Task', task)

export {
    Home, Room, Profile, Template, Task
}
