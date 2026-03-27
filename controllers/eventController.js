import { Event } from '../models/Event.js'
import { statusCode } from '../constants/statusCode.js'
import { isValid, toUTC } from '../utils/timezoneUtils.js'
import { EventLog } from '../models/EventLog.js'
import { invalidateCache } from '../middleware/cache.js'

export const createEvent = async (req, res) => {
    const { members, timezone, startTime, endTime } = req.body

    if (!members || members.length === 0) {
        return res.status(statusCode.BAD_REQUEST).json({
            success: false,
            message: "At least one profile is required"
        })
    }

    if (!timezone){
        return res.status(statusCode.BAD_REQUEST).json({
            success: false,
            message: "Timezone is required"
        })
    }

    if (!startTime || !endTime){
        return res.status(statusCode.BAD_REQUEST).json({
            success: false,
            message: "Start and End time are required"
        })
    }

    if (!isValid(startTime, timezone) || !isValid(endTime, timezone)) {
        return res.status(statusCode.BAD_REQUEST).json({ success: false, message: 'Invalid date format' })
    }

    const startUTC = toUTC(startTime,timezone)
    const endUTC = toUTC(endTime,timezone)

    if(endUTC <= startUTC){
        return res.status(statusCode.BAD_REQUEST).json({
            success: false,
            message: "End time must be after start time"
        })
    }

    const event = await Event.create({members, timezone, startTime: startUTC, endTime: endUTC})
    const populated = await event.populate('members','name')

    invalidateCache(['/api/events'])

    res.status(statusCode.CREATED).json({ success: true, data: populated})
}

export const getEventsByMembers = async (req,res)=>{
    const {userId} = req.params

    const events = await Event.find({members: userId}).populate('members','name').sort({startTime:1})

    if(events.length === 0){
        return res.status(statusCode.NOT_FOUND).json({success:false,message:'No Events found for this Profile'})
    }

    res.json({success:true, data: events})
}

export const updateEvent = async (req, res) => {
    const { eventId } = req.params
    const { members, timezone, startTime, endTime } = req.body

    const event = await Event.findById(eventId)
    if (!event) {
        return res.status(statusCode.NOT_FOUND).json({ success: false, message: 'Event not found' })
    }

    const logs = []

    if (timezone && timezone !== event.timezone) {
        logs.push({ eventId, field: 'timezone', previousValue: event.timezone, updatedValue: timezone })
        event.timezone = timezone
    }

    const tz = event.timezone

    if (startTime) {
        const newStart = toUTC(startTime, tz)
        if (newStart.getTime() !== event.startTime.getTime()) {
            logs.push({eventId,field: 'startTime', previousValue: event.startTime, updatedValue: newStart})
            event.startTime = newStart
        }
    }

    if (endTime) {
        const newEnd = toUTC(endTime, tz)
        if (newEnd.getTime() !== event.endTime.getTime()) {
            logs.push({ eventId, field: 'endTime', previousValue: event.endTime, updatedValue: newEnd })
            event.endTime = newEnd
        }
    }

    if (members) {
        const oldIds = event.members.map((id) => id.toString()).sort()
        const newIds = [...members].sort()
        if (JSON.stringify(oldIds) !== JSON.stringify(newIds)) {
            logs.push({ eventId, field: 'members', previousValue: event.members, updatedValue: members })
            event.members = members
        }
    }

    if (event.endTime <= event.startTime) {
        return res.status(statusCode.BAD_REQUEST).json({ success: false, message: 'End time must be after start time' })
    }

    await event.save()

    if (logs.length > 0) {
        await EventLog.insertMany(logs)
    }

    invalidateCache(['/api/events'])

    const populated = await event.populate('members', 'name')
    res.json({ success: true, data: populated })
}

export const getEventLogs = async (req,res) => {
    const {eventId} = req.params

    const logs = await EventLog.find({eventId}).sort({timestamp: -1})

    if(!logs || logs.length===0){
        return res.status(statusCode.NOT_FOUND).json({success:false,message:'No logs found for this Events'})
    }
    res.json({success: true, data: logs})
}