import styled from "styled-components";
import { GNV_WIDTH, LAYOUT_GAP } from "./components/CommonString";

type TWrapper = {
  isMenuOpend: boolean;
};

export const Wrapper = styled.div<TWrapper>`
  display: flex;
  width: 100%;
  //overflow: ${(props) => (props.isMenuOpend ? "hidden" : "auto")};
`;

type TGnv = TWrapper;
export const Gnv = styled.div<TGnv>`
  min-width: ${GNV_WIDTH}px;
  text-align: center;
  min-height: 100vh;
  background-color: #232323;
  position: fixed;

  .logout span {
    color: #656565;
  }
  .logout > .k-link {
    justify-content: center;
  }

  /*=========================================================================
	미디어 쿼리
	##Device = 모바일
	##Screen = 768px 이하 해상도 모바일
  =========================================================================*/
  @media (max-width: 768px) {
    display: ${(props) => (props.isMenuOpend ? "block" : "none")};
    z-index: 10;
    position: absolute;

    h1 {
      display: none;
    }
  }
`;

type ContentType = {
  CLIENT_WIDTH?: number;
};
export const Content = styled.div<ContentType>`
  width: calc(${(props) => props.CLIENT_WIDTH}px - ${GNV_WIDTH}px);

  /*=========================================================================
  미디어 쿼리
  ##Device = 모바일
  ##Screen = 768px 이하 해상도 모바일
  =========================================================================*/
  @media (max-width: 768px) {
    width: 100%;
  }
`;

export const PageWrap = styled.div`
  padding: 0 20px;
  margin-top: 40px;
  width: calc(100vw - ${GNV_WIDTH}px);
  margin-left: ${GNV_WIDTH}px;

  @media (max-width: 768px) {
    margin-top: 0;
    width: 100%;
    margin-left: 0;
    margin-bottom: 20px;
  }
`;

export const AppName = styled.h1`
  background-image: url("logo192.png");
  background-size: 20%;
  background-position: 15px;
  background-repeat: no-repeat;
  min-width: 170px;
  font-size: 20px;
  font-weight: 400;
  /* padding: 10px 0; */
  height: 70px;
  display: flex;
  justify-content: center;
  align-items: center;
  padding-left: 35px;
  color: #fff;

  /*=========================================================================
  미디어 쿼리
  ##Device = 모바일
  ##Screen = 768px 이하 해상도 모바일
  =========================================================================*/
  @media (max-width: 768px) {
    border: none;
    background-position: center;
    padding-left: 0;
  }
`;

export const TopTitle = styled.div`
  min-width: ${GNV_WIDTH}px;
  /* text-align: center; */
  padding: 0 15px;
  display: none;
  justify-content: space-between;
  align-items: center;

  button {
    height: 30px;
  }

  /*=========================================================================
  미디어 쿼리
  ##Device = 모바일
  ##Screen = 768px 이하 해상도 모바일
  =========================================================================*/
  @media (max-width: 768px) {
    display: flex;
  }
`;

type TModal = TGnv;

export const Modal = styled.div<TModal>`
  position: fixed;
  z-index: 10;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: ${(props) => (props.isMenuOpend ? "block" : "none")};
  background-color: rgba(0, 0, 0, 0.4);
`;

export const TitleContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 30px 0;
  min-height: 40px;

  .iot-title {
    font-size: 26px;
  }

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 10px;
    padding: 10px;
    display: none;
  }
`;

export const MainTopContainer = styled(TitleContainer)`
  margin-top: 10px;

  @media (max-width: 768px) {
    margin-top: 0;
    flex-direction: column;
    align-items: flex-start;
  }
`;

export const MainWorkStartEndContainer = styled.div`
  display: flex;
  margin-left: auto;

  input,
  button {
    margin-left: 5px;
  }

  @media (max-width: 768px) {
    margin-left: 0;
  }
`;

export const TextContainer = styled.div`
  display: flex;
  border: solid 1px #ff6358;
  color: #ff6358;
  border-radius: 50px;
  width: 180px;
  line-height: 30px;
  align-items: center;
  justify-content: center;
`;

export const Title = styled.h2`
  font-size: 28px;
  font-weight: 600;
`;
export const ButtonContainer = styled.div`
  display: flex;

  input,
  button {
    margin-left: 5px;
  }

  .iot-btn {
    margin-top: 5px;
    margin-right: 10px;
    max-width: 250px;
    width: 100%;
    height: 120px;
    font-size: 32px;
    font-weight: 600;
    box-shadow: none;
  }
  .iot-btn.green {
    background-color: #6fab41;
    border-color: #6fab41;
  }
  .iot-btn.red {
    background-color: #ff4949;
    border-color: #ff4949;
  }
  .iot-btn.gray {
    background-color: gray;
    border-color: gray;
  }
  .iot-btn .k-icon {
    font-size: 32px;
  }
`;

export const BottomContainer = styled(TitleContainer)`
  flex-direction: row-reverse;
  button {
    width: 100px;
    height: 40px;
  }
`;

export const FilterBoxWrap = styled.div`
  padding: 5px 0 10px;
  width: 100%;
`;

export const FilterBox = styled.table`
  /* line-height: 1.5; */
  border: solid 1px #d7d7d7;
  background-color: #fff;
  width: 100%;
  tr th + td {
    min-height: 40px;
  }
  tr th {
    background-color: #f5f5f8;
    border: solid 1px #d7d7d7;
    width: 120px;
    color: #333333;
    font-weight: 400;
    font-size: 14px;
    text-align: center;
    vertical-align: middle;
  }
  tr td {
    background-color: #ffffff;
    border: solid 1px #d7d7d7;
    width: 270px;
    text-align: center;
    padding: 5px;
    position: relative;
    vertical-align: middle;
  }
  tr td.expanded {
    min-width: 300px;
  }
  tr td.expanded > input,
  tr td.expanded > .k-input {
    width: 48%;
  }
  .k-radio-list.k-list-horizontal {
    justify-content: center;
  }

  .PR_A3000W tr th,
  .PR_A3000W tr td {
    height: 80px;
    font-size: 26px;
    font-weight: 600;
  }
  .PR_A3000W tr th {
    font-size: 22px;
  }

  .PR_A3000W tr td .k-input-md,
  .PR_A3000W tr td .k-picker-md {
    height: 65px;
    font-size: 26px;
    font-weight: 600;
    padding-left: 10px;
  }

  @media (max-width: 768px) {
    tr {
      display: flex;
      flex-direction: column;
    }
    tr th,
    tr td {
      width: 100%;
      border: none;
    }
    tr th {
      min-height: 35px;
      line-height: 35px;
    }
  }
`;

type TGridContainerWrap = {
  flexDirection?: string;
  maxWidth?: string;
};

export const GridContainerWrap = styled.div<TGridContainerWrap>`
  display: flex;
  gap: ${(props) =>
    props.flexDirection === "column" ? "0" : LAYOUT_GAP + "px"};
  justify-content: space-between;
  flex-direction: ${(props) => props.flexDirection};
  max-width: ${(props) => props.maxWidth};

  @media (max-width: 768px) {
    flex-direction: column;
    width: calc(100vw - 40px);
  }
`;

type TGridContainer = {
  maxWidth?: string;
  clientWidth?: number;
  width?: string;
  inTab?: boolean;
  margin?: TMargin;
};

type TMargin = {
  left?: string;
  top?: string;
  bottom?: string;
  right?: string;
};

export const GridContainer = styled.div<TGridContainer>`
  flex-direction: column;
  max-width: ${(props) => props.maxWidth};
  width: ${(props) =>
    props.width
      ? props.width
      : props.clientWidth
      ? "calc(" +
        props.clientWidth +
        "px - " +
        (props.inTab ? 65 : 0) + //65: 탭 마진
        "px - 150px)" //150: 기본 마진
      : ""};

  margin-top: ${(props) => (props.margin ? props.margin.top ?? "" : "")};
  margin-bottom: ${(props) => (props.margin ? props.margin.bottom ?? "" : "")};
  margin-left: ${(props) => (props.margin ? props.margin.left ?? "" : "")};
  margin-right: ${(props) => (props.margin ? props.margin.right ?? "" : "")};

  .k-grid .k-command-cell {
    text-align: center;
  }
  .k-grid td {
    white-space: nowrap; //그리드 셀 말줄임표
  }
  .k-chart.QC_A0120_TAB1 {
    width: 400px;
  }
  .k-chart.QC_A0120_TAB2 {
    width: 400px;
  }
  .k-chart.QC_A0120_TAB3 {
    width: 600px;
  }
  .k-radio-list.k-list-horizontal {
    justify-content: center;
  }
  /* .required {
    background-color: #fff0ef;
  } */

  @media (max-width: 768px) {
    width: auto;
  }
`;
type TCssGridContainer = {
  gridTemplateColumns: string;
};
export const CssGridContainer = styled.div<TCssGridContainer>`
  width: 100%;
  display: grid;
  grid-template-columns: ${(props) => props.gridTemplateColumns};
  gap: ${LAYOUT_GAP}px;

  @media screen and (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

export const DashboardGridContainer = styled.div`
  display: grid;
  width: 55%;
  height: 85vh;
  gap: 20px;
  grid-template-rows: 2fr 1fr 1fr;
  grid-template-columns: 2fr 1fr;
`;

type TDashboardGridItem = {
  column?: string;
  row?: string;
};

export const DashboardGridItem = styled.div<TDashboardGridItem>`
  grid-column: ${(props) => props.column || "auto"};
  grid-row: ${(props) => props.row || "auto"};
`;

export const GridTitle = styled.h3`
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 15px;
`;

export const PrimaryP = styled.p`
  color: #ff6358;
`;

export const PortraitPrint = styled.div`
  @media print {
    @page {
      size: 29.7cm 21cm;
      margin-top: 1cm;
      margin-right: 1cm;
      margin-bottom: 0cm;
      margin-left: 1cm;
    }
    /* html, body { border:0; margin:0; padding:0; margin-top:0px; }
	 */

    .printable {
      display: block;
    }

    #non-printable {
      display: none;
    }
  }
`;
export const LandscapePrint = styled.div`
  @media print {
    @page {
      size: 29.7cm 21cm;
      margin-top: 1cm;
      margin-right: 1cm;
      margin-bottom: 0cm;
      margin-left: 1cm;
    }
    /* html, body { border:0; margin:0; padding:0; margin-top:0px; }
	 */

    .printable {
      display: block;
    }

    #non-printable {
      display: none;
    }
  }
`;

export const GridTitleContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  /* margin: 5 0px; */
  min-height: 30px;
`;

export const ButtonInInput = styled.div`
  position: absolute;
  top: 5px;
  right: 5px;
`;
export const ButtonInFieldWrap = styled.div`
  position: relative;
`;

export const ButtonInField = styled(ButtonInInput)`
  top: -7px;
  right: 0;
`;

type TFieldWrap = {
  fieldWidth?: string;
};
export const FieldWrap = styled.div<TFieldWrap>`
  display: flex;
  justify-content: flex-start;
  align-items: center;

  > span {
    margin: 0 5px;
  }
  > span:first-child {
    margin-left: 0;
  }
  > span:last-child {
    margin-right: 0;
  }
  > .k-form-field {
    width: ${(props) => props.fieldWidth ?? ""};
  }
  .k-picker,
  .k-picker:hover,
  .k-picker.k-hover {
    background-color: #ffffff;
  }
  .required,
  .required:hover,
  .required.k-hover {
    background-color: #fff0ef;
  }
  .readonly {
    background-color: #efefef;
  }

  @media (max-width: 768px) {
    flex-direction: column;

    > .k-form-field {
      width: 100%;
    }
    .k-form-field > .k-label,
    .k-form-field > kendo-label,
    .k-form-field > .k-form-label {
      width: 20% !important;
    }
    .k-form-field-wrap {
      max-width: calc(80% - 10px) !important;
    }
  }
`;

export const LoginBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  padding-bottom: 50px;

  form {
    background-color: #2f353a;
    width: 410px;
    padding: 50px;
    border-radius: 5px;
  }
  label {
    color: #878787;
  }
  .login-btn {
    width: 100%;
    margin-top: 2rem;
    height: 3rem;
  }
  .k-form .k-form-field {
    margin-top: 1.5rem;
  }
  .footer {
    color: #bfbfbf;
    text-align: center;
    margin-top: 10px;
  }
`;

export const UserFormBox = styled(LoginBox)`
  padding-bottom: 0;
  height: 100%;

  form {
    width: 700px;
    background-color: #fff;
    border-radius: 0;
  }
  h1,
  label {
    color: #2f353a;
  }
  h2 {
    text-align: center;
  }
  hr {
    background: rgba(0, 0, 0, 0.08);
    height: 1px;
    border: 0;
    margin: 30px 0;
  }
  .k-checkbox-label {
    font-size: 16px;
    font-weight: 600;
  }
  .term-checkbox-container {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
  }
  .sign-up-btn {
    width: 100%;
    margin-top: 2rem;
    height: 3rem;
  }
`;

export const RadioButtonBox = styled.div`
  display: flex;
`;

export const ApprovalBox = styled.div`
  display: flex;
  justify-content: space-evenly;
  width: 350px;
  height: 60px;
  margin-left: 15px;
  border: solid 1px #dfdfdf;
  background-color: #fafafa;

  > div:nth-child(1) > div:last-child {
    background-color: #ffb849;
  }
  > div:nth-child(2) > div:last-child {
    background-color: #49c9ff;
  }
  > div:nth-child(3) > div:last-child {
    background-color: #ff8549;
  }

  @media (max-width: 768px) {
    margin-top: 10px;
    margin-left: 0;
    width: 100%;
  }
`;

export const ApprovalInner = styled.div`
  display: flex;
  justify-content: space-evenly;
  width: 33%;
  height: 100%;
  align-items: center;

  :nth-child(2) {
    border-right: 0;
    border-left: 0;
  }
  > div:last-child {
    width: 40px;
    line-height: 35px;
    border-radius: 5px;
    vertical-align: middle;
    text-align: center;
    font-weight: 600;
    color: #fff;
  }
`;

export const InfoList = styled.ul`
  display: flex;
  gap: 25px;
  display: flex;
  flex-direction: column;
  border: solid 1px #ebebeb;
  padding: 30px;
  border-radius: 15px;
  margin-top: 35px;

  .k-form-fieldset {
    margin: 0;
    border-top: solid 1px gainsboro;
    padding-top: 40px;
    margin-top: 20px;
    padding-bottom: 10px;
  }

  .k-form-field {
    margin: 0;
  }

  .k-form-field > .k-label {
    display: flex;
    justify-content: center;
    padding-top: 0;
  }

  .big-input {
    height: 50px;
    border: solid 1px #ff6358;
    border-radius: 10px;
    color: #ff6358;
    text-align: right;
    padding-left: 15px;
    font-size: 18px;
    font-weight: 600;
  }
`;
export const InfoTitle = styled.p`
  text-align: center;
  color: #727272;
  padding-bottom: 10px;
`;
export const InfoItem = styled.li`
  display: flex;
  justify-content: space-between;
`;
export const InfoLabel = styled.span``;
export const InfoValue = styled.span`
  font-weight: 600;
`;

export const NumberKeypad = styled.div`
  width: 100%;
  padding: 1%;
  border: solid 1px #f0f0f0;
  display: inline-block;
  margin: 5px 0;
  margin-left: 5px;
`;
export const NumberKeypadRow = styled.div`
  display: flex;
  justify-content: space-between;
`;
export const NumberKeypadCell = styled.div`
  border: solid 1px #ff6358;
  color: #ff6358;
  font-size: 20px;
  text-align: center;
  border-radius: 5px;
  width: 100%;
  margin: 1%;
  min-height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  :hover {
    background-color: #ff6358;
    color: #ffffff;
  }
  :focus {
    background-color: #ff6358;
    color: #ffffff;
  }
  :active {
    background-color: #ff6358;
    color: #ffffff;
  }
`;
export const GoalAndResultTable = styled.table`
  width: 100%;
  height: 30vh;
  margin-top: 15px;

  th,
  td {
    text-align: center;
    vertical-align: middle;
    border: solid 1px gray;
    font-size: 1.6rem;
  }
  th {
    background-color: rgba(0, 131, 191, 0.7);
    font-weight: 900;
  }

  tr:last-child td {
    background-color: rgba(0, 131, 191, 0.2);
    font-weight: 900;
  }
  tr td:first-child {
    font-weight: 900;
  }
`;

export const UsedModulesTable = styled(GoalAndResultTable)`
  margin-top: 0;

  th,
  td {
    height: 70px;
  }

  tr:last-child td {
    background-color: inherit;
    font-weight: inherit;
  }
  tr td:first-child {
    font-weight: 900;
  }
`;

export const CardBox = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  height: fit-content;
  gap: 5px;
  cursor: pointer;

  .k-card {
    min-width: 250px;
  }
  .k-card:hover {
    background-color: #f9f9f9;
  }
  .k-card-body {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .focused {
    background-color: #fff;
    color: #2489c4;
    border: solid 1px #2489c4bd;
  }

  p {
    width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-size: 18px;
    font-weight: 800;
    margin: 0;
  }
  .subscribe-badge {
    background-color: #ace394;
    width: 75px;
    height: 30px;
    font-size: 14px;
    font-weight: 400;
    color: #3e5c31;
    border-radius: 80px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  @media (max-width: 768px) {
    grid-template-columns: repeat(1, 1fr);

    .k-card {
      min-width: 220px;
    }
    .subscribe-badge {
      width: 70px;
    }
  }
`;

export const DetailBox = styled.div`
  position: fixed;
  right: 0;
  top: 0;
  height: 100%;
  width: 500px;
  background-color: #fff;
  border-left: solid 1px #efefef;
  padding: 50px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  z-index: 2;

  .top {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .top > button {
    width: auto;
  }
  .title {
    font-size: 18px;
    font-weight: 600;
    padding: 0;
  }

  .org-amt {
    float: right;
    color: gray;
    font-size: 26px;
    padding: 5px 0;
  }

  .amt {
    clear: both;
    text-align: right;
    font-size: 34px;
    font-weight: 900;
  }
  .amt span {
    font-size: 20px;
    color: #ff6358;
  }
  .preview {
    /* background-image: url("preview.png"); */
    background-size: contain;
    background-position: center;
    background-repeat: no-repeat;
    height: 230px;
  }
  .preview .k-i-image {
    width: 100%;
    height: 100%;
    font-size: 100px;
    color: #dbdbdb;
  }
  p {
    padding: 20px 0;
    font-size: 16px;
    line-height: 25px;
  }
  button {
    width: 100%;
  }
  button.important {
    height: 60px;
    font-size: 20px;
    font-weight: 900;
  }

  @media (max-width: 768px) {
    width: 100%;
    padding: 20px;
  }
`;

export const UsedMenusBox = styled.div`
  height: calc(100% - 35px);
  background-color: #fff;
  padding: 30px;
  overflow: scroll;
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */

  ::-webkit-scrollbar {
    display: none; /* Chrome, Safari, Opera*/
  }
  .title {
    margin-bottom: 10px;
    color: #1d73a4;
  }

  > div {
    margin-bottom: 20px;
  }
`;

export const UsedMenuBox = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  height: fit-content;

  p {
    border: solid 1px #dbdbdb;
    padding: 10px 20px 10px 20px;
  }

  p:not(:nth-child(4n)) {
    border-right: none;
  }

  p:not(:nth-last-child(-n + 4)) {
    border-bottom: none;
  }

  p:last-child {
    border-right: solid 1px #dbdbdb;
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;

    p {
      border-bottom: none;
    }
    p:not(:nth-child(4n)) {
      border: solid 1px #dbdbdb;
      border-bottom: none;
    }

    p:last-child {
      border: solid 1px #dbdbdb;
    }
  }
`;

export const DashboardBox = styled.div`
  padding: 30px;
  background-color: #fff;
  height: calc(100% - 35px);
  font-size: 24px;
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;

  .pay-date {
    font-size: 22px;
    margin-bottom: 20px;
    text-align: center;
    color: #2289c3;
    font-weight: 900;
  }
  .pay-amt {
    text-align: center;
    border-bottom: solid 3px #2289c38a;
    padding-bottom: 3px;
  }
  strong {
    font-weight: 800;
    font-size: 32px;
  }
`;

export const HashtagConatiner = styled.div`
  display: flex;
  justify-content: flex-start;
  gap: 5px;

  div {
    font-size: 14px;
    padding: 5px;
    text-align: center;
    color: #2289c3;
    border: solid 1px #2289c3;
    border-radius: 20px;
  }
`;

export const ServiceStoreContent = styled.div`
  display: flex;
  gap: 20px;
  padding-bottom: 20px;
  flex-wrap: nowrap;
  overflow-x: auto;
  width: calc(100% + 20px);
  height: calc(100vh - 130px);

  .item {
    flex: 0 0 auto;
    display: flex;
    flex-direction: column;
  }

  @media (max-width: 768px) {
    width: 100%;
    flex-direction: column;
    height: auto;

    /* height: calc(100vh - 160px); */
    .item {
      width: 100%;
    }
  }
`;

export const FilterTextContainer = styled.div`
  position: relative;
  .k-i-search {
    position: absolute;
    top: 0;
    right: 0;
    z-index: 1;
    height: 30px;
    width: 30px;
    color: gray;
  }
`;

export const TopInfo = styled.div`
  position: fixed;
  display: flex;
  height: 40px;
  width: calc(100vw - ${GNV_WIDTH}px);
  left: ${GNV_WIDTH}px;
  border-bottom: solid 1px #dbdbdb;
  justify-content: flex-end;
  align-items: center;
  padding: 0 20px;
  font-size: 13px;
  color: #6e6e6e;
  background-color: #f3f4f5;
  z-index: 1;

  p {
    line-height: 20px;
  }
  .k-i-user {
    color: #fff;
    background-color: #6e6e6e;
    width: 20px;
    height: 20px;
    margin-right: 10px;
    border-radius: 30px;
    font-size: 15px;
  }

  @media (max-width: 768px) {
    display: none;
  }
`;
