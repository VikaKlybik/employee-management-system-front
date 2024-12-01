import MDBox from "../../../../components/MDBox";
import MDTypography from "../../../../components/MDTypography";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import React from "react";
import MDBadge from "../../../../components/MDBadge";
import TableUtils from "../../../tables/data/utlis";
import { Select } from "@mui/material";
import MenuItem from "@mui/material/MenuItem";

const developmentPlanStatuses = ["STARTED", "COMPLETED", "FAILED", "CANCELLED"];
export default function DevelopmentPlanData(developmentPlans, setStatus) {

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
          <Select
            fullWidth
            margin={"normal"}
            value={status}
            sx={{
              "& .MuiOutlinedInput-notchedOutline": {
                border: "none", // Убирает стандартную рамку
              },
              "&:hover .MuiOutlinedInput-notchedOutline": {
                border: "none", // Убирает рамку при наведении
              },
              "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                border: "none", // Убирает рамку при фокусе
              },
            }}
            onChange={(e) => setStatus(e.target.value, id)}
          >
            {developmentPlanStatuses.map((item) => (
              <MenuItem value={item}>
                <MDBox ml={-1} alignItems="center">
                  <MDBadge badgeContent={new TableUtils().identifyStatusDevelopmentPlan(item).name}
                           color={new TableUtils().identifyStatusDevelopmentPlan(item).color} variant="gradient"
                           size="sm" />
                </MDBox>
              </MenuItem>
            ))}
          </Select>,
        competency:
          <MDTypography display="block" variant="p" fontWeight="medium">
            {competency.name}
          </MDTypography>,
      }
        ;
    }),
  };
};

