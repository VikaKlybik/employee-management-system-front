import MDTypography from "../../../../components/MDTypography";
import { Cancel, CheckCircle } from "@mui/icons-material";
import { green, red } from "@mui/material/colors";
import React from "react";

export default function data(jobTitles) {

  const StatusIcon = ({ success }) => {
    return success ? (
      <CheckCircle sx={{ color: green[500] }} />
    ) : (
      <Cancel sx={{ color: red[500] }} />
    );
  };


  if (!jobTitles || jobTitles.length === 0) {
    return { columns: [], rows: [] };
  }

  return {
    columns: [
      { Header: "Название позиции", accessor: "jobTitleName", width: "30%" },
      { Header: "Непосредственный руководитель", accessor: "lead", width: "30%" },
      { Header: "Является ли руководителем?", accessor: "isLead", width: "20%" },
    ],

    rows: jobTitles?.map(({ id, name, isLead, lead }) => {
      return {
        jobTitleName: (
          <MDTypography display="block" variant="body2" fontWeight="medium">
            {name}
          </MDTypography>
        ),
        lead: (
          <MDTypography display="block" variant="body2" color="text" fontWeight="medium">
            {lead?.name ? lead.name : "-"}
          </MDTypography>
        ),
        isLead: (
          <StatusIcon success={isLead} />
        ),
      };
    }),
  };
}
