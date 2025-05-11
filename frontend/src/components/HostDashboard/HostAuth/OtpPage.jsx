import './OtpPage.css';
import { useEffect, useRef, useState } from "react";

export default function OtpPage({length, onOtpSubmit = ()=> {}}) {
    const [otp, setOtp] = useState(new Array(length).fill(""));
    const inputRefs = useRef([]);

  useEffect(()=>{
    if(inputRefs.current[0]){
      inputRefs.current[0].focus();
    }
  },[]);

  const handleChange = (index, e) => {
    const value = e.target.value;
    if(isNaN(value)) return;

    const newOtp = [...otp];
    //allow only one inp 

    newOtp[index] = value.substring(value.length-1);
    setOtp(newOtp);

    //submit trigger 

    const combineOtp = newOtp.join("");
    if (combineOtp.length === length) onOtpSubmit(combineOtp);

    //move to next input if curr field is filled 

    if(value && index<length-1 && inputRefs.current[index+1]){
      inputRefs.current[index+1].focus();
    }
    };

  const handleClick = (index) => {
    inputRefs.current[index].setSelectionRange(1, 1);

    if(index>0 && !otp[index-1]){
      inputRefs.current[otp.indexOf("")].focus();
    }
  };

  const handleKeydown = (index,e) => {
    if(e.key === "Backspace" && !otp[index] && index>0 && inputRefs.current[index -1] ){
      inputRefs.current[index-1].focus();
    }
  };
  return (
    <div className="otpContainer">
      {otp.map((value, index) => {
        return (
          <input
            key={index}
              type="text"
              ref={(input)=> {
                if(input) inputRefs.current[index] = input;
              }}
            value={value}
            onChange={(e) => handleChange(index, e)}
            onClick={() => handleClick(index)}
            onKeyDown={(e) => handleKeydown(index, e)}
            className="otpInput"
          />
        );
      })}
    </div>
  )
}
