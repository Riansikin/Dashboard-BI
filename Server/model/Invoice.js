const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const InvoiceSchema = new Schema({
    nama_rekanan : {
        type: String,
        required: true,
    },
    nama_pekerjaan : {
        type: String,
        required: true,
    },
    nomor_invoice: {
        type: String,
        required: true,
        unique: true
    },
    nilai_kontrak : {
        type: String,
        required : true,
    },
    periode_penagihan:{
        mulai: {
            type: Date,
            required : true
        },
        akhir: {
            type: Date,
            required: true
        }
    },
    nilai_tagihan : {
        type : String,
        required : true
    },
    dokumen : {
        type : String,
        required : true
    },
    status: {
        type: String,
        default: 'Sedang diproses'
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

const invoice = mongoose.model('invoice', InvoiceSchema);
module.exports = invoice;