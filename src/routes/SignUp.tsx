import { Button } from "@progress/kendo-react-buttons";
import {
  Form,
  Field,
  FormElement,
  FieldRenderProps,
  FieldWrapper,
} from "@progress/kendo-react-form";
import { Checkbox, Input } from "@progress/kendo-react-inputs";
import { useCallback, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { menusState, tokenState } from "../store/atoms";
import { useApi } from "../hooks/api";
import { useRecoilState } from "recoil";
import { FormFile, FormInput } from "../components/Editors";
import { AppName, FieldWrap, SignUpBox } from "../CommonStyled";
import {
  Label,
  Error,
  Hint,
  FloatingLabel,
} from "@progress/kendo-react-labels";

interface FormData {
  //companyCode: string;
  userId: string;
  password: string;
}
const Login: React.FC = () => {
  const [token, setToken] = useRecoilState(tokenState);
  const [menus, setMenus] = useRecoilState(menusState);
  //const [api, setApi] = useRecoilState(apiState);
  const history = useHistory();
  const processApi = useApi();

  const handleSubmit = (data: { [name: string]: FormData }) => {
    processLogin(data);
  };

  const processLogin = useCallback(
    async (formData: { [name: string]: any }) => {
      try {
        let para = Object.assign({}, formData);

        //const md5 = require("md5");
        //para.password = sha256(md5(para.password));

        //setShowLoading(true);
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

        //setShowLoading(false);
      } catch (e: any) {
        console.log("login error", e);
        //setShowLoading(false);
        alert(e.message);
      }
    },
    []
  );
  const emailValidator = (value: string) =>
    value !== "" ? "" : "Please enter a valid email.";

  useEffect(() => {
    setToken(null as any);
    setMenus(null as any);
  }, []);

  return (
    <SignUpBox>
      <Form
        onSubmit={handleSubmit}
        render={() => (
          <FormElement horizontal={true}>
            <AppName
              style={{
                backgroundSize: 0,
                padding: 0,
                marginBottom: "40px",
                fontWeight: "900",
              }}
            >
              회원가입
            </AppName>
            <h2>사용자 정보</h2>
            <FieldWrap fieldWidth="50%">
              <Field
                name={"userId"}
                label={"이름"}
                component={FormInput}
                validator={emailValidator}
              />
              <Field
                name={"userId"}
                label={"아이디"}
                component={FormInput}
                validator={emailValidator}
              />
            </FieldWrap>
            <FieldWrap fieldWidth="50%">
              <Field
                name={"password"}
                label={"비밀번호"}
                type={"password"}
                component={FormInput}
              />
              <Field
                name={"password"}
                label={"비밀번호 확인"}
                type={"password"}
                component={FormInput}
              />
            </FieldWrap>
            <FieldWrap fieldWidth="50%">
              <Field
                name={"userId"}
                label={"이메일"}
                component={FormInput}
                validator={emailValidator}
              />
              <Field
                name={"userId"}
                label={"휴대폰 번호"}
                component={FormInput}
                validator={emailValidator}
              />
            </FieldWrap>
            <div className="term-checkbox-container">
              <Field
                id={"terms"}
                name={"terms"}
                label={"개인정보 이용 동의"}
                component={FormCheckbox}
                // validator={termsValidator}
              />
            </div>
            <hr />
            <h2>회사 정보 (선택사항)</h2>
            <FieldWrap fieldWidth="50%">
              <Field
                name={"userId"}
                label={"회사명"}
                component={FormInput}
                validator={emailValidator}
              />
              <Field
                name={"userId"}
                label={"사업자 등록 번호"}
                component={FormInput}
                validator={emailValidator}
              />
            </FieldWrap>
            <FieldWrap fieldWidth="50%">
              <Field
                name={"userId"}
                label={"대표자명"}
                component={FormInput}
                validator={emailValidator}
              />
              <Field
                name={"userId"}
                label={"회사주소"}
                component={FormInput}
                validator={emailValidator}
              />
            </FieldWrap>
            <FieldWrap fieldWidth="50%">
              <Field
                name={"userId"}
                label={"사업자등록증"}
                component={FormFile}
                validator={emailValidator}
              />
              <Field
                name={"userId"}
                label={"명함"}
                component={FormFile}
                validator={emailValidator}
              />
            </FieldWrap>
            <FieldWrap fieldWidth="50%">
              <Field
                name={"userId"}
                label={"재직증명서"}
                component={FormFile}
                validator={emailValidator}
              />
              <Field
                name={"userId"}
                label={"업종"}
                component={FormInput}
                validator={emailValidator}
              />
            </FieldWrap>
            <div className="term-checkbox-container">
              <Field
                id={"terms"}
                name={"terms"}
                label={"기업정보 이용 동의"}
                component={FormCheckbox}
                // validator={termsValidator}
              />
              <Field
                id={"terms"}
                name={"terms"}
                label={"기업 승인 요청"}
                component={FormCheckbox}
                // validator={termsValidator}
              />
            </div>
            <Button className="sign-up-btn" themeColor={"primary"}>
              회원가입
            </Button>
          </FormElement>
        )}
      ></Form>
    </SignUpBox>
  );
};
export default Login;

const FormCheckbox = (fieldRenderProps: FieldRenderProps) => {
  const {
    validationMessage,
    touched,
    id,
    valid,
    disabled,
    hint,
    optional,
    label,
    visited,
    modified,
    ...others
  } = fieldRenderProps;

  const showValidationMessage: string | false | null =
    touched && validationMessage;
  const showHint: boolean = !showValidationMessage && hint;
  const hintId: string = showHint ? `${id}_hint` : "";
  const errorId: string = showValidationMessage ? `${id}_error` : "";

  return (
    <FieldWrapper>
      <Checkbox
        ariaDescribedBy={`${hintId} ${errorId}`}
        label={label}
        labelOptional={optional}
        valid={valid}
        id={id}
        disabled={disabled}
        {...others}
      />
      {showHint && <Hint id={hintId}>{hint}</Hint>}
      {showValidationMessage && <Error id={errorId}>{validationMessage}</Error>}
    </FieldWrapper>
  );
};
