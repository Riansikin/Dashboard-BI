const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const TransactionShcema = new Schema({

    nomor_kontrak: {
        type: String,
        required: true,
    },
    dokumen : {
        type : String,
        required : true
    },
    created_by: {
        type: Schema.Types.ObjectId,
        ref: 'users',
        required: true,
    },
    created_at: {
        type: Date,
        default: Date.now
    },
    updated_at: {
        type: Date,
        default: Date.now
    }

});

const bukti_bayar = mongoose.model('bukti_bayar', TransactionShcema);
module.exports = bukti_bayar;