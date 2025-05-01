import DashboardNavbar from "../../examples/Navbars/DashboardNavbar";
import React, { useEffect, useState } from "react";
import MDBox from "../../components/MDBox";
import DashboardLayout from "../../examples/LayoutContainers/DashboardLayout";
import Grid from "@mui/material/Grid";
import MDTypography from "../../components/MDTypography";
import Card from "@mui/material/Card";
import DataTable from "../../examples/Tables/DataTable";
import DepartmentService from "../../services/DepartmentService";
import departmentsTableData from "layouts/tables/data/departmentsTableDataForEmploee";
import OrganizationService from "../../services/OrganizationService";
import DepartmentInfoDialog from "../../examples/Modal/DepartmentInfoDialog";
import { useLocation, useNavigate } from "react-router-dom";
import DepartmentInfoDialogForEmployee from "../../examples/Modal/DepartmentInfoDialogForEmployee";


function OrganizationsForEmployee() {
  const navigate = useNavigate();
  const organizationService = new OrganizationService();
  const departmentService = new DepartmentService();
  const location = useLocation();
  const [departments, setDepartments] = useState(null);
  const [tableData, setTableData] = useState({ columns: [], rows: [] });
  const isDepartmentInfoModalOpen = location.pathname.includes("/organization-for-employee/department/");

  const handleViewDepartmentInfo = (id) => {
    navigate(`/organization-for-employee/department/${id}`);
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
      const generatedTableData = departmentsTableData(departments, handleViewDepartmentInfo);
      setTableData(generatedTableData);
    }
  }, [departments]);

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
      <DepartmentInfoDialogForEmployee
        isModalOpen={isDepartmentInfoModalOpen}
      />
    </DashboardLayout>
  );
}

export default OrganizationsForEmployee;