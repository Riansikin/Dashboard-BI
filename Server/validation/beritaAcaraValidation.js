const Joi = require('joi');

const isValidDateLaterThanNow =  (value, helpers) => {
    const date = new Date(value);
    date.setHours(0, 0, 0, 0);
    const now = new Date();
    now.setHours(0, 0, 0, 0);
  
    if (date > now) {
      return date;
    }
  
    return helpers.message(`"tanggal_mulai" harus lebih dari tanggal sekarang`);
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
        jangka_waktu: Joi.number().integer().positive().messages({
            'number.integer': 'Jangka Waktu harus bilangan bulat',
            'number.positive': 'Jangka Waktu harus lebih dari 0',
            'any.required': 'Jangka waktu tidak boleh kosong',
        }), 
        tanggal_mulai: Joi.date().required().iso().custom(isValidDateLaterThanNow).messages({
            'tanggal_mulai.date' : 'test',
            'any.required': 'Tanggal Mulai tidak boleh kosong',
            'date.iso': 'Tanggal Mulai tidak sesuai format',
            'date.custom': 'Tanggal harus lebih dari sekarang',
        }),
        nilai_tagihan: Joi.string().required().messages({
            'any.required': 'Nilai tagihan tidak boleh kosong',
        }),
        nomor_kontrak: Joi.string().required().pattern(/^[a-zA-Z0-9\s!@#$%^&*()_+=[\]{};':"\\|,.<>/?-]*$/).messages({
            'any.required': 'Nomor kontrak tidak boleh kosong',
            'string.pattern.base': 'Nomor kontrak hanya boleh berisi angka, huruf, dan simbol',
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
