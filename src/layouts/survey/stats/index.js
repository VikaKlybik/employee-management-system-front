import SurveyService from "../../../services/SurveyService";
import { useParams } from "react-router-dom";
import React, { useEffect, useState } from "react";
import DashboardNavbar from "../../../examples/Navbars/DashboardNavbar";
import MDBox from "../../../components/MDBox";
import DashboardLayout from "../../../examples/LayoutContainers/DashboardLayout";
import Grid from "@mui/material/Grid";
import ComplexStatisticsCard from "../../../examples/Cards/StatisticsCards/ComplexStatisticsCard";
import { useMaterialUIController } from "../../../context";
import PassingList from "../../dashboard/components/Passing";
import SurveyReview from "../../dashboard/components/SurveyReview";
import SurveyStatsForEmployee from "../../dashboard/components/SurveyStatsForEmployee";
import { CreateDevelopmentPlanForEmployeeModal } from "../../developmentPlan";

function SurveyStats() {
  const { id } = useParams();
  const surveyService = new SurveyService();
  const [surveyData, setSurveyData] = useState(null);
  const [controller] = useMaterialUIController();
  const [selectedUserId, setSelectedUserId] = useState(null);
  const {
    sidenavColor,
    darkMode,
  } = controller;
  const [isDevelopmentPlanModalOpen, setIsDevelopmentPlanModalOpen] = useState(false);
  const handleDevelopmentPlanDialogClose = () => {
    setIsDevelopmentPlanModalOpen(false);
  };
  const handleDevelopmentPlanDialogOpen = () => {
    console.log("Invoice handleDevelopmentPlanDialogOpen")
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

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox py={3}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6} lg={4}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="dark"
                icon="?"
                title="Количество вопросов"
                count={surveyData?.questions?.length ?? 0}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                icon="person"
                title="Прошло"
                count={
                  surveyData?.passingList?.filter(({ isPass }) => isPass)?.length ?? 0
                }
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="success"
                icon="people"
                title="Надо пройти"
                count={surveyData?.passingList?.length ?? 0}
              />
            </MDBox>
          </Grid>
        </Grid>
      </MDBox>
      <MDBox>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6} lg={8}>
            <PassingList passing={surveyData?.passingList ?? []} />
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <SurveyReview survey={surveyData} />
          </Grid>
        </Grid>
      </MDBox>
      {surveyData?.status === "CLOSED" && (
        <MDBox py={3}>
          <SurveyStatsForEmployee
            passing={surveyData?.passingList ?? []}
            surveyId={id}
            handleDevelopmentPlanDialogOpen={handleDevelopmentPlanDialogOpen}
            selectedUserId={selectedUserId}
            setSelectedUserId={setSelectedUserId}
          />
        </MDBox>)
      }
      <CreateDevelopmentPlanForEmployeeModal
        onClose={handleDevelopmentPlanDialogClose}
        isModalOpen={isDevelopmentPlanModalOpen}
        surveyId={id}
        employeeId={selectedUserId}
      />
    </DashboardLayout>
  );
}

export default SurveyStats;