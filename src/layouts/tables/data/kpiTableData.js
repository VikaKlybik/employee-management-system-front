// @mui material components
// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDProgress from "components/MDProgress";
import TableUtils from "./utlis";
import DropdownMenu from "../../../components/DropDownMenu";
import Card from "@mui/material/Card";

export default function data(kpiContent) {
  const Project = ({ description, name }) => (
    <Card variant="outlined" sx={{ p: 2, mb: 2, borderRadius: '8px', boxShadow: 1 }}>
      <MDBox display="flex" flexDirection="column" lineHeight={1.5}>
        <MDTypography
          variant="h6"
          fontWeight="bold"
          mb={1}
        >
          {name}
        </MDTypography>
        <MDTypography
          variant="body2"
        >
          {description}
        </MDTypography>
      </MDBox>
    </Card>
  );

  const Progress = ({ measureUnit, actualValue, targetValue }) => (
    <MDBox display="flex" alignItems="center">
      <MDTypography variant="caption" color="text" fontWeight="medium">
        {`${actualValue}${" " + (measureUnit === "PERCENT" ? "%" : "")}`}
      </MDTypography>
      <MDBox ml={0.5} width="9rem">
        <MDProgress variant="gradient" color={new TableUtils().identifyColor(actualValue / targetValue * 100)}
                    value={actualValue / targetValue * 100} />
      </MDBox>
      <MDTypography variant="caption" color="text" fontWeight="medium">
        {`${targetValue}${" " + (measureUnit === "PERCENT" ? "%" : "")}`}
      </MDTypography>
    </MDBox>
  );

  if (!kpiContent || kpiContent.length === 0) {
    return { columns: [], rows: [] }; // Ensure a valid return structure
  }
  const getLatestAssessment = (kpiAssessments) => {
    // Check if there are assessments and find the latest one if they exist
    return kpiAssessments && kpiAssessments.length > 0
      ? kpiAssessments.reduce((latest, current) =>
        new Date(current.assessmentDate) > new Date(latest.assessmentDate) ? current : latest)
      : null;
  };

  const menuItems = [
    { label: "Удалить", action: "delete" },
    { label: "Редактировать", action: "edit" },
    { label: "Просмотреть историю обновлений", action: "detail_view" },
  ];

  const handleMenuItemClick = (item) => {
    console.log("Selected:", item);
    // Handle the action based on `item.action` or any other property
  };

  return {
    columns: [
      { Header: "Название", accessor: "name", width: "30%", align: "left" },
      { Header: "Прогресс", accessor: "progress", align: "center" },
      { Header: "Вес", accessor: "weight", align: "center" },
      { Header: "Дейстивия", accessor: "action", align: "center" },
    ],

    rows: kpiContent?.map(({ id, name, description, targetValue, measureUnit, weight, employeeId, kpiAssessments }) => {
      return {
        name: <Project description={description} name={name} />,
        weight: (
          <MDTypography display="block" variant="caption" color="text" fontWeight="medium">
            {`${weight * 100}%`}
          </MDTypography>
        ),
        // status: (
        //   <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
        //     working
        //   </MDTypography>
        // ),
        progress: <Progress measureUnit={measureUnit}
                            actualValue={getLatestAssessment(kpiAssessments) == null ? 0 : getLatestAssessment(kpiAssessments).actualValue}
                            targetValue={targetValue} />,
        action: (
          <DropdownMenu
            menuItems={
              menuItems.map((item) => {return {...item, kpi_id: id}})
            }
            onMenuItemClick={handleMenuItemClick}
          />
        ),
      };
    }),
  };
};

