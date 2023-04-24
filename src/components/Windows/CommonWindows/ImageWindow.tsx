import { useEffect, useState } from "react";
import * as React from "react";
import { Window, WindowMoveEvent } from "@progress/kendo-react-dialogs";
import { useApi } from "../../../hooks/api";
import { BottomContainer, ButtonContainer } from "../../../CommonStyled";
import { Button } from "@progress/kendo-react-buttons";
import { IWindowPosition } from "../../../hooks/interfaces";
import {
  Upload,
  UploadFileInfo,
  UploadOnAddEvent,
  UploadOnProgressEvent,
  UploadOnRemoveEvent,
  UploadOnStatusChangeEvent,
} from "@progress/kendo-react-upload";

type IWindow = {
  setVisible(t: boolean): void;
  url: string;
};

const ImageWindow = ({ setVisible, url }: IWindow) => {
  const [position, setPosition] = useState<IWindowPosition>({
    left: 300,
    top: 100,
    width: 1200,
    height: 800,
  });
  const [urls, setUrls] = useState<string>("");
  const handleMove = (event: WindowMoveEvent) => {
    setPosition({ ...position, left: event.left, top: event.top });
  };

  useEffect(() => {
    if (typeof url == "object") {
      var fileReader = new FileReader();
      fileReader.readAsDataURL(url);
      fileReader.onload = function (e) {
        if(e.target != null){
          if (e.target.result != null) {
            setUrls(e.target.result.toString().split(",")[1]);
          }
        }
      };
    } else {
      setUrls(url);
    }
  }, []);

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

  return (
    <Window
      title={"미리보기"}
      width={position.width}
      height={position.height}
      onMove={handleMove}
      onResize={handleResize}
      onClose={onClose}
    >
      <img src={`data:image/jpeg;base64,${urls}`} alt="preview" />
      <BottomContainer>
        <ButtonContainer>
          <Button themeColor={"primary"} fillMode={"outline"} onClick={onClose}>
            닫기
          </Button>
        </ButtonContainer>
      </BottomContainer>
    </Window>
  );
};

export default ImageWindow;
