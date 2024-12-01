
import React, { useEffect, useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  ListItemButton,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import DepartmentService from "../../../services/DepartmentService";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import IconButton from "@mui/material/IconButton";
import { ArrowBack, ArrowForward } from "@mui/icons-material";
import EmployeeService from "../../../services/EmployeeService";

export default function EmployeeSelectionDialog({ open, onClose, onSelect }) {
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
        console.log(response.data);
        setDepartments(response.data);
      } catch (error) {
        console.log(error);
      }
    }

    fetchDepartment();
  }, []);

  useEffect(() => {
    async function fetchEmployee() {
      try {
        const response = await employeeService.getEmployee({
          jobTitleId: selectedPosition ? selectedPosition : null,
          departmentId: selectedDepartment ? selectedDepartment : null,
          search: searchQuery ? searchQuery : null,
        });
        console.log(response.data);
        setEmployees(response.data);
      } catch (error) {
        console.log(error);
      }
    }

    fetchEmployee();
  }, [searchQuery, selectedPosition, selectedDepartment]);

  const handleSelectEmployee = (employee) => {
    setSelectedEmployees(employee);
    onSelect(employee);
    closeDialog();
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
      <DialogTitle>Выбрать сотрудника</DialogTitle>
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
            <ListItem>
              <ListItemButton onClick={() => handleSelectEmployee(emp)}>
                <ListItemText
                  primary={`${emp?.user?.lastName} ${emp?.user?.firstName}`}
                  secondary={`${emp?.department?.name}/${emp?.jobTitle?.name}`}
                  primaryTypographyProps={{ fontSize: "13px", fontWeight: "bold" }}
                  secondaryTypographyProps={{ fontSize: "12px", color: "text.secondary" }} />
              </ListItemButton>
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
        {/* Список сотрудников */}

      </DialogContent>
      <DialogActions>
        <Button onClick={closeDialog} color="primary">
          Закрыть
        </Button>
        {/*<Button onClick={handleConfirmSelection} color="primary" variant="contained">*/}
        {/*  Подтвердить*/}
        {/*</Button>*/}
      </DialogActions>
    </Dialog>
  );
}