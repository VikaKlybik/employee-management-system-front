import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import DropdownMenu from "../../../components/DropDownMenu";
import Card from "@mui/material/Card";
import Progress from "../../../components/Progress";

export default function data(kpiContent, handleMenuItemClick) {
  const Project = ({ description, name }) => (
    <Card variant="outlined" sx={{ p: 2, mb: 2, borderRadius: "8px", boxShadow: 1 }}>
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

  if (!kpiContent || kpiContent.length === 0) {
    return { columns: [], rows: [] }; // Ensure a valid return structure
  }

  const menuItems = [
    { label: "Просмотреть историю обновлений", action: "detail_view" },
  ];

  return {
    columns: [
      { Header: "Название", accessor: "name", width: "30%", align: "left" },
      { Header: "Прогресс", accessor: "progress", align: "center" },
      { Header: "Вес", accessor: "weight", align: "center" },
      { Header: "Дейстивия", accessor: "action", align: "center" },
    ],

    rows: kpiContent?.map(({ id, name, description, targetValue, measureUnit, weight, kpiAssessments }) => {
      return {
        name: <Project description={description} name={name} />,
        weight: (
          <MDTypography display="block" variant="caption" color="text" fontWeight="medium">
            {`${weight}%`}
          </MDTypography>
        ),
        progress: <Progress measureUnit={measureUnit}
                            actualValue={kpiAssessments}
                            targetValue={targetValue} />,
        action: (
          <DropdownMenu
            menuItems={
              menuItems.map((item) => {
                return { ...item, kpi_id: id };
              })
            }
            onMenuItemClick={handleMenuItemClick}
          />
        ),
      };
    }),
  };
};

