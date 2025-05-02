import React from "react";
import { Link } from "react-router-dom";
import { SidebarData } from "./SideBarData";
import { IconContext } from "react-icons";
import "../../App.css";

interface SideBarProps {
  isShown: boolean;
  toggleSidebar: () => void;
}

const SideBar: React.FC<SideBarProps> = ({ isShown, toggleSidebar }) => {
  return (
    <IconContext.Provider value={{ color: "inherit" }}>
      <nav className={isShown ? "nav-menu active" : "nav-menu"} onClick={() => toggleSidebar()}>
        <ul className="nav-menu-items">
          {SidebarData.map((item, index) => (
            <li key={index} className={item.cName}>
              <Link to={item.path}>
                {item.icon}
                {isShown && <span>{item.title}</span>}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </IconContext.Provider>
  );
};

export default SideBar;
