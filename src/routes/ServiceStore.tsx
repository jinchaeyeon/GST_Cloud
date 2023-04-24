import { useEffect, useState } from "react";
import { Card, CardBody } from "@progress/kendo-react-layout";
import { useSetRecoilState } from "recoil";
import { isLoading } from "../store/atoms";
import { useApi } from "../hooks/api";
import {
  CardBox,
  DetailBox,
  FilterTextContainer,
  GridTitle,
  HashtagConatiner,
  ServiceStoreContent,
  Title,
  TitleContainer,
} from "../CommonStyled";
import { Button } from "@progress/kendo-react-buttons";
import { numberWithCommas } from "../components/CommonFunction";
import { Input } from "@progress/kendo-react-inputs";

type TMainDataResult = {
  category: string;
  formId: string;
  menuId: string;
  menuName: string;
  parentMenuId: string;
  parentMenuName: string;
  subscribed: boolean;
};

type TDetailDataResult = {
  menuId: string;
  menuName: string;
  parentMenuId: string;
  parentMenuName: string;
  formId: string;
  category: string;
  subscribed: boolean;
  price: string;
  description: string;
  preview: any;
  hashtag: string[];
  manualExists: boolean;
} | null;

type TSelectedCard = {
  id: string;
} | null;

const Map: React.FC = () => {
  //그리드 데이터 결과값
  const [mainDataResult, setMainDataResult] = useState<TMainDataResult[]>([]);
  const [detailDataResult, setDetailDataResult] =
    useState<TDetailDataResult>(null);
  const [selectedCard, setSelectedCard] = useState<TSelectedCard>(null);
  const [filterText, setFilterText] = useState("");

  const setLoading = useSetRecoilState(isLoading);
  const processApi = useApi();

  useEffect(() => {
    fetchMainData();
  }, []);

  useEffect(() => {
    if (selectedCard) fetchDetailData(selectedCard.id);
  }, [selectedCard]);

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

  const fetchDetailData = async (menuId: string) => {
    let data: null | TDetailDataResult;
    setLoading(true);
    const para = { id: menuId };
    try {
      data = await processApi<any>("menu-view", para);
    } catch (error) {
      data = null;
    }

    if (data !== null) {
      setDetailDataResult(data);
    } else {
      setDetailDataResult(null);
      console.log("[에러발생]");
      console.log(data);
    }
    setLoading(false);
  };
  const fetchSubscribe = async () => {
    let data: any;
    if (!detailDataResult) {
      console.log("No detailDataResult for fetchSubscribe");
      return false;
    }
    if (!window.confirm(detailDataResult.menuName + "을 구독하시겠습니까?"))
      return false;

    setLoading(true);

    const para = { para: `subscribe?id=${detailDataResult.menuId}` };
    try {
      data = await processApi<any>("menu-subscribe", para);
    } catch (error) {
      data = null;
    }

    if (data !== null) {
      fetchMainData();
      fetchDetailData(detailDataResult.menuId);
    } else {
      console.log("[에러발생]");
      console.log(data);
    }
    setLoading(false);
  };

  const fetchUnsubscribe = async () => {
    let data: any;
    if (!detailDataResult) {
      console.log("No detailDataResult for fetchUnsubscribe");
      return false;
    }
    setLoading(true);
    if (!window.confirm("구독을 해제하시겠습니까?")) return false;
    const para = { para: `unsubscribe?id=${detailDataResult.menuId}` };

    try {
      data = await processApi<any>("menu-unsubscribe", para);
    } catch (error) {
      data = null;
    }

    if (data !== null) {
      fetchMainData();
      fetchDetailData(detailDataResult.menuId);
    } else {
      console.log("[에러발생]");
      console.log(data);
    }
    setLoading(false);
  };

  const handleCardClick = (id: string) => {
    setSelectedCard({ id });
  };

  const getMenusDataByGroup = (
    mainDataResult: TMainDataResult[],
    menuId: string
  ) => {
    return mainDataResult.filter((menu) => menuId === menu.parentMenuId);
  };

  const fetchManualDownload = async () => {
    let data: any;
    if (!detailDataResult) {
      console.log("No detailDataResult for fetchManualDownload");
      return false;
    }
    setLoading(true);
    const para = {
      id: `${detailDataResult.formId}_${detailDataResult.menuId}_ko-KR.pdf`,
    };

    try {
      data = await processApi<any>("manual-download", para);
    } catch (error) {
      data = null;
    }

    if (data !== null) {
      const original_name = `${detailDataResult.menuName} 매뉴얼.pdf`;
      const blob = new Blob([data.data], { type: "application/pdf" });

      // blob을 사용해 객체 URL을 생성합니다.
      const fileObjectUrl = window.URL.createObjectURL(blob);

      // blob 객체 URL을 설정할 링크를 만듭니다.
      const link = document.createElement("a");
      link.href = fileObjectUrl;
      link.style.display = "none";

      // 다운로드 파일 이름을 지정 할 수 있습니다.
      link.download = original_name;

      // 링크를 body에 추가하고 강제로 click 이벤트를 발생시켜 파일 다운로드를 실행시킵니다.
      document.body.appendChild(link);
      link.click();
      link.remove();
    } else {
      console.log("[에러발생]");
      console.log(data);
    }
    setLoading(false);
  };
  return (
    <>
      <TitleContainer>
        <Title>서비스 스토어</Title>
        <FilterTextContainer>
          <div className="k-icon k-i-search"></div>
          <Input value={filterText} onChange={(e) => setFilterText(e.value)} />
        </FilterTextContainer>
      </TitleContainer>
      <ServiceStoreContent>
        {mainDataResult &&
          mainDataResult.map(
            (data) =>
              data.category === "GROUP" && (
                <Menu
                  key={data.menuId}
                  groupMenu={data}
                  menus={getMenusDataByGroup(mainDataResult, data.menuId)}
                  filterText={filterText}
                  selectedCard={selectedCard}
                  onCardClick={handleCardClick}
                />
              )
          )}
      </ServiceStoreContent>

      {selectedCard && detailDataResult && (
        <DetailBox>
          <div>
            <div className="top">
              <p className="title">{detailDataResult.menuName}</p>
              <Button
                icon="x"
                fillMode={"flat"}
                onClick={() => setSelectedCard(null)}
              ></Button>
            </div>
            <p>{detailDataResult.description}</p>
            <HashtagConatiner>
              {detailDataResult.hashtag.map((tag) => (
                <div key={tag}>{tag}</div>
              ))}
            </HashtagConatiner>
            <div className="preview">
              {detailDataResult.preview ? (
                <img
                  src={`data:image/jpeg;base64,${detailDataResult.preview}`}
                  alt="preview"
                />
              ) : (
                <div className="k-icon k-i-image"></div>
              )}
            </div>
            <Button
              themeColor={"primary"}
              icon="pdf"
              fillMode={"outline"}
              onClick={fetchManualDownload}
              disabled={!detailDataResult.manualExists}
            >
              메뉴얼 보기
            </Button>
          </div>
          <div>
            {!detailDataResult.subscribed && (
              <>
                <del className="org-amt">
                  정가{" "}
                  {numberWithCommas(
                    detailDataResult.price
                      ? Number(detailDataResult.price)
                      : 6000
                  )}
                  원
                </del>
                <p className="amt">
                  <span>할인가</span> 월
                  {numberWithCommas(
                    (detailDataResult.price
                      ? Number(detailDataResult.price)
                      : 6000) *
                      ((100 - 40) / 100)
                  )}
                  원
                </p>
              </>
            )}
            {detailDataResult.subscribed ? (
              <Button
                themeColor={"info"}
                fillMode={"outline"}
                className="important"
                onClick={fetchUnsubscribe}
              >
                구독해제
              </Button>
            ) : (
              <Button
                themeColor={"primary"}
                fillMode={"solid"}
                className="important"
                onClick={fetchSubscribe}
              >
                구독하기
              </Button>
            )}
          </div>
        </DetailBox>
      )}
    </>
  );
};
export default Map;

type TMenu = {
  groupMenu: TMainDataResult;
  menus: TMainDataResult[];
  filterText: string;
  selectedCard: TSelectedCard;
  onCardClick: (title: string) => void;
};
const Menu = ({
  groupMenu,
  menus,
  filterText,
  selectedCard,
  onCardClick,
}: TMenu) => {
  return menus.some((menu) => menu.menuName.includes(filterText)) ? (
    <div className="item">
      <GridTitle>{groupMenu.menuName}</GridTitle>
      <CardBox>
        {menus.map(
          (menu) =>
            menu.menuName.includes(filterText) && (
              <Card
                key={menu.menuId}
                onClick={() => onCardClick(menu.menuId)}
                className={
                  selectedCard && selectedCard.id === menu.menuId
                    ? "focused"
                    : ""
                }
              >
                <CardBody>
                  <p>{menu.menuName}</p>
                  {menu.subscribed && (
                    <span className="subscribe-badge">구독중</span>
                  )}
                </CardBody>
              </Card>
            )
        )}
      </CardBox>
    </div>
  ) : (
    <></>
  );
};
