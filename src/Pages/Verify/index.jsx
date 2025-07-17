import React, { useContext, useEffect, useState } from "react";
import OtpBox from "../../components/OtpBox";
import Button from "@mui/material/Button";
import { postData } from "../../utils/api";
import { useNavigate } from "react-router-dom";
import { MyContext } from "../../App";
import { CircularProgress } from "@mui/material";

const Verify = () => {
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(!!localStorage.getItem("userEmail"));
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const handleOtpChange = (value) => {
    setOtp(value);
  };

  const history = useNavigate();
  const context = useContext(MyContext)

  const sendOtpToEmail = () => {
      if (!email) {
        context.alertBox("error", "Please enter your email.");
        return;
      }
  
      setIsLoading(true);
  
      postData("/api/user/send-otp", { email }) 
        .then((res) => {
          if (res?.error === false) {
            context.alertBox("success", "OTP sent to your email.");
            localStorage.setItem("userEmail", email);
            localStorage.setItem("actionType", "verify-account");
            setOtpSent(true);
          } else {
            context.alertBox("error", res?.message || "Failed to send OTP.");
          }
        })
        .finally(() => setIsLoading(false));
    };

  const verifyOTP = (e) => {
      e.preventDefault();
  
  
      if (otp !== "") {
        setIsLoading(true)
        const actionType = localStorage.getItem("actionType");
  
        if (actionType !== "forgot-password") {
  
          postData("/api/user/verifyEmail", {
            email: localStorage.getItem("userEmail") ,
            otp: otp
          }).then((res) => {
            if (res?.error === false) {
              context.alertBox("success", res?.message);
              localStorage.removeItem("userEmail")
              setIsLoading(false)
              localStorage.removeItem("actionType")
              history("/login")
            } else {
              context.alertBox("error", res?.message);
              setIsLoading(false)
            }
          })
        }
        else {
          postData("/api/user/verify-forgot-password-otp", {
            email: localStorage.getItem("userEmail") ,
            otp: otp
          }).then((res) => {
            if (res?.error === false) {
              context.alertBox("success", res?.message);
              history("/change-password")
            } else {
              context.alertBox("error", res?.message);
              setIsLoading(false)
            }
          })
        }
      }
      else {
        context.alertBox("error", "Please enter OTP");
      }
  
    }

  return (
    <section className="section py-5 lg:py-10">
      <div className="container">
        <div className="card shadow-md w-full sm:w-[400px] m-auto rounded-md bg-white p-5 px-10">
          <div className="text-center flex items-center justify-center">
            <img src="/verify3.png" width="80" />
          </div>
          <h3 className="text-center text-[18px] text-black mt-4 mb-1">
            Verify OTP
          </h3>

          {/* <p className="text-center mt-0 mb-4">
            OTP send to{" "}
            <span className="text-primary font-bold">{localStorage.getItem("userEmail")}</span>
          </p> */}

          {/* <form onSubmit={verifyOTP}>
            <OtpBox length={6} onChange={handleOtpChange} />

            <div className="flex items-center justify-center mt-5 px-3">
              <Button type="submit" className="w-full btn-org btn-lg">Verify OTP</Button>
            </div>
          </form> */}
          <form onSubmit={otpSent ? verifyOTP : (e) => { e.preventDefault(); sendOtpToEmail(); }}>
                    <div className="text-center flex items-center justify-center flex-col">
          
                      {!otpSent ? (
                        <>
                          <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full h-[50px] border-2 border-[rgba(0,0,0,0.1)] rounded-md focus:border-[rgba(0,0,0,0.7)] focus:outline-none px-3"
                            placeholder="Enter your email"
                            required
                          />
                        </>
                      ) : (
                        <>
                          <OtpBox length={6} onChange={handleOtpChange} />
                          <br />
                          <p className="text-center text-[15px]">OTP sent to &nbsp;
                            <span className="text-primary font-bold text-[12px] sm:text-[14px]">
                              {localStorage.getItem("userEmail")}
                            </span>
                          </p>
                        </>
                      )}
          
                    </div>
          
                    <br />
          
                    <div className="w-[100%] px-3 sm:w-[300px] sm:px-0 m-auto">
              <Button type="submit" className="w-full btn-org btn-lg">
                        {
                          isLoading
                            ? <CircularProgress color="inherit" size={22} />
                            : otpSent ? "Verify OTP" : "Send OTP"
                        }
                      </Button>
                    </div>
                  </form>
        </div>
      </div>
    </section>
  );
};

export default Verify;
