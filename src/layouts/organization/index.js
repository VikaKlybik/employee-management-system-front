import DashboardNavbar from "../../examples/Navbars/DashboardNavbar";
import React, { useEffect, useState } from "react";
import MDBox from "../../components/MDBox";
import DashboardLayout from "../../examples/LayoutContainers/DashboardLayout";
import Grid from "@mui/material/Grid";
import MDTypography from "../../components/MDTypography";
import Card from "@mui/material/Card";
import DataTable from "../../examples/Tables/DataTable";
import DepartmentService from "../../services/DepartmentService";
import departmentsTableData from "layouts/tables/data/departmentsTableData";
import OrganizationService from "../../services/OrganizationService";
import MDButton from "../../components/MDButton";
import CreateDepartmentDialog from "../../examples/Modal/CreateDepartmentDialog";
import MDSnackbar from "../../components/MDSnackbar";
import DepartmentInfoDialog from "../../examples/Modal/DepartmentInfoDialog";
import { useLocation, useNavigate } from "react-router-dom";


function Organizations() {
  const navigate = useNavigate();
  const organizationService = new OrganizationService();
  const departmentService = new DepartmentService();
  const location = useLocation();
  const [departments, setDepartments] = useState(null);
  const [tableData, setTableData] = useState({ columns: [], rows: [] });
  const [isAddDepartmentDialogOpen, setIsAddDepartmentDialogOpen] = useState(false);
  const [successSB, setSuccessSB] = useState(false);
  const [errorSB, setErrorSB] = useState(false);
  const openErrorSB = () => setErrorSB(true);
  const closeErrorSB = () => setErrorSB(false);
  const openSuccessSB = () => setSuccessSB(true);
  const closeSuccessSB = () => setSuccessSB(false);
  const isDepartmentInfoModalOpen = location.pathname.includes("/organization/department/");

  const renderSuccessSB = (
    <MDSnackbar
      color="success"
      icon="check"
      title="Инфорамация"
      content="Отдел успешно удалён!"
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
      content="Отдел не может быть удалён, так как там есть активные позиции!"
      open={errorSB}
      onClose={closeErrorSB}
      close={closeErrorSB}
      bgWhite
    />
  );

  const handleViewDepartmentInfo = (id) => {
    navigate(`/organization/department/${id}`);
  };

  const handleDeleteDepartment = (id) => {
    async function deleteDepartment() {
      if (id) {
        try {
          await departmentService.deleteDepartment(id);
          await fetchAllDepartments();
          openSuccessSB();
        } catch (error) {
          openErrorSB();
        }
      }
    }

    deleteDepartment();
  };

  async function fetchAllDepartments() {
    try {
      const response = await organizationService.getOrganizationStructure();
      setDepartments(response.data);
    } catch (_) {
    }
  }

  useEffect(() => {
    fetchAllDepartments();
  }, []);

  useEffect(() => {
    if (departments) {
      const generatedTableData = departmentsTableData(departments, handleDeleteDepartment, handleViewDepartmentInfo);
      setTableData(generatedTableData);
    }
  }, [departments]);

  const handleCreateDepartment = (data) => {
    async function createDepartment() {
      try {
        await departmentService.createDepartment({
          name: data.name,
        });
        await fetchAllDepartments();
        openSuccessSB();
        setIsAddDepartmentDialogOpen(false);
      } catch (error) {
        openErrorSB();
      }
    }

    createDepartment();
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
                  Отделы
                </MDTypography>
                <MDBox sx={{ display: "flex", justifyContent: "space-between", gap: 2 }}>
                  <MDButton color="primary" variant="contained" onClick={() => setIsAddDepartmentDialogOpen(true)}>
                    Добавить новый отдел
                  </MDButton>
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
      <DepartmentInfoDialog
        isModalOpen={isDepartmentInfoModalOpen}
      />
      <CreateDepartmentDialog
        isModalOpen={isAddDepartmentDialogOpen}
        handleCreateDepartment={handleCreateDepartment}
        closeModal={() => setIsAddDepartmentDialogOpen(false)}
      />
    </DashboardLayout>
  );
}

export default Organizations;