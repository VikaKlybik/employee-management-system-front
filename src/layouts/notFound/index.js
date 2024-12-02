import React from "react";
import MDBox from "../../components/MDBox";
import MDTypography from "../../components/MDTypography";
import DashboardNavbar from "../../examples/Navbars/DashboardNavbar";
import DashboardLayout from "../../examples/LayoutContainers/DashboardLayout";

const NotFound = () => {
  return (
    <DashboardLayout>
      <DashboardNavbar/>
        <MDBox pt={6} pb={3}>
          <MDBox
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
              backgroundColor: "#f5f5f5", // Светлый фон
            }}
          >
            <MDTypography variant="h1" component="div" sx={{ fontSize: "6rem", fontWeight: "bold", color: "#1976d2" }}>
              404
            </MDTypography>
            <MDTypography variant="h4" component="div" sx={{ marginBottom: "20px" }}>
              Ресурс не найден
            </MDTypography>
            <MDTypography variant="body1" sx={{ marginBottom: "40px", color: "#757575" }}>
              Извините, страница, которую вы ищете, не существует. Возможно, она была удалена или вы ошиблись в адресе.
            </MDTypography>
          </MDBox>
        </MDBox>
    </DashboardLayout>
  );
};

export default NotFound;
