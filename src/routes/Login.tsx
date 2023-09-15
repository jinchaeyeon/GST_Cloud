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

        alert(e.message);
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
              PlusWin-Cloud
            </AppName>
            <Field name={"userId"} label={"이메일"} component={FormInput} />
            <Field
              name={"password"}
              label={"비밀번호"}
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
            </div>
          </FormElement>
        )}
      ></Form>
    </LoginBox>
  );
};
export default Login;
