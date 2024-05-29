const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const auditLogSchema = new Schema({
    action: { 
        type: String, 
        enum: ['insert', 'update', 'delete'],
        required : true
    },
    collectionName: String,
    collectionId: Schema.Types.ObjectId,
    userId: Schema.Types.ObjectId,
    timestamp: { 
        type: Date, 
        default: Date.now() 
    },
    oldData: Schema.Types.Mixed,
    newData: Schema.Types.Mixed
});

const AudithLog = mongoose.model('audithlog', auditLogSchema);
module.exports = AudithLog;