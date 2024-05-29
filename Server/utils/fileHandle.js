const multer = require('multer');
const path = require('path');
const fs = require('fs');
const generateInvoiceNumber = require('./generetaNomorInvoice');
const generateContractNumber = require('./generateNomorTransaction');
const { beritaAcaraCreateValidation } = require('../validation/beritaAcaraValidation');
const { invoiceValidate } = require('../validation/invoiceValidation');

const berita_acara_storage = multer.diskStorage({
    destination : function (req, file, cb) {
        beritaAcaraCreateValidation(req.body, (validationResult) => {
            if (validationResult.status === "error") {
                const error = new Error(validationResult.show_msg);
                cb(error); 
            }
            const dir = 'assets/document/berita_acara/';
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
            }
            cb(null, dir);
        });
    },
    filename : async function (req, file, cb) {
        try {
            const nomor_kontrak = await generateContractNumber();
            const extname = path.extname(file.originalname);
            const fileName = `${nomor_kontrak}_berita_acara${extname}`;
            cb(null, fileName);
        } catch (error) {
            
            console.error("Gagal menghasilkan nomor kontrak:", error);
            cb(error);
        }
    }
});


const uploadBeritaAcara = multer({
    storage: berita_acara_storage,
    limits: { fileSize: 10 * 1024 * 1024 },
    fileFilter: function (req, file, cb) {
        if(!file){
            cb(new Error('File tidak ditemukan'));
        }
        const filetypes = /pdf|zip/;
        const mimetype = filetypes.test(file.mimetype);
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    
        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb(new Error('Jenis file yang diunggah harus PDF atau ZIP'));
        }
    }
}).single('berita_acara');

const bukti_bayar_storage = multer.diskStorage({
    destination : function (req, file, cb) {
        const dir = 'assets/document/bukti_bayar/';
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        cb(null, dir);
    },
    filename : async function (req, file, cb) {
        const { id } = req.params;
        try {
            const extname = path.extname(file.originalname);
            const fileName = `${id}_bukti_bayar${extname}`;
            cb(null, fileName);
        } catch (error) {
            console.error("Gagal menghasilkan nomor kontrak:", error);
            cb(error);
        }
    }
});

const uploadBuktiBayar = multer({
    storage: bukti_bayar_storage,
    limits: { fileSize: 10 * 1024 * 1024 },
    fileFilter: function (req, file, cb) {
        if(!file){
            cb(new Error('File tidak ditemukan'));
        }
        const filetypes = /pdf|zip/;
        const mimetype = filetypes.test(file.mimetype);
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    
        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb(new Error('Jenis file yang diunggah harus PDF atau ZIP'));
        }
    }
}).single('bukti_bayar');



const invoice_storage = multer.diskStorage({
    destination : function (req, file, cb) {

        invoiceValidate(  req.body, (validationResult) => {
            if(validationResult.status === "error"){
                const error = new Error(validationResult.show_msg);
                cb(error);
            }
            const dir = 'assets/document/invoice/';
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
            }
            cb(null, dir);
        });
        
    },
    filename : async function (req, file, cb) {
        
        try {
            const invoice_number = await generateInvoiceNumber();
            const extname = path.extname(file.originalname);
            const fileName = `${invoice_number}_invoice${extname}`;
            cb(null, fileName);
        } catch (error) {
            console.error("Gagal menghasilkan nomor kontrak:", error);
            cb(error);
        }
    }
});

const uploadInvoice = multer({
    storage: invoice_storage,
    limits: { fileSize: 10 * 1024 * 1024 },
    fileFilter: function (req, file, cb) {
        if(!file){
            cb(new Error('File tidak ditemukan'));
        }
        const filetypes = /pdf|zip/;
        const mimetype = filetypes.test(file.mimetype);
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    
        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb(new Error('Jenis file yang diunggah harus PDF atau ZIP'));
        }
    }
}).single('invoice');


module.exports = { uploadBeritaAcara, uploadBuktiBayar, uploadInvoice };