// @mui material components
import Grid from "@mui/material/Grid";
import Divider from "@mui/material/Divider";

// @mui icons
// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import ProfileInfoCard from "examples/Cards/InfoCards/ProfileInfoCard";
import ProfilesList from "examples/Lists/ProfilesList";
import DefaultProjectCard from "examples/Cards/ProjectCards/DefaultProjectCard";

// Overview page components
import Header from "layouts/profile/components/Header";

// Data
// Images
import homeDecor1 from "assets/images/home-decor-1.jpg";
import team1 from "assets/images/team-1.jpg";
import team2 from "assets/images/team-2.jpg";
import team3 from "assets/images/team-3.jpg";
import team4 from "assets/images/team-4.jpg";
import { useAuth } from "../../context/AuthContext";
import { useEffect, useState } from "react";
import EmployeeService from "../../services/EmployeeService";
import SurveyService from "../../services/SurveyService";

function Overview() {
  const [employee, setEmployee] = useState(null);
  const [subordinates, setSubordinates] = useState(null);
  const [availableSurveys, setAvailableSurveys] = useState([]);
  const authContext = useAuth();
  const employeeService = new EmployeeService();
  const surveyService = new SurveyService();

  useEffect(() => {
    const user = authContext.getUser();

    // Объявите асинхронную функцию внутри useEffect
    async function fetchEmployee() {
      try {
        const response = await employeeService.getEmployeeById(user.id);
        setEmployee(response.data);
        await fetchSubordinates(response.data.jobTitle.id);
      } catch (error) {
        console.error("Error fetching employee:", error);
      }
    }

    async function fetchSubordinates(leadId) {
      try {
        const response = await employeeService.getEmployee({
          leadId: leadId,
          pageSize: 6,
        });
        setSubordinates(response.data);
      } catch (error) {
        console.error("Error fetching subordinates:", error);
      }
    }

    async function fetchAvailableSurveyToPass() {
      try {
        const response = await surveyService.getSurveyToBePassByEmployee(user.id);
        setAvailableSurveys(response.data);
      } catch (error) {
        console.log(error);
      }
    }

    fetchEmployee();
    fetchAvailableSurveyToPass();
  }, []);

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox mb={2} />
      <Header employeeData={
        {
          fullName: `${employee?.user?.lastName} ${employee?.user?.firstName}`,
          title: `${employee?.department?.name} / ${employee?.jobTitle?.name}`,
          profilePhotoUrl: employee?.user?.profilePhotoUrl,
        }
      }>
        <MDBox mt={5} mb={3}>
          <Grid container spacing={1}>
            <Grid item xs={12} xl={6} sx={{ display: "flex" }}>
              <Divider orientation="vertical" sx={{ ml: -2, mr: 1 }} />
              <ProfileInfoCard
                title="Ваши данные"
                info={{
                  fullName: `${employee?.user?.lastName} ${employee?.user?.firstName}`,
                  email: employee?.user?.email,
                  department: `${employee?.department?.name}`,
                  jobTitle: `${employee?.jobTitle?.name}`,
                }}
                action={{ route: "", tooltip: "Редактировать" }}
                shadow={false}
              />
              <Divider orientation="vertical" sx={{ mx: 0 }} />
            </Grid>
            <Grid item xs={12} xl={6}>
              <ProfilesList title="Подчинённые" profiles={subordinates} shadow={false} />
            </Grid>
          </Grid>
        </MDBox>
        <MDBox pt={2} px={2} lineHeight={1.25}>
          <MDTypography variant="h6" fontWeight="medium">
            Опросы
          </MDTypography>
          <MDBox mb={1}>
            <MDTypography variant="button" color="text">
              Оцените коллег или, возможно, себя
            </MDTypography>
          </MDBox>
        </MDBox>
        <MDBox p={2}>
          <Grid container spacing={6}>
            {availableSurveys && availableSurveys.map((passing) => (
              <Grid item xs={12} md={6} xl={3}>
                <DefaultProjectCard
                  image={passing.evaluatedPerson.user.profilePhotoUrl}
                  label={passing.survey.name}
                  title={passing.evaluatedPerson.user.lastName + ' ' +passing.evaluatedPerson.user.firstName}
                  description={passing.evaluatedPerson.department.name + ', ' + passing.evaluatedPerson.jobTitle.name}
                  action={{
                    type: "internal",
                    route: `/survey/${passing.id}`,
                    color: "info",
                    label: "Пройти опрос",
                  }}
                />
              </Grid>
            ))}
          < /Grid>
        </MDBox>
      </Header>

    </DashboardLayout>
  );
}

export default Overview;
