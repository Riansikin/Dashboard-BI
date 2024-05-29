const Joi = require('joi');

const userRegisterValidate = (req, res, next) => {
    const schema = Joi.object({
        user_name: Joi.string()
                    .min(4)
                    .required(),

        email: Joi.string()
                .email()
                .regex(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/)
                .required()
                .messages({
                    'string.email': 'Please enter a valid email address',
                    'string.pattern.base': 'Email can only contain alphanumeric characters, ".", "-", and "_"'
                }),


        password: Joi.string()
                    .min(8)
                    .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])[a-zA-Z0-9]+$'))
                    .messages({
                        'string.min': 'Password must be at least 8 characters long',
                        'string.pattern.base': 'Password must have at least one uppercase, one lowercase, and one number'
                    }),

        privacy : Joi.required()
                    
    });

    const {error, value} = schema.validate(req.body);

    if(error){
        console.error(
            `POST /register --- Bad Request (403):`,
            JSON.stringify(error.message)
        );
        
        return res.status(403).json({
            status : 403,
            msg: 'Bad Request', 
            show_msg : error.message
        });
        
    }

    next();
}


const userLoginValidation = (req, res, next) => {
    const schema = Joi.object({
        email: Joi.string()
                .email()
                .regex(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/)
                .required()
                .messages({
                    'string.email': 'Please enter a valid email address',
                    'string.pattern.base': 'Email can only contain alphanumeric characters, ".", "-", and "_"'
                }),


        password: Joi.string().required()
    });

    const {error, value} = schema.validate(req.body);


    if(error){
        console.error(
            `POST /login --- Bad Request (403):`,
            JSON.stringify(error.message)
        );
        
        return res.status(403).json({
            status : 403,
            msg: 'Bad Request', 
            show_msg : error.message
        });
        
    }

    next();

}

module.exports = {
    userRegisterValidate,
    userLoginValidation
}
