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
import MDSnackbar from "../../../components/MDSnackbar";
import { useState } from "react";

function Basic() {
  const authService = new AuthService();
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const authContext = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState(false);
  const openError = () => setError(true);
  const closeError = () => setError(false);

  const enterUser = async (data) => {
    try {
      const response = await authService.login(data.email, data.password);
      authContext.login(response.data.token);
      if (response.data.token.role === "employee") {
        navigate("/profile");
      } else {
        navigate("/employee");
      }
    } catch (error) {
      openError(error)
    }
  };

  const renderError = (
    <MDSnackbar
      color="error"
      icon="warning"
      title="Ошибка авторизации"
      content="Логин или пароль указаны неверно!"
      dateTime=""
      open={error}
      onClose={closeError}
      close={closeError}
      bgWhite
    />
  );

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
            Авторизация
          </MDTypography>
        </MDBox>
        <MDBox pt={4} pb={3} px={3}>
          <MDBox component="form" role="form" onSubmit={handleSubmit(enterUser)}>
            <MDBox mb={2}>
              <MDInput
                type="email"
                label="Email"
                fullWidth
                {...register("email", {
                  required: "Email не указан!.",
                  pattern: {
                    value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                    message: "Неправильный формат",
                  },
                })}
                error={Boolean(errors.email)}
                helperText={errors.email ? <span style={{ color: "red" }}>{errors.email.message}</span> : ""}
              />
            </MDBox>
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
            {renderError}
          </MDBox>
        </MDBox>
      </Card>
    </BasicLayout>
  );
}

export default Basic;
