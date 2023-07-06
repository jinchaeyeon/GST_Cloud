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
  CssGridContainer,
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
  ChartSeriesItemTooltip,
  ChartSeriesLabels,
  ChartTooltip,
  TooltipContext,
} from "@progress/kendo-react-charts";
import "hammerjs";
import {
  convertDateToStr,
  numberWithCommas,
} from "../components/CommonFunction";
import CenterCell from "../components/Cells/CenterCell";

//그리드 별 키 필드값
const DATA_ITEM_KEY = "num";
type TMainDataResult = {
  count: number;
  form_id: string;
  menu_id: string;
  menu_name: string;
  parent_menu_id: string;
  parent_menu_name: string;
};

type TGroupDataResult = {
  menu_id: string;
  menu_name: string;
  count: number;
};

const Service: React.FC = () => {
  const [groupDataResult, setGroupDataResult] = useState<TGroupDataResult[]>(
    []
  );
  const [menuDataResult, setMenuDataResult] = useState<TMainDataResult[]>([]);

  const setLoading = useSetRecoilState(isLoading);
  const processApi = useApi();
  const idGetter = getter(DATA_ITEM_KEY);

  //그리드 데이터 스테이트
  const [mainDataState, setMainDataState] = useState<State>({
    sort: [],
  });

  const [mainDataResult2, setMainDataResult2] = useState<DataResult>(
    process([], mainDataState)
  );

  //선택 상태
  const [selectedState, setSelectedState] = useState<{
    [id: string]: boolean | number[];
  }>({});

  const [categories, setCategories] = useState<string[]>([]);
  const [usercount, setUserCount] = useState<number[]>([]);
  const [menucount, setMenuCount] = useState<number[]>([]);
  const [datausedmb, setDateusedmb] = useState<number[]>([]);
  const [attachmentsizemb, setAttachmentsizemb] = useState<number[]>([]);
  //데이터 조회
  const fetchMainData = async () => {
    let data: any;
    setLoading(true);
    let menuPara = {
      para:
        "?fromDate=" +
        convertDateToStr(new Date(new Date().getFullYear(), 0, 1)) +
        "&toDate=" +
        convertDateToStr(new Date()),
    };
    try {
      data = await processApi<any>("dashboard", menuPara);
    } catch (error) {
      data = null;
    }

    if (data !== null) {
      const dataUsageRows = data.dataUsage.Rows.reverse();
      const usageAmountRows = data.usageAmount.Rows.map(
        (item: any, index: number) => ({
          ...item,
          data_cost:
            item.data_cost == undefined
              ? 0
              : item.data_cost < 0
              ? 0
              : item.data_cost,
          attachment_cost:
            item.attachment_cost == undefined
              ? 0
              : item.attachment_cost < 0
              ? 0
              : item.attachment_cost,
          user_cost:
            item.user_cost == undefined
              ? 0
              : item.user_cost < 0
              ? 0
              : item.user_cost,
          menu_cost:
            item.menu_cost == undefined
              ? 0
              : item.menu_cost < 0
              ? 0
              : item.menu_cost,
          menu_count:
            item.menu_count == undefined
              ? 0
              : item.menu_count < 0
              ? 0
              : item.menu_count,
          is_paid: item.is_paid == "Y" ? "O" : item.is_paid == "N" ? "X" : "",
          num: index,
        })
      );
      const menuGroup = data.menuGroup.Rows.map((item: any) => ({
        ...item,
        count: 0,
      }));
      const menuUsage = data.menuUsage.Rows;
      const month = dataUsageRows.map((item: any) => {
        return item.date.substring(4, 6) + "월";
      });
      const usercounts = dataUsageRows.map((item: any) => {
        return item.user_count == undefined ? 0 : item.user_count;
      });
      const menucounts = dataUsageRows.map((item: any) => {
        return item.menu_count == undefined ? 0 : item.menu_count;
      });
      const datausedmbs = dataUsageRows.map((item: any) => {
        return item.data_used_mb == undefined ? 0 : item.data_used_mb;
      });
      const attachmentsizembs = dataUsageRows.map((item: any) => {
        return item.attachment_size_mb == undefined
          ? 0
          : item.attachment_size_mb;
      });

      setCategories(month);
      setUserCount(usercounts);
      setMenuCount(menucounts);
      setDateusedmb(datausedmbs);
      setAttachmentsizemb(attachmentsizembs);
      menuGroup.map((item: any) => {
        menuUsage.map((item2: any) => {
          if (item.menu_id == item2.parent_menu_id) {
            item.count += 1;
          }
        });
      });
      setGroupDataResult(menuGroup);
      setMenuDataResult(menuUsage);
      setMainDataResult2((prev) => {
        return {
          data: usageAmountRows,
          total: usageAmountRows.length,
        };
      });

      const firstRowData = usageAmountRows[0];
      if (firstRowData != undefined) {
        setSelectedState({ [firstRowData[DATA_ITEM_KEY]]: true });
      }
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
    return `${props.dataItem.menu_name} (${props.dataItem.count})`;
  };

  const list = (id: string) => {
    let data: any = [];

    menuDataResult.map((datas) => {
      if (datas.parent_menu_id == id) {
        data.push(datas);
      }
    });

    return data;
  };

  const SharedTooltip = (props: any) => {
    const { points } = props;

    return (
      <div style={{ padding: "10px" }}>
        <table>
          {points.map((point: any, i: any) => (
            <tr>
              <th key={i} style={{ textAlign: "left", paddingRight: "20px" }}>
                {point.series.name}
              </th>
              <td key={i} style={{ textAlign: "left", fontWeight: "bolder" }}>
                {point.value}
              </td>
            </tr>
          ))}
        </table>
      </div>
    );
  };
  const sharedTooltipRender = (context: any) => <SharedTooltip {...context} />;

  return (
    <>
      <TitleContainer>
        <Title>서비스 현황</Title>
      </TitleContainer>

      <GridContainerWrap>
        <GridContainer style={{ height: "85vh" }} width="45%">
          <GridTitle>이용중인 메뉴</GridTitle>
          <UsedMenusBox>
            {menuDataResult && menuDataResult.length == 0 ? (
              <p
                style={{
                  textAlign: "center",
                  paddingTop: `calc(50% - 35px)`,
                  fontWeight: "bolder",
                  color: "gray",
                }}
              >
                구독 중인 메뉴가 없습니다.
              </p>
            ) : (
              groupDataResult &&
              groupDataResult.map((data) => (
                <UsedMenus
                  title={data.menu_name}
                  mainDataResult={list(data.menu_id)}
                />
              ))
            )}
          </UsedMenusBox>
        </GridContainer>
        <GridContainer
          width="55%"
          style={{
            display: "grid",
            gap: "20px",
            height: "85vh",
            gridTemplateRows: "2fr 1fr 2fr",
          }}
        >
          <CssGridContainer gridTemplateColumns="2fr 1fr">
            <GridContainer>
              <GridTitle>서비스 측정</GridTitle>
              <Chart style={{ height: "calc(100% - 35px)" }}>
                <ChartLegend position="top" orientation="horizontal" />
                <ChartTooltip
                  shared={true}
                  render={sharedTooltipRender}
                  background="#F3F3F3"
                />
                <ChartCategoryAxis>
                  <ChartCategoryAxisItem
                    title={{ text: "월별 측정" }}
                    categories={categories}
                  />
                </ChartCategoryAxis>
                <ChartSeries>
                  <ChartSeriesItem
                    type="area"
                    data={usercount}
                    name="사용자 수"
                  />
                  <ChartSeriesItem
                    type="area"
                    data={menucount}
                    name="메뉴 수"
                  />
                  <ChartSeriesItem
                    type="area"
                    data={datausedmb}
                    name="데이터 사용량"
                  />
                  <ChartSeriesItem
                    type="area"
                    data={attachmentsizemb}
                    name="첨부 사용량"
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
                <p className="pay-date">
                  {mainDataResult2.data.filter(
                    (item: any) =>
                      item.num == Object.getOwnPropertyNames(selectedState)[0]
                  )[0] == undefined
                    ? convertDateToStr(new Date()).substring(2, 4) +
                      "년" +
                      convertDateToStr(new Date()).substring(4, 6) +
                      "월"
                    : mainDataResult2.data
                        .filter(
                          (item: any) =>
                            item.num ==
                            Object.getOwnPropertyNames(selectedState)[0]
                        )[0]
                        .date.substring(2, 4) +
                      "년" +
                      mainDataResult2.data
                        .filter(
                          (item: any) =>
                            item.num ==
                            Object.getOwnPropertyNames(selectedState)[0]
                        )[0]
                        .date.substring(4, 6) +
                      "월"}
                </p>
                <p className="pay-amt">
                  <strong>
                    {mainDataResult2.data.filter(
                      (item: any) =>
                        item.num == Object.getOwnPropertyNames(selectedState)[0]
                    )[0] == undefined
                      ? 0
                      : mainDataResult2.data.filter(
                          (item: any) =>
                            item.num ==
                            Object.getOwnPropertyNames(selectedState)[0]
                        )[0].is_paid == "O"
                      ? 0
                      : mainDataResult2.data
                          .filter(
                            (item: any) =>
                              item.num ==
                              Object.getOwnPropertyNames(selectedState)[0]
                          )[0]
                          .amount.toLocaleString()}
                  </strong>
                  원
                </p>
              </DashboardBox>
            </GridContainer>
          </CssGridContainer>

          <CssGridContainer gridTemplateColumns="repeat(3, 1fr)">
            <GridContainer>
              <GridTitle>사용자 수</GridTitle>
              <DashboardBox>
                <p>
                  <strong>
                    {mainDataResult2.data.filter(
                      (item: any) =>
                        item.num == Object.getOwnPropertyNames(selectedState)[0]
                    )[0] == undefined
                      ? 0
                      : mainDataResult2.data
                          .filter(
                            (item: any) =>
                              item.num ==
                              Object.getOwnPropertyNames(selectedState)[0]
                          )[0]
                          .user_count.toLocaleString()}
                  </strong>
                  <span>명</span>
                </p>
              </DashboardBox>
            </GridContainer>
            <GridContainer>
              <GridTitle>데이터 사용량</GridTitle>
              <DashboardBox>
                <p>
                  <strong>
                    {mainDataResult2.data.filter(
                      (item: any) =>
                        item.num == Object.getOwnPropertyNames(selectedState)[0]
                    )[0] == undefined
                      ? 0
                      : (
                          mainDataResult2.data.filter(
                            (item: any) =>
                              item.num ==
                              Object.getOwnPropertyNames(selectedState)[0]
                          )[0].data_used_mb / 1024
                        ).toLocaleString()}
                  </strong>
                  <span>GB</span>
                </p>
              </DashboardBox>
            </GridContainer>
            <GridContainer>
              <GridTitle>첨부 사용량</GridTitle>
              <DashboardBox>
                <p>
                  <strong>
                    {mainDataResult2.data.filter(
                      (item: any) =>
                        item.num == Object.getOwnPropertyNames(selectedState)[0]
                    )[0] == undefined
                      ? 0
                      : (
                          mainDataResult2.data.filter(
                            (item: any) =>
                              item.num ==
                              Object.getOwnPropertyNames(selectedState)[0]
                          )[0].attachment_size_mb / 1024
                        ).toLocaleString()}
                  </strong>
                  <span>GB</span>
                </p>
              </DashboardBox>
            </GridContainer>
          </CssGridContainer>
          <GridContainerWrap>
            <GridContainer width="50%">
              <GridTitle>모듈별 사용빈도</GridTitle>
              <Chart style={{ height: "calc(100% - 35px)" }}>
                <ChartSeries>
                  <ChartSeriesItem
                    type="funnel"
                    data={groupDataResult}
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
            <GridContainer width="50%">
              <GridTitle>월별 사용내역</GridTitle>
              <Grid
                style={{ height: "calc(100% - 35px)" }}
                data={process(
                  mainDataResult2.data.map((row) => ({
                    ...row,
                    date: row.date.substring(4, 6) + "월",
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
                  field="date"
                  title="월"
                  width="60px"
                  cell={CenterCell}
                />
                <GridColumn
                  field="basic_cost"
                  title="기본 패키지"
                  width="100px"
                  cell={NumberCell}
                />
                <GridColumn
                  field="data_cost"
                  title="데이터 사용 비용"
                  width="130px"
                  cell={NumberCell}
                />
                <GridColumn
                  field="attachment_cost"
                  title="첨부 사용 비용"
                  width="130px"
                  cell={NumberCell}
                />
                <GridColumn
                  field="user_cost"
                  cell={NumberCell}
                  title="사용자 비용"
                  width="120px"
                />
                <GridColumn
                  field="menu_cost"
                  title="메뉴 비용"
                  width="120px"
                  cell={NumberCell}
                />
                <GridColumn
                  field="menu_count"
                  title="메뉴 수"
                  width="100px"
                  cell={NumberCell}
                />
                <GridColumn
                  field="is_paid"
                  title="정산여부"
                  width="80px"
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
            {row.menu_name}
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
