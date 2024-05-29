const PDFDocument = require('../pdfkit');
const path = require('path');
const InvoiceModel = require('../model/Invoice');
const fs = require('fs');

const exportInvoice = async (req, res) => {
    try {
        const { id, username } = req.userData;
        const data = await getDataFromMongoDB(); 

        const doc = new PDFDocument();

        const filePath = path.join(__dirname, '../assets/document/invoice/exported_invoice.pdf');
        const buffers = [];
        doc.on('data', buffers.push.bind(buffers));
        doc.on('end', () => {
            // Gabungkan buffer menjadi satu dan kirim sebagai respons
            const pdfData = Buffer.concat(buffers);
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', 'attachment; filename="exported_invoice.pdf"');
            res.send(pdfData);
        });


        doc
            .image("bi_log.png", 50, 45, { width: 50 })
            .fillColor("#444444")
            .fontSize(20)
            .text("Laporan Invoice", 110, 57)
            .fontSize(10)
            .text(`Create by ${username}`, 200, 65, { align: "right" })
            .text(formatDate(Date.now()), 200, 80, { align: "right" })
            .moveDown();

        const table = {
            headers: [
                "Nomor invoice",
                "Nama Rekanan",
                "Nama Pekerjaan",
                "Nilai Kontrak",
                "Tanggal Mulai",
                "Tanggal Akhir",
                "Status"
            ],
            rows: []
        };

        for (const item of data) {
            table.rows.push([
                item.nomor_invoice,
                item.nama_rekanan, 
                item.nama_pekerjaan,
                item.nilai_kontrak, 
                formatDate(item.periode_penagihan.mulai),
                formatDate(item.periode_penagihan.akhir),
                item.status,
            ]);
        }

        doc.moveDown().table(table, 10, 125, { width: 590 });
        doc.end();

        console.log(`GET /export-invoice --- Success (200)`);

    } catch (error) {
        console.error(
            `GET /export-invoice --- Failed (500):`,
            JSON.stringify(error.message)
        );
        return res.status(500).json({
            status: 500,
            msg: "Internal Server Error",
            show_msg: "Gagal melakukan ekspor PDF",
        });
    }
};

async function getDataFromMongoDB() {
    const response = await InvoiceModel.find();
    return response;
}

function formatDate(date) {
    const foramat_date = new Date(date);
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return foramat_date.toLocaleDateString('id-ID', options);
}

module.exports = {
    exportInvoice
};
