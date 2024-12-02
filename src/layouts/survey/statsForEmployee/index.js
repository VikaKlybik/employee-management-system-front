import SurveyService from "../../../services/SurveyService";
import { useParams } from "react-router-dom";
import React, { useEffect, useState } from "react";
import DashboardNavbar from "../../../examples/Navbars/DashboardNavbar";
import MDBox from "../../../components/MDBox";
import DashboardLayout from "../../../examples/LayoutContainers/DashboardLayout";
import { useMaterialUIController } from "../../../context";
import MDTypography from "../../../components/MDTypography";
import Card from "@mui/material/Card";
import { FormControl, InputLabel, Select } from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import { statisticType } from "../stats/data/statisticType";
import MDButton from "../../../components/MDButton";
import SurveyChartForEmployee
  from "../../dashboard/components/SurveyStatsForEmployee/components/SurveyChartForEmployee";
import SurveyTableForEmployee
  from "../../dashboard/components/SurveyStatsForEmployee/components/SurveyTableForEmployee";
import { useAuth } from "../../../context/AuthContext";
import ViewDevelopmentPlanForEmployeeModal
  from "../../developmentPlan/viewForEmployee/ViewDevelopmentPlanForEmployeeModal";
import MDSnackbar from "../../../components/MDSnackbar";

function SurveyOverviewForEmployee() {
  const { id } = useParams();
  const surveyService = new SurveyService();
  const [surveyData, setSurveyData] = useState(null);
  const [controller] = useMaterialUIController();
  const [type, setType] = useState(null);
  const [assessments, setAssessments] = useState([]);
  const authContext = useAuth();
  const [successSB, setSuccessSB] = useState(false);
  const [errorSB, setErrorSB] = useState(false);
  const openErrorSB = () => setErrorSB(true);
  const closeErrorSB = () => setErrorSB(false);
  const openSuccessSB = () => setSuccessSB(true);
  const closeSuccessSB = () => setSuccessSB(false);
  const [message, setMessage] = useState("");

  const renderSuccessSB = (
    <MDSnackbar
      color="success"
      icon="check"
      title="Инфорамация"
      content={message}
      open={successSB}
      onClose={closeSuccessSB}
      close={closeSuccessSB}
      bgWhite
    />
  );
  const renderErrorSB = (
    <MDSnackbar
      color="error"
      icon="warning"
      title="Ошибка"
      content={message}
      open={errorSB}
      onClose={closeErrorSB}
      close={closeErrorSB}
      bgWhite
    />
  );

  const {
    sidenavColor,
    darkMode,
  } = controller;
  const [isDevelopmentPlanModalOpen, setIsDevelopmentPlanModalOpen] = useState(false);
  const handleDevelopmentPlanDialogClose = () => {
    setIsDevelopmentPlanModalOpen(false);
  };
  const handleDevelopmentPlanDialogOpen = () => {
    console.log("Invoice handleDevelopmentPlanDialogOpen");
    setIsDevelopmentPlanModalOpen(true);
  };
  useEffect(() => {
    console.log("isDevelopmentPlanModalOpen ", isDevelopmentPlanModalOpen);
  }, [isDevelopmentPlanModalOpen]);

  useEffect(() => {
    async function fetchSurveyData() {
      try {
        const response = await surveyService.getSurveyById(id);
        setSurveyData(response.data);
      } catch (error) {
        console.log(error);
      }
    }

    fetchSurveyData();
  }, [id]);

  useEffect(() => {
    async function fetchAssessments() {
      try {
        const user = authContext.getUser();
        const response = await surveyService.getAssessments({
          userId: user.id,
          surveyId: id,
          statisticType: "TABLE",
        });
        setAssessments(response.data);
      } catch (error) {
        console.log(error);
      }
    }

    if (type) {
      fetchAssessments();
    }
  }, [type]);

  const handleDownloadSurvey = async () => {
    try {
      const user = authContext.getUser();

      const response = await surveyService.getReportForUser(id, user.id);
      const link = document.createElement("a");
      const url = window.URL.createObjectURL(response.data);
      link.href = url;
      link.download = "reportSurvey.xlsx";  // Укажите имя файла и его расширение
      link.click();

      // Освобождаем ресурсы
      window.URL.revokeObjectURL(url);
      setMessage("Отчёт отобразиться в скаченных файлах!")
      openSuccessSB()
    } catch (error) {
      setMessage("Попробуйти позже или обратитесь в поддержку!")
      openErrorSB()
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("ru-RU"); // en-GB sets the format to DD/MM/YYYY
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      {surveyData?.status === "CLOSED" && (
        <Card>
          <MDBox py={3}>
            <MDBox pt={3} px={3}>
              <MDTypography variant="h5" fontWeight="medium">
                Общие данные опроса
              </MDTypography>
            </MDBox>
            <MDBox p={3}>
              <MDBox display="flex" py={1} pr={2}>
                <MDTypography variant="button" fontWeight="bold" textTransform="capitalize">
                  Название: &nbsp;
                </MDTypography>
                <MDTypography variant="button" fontWeight="regular" color="text">
                  &nbsp; {surveyData?.name}
                </MDTypography>
              </MDBox>
              <MDBox display="flex" py={1} pr={2}>
                <MDTypography variant="button" fontWeight="bold" textTransform="capitalize">
                  Описание: &nbsp;
                </MDTypography>
                <MDTypography variant="button" fontWeight="regular" color="text">
                  &nbsp; {surveyData?.description}
                </MDTypography>
              </MDBox>
              <MDBox display="flex" py={1} pr={2}>
                <MDTypography variant="button" fontWeight="bold" textTransform="capitalize">
                  Дата создания: &nbsp;
                </MDTypography>
                <MDTypography variant="button" fontWeight="regular" color="text">
                  &nbsp; {formatDate(surveyData?.createdAt)}
                </MDTypography>
              </MDBox>
              <MDBox display="flex" py={1} pr={2}>
                <MDTypography variant="button" fontWeight="bold" textTransform="capitalize">
                  Метод оценки: &nbsp;
                </MDTypography>
                <MDTypography variant="button" fontWeight="regular" color="text">
                  &nbsp; {surveyData?.evaluationMethod === "METHOD_270" ? "Метод 270" : "Метод 360"}
                </MDTypography>
              </MDBox>
            </MDBox>
            <MDBox alignItems="center" p={3}>
              <MDBox display="flex" justifyContent="space-between" alignItems="center">
                <FormControl fullWidth={false}
                             margin="normal"
                             style={{
                               width: "50%",
                             }}>
                  <InputLabel id="chart">Выберите тип графика</InputLabel>
                  <Select
                    labelId="chart"
                    fullWidth
                    displayEmpty
                    margin="normal"
                    style={{ paddingTop: "11px", paddingBottom: "11px", marginTop: "2px", height: "60px" }}
                    value={type}
                    label="Выберите тип графика"
                    onChange={(e) => setType(e.target.value)}
                  >
                    {statisticType.map(({ label, name }) => (
                      <MenuItem value={name}>{label}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <MDBox style={{ width: "23%" }}>
                  <MDButton
                    color="primary"
                    variant="contained"
                    fullWidth
                    style={{
                      paddingTop: "11px",
                      paddingBottom: "11px",
                      marginTop: "2px",
                      height: "60px",
                    }}
                    onClick={() => handleDevelopmentPlanDialogOpen()}>
                    План развития
                  </MDButton>
                </MDBox>
                <MDBox style={{ width: "23%" }}>
                  <MDButton
                    color="success"
                    variant="contained"
                    fullWidth
                    style={{
                      paddingTop: "11px",
                      paddingBottom: "11px",
                      marginTop: "2px",
                      height: "60px",
                    }}
                    onClick={() => handleDownloadSurvey()}>
                    Выгрузить отчёт
                  </MDButton>
                </MDBox>
              </MDBox>
            </MDBox>
            <MDBox>
              {type && (
                <>
                  {type === "charts" && (
                    <>
                      <SurveyChartForEmployee
                        surveyId={id}
                        assessments={assessments}
                      />
                    </>
                  )}
                  {type === "full-review" && assessments && (
                    <SurveyTableForEmployee
                      surveyId={id}
                      assessments={assessments}
                    />
                  )}
                </>
              )}
            </MDBox>
          </MDBox>
        </Card>)
      }
      {renderErrorSB}
      {renderSuccessSB}
      <ViewDevelopmentPlanForEmployeeModal
        onClose={handleDevelopmentPlanDialogClose}
        isModalOpen={isDevelopmentPlanModalOpen}
        surveyId={id}
        employeeId={authContext.getUser().id}
      />
    </DashboardLayout>
  );
}

export default SurveyOverviewForEmployee;