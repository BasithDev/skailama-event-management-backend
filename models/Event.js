import mongoose from "mongoose"

const eventSchema = new mongoose.Schema({
        members: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User'
            }
        ],
        timezone: {
            type: String,
            required: true
        },
        startTime: {
            type: Date,
            required: true,
        },
        endTime: {
            type: Date,
            required: true,
        }

    },
    {timestamps: true}
)

eventSchema.index({ members: 1 })
export const Event = mongoose.model('Event', eventSchema)