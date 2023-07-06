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
import { SetStateAction, useCallback, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { menusState, tokenState } from "../store/atoms";
import { useApi } from "../hooks/api";
import { useRecoilState, useSetRecoilState } from "recoil";
import { FormInput, FormUpload } from "../components/Editors";
import { AppName, FieldWrap, UserFormBox } from "../CommonStyled";
import { Error, Hint } from "@progress/kendo-react-labels";
import Token from "../components/Token";
import { Icon, IconThemeColor } from "@progress/kendo-react-common";

interface FormData {
  userId: string;
  password: string;
}
let businessLicense = "";
const BusinessSignUp: React.FC = () => {
  const [token, setToken] = useRecoilState(tokenState);
  const [menus, setMenus] = useRecoilState(menusState);
  const setShowLoading = useSetRecoilState(isLoading);
  //const history = useHistory();
  const processApi = useApi();
  const [state, setState] = useState<number>(0);
  const [value, setValue] = useState<string>("");

  const handleSubmit = async (data: { [name: string]: FormData }) => {
    const datas2 = processSignUp(data);
    let para = Object.assign({}, datas2);
    let datas: any;
    if (para.Bus_yn != undefined && para.Bus_yn != "") {
      console.log(value);
      if(value != "") {
        try {
          data = await processApi<any>("user-approval-request", para, value);
        } catch (e: any) {
          datas = true;
          console.log("Sign-up error", e);
          //setShowLoading(false);
          alert(e.message);
        }

        if (datas != true) {
          alert("기업용 계정 신청이 완료되었습니다.");
          window.location.reload();
        }
      }
    } else {
      alert("기업정보 이용 동의를 해주세요");
    }
  };

  const processSignUp = useCallback((formData: { [name: string]: any }) => {
      setShowLoading(true);
      let para = Object.assign({}, formData);
      if (para.BusinessLicense != undefined) {
        var fileReader = new FileReader();
        fileReader.readAsDataURL(para.BusinessLicense);
        fileReader.onload = function (e) {
          if (e.target != null) {
            para.BusinessLicense = e.target.result?.toString().split(",")[1];
          }
        };
      }
      setShowLoading(false);
      return para;
    },
    []
  );

  const highFunction = (
    text: SetStateAction<string>,
    yn: boolean | ((prevState: boolean) => boolean)
  ) => {
    setValue(text);
  };

  const [initialVal, setInitialVal] = useState({
    userId: "",
    userName: "",
    phoneNumber: "",
    password: "",
    email: "",
    companyName: "",
    businessType: "",
    businessOwner: "",
    businessNumber: "",
    businessLicense: "",
    businessAddress: "",
    requestDate: "",
    approvalDate: "",
    companyCode: "",
    bizyn: false,
  });

  useEffect(() => {
    fetchUser();
  }, []);

  async function fetchUser() {
    const response = await processApi<any>("user-info-view");
    businessLicense = response.businessLicense;
    setInitialVal((prev) => {
      return {
        ...prev,
        businessAddress:
          response.businessAddress != undefined ? response.businessAddress : "",
        businessLicense:
          response.businessLicense != undefined ? response.businessLicense : "",
        businessNumber:
          response.businessNumber != undefined ? response.businessNumber : "",
        businessOwner:
          response.businessOwner != undefined ? response.businessOwner : "",
        businessType:
          response.businessType != undefined ? response.businessType : "",
        companyName:
          response.companyName != undefined ? response.companyName : "",
        email: response.email,
        phoneNumber: response.phoneNumber,
        userId: response.userId,
        userName: response.userName,
        password: "",
        requestDate: response.requestDate,
        approvalDate: response.approvalDate,
        companyCode: response.companyCode,
        bizyn:
          response.businessAddress == "" &&
          response.businessCard == null &&
          response.businessLicense == null &&
          response.businessNumber == "" &&
          response.businessOwner == "" &&
          response.businessType == "" &&
          response.companyName == ""
            ? false
            : true,
      };
    });
    if (response.requestDate == "" && response.approvalDate == "") {
      setState(0);
    } else if (response.requestDate != "" && response.approvalDate == "") {
      setState(1);
    } else if (response.requestDate != "" && response.approvalDate != "") {
      setState(2);
    }
  }

  const processBizCancel = async () => {
    if (!window.confirm("승인 취소하시겠습니까?")) {
      return false;
    }
    const response = await processApi<any>("user-approval-request-delete");
    fetchUser();
  };

  return (
    <UserFormBox style={{ height: `calc(100vh - 40px)` }}>
      <Form
        onSubmit={handleSubmit}
        render={() =>
          state == 0 ? (
            <FormElement horizontal={true}>
              <AppName
                style={{
                  backgroundSize: 0,
                  padding: 0,
                  marginBottom: "40px",
                  fontWeight: "900",
                }}
              >
                기업용 계정 신청
              </AppName>
              <h2>회사 정보</h2>
              <FieldWrap fieldWidth="100%" className="full-form-field">
                <Field
                  name={"CompanyName"}
                  label={"회사명"}
                  component={FormInput}
                  // validator={emailValidator}
                />
              </FieldWrap>
              <FieldWrap fieldWidth="100%" className="full-form-field">
                <Field
                  name={"BusinessNumber"}
                  label={"사업자 등록 번호"}
                  component={FormInput}
                  //validator={emailValidator}
                />
              </FieldWrap>
              <FieldWrap fieldWidth="100%" className="full-form-field">
                <Field
                  name={"BusinessOwner"}
                  label={"대표자명"}
                  component={FormInput}
                  //validator={emailValidator}
                />
              </FieldWrap>
              <FieldWrap fieldWidth="100%" className="full-form-field">
                <Field
                  name={"BusinessAddress"}
                  label={"회사주소"}
                  component={FormInput}
                  //validator={emailValidator}
                />
              </FieldWrap>
              <FieldWrap fieldWidth="100%" className="full-form-field">
                <Field
                  name={"BusinessType"}
                  label={"업종"}
                  component={FormInput}
                  //validator={emailValidator}
                />
              </FieldWrap>
              <FieldWrap fieldWidth="100%" className="full-form-field">
                <Field
                  name={"BusinessLicense"}
                  label={"사업자등록증"}
                  component={FormUpload}
                  //validator={emailValidator}
                />
              </FieldWrap>
              <div
                className="term-checkbox-container"
                style={{ margin: "0 auto", textAlign: "center" }}
              >
                <div style={{ margin: "0 auto", textAlign: "center" }}>
                  <Field
                    id={"Bus_yn"}
                    name={"Bus_yn"}
                    label={"기업정보 이용 동의"}
                    component={FormCheckbox}
                  />
                </div>
              </div>
              <Token propFunction={highFunction} />
              <Button className="sign-up-btn" themeColor={"primary"}>
                기업 계정 신청
              </Button>
            </FormElement>
          ) : state == 1 ? (
            <FormElement horizontal={true}>
              <AppName
                style={{
                  backgroundSize: 0,
                  padding: 0,
                  marginBottom: "40px",
                  fontWeight: "900",
                }}
              >
                기업 계정 승인 요청이 신청되었습니다
              </AppName>
              <Button
                className="sign-out-btn"
                type="button"
                themeColor={"primary"}
                fillMode="outline"
                onClick={processBizCancel}
                style={{ width: "100%", height: "50px" }}
              >
                기업 계정 신청 요청 취소
              </Button>
            </FormElement>
          ) : (
            <FormElement
              horizontal={true}
              style={{ textAlign: "center" }}
            >
              <Icon
                style={{ marginTop: "40px" }}
                name="check-circle"
                size="xlarge"
                themeColor={"primary"}
              />
              <AppName
                style={{
                  backgroundSize: 0,
                  padding: 0,
                  marginBottom: "40px",
                  fontWeight: "900",
                }}
              >
                기업 계정 서비스를 이용중입니다.
              </AppName>
            </FormElement>
          )
        }
      ></Form>
    </UserFormBox>
  );
};
export default BusinessSignUp;

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
