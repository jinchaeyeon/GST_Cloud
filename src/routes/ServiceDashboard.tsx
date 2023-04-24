import React, { useEffect, useState } from "react";
import {
  Grid,
  GridColumn,
  GridDataStateChangeEvent,
  GridSelectionChangeEvent,
  getSelectedState,
  GridFooterCellProps,
} from "@progress/kendo-react-grid";
import { getter } from "@progress/kendo-react-common";
import { DataResult, process, State } from "@progress/kendo-data-query";
import {
  Title,
  GridContainer,
  GridContainerWrap,
  TitleContainer,
  GridTitle,
  DashboardBox,
  UsedMenusBox,
  UsedMenuBox,
} from "../CommonStyled";
import { useApi } from "../hooks/api";
import { SELECTED_FIELD, MAIN_COLOR } from "../components/CommonString";
import NumberCell from "../components/Cells/NumberCell";
import { isLoading } from "../store/atoms";
import { useSetRecoilState } from "recoil";
import {
  Chart,
  ChartCategoryAxis,
  ChartCategoryAxisItem,
  ChartLegend,
  ChartSeries,
  ChartSeriesItem,
  ChartSeriesLabels,
  ChartTooltip,
  TooltipContext,
} from "@progress/kendo-react-charts";
import "hammerjs";
import { numberWithCommas } from "../components/CommonFunction";
import CenterCell from "../components/Cells/CenterCell";

//그리드 별 키 필드값
const DATA_ITEM_KEY = "service_name";
type TMainDataResult = {
  category: string;
  formId: string;
  menuId: string;
  menuName: string;
  parentMenuId: string;
  parentMenuName: string;
  subscribed: boolean;
};

const Service: React.FC = () => {
  //그리드 데이터 결과값
  const [usedModulesData, setUsedModulesData] = useState([
    {
      stat: "영업관리",
      count: 8,
      color: "#0e5a7e",
    },
    {
      stat: "전사관리",
      count: 8,
      color: "#166f99",
    },
    {
      stat: "회계관리",
      count: 8,
      color: "#2185b4",
    },
    {
      stat: "인사관리",
      count: 6,
      color: "#319fd2",
    },
    {
      stat: "물류관리",
      count: 5,
      color: "#3eaee2",
    },
  ]);
  const [mainDataResult1, setMainDataResult1] = useState([
    { name: "수주처리" },
    { name: "출고현황" },
    { name: "출하처리" },
    { name: "수주현황조회" },
    { name: "판매처리" },
    { name: "출하지시" },
    { name: "수금처리" },
    { name: "견적처리" },
    { name: "프로젝트진행현황" },
    { name: "매출매입장" },
    { name: "수주이력변경" },
    { name: "기타출고" },
    { name: "견적관리대장" },
    { name: "반품처리참조" },
    { name: "수금전표생성" },
    { name: "매출자료" },
    { name: "매출통합전표" },
    { name: "매출E-TAX에러확인" },
    { name: "직접판매처리" },
    { name: "매출대비원자재조회" },
    { name: "납기준수율" },
  ]);
  const [mainDataResult4, setMainDataResult4] = useState([
    { name: "지급처리" },
    { name: "입고현황" },
    { name: "발주대비입고현황" },
    { name: "발주현황" },
    { name: "자재발주" },
    { name: "발주입고", purchased: false },
    { name: "팔레트관리", purchased: false },
    { name: "구매계획", purchased: false },
    { name: "매입확정", purchased: false },
    { name: "재고현황", purchased: false },
  ]);
  const [mainDataResult3, setMainDataResult3] = useState([
    { name: "출퇴근관리" },
    { name: "증명서 발급" },
    { name: "정산기준" },
    { name: "연금보험료" },
    { name: "급여임금관리" },
    { name: "지급공제관리" },
  ]);
  const [mainDataResult5, setMainDataResult5] = useState([
    { name: "자금일보" },
    { name: "계정관리" },
    { name: "영세율표제" },
    { name: "대체전표" },
    { name: "지출결의서" },
    { name: "부가세비교" },
    { name: "자금관리" },
    { name: "자금계획" },
  ]);
  const [mainDataResult6, setMainDataResult6] = useState([
    { name: "공통코드정보" },
    { name: "사용자그룹" },
    { name: "사용자 권한" },
    { name: "마감정보" },
  ]);
  const [mainDataResult7, setMainDataResult7] = useState([
    { name: "업무일지" },
    { name: "일정조회" },
    { name: "임률관리" },
    { name: "자료실" },
    { name: "공지사항" },
    { name: "스케줄러" },
    { name: "프로젝트 마스터" },
    { name: "MBO" },
  ]);
  const setLoading = useSetRecoilState(isLoading);
  const processApi = useApi();
  const idGetter = getter(DATA_ITEM_KEY);

  //그리드 데이터 스테이트
  const [mainDataState, setMainDataState] = useState<State>({
    sort: [],
  });

  const [mainDataResult, setMainDataResult] = useState<TMainDataResult[]>([]);
  const [mainDataResult2, setMainDataResult2] = useState<DataResult>(
    process(
      [
        { month: "1월", user: "관리자", used: "556MB", yn: "O" },
        { month: "2월", user: "관리자", used: "0MB", yn: "" },
        { month: "3월", user: "관리자", used: "55MB", yn: "O" },
        { month: "4월", user: "관리자", used: "55MB", yn: "O" },
        { month: "5월", user: "관리자", used: "5MB", yn: "O" },
        { month: "6월", user: "관리자", used: "78MB", yn: "O" },
        { month: "7월", user: "관리자", used: "41MB", yn: "O" },
      ],
      mainDataState
    )
  );

  //선택 상태
  const [selectedState, setSelectedState] = useState<{
    [id: string]: boolean | number[];
  }>({});

  //데이터 조회
  const fetchMainData = async () => {
    let data: any;
    setLoading(true);
    try {
      data = await processApi<any>("menus-view");
    } catch (error) {
      data = null;
    }

    if (data !== null) {
      const rows = data.allMenu.filter(
        (menu: TMainDataResult) => menu.menuName !== "PlusWin6"
      );

      setMainDataResult(rows);
    } else {
      console.log("[에러발생]");
      console.log(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchMainData();
  }, []);

  //메인 그리드 선택 이벤트 => 디테일1 그리드 조회
  const onMainSelectionChange = (event: GridSelectionChangeEvent) => {
    const newSelectedState = getSelectedState({
      event,
      selectedState: selectedState,
      dataItemKey: DATA_ITEM_KEY,
    });

    setSelectedState(newSelectedState);

    const selectedIdx = event.startRowIndex;
    const selectedRowData = event.dataItems[selectedIdx];
  };

  //그리드의 dataState 요소 변경 시 => 데이터 컨트롤에 사용되는 dataState에 적용
  const onMainDataStateChange = (event: GridDataStateChangeEvent) => {
    setMainDataState(event.dataState);
  };

  // //그리드 푸터
  // const mainTotalFooterCell = (props: GridFooterCellProps) => {
  //   return (
  //     <td colSpan={props.colSpan} style={props.style}>
  //       총 {mainDataResult.total}건
  //     </td>
  //   );
  // };

  //그리드 정렬 이벤트
  const onMainSortChange = (e: any) => {
    setMainDataState((prev) => ({ ...prev, sort: e.sort }));
  };

  const labelContent = (props: any) => {
    return `${props.category} (${props.value})`;
  };

  const categories = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"];

  const list = (id: string) => {
    let data: any = [];

    mainDataResult.map((datas) => {
      if (
        datas.category !== "GROUP" &&
        datas.subscribed == true &&
        datas.parentMenuId == id
      ) {
        data.push(datas);
      }
    });

    return data;
  };
  return (
    <>
      <TitleContainer>
        <Title>서비스 현황</Title>
      </TitleContainer>

      <GridContainerWrap>
        <GridContainer style={{ height: "85vh" }} width="45%">
          <GridTitle>이용중인 메뉴</GridTitle>
          <UsedMenusBox>
            {mainDataResult &&
              mainDataResult.map(
                (data) =>
                  data.category === "GROUP" &&
                  data.subscribed == true && (
                    <UsedMenus
                      title={data.menuName}
                      mainDataResult={list(data.menuId)}
                    />
                  )
              )}
          </UsedMenusBox>
        </GridContainer>
        <GridContainer
          width="55%"
          style={{
            display: "grid",
            gap: "20px",
            height: "85vh",
            gridTemplateRows: "2fr 1fr 1fr",
          }}
        >
          <GridContainerWrap
            style={{
              display: "grid",
              gridTemplateColumns: "2fr 1fr ",
            }}
          >
            <GridContainer>
              <GridTitle>서비스 측정</GridTitle>
              <Chart style={{ height: "calc(100% - 35px)" }}>
                <ChartCategoryAxis>
                  <ChartCategoryAxisItem
                    title={{ text: "월별 측정" }}
                    categories={categories}
                  />
                </ChartCategoryAxis>
                <ChartSeries>
                  <ChartSeriesItem
                    type="area"
                    data={[123, 276, 310, 212, 240, 156, 98]}
                  />
                  <ChartSeriesItem
                    type="area"
                    data={[165, 210, 287, 144, 190, 167, 212]}
                  />
                  <ChartSeriesItem
                    type="area"
                    data={[56, 140, 195, 46, 123, 78, 95]}
                  />
                </ChartSeries>
              </Chart>
            </GridContainer>
            <GridContainer>
              <GridTitle>결제 예상 금액</GridTitle>
              <DashboardBox
                style={{
                  alignItems: "center",
                }}
              >
                <p className="pay-date">23년 7월</p>
                <p className="pay-amt">
                  <strong>400,000</strong>원
                </p>
              </DashboardBox>
            </GridContainer>
          </GridContainerWrap>
          <GridContainerWrap
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
            }}
          >
            <GridContainer>
              <GridTitle>사용자 수</GridTitle>
              <DashboardBox>
                <p>
                  <strong>52</strong>
                  <span>명</span>
                </p>
              </DashboardBox>
            </GridContainer>
            <GridContainer>
              <GridTitle>데이터 사용량</GridTitle>
              <DashboardBox>
                <p>
                  <strong>1.24</strong>
                  <span>GB</span>
                </p>
              </DashboardBox>
            </GridContainer>
            <GridContainer>
              <GridTitle>첨부 사용량</GridTitle>
              <DashboardBox>
                <p>
                  <strong>1.02</strong>
                  <span>GB</span>
                </p>
              </DashboardBox>
            </GridContainer>
          </GridContainerWrap>
          <GridContainerWrap
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
            }}
          >
            <GridContainer>
              <GridTitle>모듈별 사용빈도</GridTitle>
              <Chart style={{ height: "calc(100% - 35px)" }}>
                <ChartSeries>
                  <ChartSeriesItem
                    type="funnel"
                    data={usedModulesData}
                    categoryField="stat"
                    field="count"
                    colorField="color"
                    neckRatio={1}
                  >
                    <ChartSeriesLabels
                      color="white"
                      background="none"
                      content={labelContent}
                    />
                  </ChartSeriesItem>
                </ChartSeries>
                {/* <ChartTooltip render={tooltipRender} /> */}
                <ChartLegend visible={false} />
              </Chart>
            </GridContainer>
            <GridContainer>
              <GridTitle>월별 사용내역</GridTitle>
              <Grid
                style={{ height: "calc(100% - 35px)" }}
                data={process(
                  mainDataResult2.data.map((row) => ({
                    ...row,
                    [SELECTED_FIELD]: selectedState[idGetter(row)], //선택된 데이터
                  })),
                  mainDataState
                )}
                {...mainDataState}
                onDataStateChange={onMainDataStateChange}
                //선택 기능
                dataItemKey={DATA_ITEM_KEY}
                selectedField={SELECTED_FIELD}
                selectable={{
                  enabled: true,
                  mode: "single",
                }}
                onSelectionChange={onMainSelectionChange}
                //스크롤 조회 기능
                fixedScroll={true}
                total={mainDataResult2.total}
                //정렬기능
                sortable={true}
                onSortChange={onMainSortChange}
                //컬럼순서조정
                reorderable={true}
                //컬럼너비조정
                resizable={true}
              >
                <GridColumn
                  field="month"
                  title="월"
                  width="80"
                  // footerCell={mainTotalFooterCell}
                />
                <GridColumn field="user" title="사용자" width="150" />
                <GridColumn
                  field="used"
                  title="사용용량"
                  cell={NumberCell}
                  width="120"
                />
                <GridColumn
                  field="yn"
                  title="총요금 정산여부"
                  width="150"
                  cell={CenterCell}
                />
              </Grid>
            </GridContainer>
          </GridContainerWrap>
        </GridContainer>
      </GridContainerWrap>
    </>
  );
};

export default Service;

const UsedMenus = ({ title, mainDataResult }: any) => {
  return (
    <div>
      <p className="title">{title}</p>
      <UsedMenuBox>
        {mainDataResult.map((row: any, idx: number) => (
          <p
            style={{
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
            key={idx}
          >
            {row.menuName}
          </p>
        ))}
      </UsedMenuBox>
    </div>
  );
};

const tooltipRender = (props: TooltipContext) => {
  if (props.point) {
    return props.point.dataItem.stat;
  }
};
