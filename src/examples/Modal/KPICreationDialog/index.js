import React, { useEffect, useRef, useState } from "react";
import {
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import MDButton from "../../../components/MDButton";
import KPIServices from "../../../services/KPIService";
import DataTable from "../../Tables/DataTable";
import MDBox from "../../../components/MDBox";
import { useForm } from "react-hook-form";
import KpiRowsData from "./data/KpiRowsData";

export default function KPICreationDialog({kpiList, setKpiList,  open, onClose, handleCreate }) {
  const { register, setValue, trigger, handleSubmit, reset, watch, formState: { errors } } = useForm();
  const kpiService = new KPIServices();
  const maxWeight = 100;
  const [totalWeight, setTotalWeight] = useState(0);
  const measureUnit = watch("measureUnit");
  const [tableData, setTableData] = useState({
    columns: [],
    rows: [],
  });
  const handleAddDevelopmentPlan = (data) => {
    setKpiList([...kpiList, {
      id: Date.now(),
      name: data.name,
      description: data.description,
      measureUnit: data.measureUnit,
      targetValue: Number(data.targetValue),
      weight: Number(data.weight),
    }]);
    setTotalWeight(totalWeight + Number(data.weight));
    reset();
  };

  useEffect(() => {
    setTableData({
      columns: [],
      rows: [],
    })
    setTotalWeight(0)
    reset();
    setKpiList([])
  }, [open]);

  useEffect(() => {
    if (kpiList) {
      setTableData(KpiRowsData(kpiList, handleDeleteRow));
    }
  }, [kpiList]);

  const handleDeleteRow = (rowId) => {
    const deletedItem = kpiList.some(row => row.id !== rowId);
    setTotalWeight(totalWeight - deletedItem.weight);
    setKpiList(kpiList.filter(row => row.id !== rowId));
  };
  useEffect(() => {

    setValue("weight", "", { shouldValidate: false });
    // trigger("weight");
  }, [totalWeight, setValue, trigger]);

  return (
    <Dialog open={open} onClose={onClose} sx={{
      "& .MuiDialog-paper": {
        width: "90%",
        maxWidth: "none",
        height: "100%",
      },
    }}>
      <DialogTitle>Выставление KPI</DialogTitle>
      <DialogContent>
        <MDBox>
          <MDBox
            mx={2}
            py={3}
            px={2}
          >
            <Container>
              <h1>Таблица c KPI</h1>
              <DataTable
                table={tableData}
                isSorted={false}
                entriesPerPage={false}
                showTotalEntries={false}
                noEndBorder
              />

              {totalWeight !== maxWeight && (
                <MDBox
                  mx={2}
                  py={3}
                  px={2}
                  role="form"
                  component="form"
                  onSubmit={handleSubmit(handleAddDevelopmentPlan)}
                >
                  <TextField
                    fullWidth
                    label="Цель"
                    margin="normal"
                    {...register("name", {
                      required: "Цель не указана!.",
                    })}
                    error={Boolean(errors.name)}
                    helperText={errors.name ? <span style={{ color: "red" }}>{errors.name.message}</span> : ""}
                  />
                  <TextField
                    fullWidth
                    label="KPI"
                    type="text"
                    margin="normal"
                    {...register("description", {
                      required: "KPI не указана!.",
                    })}
                    error={Boolean(errors.description)}
                    helperText={errors.description ?
                      <span style={{ color: "red" }}>{errors.description.message}</span> : ""}
                  />
                  <InputLabel id="measureUnit">Единица измерения</InputLabel>
                  <Select
                    labelId="measureUnit"
                    fullWidth
                    displayEmpty
                    margin="normal"
                    style={{ paddingTop: "10px", paddingBottom: "10px", marginTop: "2px" }}
                    {...register("measureUnit", {
                      required: "Единица измерения не выбрана!.",
                    })}
                    error={Boolean(errors.measureUnit)}
                    helperText={errors.measureUnit ?
                      <span style={{ color: "red" }}>{errors.measureUnit.message}</span> : ""}
                  >
                    <MenuItem value={"PERCENT"}>Проценты</MenuItem>
                    <MenuItem value={"COUNT"}>Количество</MenuItem>
                  </Select>
                    <TextField
                      fullWidth
                      label="Плановое значение"
                      type="number"
                      margin="normal"
                      disabled={!measureUnit}
                      {...register("targetValue", {
                        required: "Плановое значение не указано!.",
                        // For 'COUNT', remove min/max restrictions if needed
                        min: measureUnit === 'PERCENT' ? {
                          value: 0,
                          message: "Плановое значение не может быть меньше 0!"
                        } : undefined,
                        max: measureUnit === 'PERCENT' ? {
                          value: 100,
                          message: "Плановое значение не может быть больше 100!"
                        } : undefined,
                        // For 'COUNT', remove min/max restrictions if needed
                        min: measureUnit === 'COUNT' ? {
                          value: 1,
                          message: "Плановое значение должно быть больше 0!"
                        } : undefined
                      })}
                      error={Boolean(errors.targetValue)}
                      helperText={errors.targetValue ?
                        <span style={{ color: "red" }}>{errors.targetValue.message}</span> : ""}
                    />
                  <TextField
                    fullWidth
                    label="Вес"
                    type="number"
                    margin="normal"
                    {...register("weight", {
                      required: "Вес не указан!.",
                      min: {
                        value: 1,
                        message: "Вес должен быть больше или равен 1!",
                      },
                      max: {
                        value: (maxWeight - totalWeight) < 0 ? 0 : maxWeight - totalWeight,
                        message: `Вес не может превышать ${(maxWeight - totalWeight) < 0 ? 0 : maxWeight - totalWeight}!`,
                      },
                    })}
                    error={Boolean(errors.weight)}
                    helperText={errors.weight ? <span style={{ color: "red" }}>{errors.weight.message}</span> : ""}
                  />
                  <MDBox mt={2}>
                    <MDButton variant="contained" type={"submit"} color="info" fullWidth>
                      Сохранить
                    </MDButton>
                  </MDBox>
                </MDBox>
              )}
            </Container>
          </MDBox>
        </MDBox>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="info">
          Закрыть
        </Button>
        <MDButton onClick={handleCreate} color="info" variant="contained" disabled={maxWeight!==totalWeight}>
          Подтвердить
        </MDButton>
      </DialogActions>
    </Dialog>
  );
}
