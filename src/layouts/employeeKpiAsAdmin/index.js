import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import React, { useEffect, useState } from "react";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import MDBox from "components/MDBox";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import MDTypography from "components/MDTypography";
import DataTable from "examples/Tables/DataTable";
import kpiTableData from "../tables/data/kpiTableData";
import KPIService from "../../services/KPIService";
import MDButton from "../../components/MDButton";
import { Outlet, useLocation, useNavigate, useParams } from "react-router-dom";
import KpiAssessmentModalAsAdmin from "../../examples/Modal/KpiAssesmentDialogAsAdmin";
import { ArrowSelect } from "../../examples/ArrowSelect";
import KPICreationDialog from "../../examples/Modal/KPICreationDialog";
import MDSnackbar from "../../components/MDSnackbar";
import { useAuth } from "../../context/AuthContext";

function EmployeeKPITables() {
  const kpiService = new KPIService();
  const [kpiList, setKpiList] = useState();
  const [kpiPeriods, setKpiPeriods] = useState([]);
  const [selectedKpiPeriod, setSelectedKpiPeriod] = useState();
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();
  const [isKPICreationDialogOpen, setIsKPICreationDialogOpen] = useState(false);
  const [tableData, setTableData] = useState({ columns: [], rows: [] });
  const [newKpiList, setNewKpiList] = useState([]);
  const handleMenuItemClick = (item) => {
    console.log("Selected:", item);
    if (item.action === "detail_view") {
      navigate(`/kpi/for-employee/${id}/assessment/${item.kpi_id}`);
    }
  };
  const isModalOpen = location.pathname.includes(`/kpi/for-employee/${id}/assessment/`);

  const [successSB, setSuccessSB] = useState(false);
  const [errorSB, setErrorSB] = useState(false);
  const openErrorSB = () => setErrorSB(true);
  const closeErrorSB = () => setErrorSB(false);
  const openSuccessSB = () => setSuccessSB(true);
  const closeSuccessSB = () => setSuccessSB(false);
  const [message, setMessage] = useState("");
  const auth = useAuth();
  const user = auth.getUser();

  const renderSuccessSB = (
    <MDSnackbar
      color="success"
      icon="check"
      title="Инфорамация"
      content={message}
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
      content={message}
      open={errorSB}
      onClose={closeErrorSB}
      close={closeErrorSB}
      bgWhite
    />
  );

  async function fetchAllEmployeeKpi() {
    try {
      const response = await kpiService.getKPIForEmployee(id, {
        kpiPeriodId: selectedKpiPeriod,
      });
      console.log("Fetched kpi data:", response.data); // Debug log
      setKpiList(response.data);
    } catch (error) {
      console.log("Error fetching employee:", error);
    }
  }

  useEffect(() => {
    if (id && selectedKpiPeriod) {
      fetchAllEmployeeKpi();
    }
  }, [id, selectedKpiPeriod]);

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

  const handleNewKpiCreate = () => {
    async function createKPIs() {
      try {
        const response = await kpiService.createKPIs(
          newKpiList.map((item) => {
            return {
              ...item,
              employeeId: id,
              kpiPeriodId: selectedKpiPeriod,
            };
          }),
        );
        fetchAllEmployeeKpi();
        setIsKPICreationDialogOpen(false);
        setMessage("KPI успешно выставлены!");
        openSuccessSB();
        setNewKpiList([])
      } catch (error) {
        setMessage("Попробуйти позже или обратитесь в поддержку!");
        openErrorSB();
      }
    }

    createKPIs();
  };

  const handleDownloadKPI = async () => {
    try {
      const response = await kpiService.getReportForUser(id, {
        kpiPeriodId: selectedKpiPeriod,
      });
      const link = document.createElement("a");
      const url = window.URL.createObjectURL(response.data);
      link.href = url;
      link.download = "reportKpi.xlsx";  // Укажите имя файла и его расширение
      link.click();

      // Освобождаем ресурсы
      window.URL.revokeObjectURL(url);
      setMessage("Отчёт отобразиться в скаченных файлах!");
      openSuccessSB();
    } catch (error) {
      setMessage("Попробуйти позже или обратитесь в поддержку!");
      openErrorSB();
    }
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
                  KPI
                </MDTypography>
                {kpiPeriods && kpiPeriods.length !== 0 &&
                  <ArrowSelect
                    options={kpiPeriods}
                    handleOptionChange={setSelectedKpiPeriod}
                  />
                }
                <MDBox>
                  {user.role === "admin" && (
                    <MDButton sx={{ mx: "2px" }} color="success" disabled={kpiList?.length !== 0} variant="contained"
                              onClick={() => setIsKPICreationDialogOpen(true)}>
                      Выставить KPI
                    </MDButton>
                  )}
                  <MDButton sx={{ mx: "2px" }} color="primary" disabled={kpiList?.length === 0} variant="contained"
                            onClick={handleDownloadKPI}>
                    Выгрузить отчёт
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
      <Outlet />
      {renderErrorSB}
      {renderSuccessSB}
      <KpiAssessmentModalAsAdmin
        isModalOpen={isModalOpen} />
      <KPICreationDialog
        open={isKPICreationDialogOpen}
        onClose={() => setIsKPICreationDialogOpen(false)}
        kpiList={newKpiList}
        setKpiList={setNewKpiList}
        handleCreate={handleNewKpiCreate}
      />
    </DashboardLayout>
  );
}

export default EmployeeKPITables;