const Joi = require('joi');

const isValidDateLaterThanStart = (value, helpers) => {
    const startDate = new Date(helpers.state.ancestors[0].tanggal_mulai);
    startDate.setHours(0, 0, 0, 0);
    const endDate = new Date(value);
    endDate.setHours(0, 0, 0, 0);
  
    if (endDate > startDate) {
        return value; // It is valid, return the value
    }
  
    return helpers.message(`"Tanggal Akhir" harus lebih dari "Tanggal Mulai"`);
};


const invoiceValidate = (data, callback) => {
    
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
        tanggal_akhir: Joi.date().required().iso().custom(isValidDateLaterThanStart).messages({
            'tanggal_akhir.date' : 'test',
            'any.required': 'Tanggal Akhir tidak boleh kosong',
            'date.iso': 'Tanggal Akhir tidak sesuai format',
            'date.custom' : 'Tanggal harus lebih dari tanggal mulai',
        }),
        nilai_tagihan: Joi.string().required().messages({
            'any.required': 'Nilai tagihan tidak boleh kosong',
        }),
        nomor_invoice: Joi.string().required().pattern(/^[a-zA-Z0-9\s!@#$%^&*()_+=[\]{};':"\\|,.<>/?-]*$/).messages({
            'any.required': 'Nomor Invoice tidak boleh kosong',
            'string.pattern.base': 'Nomor invoice hanya boleh berisi angka, huruf, dan simbol',
        }),
        
    });

    const { error } = schema.validate(data);

    if (error) { 
        callback({
            status: "error",
            show_msg : error.details[0].message
        });
    } else {
        callback({
            status : "success",
        });
    }
}

module.exports = {
    invoiceValidate
}
