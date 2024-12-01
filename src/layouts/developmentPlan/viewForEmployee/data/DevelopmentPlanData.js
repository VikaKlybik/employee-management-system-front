import MDBox from "../../../../components/MDBox";
import MDTypography from "../../../../components/MDTypography";
import React from "react";
import MDBadge from "../../../../components/MDBadge";
import TableUtils from "../../../tables/data/utlis";

export default function DevelopmentPlanForEmployeeData(developmentPlans, setStatus) {

  if (!developmentPlans || developmentPlans.length === 0) {
    return { columns: [], rows: [] }; // Ensure a valid return structure
  }

  return {
    columns: [
      { Header: "Цель", accessor: "goal", width: "40%", align: "left" },
      { Header: "Комментарии", width: "", accessor: "comments", align: "center" },
      { Header: "Компетенция", accessor: "competency", align: "center" },
      { Header: "Статус", accessor: "status", align: "center" },
    ],

    rows: developmentPlans?.map(({ id, goal, comments, status, competency }) => {
      return {
        goal:
          <MDTypography display="block" variant="p" fontWeight="medium">
            {goal}
          </MDTypography>,
        comments:
          <MDTypography display="block" fontWeight="medium" variant="caption" color="textSecondary">
            {comments}
          </MDTypography>,
        status:
          <MDBox ml={-1} alignItems="center">
            <MDBadge badgeContent={new TableUtils().identifyStatusDevelopmentPlan(status).name}
                     color={new TableUtils().identifyStatusDevelopmentPlan(status).color} variant="gradient"
                     size="sm" />
          </MDBox>,
        competency:
          <MDTypography display="block" variant="p" fontWeight="medium">
            {competency.name}
          </MDTypography>,
      }
        ;
    }),
  };
};

