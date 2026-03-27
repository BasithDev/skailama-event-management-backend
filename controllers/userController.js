import { User } from '../models/User.js'
import { statusCode } from '../constants/statusCode.js'
import { invalidateCache } from '../middleware/cache.js'

export const getAllUsers = async (req,res) => {
    const users = await User.find()
    res.json({success: true, data: users})
}

export const createUser = async (req,res) => {
    const {name} = req.body

    if (!name || !name.trim()){
        return res.status(statusCode.BAD_REQUEST).json({
            success:false,
            message: "Name is reuired"
        })
    }

    const existing = await User.findOne({ name: name.trim() })

    if(existing){
        return res.status(statusCode.BAD_REQUEST).json({
            success:false,
            message:"Profile name already exists"
        })
    }

    const user = await User.create({ name: name.trim() })

    invalidateCache(['/api/users'])

    res.status(statusCode.CREATED).json({ success: true, data: user })
}
