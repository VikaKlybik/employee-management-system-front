// react-router-dom components

// @mui material components
import Card from "@mui/material/Card";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";
import AuthService from "services/AuthService";

// Authentication layout components
import BasicLayout from "layouts/authentication/components/BasicLayout";

// Images
import bgImage from "assets/images/bg-sign-in-basic.webp";
import { useForm } from "react-hook-form";
import { useAuth } from "context/AuthContext";
import { useNavigate } from "react-router-dom";

function ChangePassword() {
  const authService = new AuthService();
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const authContext = useAuth();
  const navigate = useNavigate();
  const updatePassword = async (data) => {
    try {
      const user = authContext.getUser();
      const response = await authService.updatePassword(user.email, data.password);
      authContext.login(response.data.token);
      if (response.data.token.role === "employee") {
        navigate("/profile");
      } else {
        navigate("/employee");
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <BasicLayout image={bgImage}>
      <Card>
        <MDBox
          variant="gradient"
          bgColor="info"
          borderRadius="lg"
          coloredShadow="info"
          mx={2}
          mt={-3}
          p={2}
          mb={1}
          textAlign="center"
        >
          <MDTypography variant="h4" fontWeight="medium" color="white" mt={1}>
            Сменить пароль
          </MDTypography>
        </MDBox>
        <MDBox pt={4} pb={3} px={3}>
          <MDBox component="form" role="form" onSubmit={handleSubmit(updatePassword)}>
            <MDBox mb={2}>
              <MDInput
                type="password"
                label="Пароль"
                fullWidth
                {...register("password", {
                  required: "Пароль не указан!",
                })}
                error={Boolean(errors.password)}
                helperText={errors.password ? <span style={{ color: "red" }}>{errors.password.message}</span> : ""}
              />
            </MDBox>
            <MDBox mt={4} mb={1}>
              <MDButton variant="gradient" color="info" type="submit" fullWidth>
                Вход
              </MDButton>
            </MDBox>
          </MDBox>
        </MDBox>
      </Card>
    </BasicLayout>
  );
}

export default ChangePassword;
