// EmployeeSelectionDialog.js
import React, { useEffect, useState } from "react";
import { Button, CardContent, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import KPIService from "../../../services/KPIService";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import Progress from "../../../components/Progress";
import DataTable from "../../Tables/DataTable";
import kpiAssementTableData from "../../../layouts/tables/data/kpiAssementTableData";
import MDBox from "../../../components/MDBox";
import MDTypography from "../../../components/MDTypography";
import MDInput from "../../../components/MDInput";
import MDButton from "../../../components/MDButton";
import { useForm } from "react-hook-form";

export default function KpiAssessmentModal({ isModalOpen }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const kpiService = new KPIService();
  const [kpiData, setKpiData] = useState(null);
  const [tableData, setTableData] = useState({ columns: [], rows: [] });

  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const closeModal = () => {
    navigate(-1); // Go back to the previous route
  };
  useEffect(() => {
    async function fetchKPIById() {
      try {
        const response = await kpiService.getKPIById(id);
        console.log(response.data);
        setKpiData(response.data);
        reset();
      } catch (error) {
        console.log(error);
      }
    }

    fetchKPIById();
  }, [id]);

  useEffect(() => {
    if (kpiData) {
      const myTableData = kpiAssementTableData(kpiData);
      console.log("Generated table data:", myTableData); // Debug log
      setTableData(myTableData);
    }
  }, [kpiData]);

  const handleAddAssessment = async (data) => {
    try {
      await kpiService.addKPIAssessment({
        kpiId: id,
        comments: data.comments,
        actualValue: Number(data.actualValue)
      });
      setKpiData((prev) => ({
        ...prev,
        kpiAssessments: [...prev.kpiAssessments, {
          comments: data.comments,
          actualValue: Number(data.actualValue),
          assessmentDate: createFormattedDate()
        }],
      }));
      reset();
    } catch (error) {
      console.error("Error adding KPI assessment:", error);
    }
  };

  function createFormattedDate() {
    const now = new Date();

    const datePart = now.toISOString().split("Z")[0]; // ISO format without the 'Z'
    const microseconds = String(Math.floor(Math.random() * 1000)).padStart(3, "0"); // Random microseconds

    return `${datePart}${microseconds}`;
  }
  return (
    <Dialog open={isModalOpen} onClose={closeModal} sx={{
      "& .MuiDialog-paper": {
        width: "70%",
        maxWidth: "none",
        height: "100%",
      },
    }}>
      <DialogTitle>KPI История оценок</DialogTitle>
      <DialogContent>
        {kpiData && (
          <Card sx={{ maxWidth: "95%", margin: "10px auto" }}>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                {kpiData.name}
              </Typography>
              <Typography variant="body1" gutterBottom>
                {kpiData.description}
              </Typography>
              <Progress measureUnit={kpiData.measureUnit}
                        actualValue={kpiData.kpiAssessments}
                        targetValue={kpiData.targetValue} />
              <MDBox component="form" sx={{ marginTop: 4 }} role="form" onSubmit={handleSubmit(handleAddAssessment)}>
                <MDTypography variant="h6" gutterBottom>
                  Добавить новую оценку
                </MDTypography>
                <MDInput
                  fullWidth
                  label="Комментарии"
                  margin="normal"
                  {...register("comments", {
                    required: "Комментарии не указаны!.",
                  })}
                  error={Boolean(errors.comments)}
                  helperText={errors.comments ? <span style={{ color: "red" }}>{errors.comments.message}</span> : ""}
                />
                <MDInput
                  fullWidth
                  label="Фактическое значение"
                  type="number"
                  margin="normal"
                  inputProps={{
                    step: kpiData?.measureUnit === 'PERCENT' ? 0.01 : 1,
                  }}
                  {...register("actualValue", {
                    required: "Фактическое значение не указано!",
                    validate: {
                      inRange: (value) =>
                        kpiData?.measureUnit === 'PERCENT' ?
                          (value >= 0 && value <= 100 || "Значение должно быть в диапазоне от 0 до 100!")
                      : (value >= 0 && value <= kpiData.targetValue || `Значение должно быть в диапазоне от 0 до ${kpiData.targetValue}!`
                          ),
                    },
                    isInteger: (value) =>
                      kpiData?.measureUnit === 'COUNT' || Number.isInteger(parseFloat(value)) || "Значение должно быть целым числом!"
                  })}
                  error={Boolean(errors.actualValue)}
                  helperText={errors.actualValue ? <span style={{ color: "red" }}>{errors.actualValue.message}</span> : ""}
                />
                <MDButton
                  variant="contained"
                  color="primary"
                  type="submit"
                  sx={{ marginTop: 2 }}
                >
                  Добавить
                </MDButton>
              </MDBox>
              <Typography variant="h6" sx={{ marginTop: 2 }}>
                Оценки
              </Typography>
              {kpiData?.kpiAssessments && kpiData.kpiAssessments.length !==0 ? (
                <DataTable
                  table={tableData}
                  isSorted={false}
                  entriesPerPage={false}
                  showTotalEntries={false}
                  noEndBorder
                />) : (
                <MDBox align={"center"}>
                  <Typography variant="body2" color="text.secondary">
                    Не найдено :(
                  </Typography>
                </MDBox>
              )}
            </CardContent>
          </Card>
        )}
      </DialogContent>
      <DialogActions>

        <Button color="primary" onClick={closeModal}>
          Закрыть
        </Button>
        {/*<Button onClick={handleConfirmSelection} color="primary" variant="contained">*/}
        {/*  Подтвердить*/}
        {/*</Button>*/}
      </DialogActions>
    </Dialog>
  );
}