import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import React, { useEffect, useState } from "react";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import MDBox from "components/MDBox";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import MDTypography from "components/MDTypography";
import DataTable from "examples/Tables/DataTable";
import EmployeeService from "../../services/EmployeeService";
import kpiTableData from "../tables/data/kpiTableData";
import KPIService from "../../services/KPIService";
import { useAuth } from "../../context/AuthContext";
import MDButton from "../../components/MDButton";

function EmployeeKPITables() {
  const authContext = useAuth();
  const kpiService = new KPIService();
  const employeeService = new EmployeeService();
  const [kpiList, setKpiList] = useState(null);
  const [tableData, setTableData] = useState({ columns: [], rows: [] });

  useEffect(() => {
    async function fetchAllEmployeeKpi() {
      try {
        const user = authContext.getUser()
        const employee = await employeeService.getEmployeeById(user.id);
        const response = await kpiService.getKPIForEmployee(employee.data.id);
        console.log("Fetched kpi data:", response.data); // Debug log
        setKpiList(response.data);
      } catch (error) {
        console.log("Error fetching employee:", error);
      }
    }

    fetchAllEmployeeKpi();
  }, []);

  useEffect(() => {
    if (kpiList) {
      const myTableData = kpiTableData(kpiList);
      console.log("Generated table data:", myTableData); // Debug log
      setTableData(myTableData);
    }
  }, [kpiList]);

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
                  KPI
                </MDTypography>
                <MDButton color="primary" variant="contained">
                  Выгрузить отчёт
                </MDButton>
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

export default EmployeeKPITables;