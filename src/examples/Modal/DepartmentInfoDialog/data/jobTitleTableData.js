import MDTypography from "../../../../components/MDTypography";
import { Cancel, CheckCircle } from "@mui/icons-material";
import { green, red } from "@mui/material/colors";
import DropdownMenu from "../../../../components/DropDownMenu";
import { Checkbox, FormControl, FormControlLabel, MenuItem, Select, TextField } from "@mui/material";
import React from "react";

export default function data(jobTitles, handleMenuItemClick, editRow, editJobTitle, setEditJobTitle) {

  const StatusIcon = ({ success }) => {
    return success ? (
      <CheckCircle sx={{ color: green[500] }} />
    ) : (
      <Cancel sx={{ color: red[500] }} />
    );
  };

  const baseMenuItems = [
    { label: "Редактировать", action: "edit" },
    { label: "Удалить", action: "delete" },
  ];
  const editMenuItems = [
    { label: "Сохранить", action: "save" },
    { label: "Отменить", action: "cancel" },
  ];


  if (!jobTitles || jobTitles.length === 0) {
    return { columns: [], rows: [] };
  }

  return {
    columns: [
      { Header: "Название позиции", accessor: "jobTitleName", width: "30%"},
      { Header: "Непосредственный руководитель", accessor: "lead", width: "30%" },
      { Header: "Является ли руководителем?", accessor: "isLead", width: "20%" },
      { Header: "Действия", accessor: "action", width: "20%" },
    ],

    rows: jobTitles?.map(({ id, name, isLead, lead }) => {
      let currentItems = id === editRow? editMenuItems: baseMenuItems
      const possibleLeads = jobTitles.filter(item => item.id!== id && item.isLead === true)
      return {
        jobTitleName: id !== editRow ? (
          <MDTypography display="block" variant="body2" fontWeight="medium">
            {name}
          </MDTypography>
        ) : (
          <>
            <TextField
              variant="outlined"
              fullWidth
              margin="normal"
              value={editJobTitle.name}
              onChange={(e) => setEditJobTitle({
                ...editJobTitle,
                name: e.target.value
              })}
            />
        </>),
        lead: id !== editRow ? (
          <MDTypography display="block" variant="body2" color="text" fontWeight="medium">
            {lead?.name ? lead.name : "-"}
          </MDTypography>
        ): (
          <FormControl fullWidth margin="normal">
            <Select
              fullWidth
              displayEmpty
              style={{ paddingTop: "11px", paddingBottom: "11px", marginTop: "2px" }}
              value={editJobTitle.lead}
              onChange={(e) => setEditJobTitle({
                ...editJobTitle,
                lead: e.target.value
              })}
              renderValue={(selected) => {
                if (!selected) {
                  return <span style={{ color: '#aaa' }}>Выберите руководителя</span>;
                }
                const selectedItem = possibleLeads.find(item => item.id === selected);
                return selectedItem ? selectedItem.name : '';
              }}
              sx={{ minWidth: '200px' }}
            >
              {possibleLeads?.map(item => (
                <MenuItem key={item.id} value={item.id}>
                  {item.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        ),
        isLead: id!== editRow ? (
          <StatusIcon success={isLead} />
        ): (
          <FormControlLabel
            control={<Checkbox checked={editJobTitle.isLead} onChange={(e) => setEditJobTitle({
              ...editJobTitle,
              isLead: e.target.checked
            })} />}
          />
        ),
        action: (
          <DropdownMenu
            menuItems={
              currentItems.map((item) => {
                return { ...item, jobTitleId: id };
              })
            }
            onMenuItemClick={handleMenuItemClick}
          />
        ),
      };
    }),
  };
}
