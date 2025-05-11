import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { HostOtpVerify, submitOtp } from '../../../features/hostSingupSlices';
import { useState } from 'react';
import { toast } from 'react-toastify';

export default function OtpSent() {

    const dispatch = useDispatch();
    const [formData, setFormData] = useState({
        email: ""
    })

    const handleInput = async (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.email) {
            toast.error("Please enter the email");
            return;
        }

        try {
            await dispatch(submitOtp(formData)).unwrap();
            setFormData({ email: "" })
        } catch (error) {
            toast.error(error);
        }
    }

    return (
        <div>
            <Box
                sx={{ '& > :not(style)': { width: '45ch' } }}
                noValidate
                component="form"
                onSubmit={handleSubmit}
                autoComplete="off"

            >
                <TextField id="standard-basic" label="Enter Email" type='email' name='email' variant="standard" className='ms-5' sx={{ mt: 18 }} value={formData.email} onChange={handleInput} required />
                <p className='ms-5 mt-5' style={{ fontSize: "0.8rem" }}>By Continuning, you agree to PharmaNest's <a className='link text-decoration-none'>Terms of Use</a> and <a className='link text-decoration-none'>Privacy Policy</a> </p>
                <Stack direction="row" sx={{ mt: 5, width: "100%" }} className='ms-5'>
                    <Button variant="contained" sx={{ textTransform: "none", width: "100%" }} color="warning" type='submit'>Continue</Button>
                </Stack>
            </Box>
            <Stack direction="row" sx={{ mt: 2, textTransform: "none", width: '50ch' }} className='ms-5'>
                <Link style={{ display: "block", width: "100%" }} to={"/hostLogin"}><Button variant="contained" sx={{ textTransform: "none" }} style={{ width: "90%" }}>Existing User? Log in </Button></Link>
            </Stack>
        </div>
    )
}
