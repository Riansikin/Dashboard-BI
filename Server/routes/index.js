const express = require("express");
const { registerUser, loginUser, getAllUsers, logout, changeRole } = require("../controller/UserController");
const { userRegisterValidate, userLoginValidation } = require("../validation/userValidation")
const verifyToken = require("../middleware/verifytoken");
const { resfreshToken } = require("../controller/RefreshTokenController");
const { getAllBeritaAcara, createBeritaAcara, getBeritaAcarabyId, updatedBertiaAcarabyId, downloadFileBeritaAcara, acceptBeritaAcarabyId } = require("../controller/TransactionController");
const { uploadBeritaAcara, uploadBuktiBayar,  uploadInvoice } = require("../utils/fileHandle");
const verifyRole = require("../middleware/VerifyRole");
const { exportPDFController } = require("../controller/ExportBeritaAcara");
const { exportInvoice } = require("../controller/ExportInvoice");
const { getBuktiBayar, createBuktiBayar, downloadFileBuktiBayar } = require("../controller/BuktiBayarController");
const { createInovice, getAllinvoice, getInvoicebyId, updatedInvoicebyId, downloadFileInvoice } = require('../controller/InvoiceController');

const routes = express.Router();

routes.get('/refresh-token', resfreshToken);

routes.post('/register', userRegisterValidate ,registerUser);
routes.post('/login', userLoginValidation ,loginUser);
routes.delete('/logout', logout);
routes.get('/get-all-users', verifyRole(['Super Admin']) ,getAllUsers);
routes.patch('/change-role/:newRole', verifyRole(['Super Admin', 'Vendor']) ,changeRole);
routes.post('/new-berita-acara', verifyRole(['Super Admin', 'Admin', 'Vendor']), function(req, res, next) {
    uploadBeritaAcara(req, res, function (err) {
        if (err) {
            console.log("POST /new-berita-acara --- Bad Request (400)");
            return res.status(400).json({ 
                status: 400, 
                msg: "Bad Request",
                show_msg : err.message,
                err 
            });
        }
        next();
    });
}, createBeritaAcara);
routes.get('/get-all-berita-acara', verifyRole(['Super Admin', 'Admin', 'Vendor']), getAllBeritaAcara);
routes.get('/get-berita-acara-id/:id', verifyRole(['Super Admin', 'Admin', 'Vendor']), getBeritaAcarabyId);
routes.patch('/update-berita-acara-status/:id', verifyRole(['Super Admin', 'Admin']), updatedBertiaAcarabyId);
routes.get('/download/:id', verifyRole(['Super Admin', 'Admin', 'Vendor']), downloadFileBeritaAcara);
routes.get('/export-berita-acara', verifyRole(['Super Admin', 'Admin']), exportPDFController);

routes.get('/get-bukti-bayar/:id', verifyRole(['Super Admin', 'Admin', 'Vendor']), getBuktiBayar);
routes.post('/new-bukti-bayar/:id', verifyRole(['Super Admin', 'Admin', 'Vendor']), uploadBuktiBayar, createBuktiBayar);
routes.get('/download-bukti-bayar/:id', verifyRole(['Super Admin', 'Admin', 'Vendor']), downloadFileBuktiBayar);

routes.post('/invoice', verifyRole(['Super Admin', 'Admin', 'Vendor']), function(req, res, next) {
    uploadInvoice(req, res, function (err) {
        if (err) {
            console.log("POST /invoice --- File Bad Request (400)");
            return res.status(400).json({ 
                status: 400, 
                msg: "Bad Request",
                show_msg : err.message,
                err
            });
        }
        next();
    });
}, createInovice);
routes.get('/invoice', verifyRole(['Super Admin', 'Admin', 'Vendor']), getAllinvoice);
routes.get('/invoice/:id', verifyRole(['Super Admin', 'Admin', 'Vendor']), getInvoicebyId);
routes.patch('/invoice/:id', verifyRole(['Super Admin', 'Admin']), updatedInvoicebyId);
routes.get('/download-invoice/:id', verifyRole(['Super Admin', 'Admin', 'Vendor']), downloadFileInvoice);
routes.get('/export-invoice', verifyRole(['Super Admin', 'Admin']), exportInvoice);

module.exports = routes;