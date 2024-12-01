// @mui material components
import Card from "@mui/material/Card";
import Icon from "@mui/material/Icon";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// Material Dashboard 2 React example components
import TimelineItem from "examples/Timeline/TimelineItem";
import TableUtils from "../../../tables/data/utlis";
import MDBadge from "../../../../components/MDBadge";

function SurveyReview({survey}) {

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("ru-RU"); // en-GB sets the format to DD/MM/YYYY
  };

  return (
    <Card sx={{ height: "100%" }}>
      <MDBox pt={3} px={3}>
        <MDTypography variant="h5" fontWeight="medium">
          Общие данные опроса
        </MDTypography>

      </MDBox>
      <MDBox p={2}>
        <MDBox display="flex" py={1} pr={2}>
          <MDTypography variant="button" fontWeight="bold" textTransform="capitalize">
            Название: &nbsp;
          </MDTypography>
          <MDTypography variant="button" fontWeight="regular" color="text">
            &nbsp; {survey?.name}
          </MDTypography>
        </MDBox>
        <MDBox display="flex" py={1} pr={2}>
          <MDTypography variant="button" fontWeight="bold" textTransform="capitalize">
            Описание: &nbsp;
          </MDTypography>
          <MDTypography variant="button" fontWeight="regular" color="text">
            &nbsp; {survey?.description}
          </MDTypography>
        </MDBox>
        <MDBox display="flex" py={1} pr={2}>
          <MDTypography variant="button" fontWeight="bold" textTransform="capitalize">
            Статус: &nbsp;
          </MDTypography>
          <MDTypography variant="button" fontWeight="regular" color="text">
            &nbsp; <MDBadge badgeContent={new TableUtils().identifyStatus(survey?.status)?.name}
                            color={new TableUtils().identifyStatus(survey?.status)?.color} variant="gradient" size="sm" />
          </MDTypography>
        </MDBox>
        <MDBox display="flex" py={1} pr={2}>
          <MDTypography variant="button" fontWeight="bold" textTransform="capitalize">
            Дата создания: &nbsp;
          </MDTypography>
          <MDTypography variant="button" fontWeight="regular" color="text">
            &nbsp; {formatDate(survey?.createdAt)}
          </MDTypography>
        </MDBox>
        <MDBox display="flex" py={1} pr={2}>
          <MDTypography variant="button" fontWeight="bold" textTransform="capitalize">
            Метод оценки: &nbsp;
          </MDTypography>
          <MDTypography variant="button" fontWeight="regular" color="text">
            &nbsp; {survey?.evaluationMethod === 'METHOD_270'? "Метод 270": "Метод 360"}
          </MDTypography>
        </MDBox>
      </MDBox>
    </Card>
  );
}

export default SurveyReview;
