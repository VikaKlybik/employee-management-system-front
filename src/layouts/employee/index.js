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
import UpdateEmployeeDialog from "../../examples/Modal/UpdateEmployeeDialog";
import MDSnackbar from "../../components/MDSnackbar";
import EmployeeFilterDialog from "../../examples/Modal/EmployeeFilterDialog";
import ClearIcon from "@mui/icons-material/Clear";
import IconButton from "@mui/material/IconButton";
import { useAuth } from "../../context/AuthContext";
import CompetenciesForEmployeeDialog from "../../examples/Modal/CompetenciesForEmployeeDialog";
import { useLocation, useNavigate } from "react-router-dom";


function EmployeeTables() {
  const employeeService = new EmployeeService();
  const [employees, setEmployees] = useState(null);
  const [tableData, setTableData] = useState({ columns: [], rows: [] });
  const [isCreateEmployeeOpen, setIsCreateEmployeeOpen] = useState(false);
  const [isUpdateEmployeeOpen, setIsUpdateEmployeeOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [successSB, setSuccessSB] = useState(false);
  const [errorSB, setErrorSB] = useState(false);
  const openErrorSB = () => setErrorSB(true);
  const closeErrorSB = () => setErrorSB(false);
  const openSuccessSB = () => setSuccessSB(true);
  const closeSuccessSB = () => setSuccessSB(false);
  const [isFilterEmployeeOpen, setIsFilterEmployeeOpen] = useState(false);
  const auth = useAuth();
  const user = auth.getUser();
  const navigate = useNavigate()
  const [searchParam, setSearchParam] = useState({
    search: null,
    departmentId: null,
    jobTitleId: null,
  });
  const location = useLocation();
  const isModalOpen = location.pathname.includes("/employee/competencies/");


  const renderSuccessSB = (
    <MDSnackbar
      color="success"
      icon="check"
      title="Инфорамация"
      content="Данные о сотруднике успешно сохранены!"
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
      content="Пользователь с такой почтой уже существует!"
      open={errorSB}
      onClose={closeErrorSB}
      close={closeErrorSB}
      bgWhite
    />
  );

  const competenciesNavigate = (userId) => {
    navigate(`/employee/competencies/${userId}`)
  }


  useEffect(() => {
    async function fetchAllEmployee() {
      try {
        const response = await employeeService.getEmployee(searchParam);
        console.log("Fetched employees data:", response.data); // Debug log
        setEmployees(response.data);
      } catch (error) {
        console.log("Error fetching employee:", error);
      }
    }

    fetchAllEmployee();
  }, [searchParam]);

  useEffect(() => {
    if (employees) {
      const myTableData = employeeTableData(employees, handleSelectEmployee, competenciesNavigate);
      console.log("Generated table data:", myTableData); // Debug log
      setTableData(myTableData);
    }
  }, [employees]);
  const handleUpdateEmployee = (data) => {
    async function updateEmployee() {
      try {
        const response = await employeeService.updateEmployee(selectedEmployee.user.id, {
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          jobTitleId: data.position,
        });
        const responseEmployee = await employeeService.getEmployee({});
        setEmployees(responseEmployee.data);
        setIsUpdateEmployeeOpen(false);
        openSuccessSB();
      } catch (error) {
        openErrorSB();
      }
    }

    updateEmployee();
  };

  const handleSelectEmployee = (selectedId) => {
    setSelectedEmployee(employees.filter(({ id }) => id === selectedId)[0]);
    setIsUpdateEmployeeOpen(true);
  };

  const resetFilter = () => {
    setSearchParam({
      search: null,
      departmentId: null,
      jobTitleId: null,
    });
  };

  const handleCreateEmployee = (data) => {
    async function createEmployee() {
      try {
        const response = await employeeService.createEmployee({
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          password: data.password,
          role: "employee",
          jobTitleId: data.position,
        });
        const employeeData = await employeeService.getEmployeeById(response.data.id);
        setEmployees([...employees, employeeData.data]);
        setIsCreateEmployeeOpen(false);
        setSelectedEmployee(null);
        openSuccessSB();
      } catch (error) {
        openErrorSB();
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
                <MDBox sx={{ display: "flex", justifyContent: "space-between", gap: 2 }}>
                  <MDButton color="success" variant="contained" onClick={() => setIsFilterEmployeeOpen(true)}>
                    Фильтровать
                  </MDButton>
                  {(searchParam.departmentId || searchParam.search || searchParam.jobTitleId) && (
                    <IconButton
                      onClick={resetFilter}
                      sx={{
                        color: "primary.main", // Цвет иконки (можно настроить)
                        backgroundColor: "transparent", // Без фона
                        "&:hover": {
                          backgroundColor: "rgba(0, 0, 0, 0.04)", // Лёгкий фон при наведении (можно убрать)
                        },
                      }}
                    >
                      <ClearIcon />
                    </IconButton>
                  )}
                  {user.role === "admin" && (
                    <MDButton color="primary" variant="contained" onClick={() => setIsCreateEmployeeOpen(true)}>
                      Добавить нового сотрудника
                    </MDButton>
                  )}
                </MDBox>
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
      {renderErrorSB}
      {renderSuccessSB}
      <CreateEmployeeDialog
        isModalOpen={isCreateEmployeeOpen}
        handleCreateEmployee={handleCreateEmployee}
        closeModal={() => setIsCreateEmployeeOpen(false)}
      />
      <EmployeeFilterDialog
        open={isFilterEmployeeOpen}
        onClose={() => setIsFilterEmployeeOpen(false)}
        searchParam={searchParam}
        setSearchParam={setSearchParam}
        resetFilter={resetFilter}
      />
      {selectedEmployee && (
        <UpdateEmployeeDialog
          isModalOpen={isUpdateEmployeeOpen}
          handleUpdateEmployee={handleUpdateEmployee}
          closeModal={() => {
            setIsUpdateEmployeeOpen(false);
            setSelectedEmployee(null);
          }}
          employeeData={selectedEmployee}
        />
      )}
      <CompetenciesForEmployeeDialog
        isModalOpen={isModalOpen}
        />
    </DashboardLayout>
  );
}

export default EmployeeTables;