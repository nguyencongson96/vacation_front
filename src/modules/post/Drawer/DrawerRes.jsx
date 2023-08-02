import { Drawer } from "antd";
import "./DrawerRes.scss";
import Sidebar from "~/modules/vacation/components/Sidebar/Sidebar";
import Timeline from "~/modules/vacation/components/Timelines/Timeline";
import { useState } from "react";
import { useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose } from "@fortawesome/free-solid-svg-icons";

const DrawerRes = ({ resModal, setResModal }) => {
  const [show, setShow] = useState("sidebar");
  const { size } = useSelector((state) => state.general);
  const isSmallSize = size.width <= 768;

  return (
    <Drawer
      width={400}
      placement="left"
      onClose={() => setResModal(false)}
      open={resModal}
      closeIcon={false}
      className="drawer-wrapper"
    >
      <FontAwesomeIcon icon={faClose} onClick={() => setResModal(false)} />
      {isSmallSize && (
        <header className="header">
          <span onClick={() => setShow("sidebar")} className={show === "sidebar" && "active"}>
            Vacation Info
          </span>
          <span onClick={() => setShow("timeline")} className={show === "timeline" && "active"}>
            Timeline
          </span>
        </header>
      )}

      <main className="main">
        {isSmallSize ? show === "sidebar" ? <Sidebar /> : <Timeline /> : <Timeline />}
      </main>
    </Drawer>
  );
};

export default DrawerRes;
