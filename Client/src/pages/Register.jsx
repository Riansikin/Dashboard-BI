import axios from 'axios';
import React, { useRef } from "react";
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { Password } from 'primereact/password';
import { InputText } from 'primereact/inputtext';
import { useForm, Controller } from 'react-hook-form';
import { TriStateCheckbox } from 'primereact/tristatecheckbox';


import '../css/pages/register.css';
import doRegister from '../services/doRegister';


export default function Register() {

    const defaultValues = {
        email : '',
        user_name : '',
        password : '',
        privacy : null
        

    };
    const { handleSubmit, setValue ,control, formState: { errors } } = useForm({ mode: 'onChange', defaultValues });
    const toast = useRef(null);
    

    const onSubmit = async (data) => {
        try {
            const response = await doRegister(data);
            console.log(response);
            await toast.current.show({ 
                severity: response.status, 
                summary: response.status === 'error' ? 'Error' : 'Success',
                detail: response.response 
            });
            
            if(response.status === 'success') {
                setTimeout(() => {
                    window.location.href = '/login';
                }, 3000); 
            }
        } catch (error) {

            console.error(
                'ERROR:',
                JSON.stringify(error.message)
            );

            toast.current.show({ 
                severity: 'error', 
                summary: 'Error', 
                detail: "Server Dalam Gangguan" 
            });
        }
    }

    return (
        <div className="register w-full h-screen align-items-center flex justify-content-center ">
            <div className="box-register w-11 sm:w-10 md:w-6 lg:w-4 xl:w-4">
                <h1 className="mb-6">Create an account for free</h1>

                <form className="w-full" method="post" onSubmit={handleSubmit(onSubmit)} >
                    <div className="email-field flex flex-column mb-3">
                        <label htmlFor="email">Your Email</label>
                        <Controller
                            name="email"
                            control={control}
                            rules={{ required: 'Email is required' }}
                            render={({ field }) => (
                                <>
                                    <InputText id="email" {...field} />
                                    <small>{errors.email && <span>{errors.email.message}</span>}</small>
                                </>
                            )}

                        />
                    </div>
                    <div className="username-field flex flex-column mb-3">
                        <label htmlFor="user_name">Create username</label>
                        <Controller
                            name="user_name"
                            control={control}
                            rules={{ required: 'User name is required' }}
                            render={({ field }) => (
                                <>
                                    <InputText {...field} />
                                    <small>{errors.user_name && <span>{errors.user_name.message}</span>}</small>
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
                                    <Password {...field} toggleMask className="w-full" autoComplete="off"/>
                                    <small>{errors.password && <span>{errors.password.message}</span>}</small>
                                </>
                            )}
                        />
                    </div>
                    <div className="privacy-polacy mb-3">
                        <Controller
                            name="privacy"
                            control={control}
                            defaultValue={null}
                            rules={{ required: 'Acceptance is required' }}
                            render={({ field }) => {
                                return (
                                    <>
                                        <div className='flex gap-2'>
                                            <TriStateCheckbox 
                                                id="privacy" 
                                                checked={field.value}
                                                {...field}
                                                />
                                            <label htmlFor="privacy">By creating an account you are agreeing to our Terms and Conditions and Privacy Policy</label>
                                        </div>

                                        <small>{errors.privacy && <span>{errors.privacy.message}</span>}</small>
                                    </>
                                );
                            }}
                        />
                    </div>

                    <Button label="SIGN UP" type="submit" className="w-full" />
                    <div className='w-full text-center mt-4'>
                        <a href="/login" className='underline'>Already have an account?</a>
                    </div>
                </form>
                
            </div>

            
            <Toast ref={toast} />
        </div>
    )
}