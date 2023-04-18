import { RecoilRoot, useRecoilValue } from "recoil";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import React from "react";
//import "@progress/kendo-theme-default/dist/all.css";
import PanelBarNavContainer from "./components/PanelBarNavContainer";
import { createGlobalStyle } from "styled-components";
import AuthRoute from "./components/AuthRoute";
import Login from "./routes/Login";
import { isMenuOpendState } from "./store/atoms";
import ServiceStore from "./routes/ServiceStore";
import ServiceDashboard from "./routes/ServiceDashboard";
import SignUp from "./routes/SignUp";
import "./index.scss";

type TGlobalStyle = {
  isMenuOpend: boolean;
};
const GlobalStyle = createGlobalStyle<TGlobalStyle>`
@import url('https://fonts.googleapis.com/css2?family=Source+Sans+Pro:wght@300;400&display=swap');
html, body, div, span, applet, object, iframe,
h1, h2, h3, h4, h5, h6, p, blockquote, pre,
a, abbr, acronym, address, big, cite, code,
del, dfn, em, img, ins, kbd, q, s, samp,
small, strike, strong, sub, sup, tt, var,
b, u, i, center,
dl, dt, dd, menu, ol, ul, li,
fieldset, form, label, legend,
table, caption, tbody, tfoot, thead, tr, th, td,
article, aside, canvas, details, embed,
figure, figcaption, footer, header, hgroup,
main, menu, nav, output, ruby, section, summary,
time, mark, audio, video {
  margin: 0;
  padding: 0;
  border: 0;
  font-size: 100%;
  font: inherit;
  vertical-align: baseline;
}
/* HTML5 display-role reset for older browsers */
article, aside, details, figcaption, figure,
footer, header, hgroup, main, menu, nav, section {
  display: block;
}
/* HTML5 hidden-attribute fix for newer browsers */
*[hidden] {
    display: none;
}
body {
  line-height: 1;  
  overflow: ${(props) => (props.isMenuOpend ? "hidden" : "auto")};
}
menu, ol, ul {
  list-style: none;
}
blockquote, q {
  quotes: none;
}
blockquote:before, blockquote:after,
q:before, q:after {
  content: '';
  content: none;
}
table {
  border-collapse: collapse;
  border-spacing: 0;
}
* {
  box-sizing: border-box;
}
body {
  font-family: 'Source Sans Pro', sans-serif;
}
a {
  text-decoration:none;
}
body{
  background-color: #f3f4f5;
  /* color: #000; */
}

html{
  font-size: 62.5;
}
.k-panelbar>.k-item>.k-link, .k-panelbar>.k-panelbar-header>.k-link {    
    background-color: #f3f4f5;
}    
.k-grid .k-grid-header .k-header .k-cell-inner > .k-link {
  justify-content: center; /*공통설정 : 그리드 헤더 텍스트 중앙정렬*/
}

.customoverlay {position:relative;bottom: 60px;border-radius:6px;border: 1px solid #ccc;border-bottom:2px solid #ddd;float:left;}
.customoverlay:nth-of-type(n) {border:0; box-shadow:0px 1px 2px #888;}
.customoverlay a {display:block;text-decoration:none;color:#000;text-align:center;border-radius:6px;font-size:14px;font-weight:bold;overflow:hidden;}
.customoverlay .title {display:block;text-align:center;color: #000;background:#fff;padding:10px 15px;font-size:14px;font-weight:bold;border-radius:6px;}
.customoverlay:after {content:'';position:absolute;margin-left:-12px;left:50%;bottom:-12px;width:22px;height:12px;background:url('https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/vertex_white.png')}
.k-panelbar{
    border: none;
}
.k-panelbar .k-panelbar-item{

}
.k-panelbar>.k-item>.k-link, 
.k-panelbar>.k-panelbar-header>.k-link{
  background-color: #232323;
    color: #fff;
}
.k-panelbar .k-panelbar-item{
  border: none;
  border-bottom: solid 1px #495057;
}
.k-arcgauge-label{  
    top: 50% !important;
    left: 50% !important;
    transform: translate(-50%, -50%);
}
.k-panelbar > .k-panelbar-header > .k-link:hover,
.k-panelbar>.k-panelbar-header>.k-link.k-selected:hover,
.k-panelbar>.k-panelbar-header>.k-link.k-selected,
.k-panelbar>.k-item>.k-link.k-selected, .k-panelbar>.k-panelbar-header>.k-link.k-selected{  
  background-color: #343a40;
}
.k-panelbar>.k-item>.k-link, .k-panelbar>.k-panelbar-header>.k-link{
  cursor: pointer;
}
.k-grid th.k-selected, .k-grid td.k-selected, .k-grid tr.k-selected>td{  
  background-color: rgb(0 123 255 / 45%);
}
/* &::-webkit-scrollbar {
  width: 20px;
}

&::-webkit-scrollbar-thumb {
  border-radius: 2px;
  background: #6c757d;
}
&::-webkit-scrollbar-corner {  
  background: transparent;
} */

`;

const App: React.FC = () => {
  return (
    <RecoilRoot>
      <AppInner></AppInner>
    </RecoilRoot>
  );
};

const AppInner: React.FC = () => {
  const isMenuOpend = useRecoilValue(isMenuOpendState); //상태

  return (
    <>
      <GlobalStyle isMenuOpend={isMenuOpend} />
      <Router>
        <Switch>
          <Route path="/SignUp" component={SignUp} exact />
          <Route path="/" component={Login} exact />
          <PanelBarNavContainer>
            <AuthRoute path="/ServiceStore" component={ServiceStore} exact />
            <AuthRoute
              path="/ServiceDashboard"
              component={ServiceDashboard}
              exact
            />
          </PanelBarNavContainer>
        </Switch>
      </Router>
    </>
  );
};

export default App;
