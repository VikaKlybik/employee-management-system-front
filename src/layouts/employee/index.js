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
import CreateEmployeeDialog from "../../examples/Modal/CreateEmployeeDialog";
import MDButton from "../../components/MDButton";


function EmployeeTables() {
  const employeeService = new EmployeeService();
  const [employees, setEmployees] = useState(null);
  const [tableData, setTableData] = useState({ columns: [], rows: [] });
  const [isCreateEmployeeOpen, setIsCreateEmployeeOpen] = useState(false);

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

  const handleCreateEmployee = (data) => {
    async function createEmployee() {
      try {
        const response = await employeeService.createEmployee({
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          password: data.password,
          role: "employee",
          jobTittleId: data.position,
        });
        const employeeData = await employeeService.getEmployeeById(response.data.id);
        setEmployees([...employees, employeeData.data]);
        setIsCreateEmployeeOpen(false);
      } catch (error) {
        console.log(error);
      }
    }

    createEmployee();
  };


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
                  Наши сотрудники
                </MDTypography>
                <MDButton color="primary" variant="contained" onClick={() => setIsCreateEmployeeOpen(true)}>
                  Добавить нового сотрудника
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
      <CreateEmployeeDialog
        isModalOpen={isCreateEmployeeOpen}
        handleCreateEmployee={handleCreateEmployee}
        closeModal={() => setIsCreateEmployeeOpen(false)}
      />
    </DashboardLayout>
  );
}

export default EmployeeTables;