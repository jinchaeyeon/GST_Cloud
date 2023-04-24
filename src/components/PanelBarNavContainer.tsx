import { useCallback, useState } from "react";
import {
  PanelBar,
  PanelBarItem,
  PanelBarSelectEventArguments,
} from "@progress/kendo-react-layout";
import { useLocation, withRouter } from "react-router-dom";
import { Button } from "@progress/kendo-react-buttons";
import { useRecoilState } from "recoil";
import { isMenuOpendState, tokenState } from "../store/atoms";
import UserOptionsWindow from "./Windows/CommonWindows/UserOptionsWindow";
import { CLIENT_WIDTH } from "../components/CommonString";
import { useApi } from "../hooks/api";
import Loading from "./Loading";
import {
  AppName,
  Content,
  Gnv,
  Modal,
  PageWrap,
  TopInfo,
  TopTitle,
  Wrapper,
} from "../CommonStyled";

const PanelBarNavContainer = (props: any) => {
  const processApi = useApi();
  const location = useLocation();
  const [token, setToken] = useRecoilState(tokenState);
  const [isMenuOpend, setIsMenuOpend] = useRecoilState(isMenuOpendState);
  const companyCode = token ? token.companyCode : "";
  const userName = token ? token.userName : "";
  const userId = token ? token.userId : "";
  const loginKey = token ? token.loginKey : "";
  const [previousRoute, setPreviousRoute] = useState("");
  const [formKey, setFormKey] = useState("");

  const paths = [
    // {
    //   path: "/Home",
    //   index: ".0",
    // },
    {
      path: "/ServiceDashboard",
      index: ".0",
    },
    {
      path: "/ServiceStore",
      index: ".1",
    },
    {
      path: "/GoalAndResult",
      index: ".2",
    },
    {
      path: "/UsedModules",
      index: ".3",
    },
  ];

  const [userOptionsWindowVisible, setUserOptionsWindowVisible] =
    useState<boolean>(false);

  const onSelect = (event: PanelBarSelectEventArguments) => {
    const route = event.target.props.route;
    props.history.push(route);

    if (route) {
      setIsMenuOpend(false);
    }
  };

  const setSelectedIndex = (pathName: any) => {
    let currentPath: any = paths.find((item: any) => item.path === pathName);

    return currentPath ? currentPath.index : 0;
  };

  const selected = setSelectedIndex(props.location.pathname);

  const logout = useCallback(() => {
    setToken(null as any);
    // 전체 페이지 reload (cache 삭제)
    (window as any).location = "/";
  }, []);

  const onMenuBtnClick = () => {
    setIsMenuOpend((prev) => !prev);
  };

  return (
    <Wrapper isMenuOpend={isMenuOpend}>
      <Modal isMenuOpend={isMenuOpend} onClick={onMenuBtnClick} />
      <Gnv isMenuOpend={isMenuOpend}>
        <AppName>Cloud Store</AppName>

        <PanelBar selected={selected} expandMode={"single"} onSelect={onSelect}>
          {/* <PanelBarItem title={"Home"} route="/Home"></PanelBarItem> */}
          <PanelBarItem
            title={"서비스 현황"}
            route="/ServiceDashboard"
          ></PanelBarItem>
          <PanelBarItem
            title={"서비스 스토어"}
            route="/ServiceStore"
          ></PanelBarItem>
        </PanelBar>

        {/* GST */}
        {companyCode === "2207C612" && (
          <PanelBar
            selected={selected}
            expandMode={"single"}
            onSelect={onSelect}
          >
            <PanelBarItem title={"Home"} route="/Home"></PanelBarItem>

            <PanelBarItem title={"전사관리"}>
              <PanelBarItem title={"Scheduler"} route="/CM_A1600W" />
            </PanelBarItem>
            <PanelBarItem title={"전자결재"}>
              <PanelBarItem title={"결재관리"} route="/EA_A2000W" />
            </PanelBarItem>
          </PanelBar>
        )}

        <Button
          onClick={logout}
          //icon={"logout"}
          fillMode={"flat"}
          themeColor={"secondary"}
        >
          로그아웃
        </Button>
      </Gnv>
      <Content CLIENT_WIDTH={CLIENT_WIDTH}>
        <TopTitle>
          <div style={{ width: "30px" }}></div>
          <AppName></AppName>
          <Button
            icon="menu"
            themeColor={"primary"}
            fillMode={"flat"}
            onClick={onMenuBtnClick}
          />
        </TopTitle>
        <TopInfo>
          <p>
            <span className="k-icon k-i-user"></span>
            {userName}({userId})
          </p>
        </TopInfo>
        <PageWrap>{props.children}</PageWrap>
      </Content>
      {userOptionsWindowVisible && (
        <UserOptionsWindow getVisible={setUserOptionsWindowVisible} />
      )}

      <Loading />
    </Wrapper>
  );
};

export default withRouter(PanelBarNavContainer);
