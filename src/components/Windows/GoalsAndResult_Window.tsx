import { useEffect, useState, useCallback, createContext } from "react";
import * as React from "react";
import { Window, WindowMoveEvent } from "@progress/kendo-react-dialogs";
import {
  getSelectedState,
  Grid,
  GridColumn,
  GridHeaderSelectionChangeEvent,
  GridSelectionChangeEvent,
} from "@progress/kendo-react-grid";
import { DataResult, getter, process, State } from "@progress/kendo-data-query";
import { useApi } from "../../hooks/api";
import {
  BottomContainer,
  ButtonContainer,
  GridContainer,
} from "../../CommonStyled";
import {
  Form,
  FormElement,
  FieldArray,
  FieldArrayRenderProps,
  FormRenderProps,
} from "@progress/kendo-react-form";
import { Error } from "@progress/kendo-react-labels";
import { FormNumberCell } from "../Editors";
import { arrayLengthValidator } from "../CommonFunction";
import { Button } from "@progress/kendo-react-buttons";
import { IWindowPosition } from "../../hooks/interfaces";
import {
  COM_CODE_DEFAULT_VALUE,
  EDIT_FIELD,
  FORM_DATA_INDEX,
  SELECTED_FIELD,
} from "../CommonString";
import { CellRender, RowRender } from "../Renderers";
import { bytesToBase64 } from "byte-base64";

// Create React.Context to pass props to the Form Field components from the main component
export const FormGridEditContext = createContext<{
  editIndex: number | undefined;
  parentField: string;
}>({} as any);

type TKendoWindow = {
  setVisible(isVisible: boolean): void;
  setData(): void;
};

let deletedRows: object[] = [];
const idGetter = getter(FORM_DATA_INDEX);

// Create the Grid that will be used inside the Form
const FormGrid = (fieldArrayRenderProps: FieldArrayRenderProps) => {
  const { validationMessage, visited, name, dataItemKey } =
    fieldArrayRenderProps;
  const [editIndex, setEditIndex] = useState<number | undefined>();

  const dataWithIndexes = fieldArrayRenderProps.value.map(
    (item: any, index: any) => {
      return { ...item, [FORM_DATA_INDEX]: index };
    }
  );

  const enterEdit = (dataItem: any, field: string | undefined) => {
    fieldArrayRenderProps.onReplace({
      index: dataItem[FORM_DATA_INDEX],
      value: {
        ...dataItem,
        rowstatus: dataItem.rowstatus === "N" ? dataItem.rowstatus : "U",
        [EDIT_FIELD]: field,
      },
    });

    setEditIndex(dataItem[FORM_DATA_INDEX]);

    // input 클릭하여 edit 시 onSelectionChange 동작 안하여서 강제로 setSelectedState 처리
    setSelectedState({ [dataItem[FORM_DATA_INDEX]]: true });
  };

  const exitEdit = (item: any) => {
    fieldArrayRenderProps.value.forEach((item: any, index: any) => {
      fieldArrayRenderProps.onReplace({
        index: index,
        value: {
          ...item,
          [EDIT_FIELD]: undefined,
        },
      });
    });
  };

  const customCellRender = (td: any, props: any) => (
    <CellRender
      originalProps={props}
      td={td}
      enterEdit={enterEdit}
      editField={EDIT_FIELD}
    />
  );

  const customRowRender = (tr: any, props: any) => (
    <RowRender
      originalProps={props}
      tr={tr}
      exitEdit={exitEdit}
      editField={EDIT_FIELD}
    />
  );

  const [selectedState, setSelectedState] = useState<{
    [id: string]: boolean | number[];
  }>({});

  useEffect(() => {
    setSelectedState({ [0]: true });
  }, []);

  const onSelectionChange = useCallback(
    (event: GridSelectionChangeEvent) => {
      const newSelectedState = getSelectedState({
        event,
        selectedState: selectedState,
        dataItemKey: FORM_DATA_INDEX,
      });

      setSelectedState(newSelectedState);
    },
    [selectedState]
  );

  const onHeaderSelectionChange = useCallback(
    (event: GridHeaderSelectionChangeEvent) => {
      const checkboxElement: any = event.syntheticEvent.target;
      const checked = checkboxElement.checked;
      const newSelectedState: {
        [id: string]: boolean | number[];
      } = {};

      event.dataItems.forEach((item) => {
        newSelectedState[idGetter(item)] = checked;
      });

      setSelectedState(newSelectedState);

      //선택된 상태로 리랜더링
      event.dataItems.forEach((item: any, index: number) => {
        fieldArrayRenderProps.onReplace({
          index: index,
          value: {
            ...item,
          },
        });
      });
    },
    []
  );

  const onAdd = useCallback(
    (e: any) => {
      e.preventDefault();
      fieldArrayRenderProps.onPush({
        value: {
          rowstatus: "N",
          badcd: COM_CODE_DEFAULT_VALUE,
          badqty: 0,
        },
      });

      setEditIndex(0);
    },
    [fieldArrayRenderProps]
  );

  const onRemove = useCallback(() => {
    let newData: any[] = [];

    //삭제 안 할 데이터 newData에 push, 삭제 데이터 deletedRows에 push
    fieldArrayRenderProps.value.forEach((item: any, index: number) => {
      if (!selectedState[index]) {
        newData.push(item);
      } else {
        deletedRows.push(item);
      }
    });

    //전체 데이터 삭제
    fieldArrayRenderProps.value.forEach(() => {
      fieldArrayRenderProps.onRemove({
        index: 0,
      });
    });

    //newData 생성
    newData.forEach((item: any) => {
      fieldArrayRenderProps.onPush({
        value: item,
      });
    });

    //선택 상태 초기화
    setSelectedState({});

    //수정 상태 초기화
    setEditIndex(undefined);
  }, [fieldArrayRenderProps]);

  // 키패드 숫자 입력
  const enterNumber = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const selectedDataKey = Object.getOwnPropertyNames(selectedState)[0];
    if (!selectedDataKey) {
      // 그리드 선택 행 없을 시 리턴
      return false;
    }
    const selectedData = dataWithIndexes[selectedDataKey];
    const selectedIdx = dataWithIndexes[selectedDataKey][FORM_DATA_INDEX];
    const value = e.currentTarget.innerText;

    // 소수점 한개 초과 입력 시 리턴
    if (value === "." && String(selectedData["badqty"]).includes(".")) {
      return false;
    }

    if (value !== "") {
      //숫자, 소수점 입력
      fieldArrayRenderProps.onReplace({
        index: selectedIdx,
        value: {
          ...selectedData,
          rowstatus: "U",
          badqty:
            value === "."
              ? selectedData["badqty"] + value // 소수점 입력시 스트링으로 처리
              : Number(String(selectedData["badqty"]) + value),
        },
      });
    } else {
      //삭제
      fieldArrayRenderProps.onReplace({
        index: selectedIdx,
        value: {
          ...selectedData,
          rowstatus: "U",
          badqty: Number(String(selectedData["badqty"]).slice(0, -1)),
        },
      });
    }
  };

  return (
    <GridContainer>
      <FormGridEditContext.Provider
        value={{
          editIndex,
          parentField: name,
        }}
      >
        {visited && validationMessage && <Error>{validationMessage}</Error>}
        <Grid
          data={dataWithIndexes.map((item: any) => ({
            ...item,
            parentField: name,
            [SELECTED_FIELD]: selectedState[idGetter(item)],
          }))}
          total={dataWithIndexes.total}
          style={{ height: "420px" }}
          cellRender={customCellRender}
          //선택기능
          dataItemKey={FORM_DATA_INDEX}
          rowRender={customRowRender}
          selectedField={SELECTED_FIELD}
          selectable={{
            enabled: true,
            drag: false,
            cell: false,
            mode: "multiple",
          }}
          onSelectionChange={onSelectionChange}
          //onHeaderSelectionChange={onHeaderSelectionChange}
        >
          {/* <GridToolbar>
            <Button
              type={"button"}
              themeColor={"primary"}
              fillMode="outline"
              onClick={onAdd}
              icon="add"
            >
              추가
            </Button>
            <Button
              type={"button"}
              themeColor={"primary"}
              fillMode="outline"
              onClick={onRemove}
              icon="minus"
            >
              삭제
            </Button>
          </GridToolbar> */}

          {/* <GridColumn
            field={SELECTED_FIELD}
            width="45px"
            headerSelectionValue={
              dataWithIndexes.findIndex(
                (item: any) => !selectedState[idGetter(item)]
              ) === -1
            }
          /> */}
          <GridColumn field="rowstatus" title=" " width="40px" />

          <GridColumn field="year" title="연도" /*width="240px"*/ />
          <GridColumn
            field="goal"
            title="목표(누적)"
            cell={FormNumberCell}
            // width="240px"
          />
          <GridColumn
            field="performance"
            title="실적(누적)"
            cell={FormNumberCell}
            // width="240px"
          />
        </Grid>
      </FormGridEditContext.Provider>
    </GridContainer>
  );
};
const KendoWindow = ({ setVisible, setData }: TKendoWindow) => {
  const [position, setPosition] = useState<IWindowPosition>({
    left: 300,
    top: 100,
    width: 800,
    height: 600,
  });

  const handleMove = (event: WindowMoveEvent) => {
    setPosition({ ...position, left: event.left, top: event.top });
  };
  const handleResize = (event: WindowMoveEvent) => {
    setPosition({
      left: event.left,
      top: event.top,
      width: event.width,
      height: event.height,
    });
  };

  const onClose = () => {
    setVisible(false);
  };

  const [formKey, setFormKey] = useState(1);
  const resetForm = () => {
    setFormKey(formKey + 1);
  };
  //수정 없이 submit 가능하도록 임의 value를 change 시켜줌
  useEffect(() => {
    const valueChanged = document.getElementById("valueChanged");
    valueChanged!.click();
  }, [formKey]);

  const processApi = useApi();
  const [dataState, setDataState] = useState<State>({
    skip: 0,
    take: 20,
  });

  const [detailDataResult, setDetailDataResult] = useState<DataResult>(
    process([], dataState)
  );
  useEffect(() => {
    fetchGrid();
  }, []);

  //fetch된 그리드 데이터가 그리드 폼에 세팅되도록 하기 위해 적용
  useEffect(() => {
    resetForm();
  }, [detailDataResult]);

  //상세그리드 조회
  const fetchGrid = async () => {
    let data: any;

    const queryStr = `    
      SELECT year, goal, performance FROM substCompanyProject      
    `;

    const bytes = require("utf8-bytes");
    const convertedQueryStr = bytesToBase64(bytes(queryStr));

    let query = {
      query: convertedQueryStr,
    };

    try {
      data = await processApi<any>("query", query);
    } catch (error) {
      data = null;
    }

    if (data) {
      const rows = data[0].Rows;
      const totalRowCnt = data[0].RowCount;

      setDetailDataResult(() => {
        return {
          data: [...rows],
          total: totalRowCnt,
        };
      });
    }
  };

  //그리드 리셋
  const resetAllGrid = () => {
    setDetailDataResult(process([], dataState));
  };

  const handleSubmit = async (dataItem: { [name: string]: any }) => {
    console.log(dataItem);
    const dataDetails = dataItem.dataDetails.filter((item: any) => {
      return item.rowstatus === "U";
    });

    if (dataDetails.length === 0) return false;

    try {
      for (const item of dataDetails) {
        const { year, goal = 0, performance = 0 } = item;

        let data: any;

        const queryStr = `    
        UPDATE substCompanyProject
        SET goal = ${goal},
            performance = ${performance} 
        WHERE year = '${year}'        

        SELECT @@ROWCOUNT 
        `;

        const bytes = require("utf8-bytes");
        const convertedQueryStr = bytesToBase64(bytes(queryStr));

        let query = {
          query: convertedQueryStr,
        };

        try {
          data = await processApi<any>("query", query);
        } catch (error) {
          data = null;
        }
        if (!data) {
          const rowCount = data.RowCount;
          if (rowCount < 1) {
            console.log("[오류 발생]");
            console.log(data);
            const msg = "처리중 오류가 발생하였습니다.";
            throw msg;
          }
        }
      }
      setData();
      onClose();
    } catch (e) {
      alert(e);
    }
  };

  useEffect(() => {
    resetAllGrid();
    fetchGrid();
  }, []);

  return (
    <Window
      title={"목표 및 실적 입력"}
      width={position.width}
      height={position.height}
      onMove={handleMove}
      onResize={handleResize}
      onClose={onClose}
    >
      <Form
        onSubmit={handleSubmit}
        key={formKey}
        initialValues={{
          dataDetails: detailDataResult.data, //detailDataResult.data,
        }}
        render={(formRenderProps: FormRenderProps) => (
          <FormElement horizontal={true}>
            <fieldset className={"k-form-fieldset"}>
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
            </fieldset>
            <FieldArray
              name="dataDetails"
              dataItemKey={FORM_DATA_INDEX}
              component={FormGrid}
              validator={arrayLengthValidator}
            />

            <BottomContainer>
              <ButtonContainer>
                <Button type={"submit"} themeColor={"primary"}>
                  저장
                </Button>
              </ButtonContainer>
            </BottomContainer>
          </FormElement>
        )}
      />
    </Window>
  );
};

export default KendoWindow;
