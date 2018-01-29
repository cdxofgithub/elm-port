import mongoose from 'mongoose'

const Schema = mongoose.Schema

const adminSchema = new Schema({
    user_name: String,
    password: String,
    id: Number,
    create_time: String,
    admin: {
        type: String,
        default: '管理员'
    },
    status: Number,
    avatar: {
        type: String,
        default: 'default.jpg'
    },
    city: String
})

adminSchema.index({id: 1})  //添加索引、升序

const Admin = mongoose.model('Admin', adminSchema)

export default Admin