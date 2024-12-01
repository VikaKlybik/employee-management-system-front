import DashboardNavbar from "../../../examples/Navbars/DashboardNavbar";
import React, { useEffect, useState } from "react";
import DashboardLayout from "../../../examples/LayoutContainers/DashboardLayout";
import MDBox from "../../../components/MDBox";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import MDTypography from "../../../components/MDTypography";
import MDButton from "../../../components/MDButton";
import SurveyService from "../../../services/SurveyService";
import { Container } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EmployeeSelectionDialog from "../../../examples/Modal/EmployeeSelectionDialog";
import DataTable from "../../../examples/Tables/DataTable";
import evaluatorsTableData from "../../tables/data/evaluatorsTableData";
import EmployeeEvaluatorsSelectionDialog from "../../../examples/Modal/EmployeeEvaluatorsSelectionDialog";
import EmployeeService from "../../../services/EmployeeService";
import { useNavigate, useParams } from "react-router-dom";


function SurveyEvaluators() {

  const { id } = useParams();
  const surveyService = new SurveyService();
  const employeeService = new EmployeeService();
  const [rows, setRows] = useState([{ id: Date.now(), evaluated: null, evaluatorsEmp: [] }]);
  const [openDialog, setOpenDialog] = useState(false);
  const [openEvaluatorDialog, setOpenEvaluatorDialog] = useState(false);
  const [activeRowId, setActiveRowId] = useState(null);
  const [tableData, setTableData] = useState({ columns: [], rows: [] });
  const [alreadySelectedEmployee, setAlreadySelectedEmployee] = useState([]);
  const [surveyData, setSurveyData] = useState(null);
  const navigate = useNavigate();

  useEffect( () => {
    async function fetchSurveyData() {
      try {
        const response = await surveyService.getSurveyById(id);
        setSurveyData(response.data);
      } catch (error) {
        console.log(error);
      }
    }

    fetchSurveyData();
  }, [id]);

  useEffect(() => {
    if (rows) {
      const myTableData = evaluatorsTableData(rows, handleDeleteRow, handleDialogOpen, handleOpenEvaluatorsDialog, handleDeleteEvaluators);
      console.log("Generated table data:", myTableData); // Debug log
      setTableData(myTableData);
    }
  }, [rows]);


  const handleAddRow = () => {
    setRows([...rows, { id: Date.now(), evaluated: null, evaluatorsEmp: [] }]);
  };

  const handleDeleteRow = (rowId) => {
    setRows(rows.filter(row => row.id !== rowId));
  };

  const handleDialogOpen = (rowId) => {
    setActiveRowId(rowId);
    setOpenDialog(true);
  };

  const handleOpenEvaluatorsDialog = (rowId) => {
    setActiveRowId(rowId);
    setAlreadySelectedEmployee(rows.find(row => row.id === rowId).evaluatorsEmp);
    setOpenEvaluatorDialog(true);
  };

  const handleEvaluatorsDialogClose = () => {
    setOpenEvaluatorDialog(false);
    setActiveRowId(null);
    setAlreadySelectedEmployee([]);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
    setActiveRowId(null);
  };

  const handleSelectEmployees = async (selectedEmployees) => {
    // setRows(rows.map(row =>
    //   row.id === activeRowId ? { ...row, evaluated: selectedEmployees } : row,
    // ));

    async function fetchGeneratedEvaluators() {
      try {
        const response = await employeeService.generateDefaultEvaluators({
          userId: selectedEmployees.user.id,
          method: surveyData.evaluationMethod,
        });
        console.log(response);
        setRows(rows.map(row =>
          row.id === activeRowId ? { ...row, evaluated: selectedEmployees, evaluatorsEmp: response.data } : row,
        ));
      } catch (error) {
        console.log(error);
      }
    }

    fetchGeneratedEvaluators();
  };

  const handleSelectEvaluator = (selectedEvaluators) => {
    setRows(rows.map(row =>
      row.id === activeRowId ? { ...row, evaluatorsEmp: selectedEvaluators } : row,
    ));
  };

  const handleDeleteEvaluators = (rowId, id) => {
    const evaluatorRow = rows.filter(item => item.id === rowId).at(0);
    if (evaluatorRow) {
      evaluatorRow.evaluatorsEmp = evaluatorRow.evaluatorsEmp.filter(emp => emp.id !== id);
    }
    setRows(rows.map(row =>
      row.id === rowId ? { ...row, evaluatorsEmp: evaluatorRow.evaluatorsEmp } : row,
    ));
  };

  const sendRequestToCreateEvaluators = async () => {
    async function setEvaluators() {
      try {
        const response = await surveyService.setEvaluators({
          surveyId: id,
          passing: rows.map(row => {
            return {
              evaluatedId: row.evaluated.user.id,
              evaluatorIds: row.evaluatorsEmp.map(evaluator => evaluator.user.id)
            };
          }),
        });
        surveyService.sendNotifyMessage(id)
        console.log(response);
        navigate("/survey");
      } catch (error) {
        console.log(error);
      }
    }

    setEvaluators();
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
              >
                <MDTypography variant="h6" color="white">
                  Распределение оценщиков
                </MDTypography>
              </MDBox>
              <MDBox>
                <MDBox
                  mx={2}
                  py={3}
                  px={2}
                >
                  <Container>
                    <h1>Таблица с оценкой сотрудников</h1>
                    <DataTable
                      table={tableData}
                      isSorted={false}
                      entriesPerPage={false}
                      showTotalEntries={false}
                      noEndBorder
                    />
                    <MDButton
                      variant="contained"
                      startIcon={<AddIcon />}
                      onClick={handleAddRow}
                      style={{ marginTop: "16px" }}
                    >
                      Добавить строку
                    </MDButton>

                    {/* Модальное окно для выбора сотрудника */}
                    {(rows && rows.length !== 0 &&
                      <EmployeeSelectionDialog
                        open={openDialog}
                        onClose={handleDialogClose}
                        onSelect={handleSelectEmployees}
                      />)}
                    <EmployeeEvaluatorsSelectionDialog
                      open={openEvaluatorDialog}
                      onClose={handleEvaluatorsDialogClose}
                      onSelect={handleSelectEvaluator}
                      alreadySelectedEmployee={alreadySelectedEmployee}
                    />
                  </Container>

                  <Grid container spacing={3} style={{ marginTop: "10px" }}>
                    <Grid item xs={12} md={6} lg={3}>
                      <MDButton variant="contained" color="info" fullWidth onClick={sendRequestToCreateEvaluators}>
                        Сохранить
                      </MDButton>
                    </Grid>
                  </Grid>
                </MDBox>
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>
    </DashboardLayout>
  );
}

export default SurveyEvaluators;