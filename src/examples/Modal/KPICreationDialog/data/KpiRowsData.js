// @mui material components
// Material Dashboard 2 React components
import MDTypography from "components/MDTypography";
import DeleteIcon from "@mui/icons-material/Delete";
import IconButton from "@mui/material/IconButton";
import React from "react";

export default function KpiRowsData(kpis, handleDeleteRow) {

  if (!kpis || kpis.length === 0) {
    return { columns: [], rows: [] }; // Ensure a valid return structure
  }

  return {
    columns: [
      { Header: "Цель", accessor: "name", width: "40%", align: "left" },
      { Header: "KPI", width: "40%", accessor: "description", align: "center" },
      { Header: "Единица измерения", accessor: "measureUnit", align: "center" },
      { Header: "Планируемое значение", accessor: "targetValue", align: "center" },
      { Header: "Вес", accessor: "weight", align: "center" },
      { Header: "", accessor: "action", align: "center" }
    ],

    rows: kpis?.map(({ id, name, description, measureUnit, targetValue, weight }) => {
      return {
        name: <MDTypography display="block" variant="p" fontWeight="medium">
          {name}
        </MDTypography>,
        description:
          <MDTypography display="block" fontWeight="medium" variant="caption" color="textSecondary">
            {description}
          </MDTypography>,
        measureUnit:
          <MDTypography display="block" fontWeight="medium" variant="caption" color="textSecondary">
            {measureUnit === 'PERCENT' ? 'Процент': 'Количество'}
          </MDTypography>,
        targetValue:
          <MDTypography display="block" fontWeight="medium" variant="caption" color="textSecondary">
            {targetValue}
          </MDTypography>,
        weight:
          <MDTypography display="block" fontWeight="medium" variant="caption" color="textSecondary">
            {weight}%
          </MDTypography>,
        action: (
          <IconButton onClick={() => handleDeleteRow(id)}>
            <DeleteIcon />
          </IconButton>
        ),
      };
    }),
  };
};

