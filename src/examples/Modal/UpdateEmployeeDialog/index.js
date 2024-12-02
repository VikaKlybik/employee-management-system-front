// EmployeeSelectionDialog.js
import React, { useEffect, useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import MDBox from "../../../components/MDBox";
import MDInput from "../../../components/MDInput";
import MDButton from "../../../components/MDButton";
import { useForm } from "react-hook-form";
import DepartmentService from "../../../services/DepartmentService";

export default function UpdateEmployeeDialog({ isModalOpen, closeModal, handleUpdateEmployee, employeeData }) {
  const [departmentList, setDepartmentList] = useState([]);
  const departmentService = new DepartmentService();

  useEffect(() => {
    async function fetchDepartments() {
      try {
        const response = await departmentService.getDepartment();
        setDepartmentList(response.data);
      } catch (error) {
        console.log(error);
      }
    }

    fetchDepartments();
  }, []);

  const { register, control , watch, handleSubmit, reset, formState: { errors } } = useForm({
      defaultValues: {
        firstName: employeeData?.user?.firstName,
        lastName: employeeData?.user?.lastName,
        email: employeeData?.user?.email,
        department: employeeData?.department?.id,
        position: employeeData?.jobTitle?.id,
      },
    },
  );


  useEffect(() => {
    if (employeeData && departmentList.length > 0) {
      reset({
        firstName: employeeData?.user?.firstName || "",
        lastName: employeeData?.user?.lastName || "",
        email: employeeData?.user?.email || "",
        department: employeeData.department.id,
        position: employeeData.jobTitle.id,
      });
    }
  }, [employeeData, departmentList, reset]);


  const department = watch("department");

  return (
    <Dialog open={isModalOpen} onClose={closeModal} sx={{
      "& .MuiDialog-paper": {
        width: "70%",
        maxWidth: "none",
        height: "100%",
      },
    }}
            disableEnforceFocus
            disableAutoFocus>
      <DialogTitle>Редактирование сотрудника</DialogTitle>
      <DialogContent>
        <MDBox sx={{ maxWidth: "95%", margin: "10px auto" }}>
          <MDBox component="form" sx={{ marginTop: 4 }} role="form" onSubmit={handleSubmit(handleUpdateEmployee)}>
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
              type={"email"}
              margin="normal"
              {...register("email", {
                required: "Почта не указана!",
              })}
              error={Boolean(errors.email)}
              helperText={errors.email ?
                <span style={{ color: "red" }}>{errors.email.message}</span> : ""}
            />
            <FormControl fullWidth margin="normal">
              <InputLabel id="department">Департамент</InputLabel>
              <Select
                labelId="department"
                fullWidth
                displayEmpty
                margin="normal"
                control={control}
                style={{ paddingTop: "11px", paddingBottom: "11px", marginTop: "2px" }}
                value={watch("department") || ""}
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
              <InputLabel id="position">Позиция</InputLabel>
              <Select
                labelId="position"
                displayEmpty
                fullWidth
                control={control}
                sx={{ pt: 1.5, pb: 1.5, mt: 0.5 }}
                value={watch("position") || ""}
                {...register("position", {
                  required: "Позиция не указана!",
                })}
                label="Позиция"
              >
                {department &&
                  departmentList
                    ?.find((item) => item.id === department)?.jobs?.length > 0 &&
                  departmentList
                    ?.find((item) => item.id === department)
                    ?.jobs?.map((job) => (
                    <MenuItem key={job.id} value={job.id}>
                      {job.name}
                    </MenuItem>
                  ))}
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
              Обновить
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