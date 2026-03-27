import mongoose from "mongoose"

const eventLogSchema = new mongoose.Schema({
    eventId : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event',
        required: true,
    },
    field : {
        type: String,
        required: true,
        enum:["startTime","endTime","timezone","name","members"]
    },
    previousValue: mongoose.Schema.Types.Mixed,
    updatedValue: mongoose.Schema.Types.Mixed,
    timestamp: {
        type: Date,
        default: Date.now,
    }
})
eventLogSchema.index({ eventId: 1 })
export const EventLog = mongoose.model('EventLog', eventLogSchema)