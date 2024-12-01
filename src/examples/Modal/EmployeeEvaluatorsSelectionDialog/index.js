import React, { useEffect, useState } from "react";
import {
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  List,
  ListItem,
  ListItemText,
  MenuItem,
  Select,
  TextField,
  IconButton,
} from "@mui/material";
import { ArrowBack, ArrowForward } from "@mui/icons-material";
import DepartmentService from "../../../services/DepartmentService";
import EmployeeService from "../../../services/EmployeeService";
import MDButton from "../../../components/MDButton";

export default function EmployeeEvaluatorsSelectionDialog({ open, onClose, onSelect, alreadySelectedEmployee }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedPosition, setSelectedPosition] = useState("");
  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [employees, setEmployees] = useState([]);
  const employeesPerPage = 5;

  const departmentService = new DepartmentService();
  const employeeService = new EmployeeService();

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
    setSelectedEmployees([...alreadySelectedEmployee]);
  }, [alreadySelectedEmployee]);


  useEffect(() => {
    async function fetchEmployee() {
      try {
        const response = await employeeService.getEmployee({
          jobTitleId: selectedPosition || null,
          departmentId: selectedDepartment || null,
          search: searchQuery || null,
        });
        setEmployees(response.data);
      } catch (error) {
        console.log(error);
      }
    }
    fetchEmployee();
  }, [searchQuery, selectedPosition, selectedDepartment]);

  const handleSelectEmployee = (employee) => {
    setSelectedEmployees((prevSelected) =>
      prevSelected.includes(employee)
        ? prevSelected.filter((emp) => emp !== employee)
        : [...prevSelected, employee]
    );
  };

  const handleConfirmSelection = () => {
    onSelect(selectedEmployees);
    closeDialog();
  };

  const closeDialog = () => {
    setSelectedDepartment("");
    setSelectedPosition("");
    setSearchQuery("");
    setSelectedEmployees([]);
    onClose();
  };

  const totalPages = Math.ceil(employees.length / employeesPerPage);

  const handlePreviousPage = () => {
    if (currentPage > 0) setCurrentPage((prev) => prev - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages - 1) setCurrentPage((prev) => prev + 1);
  };

  const paginatedEmployees = employees.slice(
    currentPage * employeesPerPage,
    currentPage * employeesPerPage + employeesPerPage,
  );

  return (
    <Dialog open={open} onClose={onClose} sx={{
      "& .MuiDialog-paper": {
        width: "50%",
        maxWidth: "none",
        height: "100%",
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
        <List>
          {paginatedEmployees.map(emp => (
            <ListItem key={emp.id}>
              <Checkbox
                checked={selectedEmployees.some((selectedEmp) => selectedEmp.id === emp.id)}
                onChange={() => handleSelectEmployee(emp)}
              />
              <ListItemText
                primary={`${emp?.user?.lastName} ${emp?.user?.firstName}`}
                secondary={`${emp?.department?.name}/${emp?.jobTitle?.name}`}
                primaryTypographyProps={{ fontSize: "13px", fontWeight: "bold" }}
                secondaryTypographyProps={{ fontSize: "12px", color: "text.secondary" }}
              />
            </ListItem>
          ))}
        </List>
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", marginTop: "10px" }}>
          <IconButton onClick={handlePreviousPage} disabled={currentPage === 0}>
            <ArrowBack />
          </IconButton>
          <span>
            {currentPage + 1} / {totalPages}
          </span>
          <IconButton onClick={handleNextPage} disabled={currentPage === totalPages - 1}>
            <ArrowForward />
          </IconButton>
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={closeDialog} color="info">
          Закрыть
        </Button>
        <MDButton onClick={handleConfirmSelection} color="info" variant="contained">
          Подтвердить
        </MDButton>
      </DialogActions>
    </Dialog>
  );
}
