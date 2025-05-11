import Navbar from '../Header&Footer/Navbar';
import Footer from '../Header&Footer/Footer';
import OtpSent from './OtpSent';
import OtpBox from './OtpBox';
import Credentials from './Credentials';
import { useNavigate } from 'react-router-dom';
import {useDispatch , useSelector} from 'react-redux'
import { useEffect } from 'react';
import { toast } from 'react-toastify'
import { submitCredentials, submitOtp } from '../../features/signupSlice';

export default function Signup() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const step = useSelector((state) => state.signup.step);
  const user = useSelector((state)=> state.signup.userData);
  useEffect(() => {
    if (step === 4) {
      navigate('/');
    }
  }, [step, navigate]);
  const onOtpSubmit = async(otp)=>{
    if(!otp){
      toast.error("Please enter the OTP");
      return;
    }
    console.log(user)
    const userData = {
      otp:otp,
      id:user._id
    }
    try {
          await dispatch(submitCredentials(userData)).unwrap();
        } catch (error) {
          toast.error(error);
        }
};

  return (
    <>
      <Navbar />
      <div className="container m-5">
        <div className="row" style={{ height: "36rem" }}>
          <div className="col-2"></div>
          <div className="col-3 bg-primary d-flex align-items-start flex-column" style={{ color: "white" }}>
            <p className="fw-bold fs-3 card-title ms-5 mt-4"> Loooks like you're new here</p>
            <p className="ms-5 mt-3">Signup with your email and get started</p>
            <img src="media/images/log.png" alt="" style={{ height: "12rem", width: "13rem" }} className="ms-5 mt-auto" />
          </div>
          <div className="col-5 bg-light d-flex align-items-start flex-column">
          {step === 1 && <OtpSent />}
          {step === 3 && (
              <>
                <OtpBox onOtpSubmit={onOtpSubmit} length={4} />
              </>
            )}
          {step === 2 && <Credentials/>}
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}
