import mongoose from "mongoose"

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
            unique: true,
        }
    },
    {timestamps: true}
)

export const User = mongoose.model('User', userSchema)