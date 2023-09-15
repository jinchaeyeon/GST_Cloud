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
import {
  SetStateAction,
  createRef,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { useHistory } from "react-router-dom";
import { menusState, tokenState } from "../store/atoms";
import { useApi } from "../hooks/api";
import { useRecoilState, useSetRecoilState } from "recoil";
import { FormInput, FormUpload } from "../components/Editors";
import { AppName, FieldWrap, UserFormBox } from "../CommonStyled";
import { Error, Hint } from "@progress/kendo-react-labels";
import Token from "../components/Token";

interface FormData {
  userId: string;
  password: string;
}

const SignUp: React.FC = () => {
  const [token, setToken] = useRecoilState(tokenState);
  const [menus, setMenus] = useRecoilState(menusState);
  const setShowLoading = useSetRecoilState(isLoading);
  const history = useHistory();
  const processApi = useApi();
  const [value, setValue] = useState<string>("");

  const handleSubmit = async (data: { [name: string]: FormData }) => {
    let para = Object.assign({}, data);
    let datas = false;
    if (
      para.UserName == undefined ||
      para.UserId == undefined ||
      para.Password == undefined ||
      para.PasswordConfirm == undefined ||
      para.PhoneNumber == undefined
    ) {
      alert("사용자 정보를 입력해주세요.");
    } else if (para.Password !== para.PasswordConfirm) {
      alert("비밀번호가 맞지 않습니다.");
    } else {
      if (para.User_yn != undefined) {
        if(value != "") {
          try {
            data = await processApi<any>("sign-up", para, value);
          } catch (e: any) {
            datas = true;
            console.log("Sign-up error", e);
            //setShowLoading(false);
            alert(e.message);
          }

          if (datas == false) {
            alert("회원가입이 완료되었습니다.");
            history.replace("/");
          }
        }
      } else {
        alert("개인정보 이용 동의를 해주세요");
      }
    }
  };

  const highFunction = (
    text: SetStateAction<string>,
  ) => {
    setValue(text);
  };

  const emailValidator = (value: string) => {
    let result = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;;
    if (result.test(value)) {
      return "";
    } else {
      return "Please enter a valid email.";
    }
  };
    

  const PhoneNumberValidator = (number: string) => {
    let result = /^(01[016789]{1})-?[0-9]{3,4}-?[0-9]{4}$/;
    if (result.test(number)) {
      return "";
    } else {
      return "Please enter a valid PhoneNumber.";
    }
  };

  useEffect(() => {
    setToken(null as any);
    setMenus(null as any);
  }, []);

  return (
    <UserFormBox style={{height: "100vh"}}>
      <Form
        onSubmit={handleSubmit}
        render={() => (
          <FormElement horizontal={true}>
            <AppName
              style={{
                backgroundSize: 0,
                padding: 0,
                marginBottom: "10px",
                fontWeight: "900",
              }}
            >
              회원가입
            </AppName>
            <FieldWrap fieldWidth="100%">
              <Field
                name={"UserName"}
                label={"이름"}
                component={FormInput}
              />
            </FieldWrap>
            <FieldWrap fieldWidth="100%">
              <Field
                name={"UserId"}
                label={"이메일"}
                component={FormInput}
                validator={emailValidator}
              />
            </FieldWrap>
            <FieldWrap fieldWidth="100%">
              <Field
                name={"Password"}
                label={"비밀번호"}
                type={"password"}
                component={FormInput}
              />
            </FieldWrap>
            <FieldWrap fieldWidth="100%">
              <Field
                name={"PasswordConfirm"}
                label={"비밀번호 확인"}
                type={"password"}
                component={FormInput}
              />
            </FieldWrap>
            <FieldWrap fieldWidth="100%">
              <Field
                name={"PhoneNumber"}
                label={"연락처"}
                component={FormInput}
                validator={PhoneNumberValidator}
                placeholder={"000-0000-0000"}
              />
            </FieldWrap>
            <div
              className="term-checkbox-container"
              style={{ margin: "0 auto", textAlign: "center" }}
            >
              <div style={{ margin: "0 auto", textAlign: "center" }}>
                <Field
                  id={"User_yn"}
                  name={"User_yn"}
                  label={"개인정보 이용 동의"}
                  component={FormCheckbox}
                />
              </div>
            </div>
            <Token propFunction={highFunction} />
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
