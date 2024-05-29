import React, { useRef, useEffect, useState } from "react"

import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { Password } from 'primereact/password';
import { InputText } from 'primereact/inputtext';
import { useForm, Controller } from 'react-hook-form';


import '../css/pages/login.css';
import DoLogin from '../services/doLogin';
import refreshToken from "../services/resfreshToken";


export default function Login() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const checkIsLoggedIn = async () => {
            try {
                await refreshToken();
                setIsLoggedIn(true);
                window.location.href = '/';
            } catch (error) {
                setIsLoggedIn(false);
            }
        }

        if (!isLoggedIn) { 
            checkIsLoggedIn();
        }
    }, [isLoggedIn]);

    const defaultValues = {
        email : '',
        password : '',

    };
    const { handleSubmit, setValue ,control, formState: { errors } } = useForm({ mode: 'onChange', defaultValues });
    const toast = useRef(null);

    
    const onSubmit = async (data) => {
        try {
            const response = await DoLogin(data);

            await toast.current.show({
                severity: response.status, 
                summary: response.status === 'error' ? 'Error' : 'Success',
                detail: response.response,
                life: 3000
            }); 

            if( response.status === 'success'){
                setTimeout(() => {
                    window.location.href = '/';
                }, 3000);
            }
        } catch (error) {
            console.error("Error : ",JSON.stringify(error.message));

            toast.current.show({ severity: 'error', summary: 'Error', detail: "Serverl Dalam Gangguan" });
        }
    }
    return (
        <div className="login w-full h-screen flex flex-column justify-content-center align-items-center gap-4 " style={{ background: '#F8FAFC' }}>
            <div className="box-login flex justify-content-center w-11 py-6 sm:w-10 md:w-6 lg:w-4 xl:w-4" style={{ background: '#FFFFFF' }}>
                <div className="login-container w-11">
                    <div className="head-box mb-6 flex flex-column gap-2">
                        <span>Welcome back! 👋</span>
                        <h1>Sign in to your account</h1>
                    </div>
                    <form  className="w-full" onSubmit={handleSubmit(onSubmit)}>

                        <div className="email-field flex flex-column mb-3">
                            <label htmlFor="email">Your Email</label>
                            <Controller
                                name="email"
                                control={control}
                                rules={{ required: 'Email is required' }}
                                render={({ field }) => (
                                    <>
                                        <InputText {...field} />
                                        <small>{errors.email && <span>{errors.email.message}</span>}</small>
                                    </>
                                )}

                            />
                        </div>
                        <div className="password-field flex flex-column mb-3">
                            <label htmlFor="password">Password</label>
                            <Controller
                                name="password"
                                control={control}
                                rules={{ required: 'password is required' }}
                                render={({ field }) => (
                                    <>
                                        <Password {...field } feedback={false} toggleMask className="w-full relative"  autoComplete="off"/>
                                        <small>{errors.password && <span>{errors.password.message}</span>}</small>
                                    </>
                                )}
                            />
                        </div>

                        <Button label="CONTINUE" type="submit" className="w-full  mb-3" />
                        <div className='w-full text-center'>
                            <a href="/login" className='font-bold' style={{ color: '#625BF7'}}>Forgot your password?</a>
                        </div>
                        
                    </form>
                </div>
            </div>

            <div className='w-full text-center' > <span>Don’t have an account? <a href="/register">Sign up</a></span></div>
            <Toast ref={toast} />
        </div>
    )
}