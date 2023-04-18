import { useEffect, useState } from "react";
import { Card, CardBody } from "@progress/kendo-react-layout";
import { useSetRecoilState } from "recoil";
import { isLoading } from "../store/atoms";
import { useApi } from "../hooks/api";
import {
  CardBox,
  DetailBox,
  GridTitle,
  Title,
  TitleContainer,
} from "../CommonStyled";
import { Button } from "@progress/kendo-react-buttons";

const Map: React.FC = () => {
  //그리드 데이터 결과값
  const [mainDataResult1, setMainDataResult1] = useState([
    { name: "수주처리", purchased: true },
    { name: "출고현황", purchased: true },
    { name: "출하처리", purchased: true },
    { name: "수주현황조회", purchased: false },
    { name: "판매처리", purchased: false },
    { name: "기타출고", purchased: false },
    { name: "출하지시", purchased: false },
    { name: "수금처리", purchased: false },
    { name: "수주업로드", purchased: false },
    { name: "자재불출현황", purchased: false },
    { name: "견적관리", purchased: false },
    { name: "생산의뢰서", purchased: false },
    { name: "AS관리", purchased: false },
    { name: "수주출하리드타임", purchased: false },
    { name: "판매현황집계", purchased: false },
    { name: "출하지시B", purchased: false },
    { name: "매출매입장", purchased: false },
    { name: "견적처리", purchased: false },
    { name: "프로젝트진행현황", purchased: false },
    { name: "매출매입장", purchased: false },
    { name: "수주이력변경", purchased: false },
    { name: "기타출고", purchased: false },
    { name: "견적관리대장", purchased: false },
    { name: "반품처리참조", purchased: false },
    { name: "수금전표생성", purchased: false },
    { name: "매출자료", purchased: false },
    { name: "매출통합전표", purchased: false },
    { name: "매출E-TAX에러확인", purchased: false },
    { name: "직접판매처리", purchased: false },
    { name: "매출대비원자재조회", purchased: false },
    { name: "납기준수율", purchased: false },
  ]);
  const [mainDataResult2, setMainDataResult2] = useState([
    { name: "지급처리", purchased: true },
    { name: "입고현황", purchased: true },
    { name: "발주대비입고현황", purchased: false },
    { name: "발주현황", purchased: false },
    { name: "자재발주", purchased: false },
    { name: "발주입고", purchased: false },
    { name: "팔레트관리", purchased: false },
    { name: "구매계획", purchased: false },
    { name: "매입확정", purchased: false },
    { name: "재고현황", purchased: false },
    { name: "기타입고", purchased: false },
    { name: "구매계획서", purchased: false },
    { name: "매입분석", purchased: false },
    { name: "매입분석(3개년)", purchased: false },
    { name: "수입검사기준서", purchased: false },
    { name: "일일재고수불관리", purchased: false },
    { name: "금형카스타", purchased: false },
    { name: "코일출고", purchased: false },
    { name: "자사기초재고", purchased: false },
    { name: "창고관리", purchased: false },
    { name: "구매요청", purchased: false },
    { name: "SKEP입고", purchased: false },
    { name: "SKEP발주", purchased: false },
  ]);
  const [mainDataResult3, setMainDataResult3] = useState([
    { name: "출퇴근관리", purchased: false },
    { name: "증명서 발급", purchased: false },
    { name: "정산기준", purchased: false },
    { name: "연금보험료", purchased: false },
    { name: "급여임금관리", purchased: false },
    { name: "연말정산 PDF 업로드", purchased: false },
    { name: "연말정산", purchased: false },
    { name: "인사고과 모니터링", purchased: false },
    { name: "근태 모니터링", purchased: false },
    { name: "인사관리", purchased: false },
    { name: "퇴직금계산", purchased: false },
    { name: "근태허가신청", purchased: false },
    { name: "일근태업로드", purchased: false },
    { name: "일용직 이사관리", purchased: false },
    { name: "연차사용현황", purchased: false },
    { name: "근태집계현황", purchased: false },
    { name: "일근태월별조회", purchased: false },
    { name: "사회보험고지내역", purchased: false },
    { name: "워크캘린더", purchased: false },
    { name: "일용직일근태", purchased: false },
    { name: "연금보험료", purchased: false },
    { name: "사회보험현황집계표", purchased: false },
    { name: "근로소득원천징수영수증", purchased: false },
    { name: "복지포인트등록", purchased: false },
  ]);

  const setLoading = useSetRecoilState(isLoading);
  const processApi = useApi();

  useEffect(() => {
    // fetchMainData();
  }, []);

  //데이터 조회
  const fetchMainData = async () => {
    let data: any;
    setLoading(true);
    try {
      data = await processApi<any>("db-usage");
    } catch (error) {
      data = null;
    }

    if (data !== null) {
      const totalRowCnt = data.RowCount;
      const rows = data.Rows;

      // if (totalRowCnt > 0) setMainDataResult(rows);
    } else {
      console.log("[에러발생]");
      console.log(data);
    }
    setLoading(false);
  };

  const [selectedCard, setSelectedCard] = useState<{
    title: string;
    idx: number;
    rowData: any;
  } | null>(null);

  const handleCardClick = (title: string, idx: number, rowData: any) => {
    setSelectedCard({ title, idx, rowData });
  };

  return (
    <>
      <TitleContainer>
        <Title>서비스 스토어</Title>
      </TitleContainer>
      <div
        style={{
          display: "flex",
          gap: "20px",
          paddingBottom: "20px",
        }}
      >
        <Menus
          title="영업관리"
          mainDataResult={mainDataResult1}
          selectedCard={selectedCard}
          onCardClick={handleCardClick}
        />
        <Menus
          title="물류관리"
          mainDataResult={mainDataResult2}
          selectedCard={selectedCard}
          onCardClick={handleCardClick}
        />
        <Menus
          title="인사관리"
          mainDataResult={mainDataResult3}
          selectedCard={selectedCard}
          onCardClick={handleCardClick}
        />
      </div>

      {selectedCard && (
        <DetailBox>
          <div>
            <div>
              <p className="title">수주현황조회</p>
              <Button
                icon="x"
                fillMode={"flat"}
                onClick={() => setSelectedCard(null)}
              ></Button>
            </div>
            <p>
              수주처리에서 등록한 데이터를 조회조건에 맞는 수주 건에 대해
              품목명, 단가 등을 포함한 상세한 정보를 리스트 형태로 조회합니다.
            </p>
            <div className="preview"></div>
            <Button themeColor={"primary"} icon="pdf" fillMode={"outline"}>
              메뉴얼 보기
            </Button>
          </div>
          <div>
            <del className="org-amt">정가 6,000원</del>
            <p className="amt">
              <span>할인가</span> 월 3,900원
            </p>
            <Button
              themeColor={"primary"}
              fillMode={"solid"}
              className="important"
            >
              구독하기
            </Button>
          </div>
        </DetailBox>
      )}
    </>
  );
};
export default Map;

const Menus = ({ mainDataResult, title, selectedCard, onCardClick }: any) => {
  return (
    <div style={{ display: "flex", flexDirection: "column", width: "30%" }}>
      <GridTitle>{title}</GridTitle>
      <CardBox>
        {mainDataResult.map((row: any, idx: number) => (
          <Card
            key={idx}
            onClick={() => onCardClick(title, idx, row)}
            className={
              selectedCard &&
              selectedCard.idx === idx &&
              selectedCard.title === title
                ? "focused"
                : ""
            }
          >
            <CardBody>
              <p>
                {row.name}
                {row.purchased && <span>구독중</span>}
              </p>
            </CardBody>
          </Card>
        ))}
      </CardBox>
    </div>
  );
};
