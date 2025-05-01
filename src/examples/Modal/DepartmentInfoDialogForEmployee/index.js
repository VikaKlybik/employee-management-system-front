import { useNavigate, useParams } from "react-router-dom";
import DepartmentService from "../../../services/DepartmentService";
import {
  Box,
  Button,
  CardContent, Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle, FormControl, FormControlLabel, FormHelperText,
  InputLabel, MenuItem,
  Select,
} from "@mui/material";
import React, { use, useEffect, useState } from "react";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import { Tree, TreeNode } from "react-organizational-chart";
import jobTitleTableData from "./data/jobTitleTableData"
import DataTable from "../../Tables/DataTable";
import JobTitleService from "../../../services/JobTitleService";
import MDSnackbar from "../../../components/MDSnackbar";
import { Controller, useForm } from "react-hook-form";
import MDInput from "../../../components/MDInput";
import MDBox from "../../../components/MDBox";
import MDTypography from "../../../components/MDTypography";
import MDButton from "../../../components/MDButton";

export default function DepartmentInfoDialogForEmployee({ isModalOpen }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [department, setDepartment] = useState(null);
  const departmentService = new DepartmentService();
  const jobTitleService = new JobTitleService();
  const [tableData, setTableData] = useState({ columns: [], rows: [] });
  const { register, control, watch, handleSubmit, reset, formState: { errors } } = useForm();

  const closeModal = () => {
    navigate(-1);
  };

  async function fetchDepartmentDataById() {
    try {
      const response = await departmentService.getDepartmentById(id);
      setDepartment(response.data);

    } catch (_) {
    }
  }

  useEffect(() => {
    if (id) {
      fetchDepartmentDataById(id);
    }
  }, [id]);

  useEffect(() => {
    if(department?.jobs) {
      setTableData(jobTitleTableData(department.jobs))
    }
  }, [department]);

  return (
    <Dialog open={isModalOpen} onClose={closeModal} sx={{
      "& .MuiDialog-paper": {
        width: "80%",
        maxWidth: "none",
        height: "100%",
      },
    }}>
      {department && <>
        <DialogTitle>{department.name}</DialogTitle>
        <DialogContent>
          <Card sx={{ maxWidth: "100%", margin: "5px auto" }}>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                Позиции
              </Typography>
              {(department?.jobs && department) &&
                <>
                  <OrgChart data={department}/>
                  <DataTable
                    table={tableData}
                    isSorted={false}
                    entriesPerPage={false}
                    showTotalEntries={false}
                    noEndBorder
                  />
                </>
              }

            </CardContent>
          </Card>
          <OrgChart/>
        </DialogContent>
        <DialogActions>
          <Button color="primary" onClick={closeModal}>
            Закрыть
          </Button>
        </DialogActions>
      </>}
    </Dialog>
  );

}

const Node = ({ title }) => (
  <Box
    sx={{
      border: "1px solid gray",
      borderRadius: "8px",
      padding: "8px 16px",
      backgroundColor: "#fff",
      display: "inline-block",
      fontSize: "14px",
    }}
  >
    {title}
  </Box>
);

const renderTree = (job, allJobs) => {
  const subordinates = job.subordinates.map((sub) =>
    allJobs.find((j) => j.id === sub.id)
  ).filter(Boolean);

  return (
    <TreeNode label={<Node title={job.name} />} key={job.id}>
      {subordinates.map((sub) => renderTree(sub, allJobs))}
    </TreeNode>
  );
};

const OrgChart = ({data}) => {
  if(!data) {
    return <></>
  }
  const { jobs } = data;
  let root = jobs.find(job => job.isLead && !job.lead);
  if(!root) {
    root = jobs[0]
  }
  return (
    <Tree
      label={<Node title={root.name} />}
      lineWidth={"2px"}
      lineColor={"gray"}
      lineBorderRadius={"5px"}
    >
      {root.subordinates.map((sub) => {
        const subJob = jobs.find((j) => j.id === sub.id);
        if (!subJob) return null;
        return renderTree(subJob, jobs);
      })}
    </Tree>
  )
}