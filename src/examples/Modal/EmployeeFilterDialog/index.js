import React, { useEffect, useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";
import DepartmentService from "../../../services/DepartmentService";
import MDButton from "../../../components/MDButton";
import IconButton from "@mui/material/IconButton";

export default function EmployeeFilterDialog({ open, onClose, searchParam, setSearchParam, resetFilter }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedPosition, setSelectedPosition] = useState("");
  const [departments, setDepartments] = useState([]);

  const departmentService = new DepartmentService();

  useEffect(() => {
    async function fetchDepartment() {
      try {
        const response = await departmentService.getDepartment();
        setDepartments(response.data);
      } catch (error) {
        console.log(error);
      }
    }

    fetchDepartment();
  }, []);

  useEffect(() => {
    setSearchQuery(searchParam?.search || "")
    setSelectedDepartment(searchParam?.departmentId || "")
    setSelectedPosition(searchParam?.jobTitleId || "")
  }, [searchParam]);

  const closeDialog = () => {
    setSelectedDepartment("");
    setSelectedPosition("");
    setSearchQuery("");
    onClose();
  };

  const handleFilter = () => {
    setSearchParam({
      search: searchQuery || null,
      departmentId: selectedDepartment || null,
      jobTitleId: selectedPosition || null
    })
    onClose();
  }

  return (
    <Dialog open={open} onClose={closeDialog} sx={{
      "& .MuiDialog-paper": {
        width: "50%",
        maxWidth: "none",
        height: "50%",
      },
    }}>
      <DialogTitle>Выбрать сотрудников</DialogTitle>
      <DialogContent>
        <TextField
          label="Поиск"
          variant="outlined"
          fullWidth
          margin="normal"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <FormControl fullWidth margin="normal">
          <InputLabel id="department">Департамент</InputLabel>
          <Select
            labelId="department"
            fullWidth
            displayEmpty
            margin="normal"
            style={{ paddingTop: "11px", paddingBottom: "11px", marginTop: "2px" }}
            value={selectedDepartment}
            label="Департамент"
            onChange={(e) => setSelectedDepartment(e.target.value)}
          >
            {departments?.map(dept => (
              <MenuItem key={dept.id} value={dept.id}>{dept.name}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl fullWidth margin="normal" disabled={!selectedDepartment}>
          <InputLabel id="position">Позиция</InputLabel>
          <Select
            labelId="position"
            fullWidth
            displayEmpty
            margin="normal"
            style={{ paddingTop: "11px", paddingBottom: "11px", marginTop: "2px" }}
            value={selectedPosition}
            label="Позиция"
            onChange={(e) => setSelectedPosition(e.target.value)}
          >
            {selectedDepartment &&
              departments.filter((item) => item.id === selectedDepartment).at(0)?.jobs?.map(job => (
                <MenuItem key={job.id} value={job.id}>{job.name}</MenuItem>
              ))
            }
          </Select>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={closeDialog} color="info">
          Закрыть
        </Button>
        <MDButton color="info" variant="contained" onClick={handleFilter}>
          Фильтровать
        </MDButton>
        {(searchParam.departmentId || searchParam.search || searchParam.jobTitleId) && (
          <IconButton
            onClick={resetFilter}
            sx={{
              color: "primary.main", // Цвет иконки (можно настроить)
              backgroundColor: "transparent", // Без фона
              "&:hover": {
                backgroundColor: "rgba(0, 0, 0, 0.04)", // Лёгкий фон при наведении (можно убрать)
              },
            }}
          >
            <ClearIcon />
          </IconButton>
        )}
      </DialogActions>
    </Dialog>
  );
}
