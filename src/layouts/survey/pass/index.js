import React, { useEffect, useState } from "react";
import { Survey } from "survey-react-ui";
import { Box, Container, Typography } from "@mui/material";
import "survey-core/defaultV2.min.css";
import DashboardNavbar from "../../../examples/Navbars/DashboardNavbar";
import DashboardLayout from "../../../examples/LayoutContainers/DashboardLayout";
import { useMaterialUIController } from "../../../context";
import { useNavigate, useParams } from "react-router-dom";
import SurveyService from "../../../services/SurveyService";
import MDButton from "../../../components/MDButton";
import MDBox from "../../../components/MDBox";
import MDTypography from "../../../components/MDTypography";

function SurveyPage() {

  const [controller] = useMaterialUIController();
  const { id } = useParams();
  const [surveyJson, setSurveyJson] = useState(null);
  const surveyService = new SurveyService();
  const navigate = useNavigate();
  const [isPass, setIsPass] = useState(false);
  useEffect(() => {
    async function fetchSurveyById() {
      try {
        const response = await surveyService.getPassingById(id);
        console.log("Fetched survey data", response.data);
        const surveyData = response.data.survey;
        const surveyTemplateData = {
          title: surveyData.name,
          description: surveyData.description,
          completeText: "Отправить данные",
          questions: surveyData.questions.map((question) => {
            return {
              type: "rating",
              name: question.id,
              description: question.competency.name,
              title: question.name,
              rateMin: 1,
              rateMax: 5,
              minRateDescription: "Очень плохо",
              maxRateDescription: "Очень хорошо",
              isRequired: true,
            };
          }),
        };
        setSurveyJson(surveyTemplateData);
      } catch (error) {
        console.log(error);
      }
    }

    fetchSurveyById();
  }, []);
  const {
    sidenavColor,
    darkMode,
  } = controller;
  const onComplete = (survey) => {
    async function completeSurvey() {
      try {
        await surveyService.passSurvey({
          passingId: id,
          responses:
            Object.entries(survey.data).map(([questionId, mark]) => ({
              questionId,
              mark,
            })),
        });
        //survey.complete()
        setIsPass(true);
      } catch (error) {
        console.log(error);
      }
    }

    completeSurvey();
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <Container maxWidth="sm">
        <Box sx={{ textAlign: "center", mt: 4 }}>
          {surveyJson && !isPass && (
            <Survey
              json={surveyJson}
              onComplete={onComplete}
            />
          )}
          {isPass && (
            <MDBox>
              <MDBox mb={1} mt={25}>
                <MDTypography variant="h2">Спасибо, что прошли запрос</MDTypography>
              </MDBox>
              <MDBox mt={1} mx={0.5}>
                <MDButton variant="contained" color="info" onClick={() => navigate("/profile")}>
                  Вернуться на страницу профиля
                </MDButton>
              </MDBox>
            </MDBox>
          )}
        </Box>
      </Container>
    </DashboardLayout>
  );
}

export default SurveyPage;
