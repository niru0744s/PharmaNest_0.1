import OtpSent from "./OtpSent"
import OtpPage from "./OtpPage";
import HostCredentials from "./HostCredentials";
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux'
import { useEffect } from 'react';
import { toast } from 'react-toastify'
import { HostOtpVerify } from '../../../features/hostSingupSlices';
import HostNavbar from "../LandingPage/HostNavbar";
import HostFooter from "../LandingPage/HostFooter";
export default function HostSignup() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const step = useSelector((state) => state.signupHost.step);
  const host = useSelector((state) => state.signupHost.hostData);
  useEffect(() => {
    if (step === 4) {
      navigate('/sellerDashboard');
    }
  }, [step, navigate]);
  const onOtpSubmit = async (otp) => {
    console.log(otp);
    if (!otp) {
      toast.error("Please enter the OTP");
      return;
    }
    console.log(host);
    const hostData = {
      otp: otp,
      id: host._id
    }
    try {
      await dispatch(HostOtpVerify(hostData)).unwrap();
    } catch (error) {
      toast.error(error);
    }
  };
  return (
    <>
    <HostNavbar/>
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
                <OtpPage onOtpSubmit={onOtpSubmit} length={4} />
              </>
            )}
            {step === 2 && <HostCredentials />}
          </div>
        </div>
      </div>
      <HostFooter/>
    </>
  )
}
