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
const MyPage: React.FC = () => {
  const [token, setToken] = useRecoilState(tokenState);
  const [menus, setMenus] = useRecoilState(menusState);
  const setShowLoading = useSetRecoilState(isLoading);
  const [state, setState] = useState<number>(0);
  const history = useHistory();
  const processApi = useApi();

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
    businessCard: "",
    businessAddress: "",
    requestDate: "",
    approvalDate: "",
    companyCode: "",
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

  const onSubmit = (data: any, buttonType: string) => {
    if (buttonType === "submit1") {
      processUpdate(data);
    } else if (buttonType === "submit2") {
      if(state == 0) {
        processBiz(data);
      } else if(state == 1) {
        processBizCancel();
      }
    }
  };

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    const buttonType = event.currentTarget.name;

    // 폼 데이터를 가져옵니다.
    const formData = new FormData(event.currentTarget.form as HTMLFormElement);
    const data = Object.fromEntries(formData.entries());

    onSubmit(data, buttonType);
  };

  const processUpdate = useCallback(
    async (formData: { [name: string]: any }) => {
      let para = Object.assign({}, formData);
      console.log(para);
      let data: any;
      if (
        para.UserName == undefined ||
        para.UserId == undefined ||
        para.Email == undefined
      ) {
        alert("사용자 정보를 입력해주세요.");
      } else if (
        para.password == "" ||
        para.Password !== para.PasswordConfirm
      ) {
        alert("비밀번호가 맞지 않습니다.");
      } else {
        if (
          para.CompanyName == "" &&
          para.BusinessNumber == "" &&
          para.BusinessOwner == "" &&
          para.BusinessAddress == "" &&
          para.BusinessType == "" &&
          para.BusinessLicense == "" &&
          para.BusinessCard == ""
        ) {
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
        } else {
          setShowLoading(true);
          if (
            para.BusinessLicense != ""
          ) {
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

          if (para.BusinessCard != "") {
            var fileReader = new FileReader();
            fileReader.readAsDataURL(para.BusinessCard);
            fileReader.onload = function (e) {
              if (e.target != null) {
                para.BusinessCard = e.target.result?.toString().split(",")[1];
              }
            };
          }

          try {
            data = await processApi<any>("user-info-save", para);
          } catch (e: any) {
            data = null;
            console.log("MyPage error", e);
            //setShowLoading(false);
            alert(e.message);
          }
          setShowLoading(false);
          if (data != null) {
            alert("수정이 완료되었습니다.");
        fetchUser();
          }
        }
      }
    },
    []
  );

  const processBiz = useCallback(async (formData: { [name: string]: any }) => {
    let para = Object.assign({}, formData);
    let data: any;
    if (
      para.CompanyName != "" &&
      para.BusinessNumber != "" &&
      para.BusinessOwner != "" &&
      para.BusinessAddress != "" &&
      para.BusinessType != "" &&
      para.BusinessLicense != "" &&
      para.BusinessCard != ""
    ) {
      setShowLoading(true);
      const userPara = {
        CompanyName: para.CompanyName,
        BusinessType: para.BusinessType,
        BusinessNumber: para.BusinessNumber,
        BusinessLicense: para.BusinessLicense,
        BusinessOwner: para.BusinessOwner,
        BusinessAddress: para.BusinessAddress,
      };

      if (userPara.BusinessLicense != undefined) {
        var fileReader = new FileReader();
        fileReader.readAsDataURL(userPara.BusinessLicense);
        fileReader.onload = function (e) {
          if (e.target != null) {
            userPara.BusinessLicense = e.target.result
              ?.toString()
              .split(",")[1];
          }
        };
      }

      try {
        data = await processApi<any>("user-info-save", para);
      } catch (e: any) {
        data = null;
        console.log("MyPage error", e);
        //setShowLoading(false);
        alert(e.message);
      }

      if(data != null) {
        data = [];
        try {
          data = await processApi<any>("user-approval-request", userPara);
        } catch (e: any) {
          data = null;
          console.log("MyPage error", e);
          //setShowLoading(false);
          alert(e.message);
        }
      }

      if (data != null) {
        alert("승인 요청이 완료되었습니다.");
        fetchUser();
      }
      setShowLoading(false);
    } else {
      alert("회사 정보를 채워주세요.");
    }
  }, []);

  useEffect(() => {
    fetchUser();
  }, []);

  async function fetchUser() {
    const response = await processApi<any>("user-info-view");

    setInitialVal((prev) => {
      return {
        ...prev,
        businessAddress:
          response.businessAddress != undefined
            ? response.businessAddress
            : "",
        businessCard:
          response.businessCard != undefined ? response.businessCard : "",
        businessLicense:
          response.businessLicense != undefined
            ? response.businessLicense
            : "",
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

  const onDeleteUser = async () => {
    if (!window.confirm("회원 탈퇴하시겠습니까?")) {
      return false;
    }
    const response = await processApi<any>("user-info-delete");
    setToken(null as any);
    setMenus(null as any);
    history.replace("/ServiceDashboard");
  };

  const processBizCancel = async () => {
    if (!window.confirm("승인 취소하시겠습니까?")) {
      return false;
    }
    const response = await processApi<any>("user-approval-request-delete");
    fetchUser();
  };

  const emailValidator = (value: string) =>
    value !== "" ? "" : "Please enter a valid email.";

  return (
    <UserFormBox>
      <Form
        key={formKey}
        initialValues={{
          UserId: initialVal.userId,
          UserName: initialVal.userName,
          PhoneNumber: initialVal.phoneNumber,
          Password: initialVal.password,
          Email: initialVal.email,
          CompanyName: initialVal.companyName,
          BusinessType: initialVal.businessType,
          BusinessOwner: initialVal.businessOwner,
          BusinessNumber: initialVal.businessNumber,
          BusinessLicense: initialVal.businessLicense,
          BusinessCard: initialVal.businessCard,
          BusinessAddress: initialVal.businessAddress,
        }}
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
                marginBottom: "40px",
                fontWeight: "900",
              }}
            >
              마이페이지
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
                component={FormReadOnly}
                className="readonly"
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
            <hr />
            <h2>회사 정보 (선택사항)</h2>
            <FieldWrap fieldWidth="50%">
              <Field
                name={"CompanyName"}
                label={"회사명"}
                component={FormInput}
              />
              <Field
                name={"BusinessNumber"}
                label={"사업자 등록 번호"}
                component={FormInput}
              />
            </FieldWrap>
            <FieldWrap fieldWidth="50%">
              <Field
                name={"BusinessOwner"}
                label={"대표자명"}
                component={FormInput}
              />
              <Field
                name={"BusinessAddress"}
                label={"회사주소"}
                component={FormInput}
              />
            </FieldWrap>
            <FieldWrap fieldWidth="100%" className="full-form-field">
              <Field
                name={"BusinessType"}
                label={"업종"}
                component={FormInput}
              />
            </FieldWrap>
            <FieldWrap fieldWidth="100%" className="full-form-field">
              <Field
                name={"BusinessLicense"}
                label={"사업자등록증"}
                component={FormUpload}
              />
            </FieldWrap>
            <FieldWrap fieldWidth="100%" className="full-form-field">
              <Field
                name={"BusinessCard"}
                label={"명함"}
                component={FormUpload}
              />
            </FieldWrap>
            <Button
              onClick={handleClick}
              className="sign-up-btn"
              themeColor={"primary"}
              name="submit1"
            >
              수정
            </Button>
            {state != 2 ? (
              <Button
                onClick={handleClick}
                className="sign-up-btn"
                themeColor={"primary"}
                name="submit2"
                fillMode={state == 0 ? "solid" : "outline"}
              >
                {state == 0 ? "기업 승인 요청" : "기업 승인 요청 취소"}
              </Button>
            ) : (
              ""
            )}
            <Button
              className="sign-out-btn"
              type="button"
              themeColor={"info"}
              fillMode="outline"
              onClick={onDeleteUser}
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
