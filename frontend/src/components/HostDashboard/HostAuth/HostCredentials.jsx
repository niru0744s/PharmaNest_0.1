import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { Box, TextField, FormControl, InputLabel, Input, InputAdornment, IconButton, Button } from '@mui/material';
import { useState } from 'react';
import {toast} from 'react-toastify';
import {useDispatch , useSelector} from 'react-redux'
import { finalSubmit } from '../../../features/hostSingupSlices';
export default function HostCredentials() {
    const dispatch = useDispatch();
        const [showPassword, setShowPassword] = useState(false);
        const [formData, setFormData] = useState({
          firstName: '',
          lastName: '',
          pass: '',
        });
        const host = useSelector((state)=> state.signupHost.hostData);
      const handleClickShowPassword = () => setShowPassword((show) => !show);
    
      const handleMouseDownPassword = (event) => {
        event.preventDefault();
      };
    
      const handleMouseUpPassword = (event) => {
        event.preventDefault();
      };
    
      const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
      };
    
      const handleSubmit = async (e) => {
        e.preventDefault();
    
        // Basic validation
        if (
          !formData.firstName ||
          !formData.lastName ||
          !formData.pass
        ) {
          toast.error("Please fill the input fields")
          return;
        }
    
        const userData = {
          formData:formData,id:host._id
        };
        try {
          await dispatch(finalSubmit(userData)).unwrap();
          setFormData({ firstName: '', lastName: '', pass: '' });
        } catch (error) {
          toast.error(`Error: ${error}`);
        }
      };
  return (
    <>
      <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        display: 'flex',
        flexDirection: 'row',
        gap: 2,
        m: 2,
        width: '100%',
        flexWrap: 'wrap',
      }}
      noValidate
      autoComplete="off"
    >
      <TextField
        label="First Name"
        name="firstName"
        variant="standard"
        sx={{
          width:"80%"
        }}
        required
        value={formData.firstName}
        onChange={handleChange}
      />
      <TextField
        label="Second Name"
        name="lastName"
        variant="standard"
        sx={{
          width:"80%"
        }}
        required
        value={formData.lastName}
        onChange={handleChange}
      />
      <FormControl variant="standard" required sx={{
          width:"100%"
        }}>
        <InputLabel htmlFor="password">Password</InputLabel>
        <Input
          id="password"
          name="pass"
          sx={{width:"80%"}}
          type={showPassword ? 'text' : 'password'}
          value={formData.pass}
          onChange={handleChange}
          endAdornment={
            <InputAdornment position="end">
              <IconButton
                onClick={handleClickShowPassword}
                onMouseDown={handleMouseDownPassword}
                onMouseUp={handleMouseUpPassword}
                aria-label={showPassword ? 'hide password' : 'show password'}
              >
                {showPassword ? <Visibility /> : <VisibilityOff />}
              </IconButton>
            </InputAdornment>
          }
        />
      </FormControl>
      <Button type="submit" variant="contained" color="primary" sx={{
          width:"80%"
        }}>
        Submit
      </Button>
    </Box>
    </>
  )
}
