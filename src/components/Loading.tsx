import React from "react";
import ClipLoader from "react-spinners/ClipLoader";
import { useRecoilState } from "recoil";
import { isLoading } from "../store/atoms";
import { MAIN_COLOR } from "./CommonString";

function Loading() {
  const [loading] = useRecoilState(isLoading);
  return (
    <>
      {loading && (
        <div
          style={{
            width: "100%",
            height: "100%",
            position: "fixed",
            zIndex: "999",
            top: "0",
            left: "0",
          }}
        >
          <div
            style={{
              position: "fixed",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
            }}
          >
            <ClipLoader color={MAIN_COLOR.blue} size={100} loading={loading} />
          </div>
        </div>
      )}
    </>
  );
}

export default Loading;
