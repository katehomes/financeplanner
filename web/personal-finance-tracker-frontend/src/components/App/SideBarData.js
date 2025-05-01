import React from "react";
import * as FaIcons from "react-icons/fa";
import * as AiIcons from "react-icons/ai";
import * as IoIcons from "react-icons/io";

import { TbTransactionDollar, TbCategory2, TbTags } from "react-icons/tb";

export const SidebarData = [
  {
    title: "Home",
    path: "/",
    icon: <AiIcons.AiFillHome />,
    cName: "nav-text",
  },
  {
    title: "About",
    path: "/about",
    icon: <IoIcons.IoIosPaper />,
    cName: "nav-text",
  },
  {
    title: "Transactions",
    path: "/finance",
    icon: <TbTransactionDollar />,
    cName: "nav-text",
  },
  {
    title: "Categories",
    path: "/category",
    icon: <TbCategory2 />,
    cName: "nav-text",
  },
  {
    title: "Tags",
    path: "/tag",
    icon: <TbTags />,
    cName: "nav-text",
  },
  {
    title: "Support",
    path: "/support",
    icon: <IoIcons.IoMdHelpCircle />,
    cName: "nav-text",
  },
];