import { Button } from "@progress/kendo-react-buttons";
import {
  Form,
  Field,
  FormElement,
  FieldRenderProps,
  FieldWrapper,
  FormRenderProps,
} from "@progress/kendo-react-form";
import { isLoading } from "../store/atoms";
import { Checkbox, Input } from "@progress/kendo-react-inputs";
import { useCallback, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { menusState, tokenState } from "../store/atoms";
import { useApi } from "../hooks/api";
import { useRecoilState, useSetRecoilState } from "recoil";
import { FormInput, FormReadOnly, FormUpload } from "../components/Editors";
import { AppName, FieldWrap, UserFormBox } from "../CommonStyled";
import { Error, Hint } from "@progress/kendo-react-labels";

interface FormData {
  userId: string;
  password: string;
}
let businessLicense = "";
let businessCard = "";
const MyPage: React.FC = () => {
  const [token, setToken] = useRecoilState(tokenState);
  const [menus, setMenus] = useRecoilState(menusState);
  const setShowLoading = useSetRecoilState(isLoading);
  const [state, setState] = useState<number>(0);
  const [bizyn, setBizyn] = useState<boolean>(false);
  const history = useHistory();
  const processApi = useApi();

  const [initialVal, setInitialVal] = useState({
    userId: "",
    userName: "",
    phoneNumber: "",
    OldPassword: "",
    email: "",
    companyName: "",
    businessType: "",
    businessOwner: "",
    businessNumber: "",
    businessLicense: "",
    businessCard: "",
    businessAddress: "",
    requestDate: "",
    approvalDate: "",
    companyCode: "",
    bizyn: false,
  });

  const [formKey, setFormKey] = useState(1);
  const resetForm = () => {
    setFormKey(formKey + 1);
  };
  useEffect(() => {
    const valueChanged = document.getElementById("valueChanged");
    valueChanged!.click();
  }, [formKey]);

  useEffect(() => {
    //fetch된 데이터가 폼에 세팅되도록 하기 위해 적용
    resetForm();
  }, [initialVal]);

  const onSubmit = (data: any) => {
    if(data.OldPassword == "") {
      alert("비밀번호를 입력해주세요.");
    } else {
      if (
        data.CompanyName == "" &&
        data.BusinessNumber == "" &&
        data.BusinessOwner == "" &&
        data.BusinessAddress == "" &&
        data.BusinessType == "" &&
        data.BusinessLicense == "" &&
        data.BusinessCard == ""
      ) {
        processUpdate(data);
      } else if (
        data.CompanyName == "" ||
        data.BusinessNumber == "" ||
        data.BusinessOwner == "" ||
        data.BusinessAddress == "" ||
        data.BusinessType == "" ||
        data.BusinessLicense == "" ||
        data.BusinessCard == ""
      ) {
        if (data.Bus_yn == true && data.Bus_OK_yn == true) {
          alert("회사 정보를 채워주세요.");
        } else if (data.Bus_yn == true) {
          processUpdate(data);
        } else {
          alert("기업정보 이용 동의를 해주세요.");
        }
      } else {
        if (data.Bus_yn == true) {
          if (data.Bus_OK_yn == true) {
            processBiz(data);
          } else {
            processUpdate(data);
          }
        } else {
          alert("기업정보 이용 동의를 해주세요.");
        }
      }
    }
  };

  const processUpdate = useCallback(
    async (formData: { [name: string]: any }) => {
      let para = Object.assign({}, formData);
      let data: any;
      if (
        para.UserName == undefined ||
        para.UserId == undefined ||
        para.Email == undefined ||
        para.OldPassword == undefined
      ) {
        alert("사용자 정보를 입력해주세요.");
      } else if (para.Password != undefined && para.Password != para.PasswordConfirm) {
        alert("비밀번호가 맞지 않습니다.");
      } else {
          setShowLoading(true);
          try {
            data = await processApi<any>("user-info-save", para);
          } catch (e: any) {
            data = null;
            console.log("MyPage error", e);
            //setShowLoading(false);
            alert(e.message);
          }
          if (data != null) {
            alert("수정이 완료되었습니다.");
            fetchUser();
          }
          setShowLoading(false);
      }
    },
    []
  );

  const processBiz = useCallback(async (formData: { [name: string]: any }) => {
    let para = Object.assign({}, formData);
    let data: any;
    if (
      para.UserName == undefined ||
      para.UserId == undefined ||
      para.Email == undefined ||
      para.OldPassword == undefined
    ) {
      alert("사용자 정보를 입력해주세요.");
    } else {
      try {
        data = await processApi<any>("user-info-save", para);
      } catch (e: any) {
        data = null;
        console.log("MyPage error", e);
        //setShowLoading(false);
        alert(e.message);
      }

      if (data != null) {
        data = [];
        try {
          data = await processApi<any>("user-approval-request", para);
        } catch (e: any) {
          data = null;
          console.log("MyPage error", e);
          //setShowLoading(false);
          alert(e.message);
        }
      }

      if (data != null) {
        alert("승인 요청이 완료되었습니다.");
        setState(1);
        fetchUser();
      }
      setShowLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUser();
  }, []);

  async function fetchUser() {
    const response = await processApi<any>("user-info-view");
    businessLicense = response.businessLicense;
    businessCard = response.businessCard;
    setInitialVal((prev) => {
      return {
        ...prev,
        businessAddress:
          response.businessAddress != undefined ? response.businessAddress : "",
        businessCard:
          response.businessCard != undefined ? response.businessCard : "",
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

  const onDeleteUser = async (data: any) => {
    if(data == "") {
      alert("비밀번호를 입력해주세요.");
    } else {
      if (!window.confirm("회원 탈퇴하시겠습니까?")) {
        return false;
      }
      let para = Object.assign({}, { password : data });
      try {
        const response = await processApi<any>("user-info-delete", para);
        setToken(null as any);
        setMenus(null as any);
        history.replace("/ServiceDashboard");
      } catch (e: any) {
        alert(e.message);
      }
    }
  };

  const emailValidator = (value: string) =>
    value !== "" ? "" : "Please enter a valid email.";

  return (
    <UserFormBox style={{height: `calc(100vh - 40px)`}}>
      <Form
        key={formKey}
        initialValues={{
          UserId: initialVal.userId,
          UserName: initialVal.userName,
          PhoneNumber: initialVal.phoneNumber,
          OldPassword: "",
          PasswordConfirm: "",
          Password: "",
          Email: initialVal.email,
          CompanyName: initialVal.companyName,
          BusinessType: initialVal.businessType,
          BusinessOwner: initialVal.businessOwner,
          BusinessNumber: initialVal.businessNumber,
          BusinessLicense: initialVal.businessLicense,
          BusinessCard: initialVal.businessCard,
          BusinessAddress: initialVal.businessAddress,
          approvalDate: initialVal.approvalDate,
          companyCode: initialVal.companyCode,
          requestDate: initialVal.requestDate,
          Bus_yn: initialVal.bizyn,
        }}
        onSubmit={onSubmit}
        render={(formRenderProps: FormRenderProps) => (
          <FormElement horizontal={true}>
            <button
              id="valueChanged"
              style={{ display: "none" }}
              onClick={(e) => {
                e.preventDefault(); // Changing desired field value
                formRenderProps.onChange("valueChanged", {
                  value: "1",
                });
              }}
            ></button>
            <AppName
              style={{
                backgroundSize: 0,
                padding: 0,
                marginBottom: "10px",
                fontWeight: "900",
              }}
            >
              마이페이지
            </AppName>
            <h2>사용자 정보</h2>
            <FieldWrap fieldWidth="100%">
              <Field
                name={"UserName"}
                label={"이름"}
                component={FormInput}
                validator={emailValidator}
              />
            </FieldWrap>
            <FieldWrap fieldWidth="100%">
              <Field
                name={"UserId"}
                label={"이메일"}
                component={FormReadOnly}
                className="readonly"
              />
            </FieldWrap>
            <FieldWrap fieldWidth="100%">
            <Field
                name={"OldPassword"}
                label={"현재 비밀번호"}
                type={"password"}
                component={FormInput}
              />
            </FieldWrap>
            <FieldWrap fieldWidth="100%">
              <Field
                name={"Password"}
                label={"새 비밀번호"}
                type={"password"}
                component={FormInput}
              />
              </FieldWrap>
              <FieldWrap fieldWidth="100%">
              <Field
                name={"PasswordConfirm"}
                label={"새 비밀번호 확인"}
                type={"password"}
                component={FormInput}
              />
            </FieldWrap>
            <FieldWrap fieldWidth="100%">
              <Field
                name={"PhoneNumber"}
                label={"휴대폰 번호"}
                component={FormInput}
                validator={emailValidator}
              />
            </FieldWrap>
            <div>
              <hr />
              <h2>기업용 승인정보</h2>
              <FieldWrap fieldWidth="100%">
                <Field
                  name={"approvalDate"}
                  label={"승인일"}
                  component={FormReadOnly}
                  className="readonly"
                />
                </FieldWrap>
                <FieldWrap fieldWidth="100%">
                <Field
                  name={"companyCode"}
                  label={"회사코드"}
                  component={FormReadOnly}
                  className="readonly"
                />
              </FieldWrap>
            </div>
            <Button className="sign-up-btn" themeColor={"primary"}>
              저장
            </Button>
            <Button
              className="sign-out-btn"
              type="button"
              themeColor={"info"}
              fillMode="outline"
              onClick={() => onDeleteUser(formRenderProps.valueGetter("OldPassword"))}
              style={{ width: "100%", marginTop: "30px", height: "50px" }}
            >
              회원 탈퇴
            </Button>
          </FormElement>
        )}
      ></Form>
    </UserFormBox>
  );
};
export default MyPage;

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
