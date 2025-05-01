import { useNavigate, useParams } from "react-router-dom";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import React from "react";
import CompetenciesChartForEmployee from "../../../layouts/competencyHistory/components/CompetenciesChartForEmployee";

export default function CompetenciesForEmployeeDialog({ isModalOpen }) {
  const { id } = useParams();
  const navigate = useNavigate();

  const closeModal = () => {
    navigate(-1);
  };

  return (
    <Dialog open={isModalOpen} onClose={closeModal} sx={{
      "& .MuiDialog-paper": {
        width: "70%",
        maxWidth: "none",
        height: "100%",
      },
    }}>
      <DialogTitle>KPI История оценок</DialogTitle>
      <DialogContent>
        <CompetenciesChartForEmployee userId={id}/>
      </DialogContent>
      <DialogActions>
      <Button color="primary" onClick={closeModal}>
        Закрыть
      </Button>
    </DialogActions>
    </Dialog>
  );
}