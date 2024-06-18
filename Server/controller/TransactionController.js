const fs = require('fs');
const path = require('path');
const jwt = require("jsonwebtoken");
const collectionName = "berita_acara";
const encrypt = require('../utils/ecnrypt');
const AudithLog = require("../model/AudithLog");
const UserModel = require("../model/UserModel");
const BeritaAcaraModel = require("../model/BeritaAcaraModel");

module.exports = {
  createBeritaAcara: async (req, res) => {
    try {
      const {
        nomor_kontrak,
        nama_rekanan,
        nama_pekerjaan,
        nilai_kontrak,
        jangka_waktu,
        nilai_tagihan,
        tanggal_mulai
      } = req.body;

      const { id } = req.userData;

      if (!req.file) {
        console.log("POST /new-berita-acara --- Bad Request (400)");
        return res.status(400).json({ 
          status: 400, 
          msg: "Bad Request",
          show_msg : "File tidak ditemukan" 
        });
      }

      const { filename: fileName } = req.file;
      // const nomor_kontrak = req.file.filename.split("_")[0];

      const isNomorKontrakExist = await BeritaAcaraModel.findOne( { nomor_kontrak } );

      if(isNomorKontrakExist){
        console.log("POST /new-berita-acara --- Bad Request (400)");
        return res.status(400).json({ 
          status: 400, 
          msg: "Bad Request",
          show_msg :`Nomor kontrak '${nomor_kontrak}' sudah ada`,
        });
      }

      const akhirDate = new Date(tanggal_mulai);
      akhirDate.setDate(akhirDate.getDate() + jangka_waktu * 30);
      
      const newTransaction = new BeritaAcaraModel({
        nama_rekanan,
        nama_pekerjaan,
        nomor_kontrak,
        nilai_kontrak,
        jangka_waktu,
        periode_penagihan: {
          mulai: tanggal_mulai,
          akhir: akhirDate
        },
        nilai_tagihan,
        dokumen: "/assets/document/berita_acara/" + fileName,
        created_by: id,
      });

      const response = await newTransaction.save();

      const newAudithLog = new AudithLog({
        action: "insert",
        collectionName: collectionName,
        collectionId: response._id,
        userId: id,
        oldData: null,
        newData: newTransaction,
      });

      const log_response = await newAudithLog.save();

      console.log("POST /new-berita-acara --- Success (201)");

      return res.status(201).json({
        status: 201,
        msg: "Success Create New Berita Acara",
        show_msg: `Berita acara ${nomor_kontrak} ditambahkan`
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

  getAllBeritaAcara: async (req, res) => {
    try {
      const Response = await BeritaAcaraModel.find({}, { _id: 0, dokumen: 0 });
      const users = await UserModel.find({}, { _id: 1, email: 1 });

      const userMap = new Map(users.map((user) => [user._id.toString(), user.email]));
      const beritaAcara = Response.map(item => {
        const itemObject = item.toObject();
        return {
          ...itemObject,
          nomor_kontrak : encrypt.encryptData(item.nomor_kontrak),
          created_by: userMap.get(item.created_by.toString()) || "Unknown",
        }
      })
      // const beritaAcara = Response.map((berita) => ({
      //   ...berita.toObject(),
      //   created_by: userMap.get(berita.created_by.toString()) || "Unknown",
      // }));
      console.log("GET /get-all-berita-acara --- Success (200)");

      return res.status(200).json({
        status: 200,
        msg: "Success",
        data: beritaAcara,
      });
    } catch (error) {

      console.error(
        "GET /get-all-berita-acara --- Failed (500):",
        JSON.stringify(error.message)
      );

      return res.status(500).json({
        status: 500,
        msg: "Internal Server Error",
        show_msg: "Sistem dalam gangguan, coba lagi nanti",
      });
    }
  },
  getBeritaAcarabyId: async (req, res) => {
    const id  = encrypt.decryptData(req.params.id);
    try {
      const data = await BeritaAcaraModel.findOne(
        { nomor_kontrak: id },
        { _id: 0 }
      ).populate('created_by', 'email -_id').exec();

      if (!data) {
        console.log(`GET /get-berita-acar-id/${id} --- Not Found (404)`);

        return res.status(404).json({
          status: 404,
          msg: 'Not Found',
          show_msg: `Berita Acara ${id} tidak ditemukan`,
        });
      }

      console.log(`GET /get-berita-acar-id/${id} --- Success (200)`);

      return res.status(200).json({
        status: 200,
        msg: 'Success',
        show_msg: `Berita Acara ${id} ditemukan`,
        data
      });

    } catch (error) {
      console.error(
        `GET /get-berita-acar-id/${id} --- Failed (500):`,
        JSON.stringify(error.message)
      );

      return res.status(500).json({
        status: 500,
        msg: "Internal Server Error",
        show_msg: "Sistem dalam gangguan, coba lagi nanti",
      });
    }
  },

  updatedBertiaAcarabyId: async (req, res) => {
    const id  = encrypt.decryptData(req.params.id);
    const { email, newStatus } = req.body;

    try {
      const beritaAcaraData = await BeritaAcaraModel.findOne({ nomor_kontrak: id });


      if (beritaAcaraData.length <= 0) {
        console.log(
          `PATCH /update-berita-acara-status/${id} --- Bad Request (400)`
        );

        return res.status(400).json({
          status: 400,
          message: "Bad Request",
          showMessage: "Data tidak sesuai",
        });
      }
      const oldData = { ...beritaAcaraData._doc };
      
      const newData = await BeritaAcaraModel.findOneAndUpdate(
        { nomor_kontrak: id },
        { ...beritaAcaraData._doc, status: newStatus },
        { new: true }
      );

      const user = await UserModel.findOne({ email: email });

      if (!user) {
        console.log(`PATCH /update-berita-acara-status/${id} --- Bad request (400)`);
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

      console.log(`PATCH /update-berita-acara-status/${id} --- Success (200)`);
      return res.status(200).json({
        status: 200,
        msg: 'Success',
        show_msg: `Berhasil Update Status Berita Acara ${id}`,
      });

    } catch (error) {

      console.error(
        `PATCH /update-berita-acara-status/${id} --- Failed (500):`,
        JSON.stringify(error.message)
      );
      return res.status(500).json({
        status: 500,
        msg: "Internal Server Error",
        show_msg: "Sistem dalam gangguan, coba lagi nanti",
      });
    }

  },

  downloadFileBeritaAcara: async (req, res) => {
    
    const id  = encrypt.decryptData(req.params.id);
    try {
      const BeritaAcaraData = await BeritaAcaraModel.findOne({ nomor_kontrak: id });

      if (!BeritaAcaraData) {
        console.log(`GET /download/${id} --- Not Found (404)`);
        return res.status(404).json({
          status: 400,
          msg: 'Not Found',
          show_msg: 'Data tidak ditemukan'
        });
      }

      const filePath = path.join(__dirname, `../${BeritaAcaraData.dokumen}`);

      if (!fs.existsSync(filePath)) {
        console.log(`GET /download/${id} --- Failed (404)`);
        return res.status(404).json({
          status: 400,
          msg: 'Not Found',
          show_msg: 'File not found'
        });
      }

      console.log(`GET /download/${id} --- Success(200)`);
      res.download(filePath);
    
    } catch (error) {
      console.error(
        `GET /download/${id} --- Failed (500):`,
        JSON.stringify(error.message)
      );
      return res.status(500).json({
        status: 500,
        msg: "Internal Server Error",
        show_msg: "Sistem dalam gangguan, coba lagi nanti",
      });
    }
  },
};
