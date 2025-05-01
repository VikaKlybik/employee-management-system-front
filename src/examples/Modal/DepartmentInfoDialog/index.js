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

export default function DepartmentInfoDialog({ isModalOpen }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [department, setDepartment] = useState(null);
  const departmentService = new DepartmentService();
  const jobTitleService = new JobTitleService();
  const [editRow, setEditRow] = useState(null);
  const [tableData, setTableData] = useState({ columns: [], rows: [] });
  const [editJobTitle, setEditJobTitle] = useState({
    name: null,
    lead: null,
    isLead: null
  });
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successSB, setSuccessSB] = useState(false);
  const [errorSB, setErrorSB] = useState(false);
  const openErrorSB = () => setErrorSB(true);
  const closeErrorSB = () => setErrorSB(false);
  const openSuccessSB = () => setSuccessSB(true);
  const closeSuccessSB = () => setSuccessSB(false);
  const { register, control, watch, handleSubmit, reset, formState: { errors } } = useForm();

  const closeModal = () => {
    navigate(-1);
  };

  async function fetchDepartmentDataById() {
    try {
      setEditRow(null)
      setEditJobTitle({
        name: null,
        lead: null,
        isLead: null
      })
      const response = await departmentService.getDepartmentById(id);
      setDepartment(response.data);

    } catch (_) {
    }
  }
  function findJobTitleById(id) {
    return department.jobs
      .find(item => item.id === id)
  }


  const handleMenuItemClick = async (item) => {
    if(item.action === "edit") {
      setEditRow(item.jobTitleId)
      let jobTitle = findJobTitleById(item.jobTitleId)
      setEditJobTitle({
        name: jobTitle.name,
        lead: jobTitle.lead?.id,
        isLead: jobTitle.isLead
      })
    }
    if(item.action === "delete") {
      try {
        await jobTitleService.deleteById(item.jobTitleId)
        await fetchDepartmentDataById()
        setSuccessMessage("Успешное обновление!")
        openSuccessSB()
      }catch (error) {
        setErrorMessage("Позиция имеет подчинённых, сначала назначьте им руководителя!")
        openErrorSB()
      }
    }
    if(item.action === "save") {
      try {
        await jobTitleService.updateJobTitle(item.jobTitleId, editJobTitle)
        await fetchDepartmentDataById()
        setSuccessMessage("Успешное обновление!")
        openSuccessSB()
      }catch (error) {
        setErrorMessage("Позиция имеет подчинённых, сначала назначьте им руководителя!")
        openErrorSB()
      }
    }
    if(item.action === "cancel") {
      setEditRow(null)
      setEditJobTitle(null)
    }

  }

  useEffect(() => {
    if (id) {
      fetchDepartmentDataById(id);
    }
  }, [id]);

  useEffect(() => {
    if(department?.jobs) {
      setTableData(jobTitleTableData(department.jobs, handleMenuItemClick, editRow, editJobTitle, setEditJobTitle))
    }
  }, [department, editRow, editJobTitle]);

  const handleCreateJobTitle = async (data) => {
    try {
      await jobTitleService.create({
        name: data.name,
        isLead: data.isLead,
        leadId: data.lead,
        departmentId: department.id
      })
      await fetchDepartmentDataById()
      setSuccessMessage("Позиция успешно создана!")
      openSuccessSB()
      reset()
    } catch (error) {
      setErrorMessage("Позиция с таким именем уже есть!")
      openErrorSB()
    }
  }

  const renderSuccessSB = (
    <MDSnackbar
      color="success"
      icon="check"
      title="Инфорамация"
      content={successMessage}
      open={successSB}
      onClose={closeSuccessSB}
      close={closeSuccessSB}
      bgWhite
    />
  );
  const renderErrorSB = (
    <MDSnackbar
      color="error"
      icon="warning"
      title="Ошибка"
      content={errorMessage}
      open={errorSB}
      onClose={closeErrorSB}
      close={closeErrorSB}
      bgWhite
    />
  );

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
                  <MDBox sx={{ maxWidth: "95%", margin: "10px auto" }}>
                    <MDBox component="form" sx={{ marginTop: 4 }} role="form" onSubmit={handleSubmit(handleCreateJobTitle)}>
                      <MDTypography display="block" variant="body2" color="text" fontWeight="medium">
                        Создание новой позиции
                      </MDTypography>
                      <MDInput
                        fullWidth
                        label="Название"
                        margin="normal"
                        {...register("name", {
                          required: "Название не указано!.",
                        })}
                        error={Boolean(errors.name)}
                        helperText={errors.name ? <span style={{ color: "red" }}>{errors.name.message}</span> : ""}
                      />
                      <FormControl fullWidth margin="normal">
                        <InputLabel id="lead">Руководитель</InputLabel>
                        <Select
                          labelId="lead"
                          fullWidth
                          displayEmpty
                          margin="normal"
                          style={{ paddingTop: "11px", paddingBottom: "11px", marginTop: "2px" }}
                          {...register("lead", {
                            required: "Руководитель не указан!",
                          })}
                          label="Руководитель"

                        >
                          {department?.jobs?.filter(item => item.isLead)?.map(job => (
                            <MenuItem key={job.id} value={job.id}>{job.name}</MenuItem>
                          ))}
                        </Select>
                        {errors.lead && (
                          <FormHelperText error>
                            {errors.lead.message}
                          </FormHelperText>
                        )}
                      </FormControl>
                      <Controller
                        name="isLead"
                        control={control}
                        defaultValue={false} // если нужно
                        render={({ field }) => (
                          <FormControlLabel
                            control={
                              <Checkbox
                                {...field}
                                checked={field.value}
                              />
                            }
                            label="Возможность быть руководителем"
                          />
                        )}
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
      {renderErrorSB}
      {renderSuccessSB}
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