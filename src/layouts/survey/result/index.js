import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import React, { useEffect, useState } from "react";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import MDBox from "components/MDBox";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import MDTypography from "components/MDTypography";
import DataTable from "examples/Tables/DataTable";
import SurveyService from "../../../services/SurveyService";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import SurveyForEmployeeListTableData from "./data/SurveyForEmployeeListTableData";

function EmployeeResultSurveyList() {
  const surveyService = new SurveyService();
  const [surveys, setSurveys] = useState(null);
  const [tableData, setTableData] = useState({ columns: [], rows: [] });
  const navigate = useNavigate();
  const authContext = useAuth();

  async function fetchAllSurveyForEmployee() {
    try {
      const user = authContext.getUser();
      const response = await surveyService.getSurveyForEmployee(user.id);
      console.log("Fetched survey data:", response.data); // Debug log
      setSurveys(response.data);
    } catch (error) {
      console.log("Error fetching survey:", error);
    }
  }

  useEffect(() => {
    fetchAllSurveyForEmployee();
  }, []);

  useEffect(() => {
    if (surveys) {
      const myTableData = SurveyForEmployeeListTableData(surveys);
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
    </DashboardLayout>
  );
}

export default EmployeeResultSurveyList;