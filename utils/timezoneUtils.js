import {DateTime} from 'luxon'

export const toUTC = (dateStr,tz) => {
    return DateTime.fromISO(dateStr, {zone: tz}).toUTC().toJSDate()
}

export const isValid = (dateStr,tz) => {
    return DateTime.fromISO(dateStr, {zone: tz}).isValid
}