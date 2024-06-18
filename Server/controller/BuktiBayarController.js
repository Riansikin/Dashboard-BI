const fs = require('fs');
const path = require('path');
const jwt = require("jsonwebtoken");
const collectionName = "bukti_bayar";
const AudithLog = require("../model/AudithLog");
const UserModel = require("../model/UserModel");
const encrypt = require('../utils/ecnrypt');
const BuktiBayarModel = require("../model/BuktiBayarModel");
const { Z_ASCII } = require('zlib');
const { response } = require('express');



module.exports = {


    getBuktiBayar : async (req, res) => {

        const id = encrypt.decryptData(req.params.id);  
        try {
            const result = await BuktiBayarModel.findOne(
                {nomor_kontrak : id},
                {_id: 0}
            ).populate('created_by', 'email').select('-created_by._id');

            if(!result){
                console.log(`GET /get-bukti-bayar/${id} No Content (204)`);
                return res.status(204).json({
                    status : 204,
                    msg: 'No Content',
                    show_msg: 'Belum Ada Bukti Bayar',
                });
            }

            console.log(`GET /get-bukti-bayar/${id} --- Success (200)`);

            return res.status(200).json({
                status: 200,
                msg: 'Success',
                show_msg: `Bukti Bayar ${id} ditemukan`,
                result
            });
        } catch (error) {
            console.error(
                `GET /get-bukti-bayar/${id} --- Failed (200)`,
                JSON.stringify(error.message)
            );
    
            return res.status(500).json({
                status: 500,
                msg: "Internal Server Error",
                show_msg: "Sistem dalam gangguan, coba lagi nanti",
            });
        }

    },

    createBuktiBayar : async ( req, res) => {

        try {
            const nomor_kontrak = encrypt.decryptData(req.params.id);
            const { id } = req.userData;

            if(!req.file){
                console.log("POST /new-bukti-bayar --- Bad Request (400)");
                return res.status(400).json({
                    status : 400,
                    msg : "Bad Request",
                    show_msg : "File tidak ditemukan"
                })
            }

            const { filename: fileName } = req.file;

            const newBuktiBayar = new BuktiBayarModel({
                nomor_kontrak,
                dokumen : "/assets/document/bukti_bayar/" + fileName,
                created_by : id,

            })

            const responseBuktiBayar = await newBuktiBayar.save();

            const newAudithLog = new AudithLog({
                action : "insert",
                collectionName,
                colectionId : response._id,
                userId : id,
                oldData : null,
                newData : newBuktiBayar,
            });

            const log_response = await newAudithLog.save();

            console.log("POST /new-bukti-bayar --- Success (201)");

            return res.status(201).json({
                status: 201,
                msg: "Success Create New Berita Acara",
                show_msg: `Bukti Bayar dengan ${nomor_kontrak} ditambahkan`
            });

        } catch (error) {
            console.error(
                "POST /new-berita-acara --- Error (500):",
                JSON.stringify(error.message)
            );
    
            return res.status(500).json({
                status: 500,
                msg: "Internal Server Error",
                show_msg: "Sistem dalam gangguan, coba lagi nanti",
            });
        }
    },
    downloadFileBuktiBayar : async ( req , res) => {
        const id = encrypt.decryptData(req.params.id);

        try {
            const BuktiBayarData = await BuktiBayarModel.findOne({nomor_kontrak : id});

            if(!BuktiBayarData){
                console.log(`GET /download-bukti-bayar/${id} --- Not Found (404)`);
                return res.status(404).json({
                    status: 400,
                    msg: 'Not Found',
                    show_msg: 'Data tidak ditemukan'
                });
            }
            
            const filePath = path.join(__dirname, `../${BuktiBayarData.dokumen}`);
            if (!fs.existsSync(filePath)) {
                console.log(`GET /download-bukti-bayar/${id} --- Failed (404)`);
                return res.status(404).json({
                  status: 400,
                  msg: 'Not Found',
                  show_msg: 'File not found'
                });
              }
        
              console.log(`GET /download-bukti-bayar/${id} --- Success (200)`);
              res.sendFile(filePath);
        } catch (error) {
            console.error(
                `GET /download-bukti-bayar/${id} --- Failed (500):`,
                JSON.stringify(error.message)
            );
            return res.status(500).json({
                status: 500,
                msg: "Internal Server Error",
                show_msg: "Sistem dalam gangguan, coba lagi nanti",
            });
        }
    }
}