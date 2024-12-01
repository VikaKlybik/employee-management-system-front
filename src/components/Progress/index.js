import MDBox from "../MDBox";
import MDTypography from "../MDTypography";
import MDProgress from "../MDProgress";
import TableUtils from "../../layouts/tables/data/utlis";
import React, { useEffect, useState } from "react";

export default function Progress({actualValue, measureUnit, targetValue}) {
  const getLatestAssessment = (kpiAssessments) => {
    return kpiAssessments && kpiAssessments.length > 0
      ? kpiAssessments.reduce((latest, current) =>
        new Date(current.assessmentDate) > new Date(latest.assessmentDate) ? current : latest
      )
      : {actualValue:0};
  };

  useEffect(() => {
    if (actualValue) {
      setLatestAssessment(getLatestAssessment(actualValue));
    }
  }, [actualValue]);

  const [latestAssessment, setLatestAssessment] = useState(null);
  return (
    <MDBox display="flex" alignItems="center">
      <MDTypography variant="caption" color="text" fontWeight="medium">
        {`${latestAssessment?.actualValue}${" " + (measureUnit === "PERCENT" ? "%" : "")}`}
      </MDTypography>
      <MDBox ml={0.5} width="9rem">
        <MDProgress variant="gradient"
                    color={new TableUtils().identifyColorForProgress(latestAssessment?.actualValue / targetValue * 100)}
                    value={latestAssessment?.actualValue / targetValue * 100} />
      </MDBox>
      <MDTypography variant="caption" color="text" fontWeight="medium">
        {`${targetValue}${" " + (measureUnit === "PERCENT" ? "%" : "")}`}
      </MDTypography>
    </MDBox>
  );
}