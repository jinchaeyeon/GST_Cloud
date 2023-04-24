import { Button } from "@progress/kendo-react-buttons";
import {
  Form,
  Field,
  FormElement,
  FieldRenderProps,
  FieldWrapper,
} from "@progress/kendo-react-form";
import { isLoading } from "../store/atoms";
import { Checkbox, Input } from "@progress/kendo-react-inputs";
import { useCallback, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { menusState, tokenState } from "../store/atoms";
import { useApi } from "../hooks/api";
import { useRecoilState, useSetRecoilState } from "recoil";
import { FormInput, FormUpload } from "../components/Editors";
import { AppName, FieldWrap, UserFormBox } from "../CommonStyled";
import { Error, Hint } from "@progress/kendo-react-labels";

interface FormData {
  userId: string;
  password: string;
}
const SignUp: React.FC = () => {
  const [token, setToken] = useRecoilState(tokenState);
  const [menus, setMenus] = useRecoilState(menusState);
  const setShowLoading = useSetRecoilState(isLoading);
  // const [bizyn, setBizyn] = useState<boolean>(false);
  const history = useHistory();
  const processApi = useApi();

  const handleSubmit = (data: { [name: string]: FormData }) => {
    processSignUp(data);
  };

  const processSignUp = useCallback(
    async (formData: { [name: string]: any }) => {
      let para = Object.assign({}, formData);
      let data: any;
      if (
        para.UserName == undefined ||
        para.UserId == undefined ||
        para.Password == undefined ||
        para.PasswordConfirm == undefined ||
        para.Email == undefined ||
        para.PhoneNumber == undefined
      ) {
        alert("사용자 정보를 입력해주세요.");
      } else if (para.Password !== para.PasswordConfirm) {
        alert("비밀번호가 맞지 않습니다.");
      } else {
        if (
          para.BusinessLicense == undefined &&
          para.BusinessCard == undefined
        ) {
          if (para.User_yn == true && para.Bus_yn == true) {
            setShowLoading(true);
            try {
              data = await processApi<any>("sign-up", para);
            } catch (e: any) {
              data = null;
              console.log("Sign-up error", e);
              //setShowLoading(false);
              alert(e.message);
            }

            if (data != null) {
              alert("회원가입이 완료되었습니다.");
              history.replace("/");
            }
          } else {
            alert("이용 동의를 해주세요");
          }
        } else {
          if (para.User_yn == true &&para.Bus_yn == true) {
            //&& para.Bus_OK_yn == true
            setShowLoading(true);
            if (para.BusinessLicense != undefined) {
              var fileReader = new FileReader();
              fileReader.readAsDataURL(para.BusinessLicense);
              fileReader.onload = function (e) {
                if (e.target != null) {
                  para.BusinessLicense = e.target.result
                    ?.toString()
                    .split(",")[1];
                }
              };
            }
            setShowLoading(false);
            if (para.BusinessCard != undefined) {
              var fileReader = new FileReader();
              fileReader.readAsDataURL(para.BusinessCard);
              fileReader.onload = function (e) {
                if (e.target != null) {
                  para.BusinessCard = e.target.result?.toString().split(",")[1];
                }
              };
            }
            try {
              data = await processApi<any>("sign-up", para);
            } catch (e: any) {
              data = null;
              console.log("Sign-up error", e);
              //setShowLoading(false);
              alert(e.message);
            }

            if (data != null) {
              alert("회원가입이 완료되었습니다.");
              history.replace("/");
            }

            setShowLoading(false);
          } else {
            alert("이용 동의를 해주세요");
          }
        }
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
    <UserFormBox>
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
                name={"UserName"}
                label={"이름"}
                component={FormInput}
                validator={emailValidator}
              />
              <Field
                name={"UserId"}
                label={"아이디"}
                component={FormInput}
                validator={emailValidator}
              />
            </FieldWrap>
            <FieldWrap fieldWidth="50%">
              <Field
                name={"Password"}
                label={"비밀번호"}
                type={"password"}
                component={FormInput}
              />
              <Field
                name={"PasswordConfirm"}
                label={"비밀번호 확인"}
                type={"password"}
                component={FormInput}
              />
            </FieldWrap>
            <FieldWrap fieldWidth="50%">
              <Field
                name={"Email"}
                label={"이메일"}
                component={FormInput}
                validator={emailValidator}
              />
              <Field
                name={"PhoneNumber"}
                label={"휴대폰 번호"}
                component={FormInput}
                validator={emailValidator}
              />
            </FieldWrap>
            <div className="term-checkbox-container">
              <Field
                id={"User_yn"}
                name={"User_yn"}
                label={"개인정보 이용 동의"}
                component={FormCheckbox}
              />
            </div>
            <hr />
            <h2>회사 정보 (선택사항)</h2>
            <FieldWrap fieldWidth="50%">
              <Field
                name={"CompanyName"}
                label={"회사명"}
                component={FormInput}
                validator={emailValidator}
              />
              <Field
                name={"BusinessNumber"}
                label={"사업자 등록 번호"}
                component={FormInput}
                validator={emailValidator}
              />
            </FieldWrap>
            <FieldWrap fieldWidth="50%">
              <Field
                name={"BusinessOwner"}
                label={"대표자명"}
                component={FormInput}
                validator={emailValidator}
              />
              <Field
                name={"BusinessAddress"}
                label={"회사주소"}
                component={FormInput}
                validator={emailValidator}
              />
            </FieldWrap>
            <FieldWrap fieldWidth="100%" className="full-form-field">
              <Field
                name={"BusinessType"}
                label={"업종"}
                component={FormInput}
                validator={emailValidator}
              />
            </FieldWrap>
            <FieldWrap fieldWidth="100%" className="full-form-field">
              <Field
                name={"BusinessLicense"}
                label={"사업자등록증"}
                component={FormUpload}
                validator={emailValidator}
              />
            </FieldWrap>
            <FieldWrap fieldWidth="100%" className="full-form-field">
              <Field
                name={"BusinessCard"}
                label={"명함"}
                component={FormUpload}
                validator={emailValidator}
              />
            </FieldWrap>
            <div className="term-checkbox-container">
              <Field
                id={"Bus_yn"}
                name={"Bus_yn"}
                label={"기업정보 이용 동의"}
                component={FormCheckbox}
              />
              {/* {bizyn == true ? ( <Field
                id={"Bus_OK_yn"}
                name={"Bus_OK_yn"}
                label={"기업 승인 요청"}
                component={FormCheckbox}
                // validator={termsValidator}
              />) : ( <Field
                id={"Bus_OK_yn"}
                name={"Bus_OK_yn"}
                label={"기업 승인 요청"}
                component={FormCheckbox}
                disabled={true}
                // validator={termsValidator}
              />)} */}
            </div>
            <Button className="sign-up-btn" themeColor={"primary"}>
              회원가입
            </Button>
          </FormElement>
        )}
      ></Form>
    </UserFormBox>
  );
};
export default SignUp;

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
