import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import React, { useEffect, useState } from "react";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import MDBox from "components/MDBox";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import MDTypography from "components/MDTypography";
import DataTable from "examples/Tables/DataTable";
import surveyListTableData from "layouts/tables/data/surveyListTableData";
import SurveyService from "../../../services/SurveyService";
import { useNavigate } from "react-router-dom";
import MDSnackbar from "../../../components/MDSnackbar";
import { useAuth } from "../../../context/AuthContext";

function SurveyList() {
  const surveyService = new SurveyService();
  const [surveys, setSurveys] = useState(null);
  const [tableData, setTableData] = useState({ columns: [], rows: [] });
  const navigate = useNavigate();
  const [successSB, setSuccessSB] = useState(false);
  const [errorSB, setErrorSB] = useState(false);
  const openErrorSB = () => setErrorSB(true);
  const closeErrorSB = () => setErrorSB(false);
  const openSuccessSB = () => setSuccessSB(true);
  const closeSuccessSB = () => setSuccessSB(false);
  const [message, setMessage] = useState("");
  const auth = useAuth();
  const user = auth.getUser();

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

  async function fetchAllSurvey() {
    try {
      const response = await surveyService.getSurvey({});
      console.log("Fetched survey data:", response.data); // Debug log
      setSurveys(response.data);
    } catch (error) {
      console.log("Error fetching survey:", error);
    }
  }

  const handleMenuItemClick = (item) => {
    console.log("Selected:", item);

    async function duplicateSurvey(id) {
      try {
        await surveyService.duplicateSurvey(id);
        //TODO display modal or alert
        await fetchAllSurvey();
        setMessage("Создан новый дубликат!")
        openSuccessSB()
      } catch (error) {
        setMessage("Ошибка создания дубликата!")
        openErrorSB()
      }
    }

    async function closeSurvey(id) {
      try {
        await surveyService.closeSurvey(id);
        await fetchAllSurvey();
        setMessage("Прохождение опроса завершено!")
        openSuccessSB()
      } catch (error) {
        setMessage("Опрос уже был закрыт!")
        openErrorSB()
      }
    }

    switch (item.action) {
      case "duplicate":
        duplicateSurvey(item.survey_id);
        break;
      case "set-evaluators":
        navigate(`/survey/${item.survey_id}/evaluators`);
        break;
      case "view-stats":
        navigate(`/survey/${item.survey_id}/stats`)
        break;
      case "close":
        closeSurvey(item.survey_id);
        break;
      default:
        break;
    }

  };

  useEffect(() => {
    fetchAllSurvey();
  }, []);

  useEffect(() => {
    if (surveys) {
      const myTableData = surveyListTableData(surveys, handleMenuItemClick, user.role);
      console.log("Generated table data:", myTableData); // Debug log
      setTableData(myTableData);
    }
  }, [surveys]);


  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <Card>
              <MDBox
                mx={2}
                mt={-3}
                py={3}
                px={2}
                variant="gradient"
                bgColor="info"
                borderRadius="lg"
                coloredShadow="info"
                display="flex"
                justifyContent="space-between"
                alignItems="center"
              >
                <MDTypography variant="h6" color="white">
                  Опросы
                </MDTypography>
              </MDBox>
              <MDBox pt={3}>
                <DataTable
                  table={tableData}
                  isSorted={false}
                  entriesPerPage={false}
                  showTotalEntries={false}
                  noEndBorder
                />
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>
      {renderSuccessSB}
      {renderErrorSB}
    </DashboardLayout>
  );
}

export default SurveyList;