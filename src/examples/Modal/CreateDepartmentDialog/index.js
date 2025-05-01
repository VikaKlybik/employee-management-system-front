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

export default function CreateDepartmentDialog({ isModalOpen, closeModal, handleCreateDepartment }) {

  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  useEffect(() => {
    reset()
  }, [isModalOpen]);

  return (
    <Dialog open={isModalOpen} onClose={closeModal} sx={{
      "& .MuiDialog-paper": {
        width: "50%",
        maxWidth: "none",
        height: "45%",
      },
    }}>
      <DialogTitle>Создание отдела</DialogTitle>
      <DialogContent>
        <MDBox sx={{ maxWidth: "95%", margin: "10px auto" }}>
            <MDBox component="form" sx={{ marginTop: 4 }} role="form" onSubmit={handleSubmit(handleCreateDepartment)}>
              <MDInput
                fullWidth
                label="Имя"
                margin="normal"
                {...register("name", {
                  required: "Название не указано!.",
                })}
                error={Boolean(errors.name)}
                helperText={errors.name ? <span style={{ color: "red" }}>{errors.name.message}</span> : ""}
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