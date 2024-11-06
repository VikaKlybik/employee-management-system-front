import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import React, { useEffect, useState } from "react";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import MDBox from "components/MDBox";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import MDTypography from "components/MDTypography";
import DataTable from "examples/Tables/DataTable";
import EmployeeService from "services/EmployeeService";
import employeeTableData from "layouts/tables/data/employeeTableData";


function EmployeeTables() {
  const employeeService = new EmployeeService();
  const [employees, setEmployees] = useState(null);
  const [tableData, setTableData] = useState({ columns: [], rows: [] });

  useEffect(() => {
    async function fetchAllEmployee() {
      try {
        const response = await employeeService.getEmployee({});
        console.log("Fetched employees data:", response.data); // Debug log
        setEmployees(response.data);
      } catch (error) {
        console.log("Error fetching employee:", error);
      }
    }

    fetchAllEmployee();
  }, []);

  useEffect(() => {
    if (employees) {
      const myTableData = employeeTableData(employees);
      console.log("Generated table data:", myTableData); // Debug log
      setTableData(myTableData);
    }
  }, [employees]);



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
              >
                <MDTypography variant="h6" color="white">
                  Наши сотрудники
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

export default EmployeeTables;