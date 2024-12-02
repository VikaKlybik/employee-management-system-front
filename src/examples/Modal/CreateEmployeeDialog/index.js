// EmployeeSelectionDialog.js
import React, { useEffect, useState } from "react";
import {
  Button,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl, FormHelperText,
  InputLabel, MenuItem, Select,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import MDBox from "../../../components/MDBox";
import MDInput from "../../../components/MDInput";
import MDButton from "../../../components/MDButton";
import { useForm } from "react-hook-form";
import DepartmentService from "../../../services/DepartmentService";

export default function CreateEmployeeDialog({ isModalOpen, closeModal, handleCreateEmployee }) {
  const [departmentList, setDepartmentList] = useState([]);
  const departmentService = new DepartmentService();

  useEffect(() => {
    async function fetchDepartments(){
      try {
        const response = await departmentService.getDepartment();
        setDepartmentList(response.data);
      } catch (error) {
        console.log(error);
      }
    }
    fetchDepartments();
  }, []);

  const { register, watch, handleSubmit, reset, formState: { errors } } = useForm();

  const department = watch("department");

  return (
    <Dialog open={isModalOpen} onClose={closeModal} sx={{
      "& .MuiDialog-paper": {
        width: "70%",
        maxWidth: "none",
        height: "100%",
      },
    }}>
      <DialogTitle>Создание сотрудника</DialogTitle>
      <DialogContent>
        <MDBox sx={{ maxWidth: "95%", margin: "10px auto" }}>
            <MDBox component="form" sx={{ marginTop: 4 }} role="form" onSubmit={handleSubmit(handleCreateEmployee)}>
              <MDInput
                fullWidth
                label="Имя"
                margin="normal"
                {...register("firstName", {
                  required: "Имя не указано!.",
                })}
                error={Boolean(errors.firstName)}
                helperText={errors.firstName ? <span style={{ color: "red" }}>{errors.firstName.message}</span> : ""}
              />
              <MDInput
                fullWidth
                label="Фамилия"
                margin="normal"
                {...register("lastName", {
                  required: "Фамилия не указана!",
                })}
                error={Boolean(errors.lastName)}
                helperText={errors.lastName ?
                  <span style={{ color: "red" }}>{errors.lastName.message}</span> : ""}
              />
              <MDInput
                fullWidth
                label="Почта"
                type={'email'}
                margin="normal"
                {...register("email", {
                  required: "Почта не указана!",
                })}
                error={Boolean(errors.email)}
                helperText={errors.email ?
                  <span style={{ color: "red" }}>{errors.email.message}</span> : ""}
              />
              <MDInput
                fullWidth
                label="Пароль"
                type={'password'}
                margin="normal"
                {...register("password", {
                  required: "Пароль не указан!",
                })}
                error={Boolean(errors.password)}
                helperText={errors.password ?
                  <span style={{ color: "red" }}>{errors.password.message}</span> : ""}
              />
              <FormControl fullWidth margin="normal">
                <InputLabel id="department">Департамент</InputLabel>
                <Select
                  labelId="department"
                  fullWidth
                  displayEmpty
                  margin="normal"
                  value={watch("department") || ""}
                  style={{ paddingTop: "11px", paddingBottom: "11px", marginTop: "2px" }}
                  {...register("department", {
                    required: "Департамент не указан!",
                  })}
                  label="Департамент"

                >
                  {departmentList?.map(dept => (
                    <MenuItem key={dept.id} value={dept.id}>{dept.name}</MenuItem>
                  ))}
                </Select>
                {errors.department && (
                  <FormHelperText error>
                    {errors.department.message}
                  </FormHelperText>
                )}
              </FormControl>
              <FormControl fullWidth margin="normal" disabled={!department} error={Boolean(errors.position)}>
                <InputLabel id="position_create">Позиция</InputLabel>
                <Select
                  labelId="position_create"
                  displayEmpty
                  fullWidth
                  sx={{ pt: 1.5, pb: 1.5, mt: 0.5 }}
                  value={watch("position") || ""}
                  {...register("position", {
                    required: "Позиция не указана!",
                  })}
                  label="Позиция"
                >
                  {department &&
                    departmentList
                      ?.filter((item) => item.id === department)
                      .map((dept) =>
                        dept.jobs?.map((job) => (
                          <MenuItem key={job.id} value={job.id}>
                            {job.name}
                          </MenuItem>
                        ))
                      )}
                </Select>
                {errors.position && (
                  <FormHelperText error>
                    {errors.position.message}
                  </FormHelperText>
                )}
              </FormControl>

              <MDButton
                variant="contained"
                color="primary"
                type="submit"
                sx={{ marginTop: 2 }}
              >
                Добавить
              </MDButton>
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