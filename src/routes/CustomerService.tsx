import { CustomerServiceContent, Title } from "../CommonStyled";

const Login: React.FC = () => {
  return (
    <>
      <CustomerServiceContent>
        <Title>고객지원센터</Title>
        <p>항상 고객을 먼저 생각하겠습니다.</p>
        <div className="main_company_info_item">
          <div className="title_wrap">
            <p className="title">CUSTOMER CENTER</p>
            <p className="desc">문의하신 내용을 친절히 상담해 드립니다.</p>
          </div>
          <div className="customer_info">
            <span className="tel">대표전화. 070-7017-7373</span>
            <span className="unit">/</span>
            <span className="fax">E-mail. dev@gsti.co.kr</span>
            <p className="desc">
              평일: 오전 09:00 ~ 오후 06:00<span className="unit">/</span>
              토,일요일 · 공휴일 휴무
            </p>
          </div>
          <div className="address_info">
            <span className="title">
              부산 본사.
              <br />
            </span>
            <span className="content">
              부산광역시 북구 효열로 111, 부산지식산업센터 302호
              <br />
            </span>
            <span className="title">
              서울 사무소.
              <br />
            </span>
            <span className="content">
              서울특별시 금천구 가산동 714번지 하우스더스카이밸리 가산2차 1119호
            </span>
          </div>
        </div>
      </CustomerServiceContent>
    </>
  );
};
export default Login;
