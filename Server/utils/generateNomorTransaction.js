const BeritaAcaraModel = require("../model/BeritaAcaraModel");

async function generateContractNumber() {
    try {
        const now = new Date();
        const todayStart = new Date(
            now.getFullYear(), 
            now.getMonth(), 
            now.getDate()
        ); 
        const todayEnd = new Date(
            now.getFullYear(), 
            now.getMonth(), 
            now.getDate() + 1
        ); 

        const transactionsToday = await BeritaAcaraModel.find({
            created_at: {
                $gte: todayStart,
                $lt: todayEnd
            },
        });

        const counter = transactionsToday.length + 1; 

        const paddedYear = now.getFullYear().toString();
        const paddedMonth = (now.getMonth() + 1).toString().padStart(2, '0');
        const paddedDay = now.getDate().toString().padStart(2, '0');
        const paddedCounter = counter.toString().padStart(5, '0'); 

        return `${paddedYear}${paddedMonth}${paddedDay}${paddedCounter}`;
        
    } catch (error) {
        throw new Error("Gagal mendapatkan nomor kontrak:", error);
    }
}

module.exports = generateContractNumber;
