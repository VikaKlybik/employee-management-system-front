// @mui material components
// Material Dashboard 2 React components
import MDTypography from "components/MDTypography";
import Progress from "../../../components/Progress";
import React from "react";

export default function data(kpiData) {

  if (!kpiData || kpiData.kpiAssessments.length === 0) {
    return { columns: [], rows: [] }; // Ensure a valid return structure
  }

  const formatDate = (date) => {
    return new Date(date).toLocaleString("ru-RU", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return {
    columns: [
      { Header: "Комментарии", accessor: "comments", width: "50%", align: "left" },
      { Header: "Прогресс", accessor: "progress", align: "center" },
      { Header: "Дата выставления", accessor: "assessmentDate", align: "center" },
    ],

    rows: kpiData?.kpiAssessments?.map((item) => {
      return {
        comments: <MDTypography
          variant="body2"
        >
          {item.comments}
        </MDTypography>,
        progress: (
          <Progress measureUnit={kpiData.measureUnit}
                    actualValue={[item]}
                    targetValue={kpiData.targetValue} />
        ),
        assessmentDate:
          <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
            {formatDate(item.assessmentDate)}
          </MDTypography>,
      };
    }),
  };
};

