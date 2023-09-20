import { Button } from "@progress/kendo-react-buttons";
import { Form, Field, FormElement } from "@progress/kendo-react-form";
import { useCallback } from "react";
import { useHistory } from "react-router-dom";
import { tokenState } from "../store/atoms";
import { useApi } from "../hooks/api";
import { useRecoilState } from "recoil";
import { FormInput } from "../components/Editors";
import { AppName, LoginBox } from "../CommonStyled";

interface FormData {
  //companyCode: string;
  userId: string;
  password: string;
}
const Login: React.FC = () => {
  const [token, setToken] = useRecoilState(tokenState);
  const history = useHistory();
  const processApi = useApi();

  const handleSubmit = (data: { [name: string]: FormData }) => {
    processLogin(data);
  };

  const processLogin = useCallback(
    async (formData: { [name: string]: any }) => {
      try {
        let para = Object.assign(
          {},
          { ...formData, companyCode: "CLOUDSTORE" }
        );

        const response = await processApi<any>("login", para);

        const {
          token,
          userId,
          userName,
          role,
          companyCode,
          serviceName,
          customerName,
          loginKey,
        } = response;

        setToken({
          token,
          langCode: formData.langCode,
          userId,
          userName,
          role,
          companyCode,
          serviceName,
          customerName,
          loginKey,
        });

        history.replace("/ServiceDashboard");
      } catch (e: any) {
        console.log("login error", e);
        if(e.status && e.data.emailVerified != undefined && e.data.emailVerified == false){
          if(!window.confirm("이메일 인증이 완료되지 않았습니다. 인증 메일을 재발송 하시겠습니까?")){
            return false
          }

          let para2 = Object.assign(
            {},
            { email: formData.userId, password: formData.password }
          );
  
          const response2 = await processApi<any>("email", para2);

          console.log(response2);
        } else {
          alert(e.data.message);
        }
      }
    },
    []
  );

  const onClickSignUp = () => {
    history.replace("/SignUp");
  };

  return (
    <LoginBox>
      <Form
        onSubmit={handleSubmit}
        render={() => (
          <FormElement horizontal={true}>
            <AppName
              style={{
                backgroundPosition: "45px",
                paddingLeft: "70px",
              }}
            >
              GST Cloud Store
            </AppName>
            <Field name={"userId"} label={"ID"} component={FormInput} />
            <Field
              name={"password"}
              label={"PASSWORD"}
              type={"password"}
              component={FormInput}
            />
            <Button className="login-btn" themeColor={"primary"}>
              LOGIN
            </Button>
            <div className="footer">
              <Button
                onClick={onClickSignUp}
                className="sign-up"
                fillMode={"flat"}
              >
                회원가입
              </Button>
              <Button className="find-idpw" fillMode={"flat"}>
                ID/PW 찾기
              </Button>
            </div>
          </FormElement>
        )}
      ></Form>
    </LoginBox>
  );
};
export default Login;
