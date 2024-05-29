const bcrypt = require('bcrypt');
const UserModel = require("../model/UserModel")
const jwt = require('jsonwebtoken');
const AudithLog = require('../model/AudithLog');
const collectionName = 'users'

module.exports = {

    registerUser : async (req, res) => {
        const { user_name, email, password} = req.body;
                
        try {
            const salt = await bcrypt.genSalt();
            const hashPassword = await bcrypt.hash(password, salt);

            const userModel = new UserModel({
                user_name,
                email,
                password: hashPassword,
                role: 'Vendor',
            });

            const response = await userModel.save();

            console.log('POST /register --- Success (201)');
            
            return res.status(201).json({
                status: 201,
                msg: 'Success Create New User',
                show_msg : 'Akun anda berhasil dibuat',
            });
            
        } catch (error) {
            
            let msg = 'Internal Server Error';
            let show_msg = 'Sistem dalam gangguan, coba lagi nanti';
            
        
            if (error.code === 11000) {
                msg = 'Duplicate Key Error';
                show_msg = 'Alamat email sudah digunakan';
            }
            
            console.error(
                `POST /register --- Failed (500):`,
                JSON.stringify(error.message)
            );
            return res.status(500).json({
                status: 500,
                msg,
                show_msg
            });
        }
    },

    getAllUsers: async (req, res) => {
        try {
            const users = await UserModel.find({} , { _id: 0, password: 0, refresh_token : 0});

            console.log('GET /get-all-users --- Success (200)');

            return res.status(200).json({
                status: 200,
                msg: 'Success',
                users
            });
        } catch (error) {
            console.error(
                `GET /get-all-users --- Failed (500):`,
                JSON.stringify(error.message)
            );
            return res.status(500).json({
                status: 500,
                msg: 'Internal Server Error',
                show_msg: 'Sistem dalam gangguan, coba lagi nanti'
            });
        }
    },


    loginUser: async (req, res ) => {
        try {
            const { email, password } = req.body;

            const user = await UserModel.findOne({
                email : email
            });

            if(!user)  {
                console.log(`POST /login --- Not Found (400)`);
                return res.status(404).json({
                    status: 404,
                    msg : 'Not Found',
                    show_msg : `Email ${email} tidak ditemukan`,
                });
            }

            const { _id, user_name, profile_picture, role } = user; 
            
            const match = await bcrypt.compare(password, user.password);

            if(!match){

                console.log('POST /login --- Unauthorized (401)');

                return res.status(401).json({
                    status: 401,
                    msg: 'Unauthorized',
                    show_msg : 'Password Anda Salah !'
                });
            } 

            const accessToken = jwt.sign(
                { 
                    id : _id,
                    uname :  user_name,
                    email : email,
                    role : role,
                },
                process.env.ACCESS_TOKEN_SECRETE,
                {
                    expiresIn: '40s',
                }
            );

            const refreshToken = jwt.sign(
                {
                    id : _id,
                    uname :  user_name,
                    email : email,
                    role : role,
                },
                process.env.REFRESH_TOKEN_SCRETE,
                {
                    expiresIn: '1d',
                }
            );


            await UserModel.updateOne(
                { 
                    _id : _id
                },
                { 
                    $set : {
                        refresh_token : refreshToken,
                        updated_at : Date.now(),
                    },
                }
            );

            console.log('POST /login --- Success (200)');

            return res.cookie('refreshToken', refreshToken, {
                httpOnly: true,
                maxAge: 24 * 60 * 60 * 1000,
                path : '/'
            }).send({
                status: 200,
                msg : 'Login successful',
                show_msg : 'Berhasil Login',
                profile_picture,
                accessToken
            });

        } catch (error) {

            console.error(
                `POST /login --- --- Failed (500):`,
                JSON.stringify(error.message)
            );
        
            return res.status(500).json({
                status: 500,
                msg: 'Internal Server Error',
                show_msg: 'Sistem dalam gangguan, coba lagi nanti'
            });
        }
    },

    logout : async (req, res) => {
        const refreshToken = req.cookies.refreshToken;
    
        if(!refreshToken){
            console.log('DELETE /logout --- (204)');
            return res.sendStatus(204);
        }

        const user = await UserModel.findOne({ refresh_token : refreshToken });

        if(!user) {
            console.log('DELETE /logout --- User Not Found (204)');
            return res.sendStatus(204);
        }

        await UserModel.findOneAndUpdate(
            { _id: user._id},
            { 
                $set : {
                    refresh_token : null,
                    updated_at : Date.now()
                },
            }
        );

        res.clearCookie('refreshToken');
        
        console.log('DELETE /logout --- sucess (200)');

        return res.status(200).json({
            status : 200,
            msg : 'Succes Logout',
            show_msg : 'Berhasil Keluar'
        });
       
    },
    changeRole : async (req, res) => {
        const { newRole } = req.params;
        const { email } = req.body;
        const { id } = req.userData;
        try {
            const userData = await UserModel.findOne({ email : email })

            if(userData.length <= 0) {
                console.log(
                    `PATCH /change-role/${newRole} --- Bad Request (400)`
                );
        
                return res.status(400).json({
                    status: 400,
                    message: "Bad Request",
                    showMessage: "Data tidak sesuai",
                });
            }

            const oldData = { ...userData._doc };

            const newData = await UserModel.findOneAndUpdate(
                { email : email },
                { ...userData._doc, role : newRole },
                { new : true}
            )
            
            const newAudithLog = new AudithLog({
                action : "update",
                collectionName : collectionName,
                userId : id,
                oldData,
                newData
            });

            const audithLog = await newAudithLog.save();
            console.log(
                `PATCH /change-role/${newRole} --- Success (200)`
            );

            return res.status(200).json({
                status: 200,
                msg: 'Success',
                show_msg: `Berhasil Update Role ${email} menjadi ${newRole}`,
            });
      
        } catch (error) {
            console.error(
                `PATCH /change-role/${newRole} --- Failed (500):`,
                JSON.stringify(error.message)
            );
        
            return res.status(500).json({
                status: 500,
                msg: 'Internal Server Error',
                show_msg: 'Sistem dalam gangguan, coba lagi nanti'
            });
        }
    }
    

}