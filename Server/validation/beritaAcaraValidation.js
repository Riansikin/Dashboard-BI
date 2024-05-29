const Joi = require('joi');

const isValidDateLaterThan =  (value, helpers) => {
    const date = new Date(value);
    date.setHours(0, 0, 0, 0);
    const now = new Date();
    now.setHours(0, 0, 0, 0);
  
    if (date > now) {
      return date;
    }
  
    return helpers.message(`"Tanggal Akhir" harus lebih dari "Tanggal Mulai"`);
};
const beritaAcaraCreateValidation = (data, callback) => {

    const schema = Joi.object({
        nama_rekanan: Joi.string().required().messages({
            'any.required': 'Nama rekanan tidak boleh kosong',
        }),
        nama_pekerjaan: Joi.string().required().messages({
            'any.required': 'Nama pekerjaan tidak boleh kosong',
        }),
        nilai_kontrak: Joi.string().required().messages({
            'any.required': 'Nilai Kontrak tidak boleh kosong',
        }),
        tanggal_mulai: Joi.date().required().iso().messages({
            'tanggal_mulai.date' : 'test',
            'any.required': 'Tanggal Mulai tidak boleh kosong',
            'date.iso': 'Tanggal Mulai tidak sesuai format',
        }),
    
        tanggal_akhir: Joi.date().required().iso().custom(isValidDateLaterThan).messages({
            'tanggal_akhir.date' : 'test',
            'any.required': 'Tanggal Akhir tidak boleh kosong',
            'date.iso': 'Tanggal Akhir tidak sesuai format',
            'date.custom' : 'Tanggal harus lebih dari tanggal mulai',
        }),
        
        nilai_tagihan: Joi.string().required().messages({
            'any.required': 'Nilai tagihan tidak boleh kosong',
        }),
        
    });

    const { error } = schema.validate(data);

    if (error) { 
        callback({
            status: "error",
            show_msg : error.message
        });
    } else {
        callback({
            status : "success",
        });
    }
}

module.exports = {
    beritaAcaraCreateValidation
}
