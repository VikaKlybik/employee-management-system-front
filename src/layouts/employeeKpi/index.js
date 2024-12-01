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
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import KpiAssessmentModal from "../../examples/Modal/KpiAssesmentDialog";
import { ArrowSelect } from "../../examples/ArrowSelect";

function EmployeeKPITables() {
  const authContext = useAuth();
  const kpiService = new KPIService();
  const employeeService = new EmployeeService();
  const [kpiList, setKpiList] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const [tableData, setTableData] = useState({ columns: [], rows: [] });
  const [kpiPeriods, setKpiPeriods] = useState([]);
  const [selectedKpiPeriod, setSelectedKpiPeriod] = useState();

  const handleMenuItemClick = (item) => {
    console.log("Selected:", item);
    if(item.action === "detail_view") {
      navigate(`/my-kpi/assessment/${item.kpi_id}`);
    }
  };

  const handleDownloadKPI = async () => {
    try {
      const user = authContext.getUser();
      const employeeData = await employeeService.getEmployeeById(user.id);
      const response = await kpiService.getReportForUser(employeeData.data.id, {
        kpiPeriodId: selectedKpiPeriod
      })
      const link = document.createElement('a');
      const url = window.URL.createObjectURL(response.data);
      link.href = url;
      link.download = 'reportKpi.xlsx';  // Укажите имя файла и его расширение
      link.click();

      // Освобождаем ресурсы
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.log(error);
    }
  }

  const isModalOpen = location.pathname.includes("/my-kpi/assessment/");

  useEffect(() => {
    async function fetchAllEmployeeKpi() {
      try {
        const user = authContext.getUser()
        const employee = await employeeService.getEmployeeById(user.id);
        const response = await kpiService.getKPIForEmployee(employee.data.id, {
          kpiPeriodId: selectedKpiPeriod,
        });
        console.log("Fetched kpi data:", response.data); // Debug log
        setKpiList(response.data);
      } catch (error) {
        console.log("Error fetching employee:", error);
      }
    }
    if(selectedKpiPeriod) {
      fetchAllEmployeeKpi();
    }
  }, [selectedKpiPeriod]);

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("ru-RU"); // en-GB sets the format to DD/MM/YYYY
  };

  useEffect(() => {
    async function fetchKPIPeriods() {
      try {
        const response = await kpiService.getKPIPeriods();
        console.log("Fetched kpi data:", response.data); // Debug log
        setKpiPeriods(response.data.map(({ id, startDate, endDate }) => {
          return {
            value: id,
            name: `${formatDate(startDate)} - ${formatDate(endDate)}`,
          };
        }));
      } catch (error) {
        console.log("Error fetching employee:", error);
      }
    }

    fetchKPIPeriods();
  }, []);

  useEffect(() => {
    if (kpiList) {
      const myTableData = kpiTableData(kpiList, handleMenuItemClick);
      console.log("Generated table data:", myTableData);
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
                {kpiPeriods && kpiPeriods.length !== 0 &&
                  <ArrowSelect
                    options={kpiPeriods}
                    handleOptionChange={setSelectedKpiPeriod}
                  />
                }
                <MDButton color="primary" variant="contained" disabled={kpiList?.length === 0} onClick={handleDownloadKPI}>
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
      <Outlet/>
      <KpiAssessmentModal
        isModalOpen={isModalOpen}/>
    </DashboardLayout>
  );
}

export default EmployeeKPITables;