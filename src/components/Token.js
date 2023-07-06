import React, { useEffect, useRef } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { Button } from "@progress/kendo-react-buttons";

export default function Token(props) {
  const captchaRef = useRef(null);

  const Captcha = () => {
    return (
      <div>
        <ReCAPTCHA
          ref={captchaRef}
          sitekey="6LfvVbImAAAAAITQhkc0YBH17bl3vCqHRjGDlZFr"
        />
      </div>
    );
  };

  useEffect(() => {
    if(captchaRef != null) {
      const token = captchaRef.current.getValue();
      props.propFunction(token);
    }
  })

  return (
    <div style={{ marginTop: "20px" }}>
      <div style={{ margin: "auto", textAlign: "center" }}>
        <div style={{ verticalAlign: "middle", display: "inline-block" }}>
          {Captcha()}
        </div>
      </div>
    </div>
  );
}
