import React, { useRef } from "react";
import ReCAPTCHA from "react-google-recaptcha";

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

  const callApi = () => {
    const token = captchaRef.current.getValue();
    props.propFunction(token, true);
  };

  return (
    <div style={{ marginTop: "10px" }}>
      <div style={{ margin: "auto", textAlign: "center" }}>
        <div style={{ verticalAlign: "middle", display: "inline-block" }}>
          {Captcha()}
        </div>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <button onClick={() => callApi()} type={"button"}>
            확인
          </button>
          <button
            onClick={() => {
              captchaRef.current.reset();
              props.propFunction("", false);
            }}
            type={"button"}
          >
            초기화
          </button>
        </div>
      </div>
    </div>
  );
}
