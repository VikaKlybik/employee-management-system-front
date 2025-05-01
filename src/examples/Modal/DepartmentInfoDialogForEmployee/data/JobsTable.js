import React, { useState } from "react";
import {
  FormControl,
  IconButton, InputLabel, MenuItem,
  Paper, Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from "@mui/material";
import { Cancel, Delete, Edit, Save } from "@mui/icons-material";

export default function JobsTable({ data }) {
  const [jobs, setJobs] = useState(data);
  const [editId, setEditId] = useState(null);
  const [editName, setEditName] = useState("");
  const [editLeadName, setEditLeadName] = useState("");

  const handleEdit = (job) => {
    setEditId(job.id);
    setEditName(job.name);
    setEditLeadName(job.lead?.name || "");
  };

  const handleSave = (id) => {
    setJobs(prev =>
      prev.map(job =>
        job.id === id ? {
          ...job,
          name: editName,
          lead: editLeadName ? { id: "", name: editLeadName, isLead: false } : null,
        } : job,
      ),
    );
    setEditId(null);
    setEditName("");
    setEditLeadName("");
  };

  const handleCancel = () => {
    setEditId(null);
    setEditName("");
    setEditLeadName("");
  };

  const handleDelete = (id) => {
    setJobs(prev => prev.filter(job => job.id !== id));
  };

  return (
    <TableContainer component={Paper} sx={{ width: '100%' }}>
      <Table sx={{ maxWidth: 1200, minWidth: 600 }}>
        <colgroup> {/* Явное определение ширины колонок */}
          <col style={{ width: '25%' }} />
          <col style={{ width: '25%' }} />
          <col style={{ width: '25%' }} />
          <col style={{ width: '25%' }} />
        </colgroup>
        <TableHead >
          <TableRow>
            <TableCell sx={{
              width: '25%',
              whiteSpace: 'normal' // Для переноса текста
            }}>Название позиции</TableCell>

            <TableCell sx={{
              width: '25%',
              whiteSpace: 'normal'
            }}>Руководитель позиции</TableCell>

            <TableCell sx={{
              width: '25%',
              whiteSpace: 'normal'
            }}>Возможность быть руководителем</TableCell>

            <TableCell sx={{
              width: '25%',
              whiteSpace: 'normal'
            }}>Действия</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {jobs.map((job) => (
            <TableRow key={job.id}>
              <TableCell>
                {editId === job.id ? (
                  <TextField
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    size="small"
                  />
                ) : (
                  job.name
                )}
              </TableCell>
              <TableCell>
                {editId === job.id ? (
                    <Select
                      labelId="position"
                      fullWidth
                      displayEmpty
                      margin="normal"
                      style={{ paddingTop: "11px", paddingBottom: "11px", marginTop: "2px" }}
                      value={job.lead?.id}
                      onChange={(e) => setEditLeadName(e.target.value)}
                      label="Позиция"
                      // onChange={(e) => setSelectedPosition(e.target.value)}
                    >
                      {jobs.filter(item => item.isLead === true).map(jobForSelect =>(
                        <MenuItem key={jobForSelect.id} value={jobForSelect.id}>{jobForSelect.name}</MenuItem>
                      )) }
                    </Select>
                ) : (
                  job.lead?.name || "-"
                )}
              </TableCell>
              <TableCell>
                {editId === job.id ? (
                  <>
                  </>
                ) : (
                  job.isLead || "-"
                )}
              </TableCell>
              <TableCell>
                {editId === job.id ? (
                  <>
                    <IconButton onClick={() => handleSave(job.id)} color="primary">
                      <Save />
                    </IconButton>
                    <IconButton onClick={handleCancel} color="secondary">
                      <Cancel />
                    </IconButton>
                  </>
                ) : (
                  <>
                    <IconButton onClick={() => handleEdit(job)} color="primary">
                      <Edit />
                    </IconButton>
                    <IconButton onClick={() => handleDelete(job.id)} color="error">
                      <Delete />
                    </IconButton>
                  </>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}