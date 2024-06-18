const fs = require('fs');
const path = require('path');
const jwt = require("jsonwebtoken");
const collectionName = "invoice";
const encrypt = require('../utils/ecnrypt');
const AudithLog = require("../model/AudithLog");
const UserModel = require("../model/UserModel");
const InvoiceModel = require("../model/Invoice");


module.exports = {
    createInovice : async (req, res) => {
        try {
            const {
                nomor_invoice,
                nama_rekanan,
                nama_pekerjaan,
                nilai_kontrak,
                tanggal_mulai,
                tanggal_akhir,
                nilai_tagihan
            } = req.body;

            const { id } = req.userData;

            if (!req.file) {
                console.log("POST /invoice --- Bad Request (400)");
                return res.status(400).json({ 
                  status: 400, 
                  msg: "Bad Request",
                  show_msg : "File tidak ditemukan" 
                });
            }

            const { filename: fileName } = req.file;
            // const nomor_invoice = req.file.filename.split("_")[0];

            const isNomorInvoiceExist = await InvoiceModel.findOne( {nomor_invoice} );

            if(isNomorInvoiceExist){
              return res.status(400).json({ 
                status: 400, 
                msg: "Bad Request",
                show_msg :`Nomor Invoice '${nomor_invoice}' sudah ada`,
              });
            }

            const mulai = new Date(tanggal_mulai);
            const akhir = new Date(tanggal_akhir);

            const newInvoice = new InvoiceModel({
                nama_rekanan,
                nama_pekerjaan,
                nomor_invoice,
                nilai_kontrak,
                periode_penagihan: {
                    mulai,
                    akhir,
                },
                dokumen : '/assets/document/invoice/' + fileName,
                nilai_tagihan,
                created_by: id,
            });
            const response = await newInvoice.save();

            const newAudithLog = new AudithLog({
                action: "insert",
                collectionName: collectionName,
                collectionId: response._id,
                userId: id,
                oldData: null,
                newData: newInvoice,
            });

            await newAudithLog.save();


            console.log("POST /invoice --- Success (201)");

            return res.status(201).json({
                status: 201,
                msg: "Success Create New Invoice",
                show_msg: `Invoice ${nomor_invoice} ditambahkan`,
                newInvoice,
                newAudithLog,
            });
        

        } catch (error) {
            console.error(
                "POST /invoice --- Error (500):",
                JSON.stringify(error.message)
              );
        
              return res.status(500).json({
                status: 500,
                msg: "Internal Server Error",
                show_msg: "Sistem dalam gangguan, coba lagi nanti",
              });
        }
    },

    getAllinvoice: async (req, res) => {
        try {
          const Response = await InvoiceModel.find({}, { _id: 0});
          const users = await UserModel.find({}, { _id: 1, email: 1 });
    
          const userMap = new Map(users.map((user) => [user._id.toString(), user.email]));
          const Invoice = Response.map(item => {
            const itemObj = item.toObject();
            return {
              ...itemObj,
              nomor_invoice : encrypt.encryptData(item.nomor_invoice),
              created_by: userMap.get(item.created_by.toString()) || "Unknown",
            }
          });
    
          console.log("GET /invoice --- Success (200)");
    
          return res.status(200).json({
            status: 200,
            msg: "Success",
            data: Invoice,
          });
        } catch (error) {
    
          console.error(
            "GET /invoice --- Failed (500):",
            JSON.stringify(error.message)
          );
    
          return res.status(500).json({
            status: 500,
            msg: "Internal Server Error",
            show_msg: "Sistem dalam gangguan, coba lagi nanti",
          });
        }
      },


      getInvoicebyId: async (req, res) => {
        const id  = encrypt.decryptData(req.params.id);
        try {
          const data = await InvoiceModel.findOne(
            { nomor_invoice: id },
            { _id: 0 }
          ).populate('created_by', 'email -_id').exec();
    
          if (!data) {
            console.log(`GET /invoice/${id} --- Not Found (404)`);
    
            return res.status(404).json({
              status: 404,
              msg: 'Not Found',
              show_msg: `Invoice ${id} tidak ditemukan`,
            });
          }
    
          console.log(`GET /invoice/${id} --- Success (200)`);
    
          return res.status(200).json({
            status: 200,
            msg: 'Success',
            show_msg: `Invoice ${id} ditemukan`,
            data
          });
    
        } catch (error) {
          console.error(
            `GET /invoice/${id} --- Failed (500):`,
            JSON.stringify(error.message)
          );
    
          return res.status(500).json({
            status: 500,
            msg: "Internal Server Error",
            show_msg: "Sistem dalam gangguan, coba lagi nanti",
          });
        }
      },


      updatedInvoicebyId: async (req, res) => {
        const id  = encrypt.decryptData(req.params.id);
        const { email, newStatus } = req.body;
    
        try {
          const InvoiceData = await InvoiceModel.findOne({ nomor_invoice: id });
    
    
          if (InvoiceData.length <= 0) {
            console.log(
              `PATCH /invoice/${id} --- Bad Request (400)`
            );
    
            return res.status(400).json({
              status: 400,
              message: "Bad Request",
              showMessage: "Data tidak sesuai",
            });
          }
          const oldData = { ...InvoiceData._doc };
          
          const newData = await InvoiceModel.findOneAndUpdate(
            { nomor_invoice: id },
            { ...InvoiceData._doc, status: newStatus },
            { new: true }
          );
    
          const user = await UserModel.findOne({ email: email });
    
          if (!user) {
            console.log(`PATCH /invoice/${id} --- Bad request (400)`);
            return res.status(400).json({
              status: 400,
              msg: 'Bad request',
              show_msg: 'Data tidak sesuai',
            });
          }
    
          const newAudithLog = new AudithLog({
            action: "update",
            collectionName: collectionName,
            collectionId: oldData._id,
            userId: user._id,
            oldData,
            newData
          });
    
          const audithLog = await newAudithLog.save();
    
          console.log(`PATCH /invoice/${id} --- Success (200)`);
          return res.status(200).json({
            status: 200,
            msg: 'Success',
            show_msg: `Berhasil Update Status invoice ${id}`,
          });
    
        } catch (error) {
    
          console.error(
            `PATCH /invoice/${id} --- Failed (500):`,
            JSON.stringify(error.message)
          );
          return res.status(500).json({
            status: 500,
            msg: "Internal Server Error",
            show_msg: "Sistem dalam gangguan, coba lagi nanti",
          });
        }
    
      },

      downloadFileInvoice: async (req, res) => {
        const id  = encrypt.decryptData(req.params.id);
    
        try {
          const InvoiceData = await InvoiceModel.findOne({ nomor_invoice: id });
    
          if (!InvoiceData) {
            console.log(`GET /download-invoice/${id} --- Not Found (404)`);
            return res.status(404).json({
              status: 400,
              msg: 'Not Found',
              show_msg: 'Data tidak ditemukan'
            });
          }
    
          const filePath = path.join(__dirname, `../${InvoiceData.dokumen}`);
    
          if (!fs.existsSync(filePath)) {
            console.log(`GET /download-invoice/${id} --- Failed (404)`);
            return res.status(404).json({
              status: 400,
              msg: 'Not Found',
              show_msg: 'File not found'
            });
          }
    
          console.log(`GET /download-invoice/${id} --- Success(200)`);
          res.download(filePath);
        
        } catch (error) {
          console.error(
            `GET /download-invoice/${id} --- Failed (500):`,
            JSON.stringify(error.message)
          );
          return res.status(500).json({
            status: 500,
            msg: "Internal Server Error",
            show_msg: "Sistem dalam gangguan, coba lagi nanti",
          });
        }
      },

}