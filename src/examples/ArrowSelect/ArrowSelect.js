import React, { useEffect, useState } from "react";
import { IconButton, MenuItem, Select } from "@mui/material";
import { ArrowBack, ArrowForward } from "@mui/icons-material";
import MDBox from "../../components/MDBox";

const ArrowSelect = ({ options, handleOptionChange }) => {
  const [selectedValue, setSelectedValue] = useState(options[0]?.value);
  useEffect(() => {
    if (options && options.length !== 0) {
      handleOptionChange(options[0]?.value);
    }
  }, [options]);

  const currentIndex = options.findIndex((option) => option.value === selectedValue);

  const handleBack = () => {
    if (currentIndex > 0) {
      setSelectedValue(options[currentIndex - 1].value);
      handleOptionChange(options[currentIndex - 1].value);
    }
  };

  const handleForward = () => {
    if (currentIndex < options.length - 1) {
      setSelectedValue(options[currentIndex + 1].value);
      handleOptionChange(options[currentIndex + 1].value);
    }
  };

  const handleSelectChange = (event) => {
    setSelectedValue(event.target.value);
    handleOptionChange(event.target.value);
  };

  return (
    <MDBox
      display="flex"
      alignItems="center"
      gap="10px"
      sx={{
        padding: "8px",
        borderRadius: "8px",
        backgroundColor: "#f9f9f9",
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
      }}
    >
      <IconButton
        onClick={handleBack}
        aria-label="previous"
        disabled={currentIndex === 0}
        sx={{
          color: currentIndex === 0 ? "#ccc" : "#1976d2",
          ":hover": { backgroundColor: "rgba(25, 118, 210, 0.1)" },
        }}
      >
        <ArrowBack />
      </IconButton>
      <Select
        value={selectedValue}
        onChange={handleSelectChange}
        displayEmpty
        sx={{
          minWidth: "180px",
          backgroundColor: "#fff",
          borderRadius: "4px",
          "& .MuiOutlinedInput-notchedOutline": { borderColor: "#ccc" },
          ":hover .MuiOutlinedInput-notchedOutline": { borderColor: "#1976d2" },
        }}
      >
        {options.map((option) => (
          <MenuItem key={option.value} value={option.value} sx={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            padding: "8px 16px",
            borderRadius: "4px",
            ":hover": {
              backgroundColor: "rgba(25, 118, 210, 0.1)",
            },
          }}>
            <MDBox component="span" sx={{ fontWeight: 500, color: "#333" }}>
              {option.name}
            </MDBox>
          </MenuItem>
        ))}
      </Select>
      <IconButton
        onClick={handleForward}
        aria-label="next"
        disabled={currentIndex === options.length - 1}
        sx={{
          color: currentIndex === options.length - 1 ? "#ccc" : "#1976d2",
          ":hover": { backgroundColor: "rgba(25, 118, 210, 0.1)" },
        }}
      >
        <ArrowForward />
      </IconButton>
    </MDBox>
  );
};

export default ArrowSelect;
