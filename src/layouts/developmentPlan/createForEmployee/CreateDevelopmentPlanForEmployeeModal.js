// EmployeeSelectionDialog.js
import React, { useEffect, useState } from "react";
import {
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  InputLabel,
  Select,
} from "@mui/material";
import MDBox from "../../../components/MDBox";
import DataTable from "../../../examples/Tables/DataTable";
import MDButton from "../../../components/MDButton";
import SurveyService from "../../../services/SurveyService";
import DevelopmentPlanData from "./data/DevelopmentPlanData";
import MenuItem from "@mui/material/MenuItem";
import { useForm } from "react-hook-form";
import DevelopmentPlanService from "../../../services/DevelopmentPlanService";
import TextField from "@mui/material/TextField";


export default function CreateDevelopmentPlanForEmployeeModal({ isModalOpen, onClose, surveyId, employeeId }) {
  // const kpiService = new KPIService();
  // const [kpiData, setKpiData] = useState(null);
  // const [tableData, setTableData] = useState({ columns: [], rows: [] });
  const developmentPlanService = new DevelopmentPlanService();
  const surveyService = new SurveyService();
  const [competencies, setCompetencies] = useState([]);
  const [rows, setRows] = useState([]);
  const [tableData, setTableData] = useState({ columns: [], rows: [] });
  const [surveyData, setSurveyData] = useState(null);
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  useEffect(() => {
    async function fetchCompetencies() {
      try {
        const response = await surveyService.getUniqueCompetencyForSurveyById(surveyId);
        setCompetencies(response.data);
      } catch (error) {
        console.log(error);
      }
    }

    fetchCompetencies();
  }, [surveyId]);

  useEffect(() => {
    async function fetchDevelopmentPlanService() {
      const response = await developmentPlanService.getDevelopmentPlansForEmployee({
        surveyId: surveyId,
        userId: employeeId,
      });
      setRows(response.data);
    }

    if (surveyId && employeeId) {
      fetchDevelopmentPlanService();
    }
  }, [surveyId, employeeId]);

  const closeModal = () => {
    onClose();
  };

  const handleCreateDevelopmentPlan = async (data) => {
    try {
      const response = await developmentPlanService.addDevelopmentPlan({
        goal: data.goal,
        comments: data.comments,
        competencyId: data.competencyId,
        employeeUserId: employeeId,
        surveyId: surveyId,
      });
      setRows([...rows, response.data]);

    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (rows) {
      const myTableData = DevelopmentPlanData(rows, updateStatus);
      console.log("Generated table data:", myTableData); // Debug log
      setTableData(myTableData);
    }
  }, [rows]);

  const updateStatus = async (status, selectedDevelopmentId) => {
    try {
      const response = await developmentPlanService.updateStatus({
        developmentPlanId: selectedDevelopmentId,
        developmentStatus: status,
      });

      setRows((prevRows) =>
        prevRows.map((item) => {
          if (item.id !== selectedDevelopmentId) {
            return item; // Если это не тот элемент, возвращаем его без изменений
          }
          return { ...item, ...response.data }; // Если это тот элемент, обновляем его данными из ответа
        })
      );
    } catch (error) {
      console.log(error);
    }
  };


  return (
    <Dialog open={isModalOpen} onClose={closeModal} sx={{
      "& .MuiDialog-paper": {
        width: "90%",
        maxWidth: "none",
        height: "100%",
      },
    }}>
      <DialogTitle>План развития</DialogTitle>
      <DialogContent>
        <MDBox>
          <MDBox
            mx={2}
            py={3}
            px={2}
          >
            <Container>
              <h1>Таблица с планом развития</h1>
              <DataTable
                table={tableData}
                isSorted={false}
                entriesPerPage={false}
                showTotalEntries={false}
                noEndBorder
              />
            </Container>
            <MDBox
              mx={2}
              py={3}
              px={2}
              role="form"
              component="form"
              onSubmit={handleSubmit(handleCreateDevelopmentPlan)}
            >
              <TextField
                fullWidth
                label="Цель"
                margin="normal"
                {...register("goal", {
                  required: "Цель не указана!.",
                })}
                error={Boolean(errors.goal)}
                helperText={errors.goal ? <span style={{ color: "red" }}>{errors.goal.message}</span> : ""}
              />
              <TextField
                fullWidth
                label="Комментарии"
                type="text"
                margin="normal"
                {...register("comments")}
              />
              <InputLabel id="development_plan_competency">Вид опроса</InputLabel>
              <Select
                labelId="development_plan_competency"
                fullWidth
                displayEmpty
                margin="normal"
                style={{ paddingTop: "10px", paddingBottom: "10px", marginTop: "2px" }}
                {...register("competencyId", {
                  required: "Компетенция не выбрана!.",
                })}
                error={Boolean(errors.competencyId)}
                helperText={errors.competencyId ? <span style={{ color: "red" }}>{errors.competencyId.message}</span> : ""}
              >
                {competencies?.map(({ id, name }) => (
                  <MenuItem key={id} value={id}>
                    {name}
                  </MenuItem>
                ))}

              </Select>
              <MDBox mt={2}>
                <MDButton variant="contained" type={"submit"} color="info" fullWidth>
                  Сохранить
                </MDButton>
              </MDBox>
            </MDBox>
          </MDBox>
        </MDBox>
      </DialogContent>
      <DialogActions>

        <Button color="primary" onClick={closeModal}>
          Закрыть
        </Button>
      </DialogActions>
    </Dialog>
  );
}