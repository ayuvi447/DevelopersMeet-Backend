import mongoose from 'mongoose'

const connectionRequestSchema = new mongoose.Schema({
    fromUserId:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref:'User'
    },
    toUserId:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref:'User'
    },
    status:{
        type: String,
        enum:{
         values: ["ignored", "interested","accepted","rejected"],
         message: `{value} is incorrect enum type`
        },
        required: true
    }
},{
    timestamps: true
})

// connectionRequestSchema.pre('save', function (next) {
//   if (this.fromUserId.equals(this.toUserId)) {
//     const err = new Error("Cannot send connection request to yourself.");
//     return next(err); // Don't throw, just pass to next()
//   }
//   next();
// });

export const ConnectionRequest = mongoose.model('Connection', connectionRequestSchema)