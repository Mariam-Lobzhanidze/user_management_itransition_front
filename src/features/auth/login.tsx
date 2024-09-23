import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../shared/axiosInstance";
import axios from "axios";
import { LoginFormData } from "./types";

const Login: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<LoginFormData>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const navigate = useNavigate();

  const setFieldError = (fieldName: "email" | "password", errorType: string = "manual", message: string) => {
    setError(fieldName, {
      type: errorType,
      message: message,
    });
  };

  const onSubmit: SubmitHandler<LoginFormData> = async (data) => {
    try {
      const response = await axiosInstance.post("/login", data);
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("activeUserId", response.data.userId);
      navigate("/users");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.data.message === "Invalid password.") {
          setFieldError("password", "manual", "Password is incorrect");
        }

        if (error.response?.data.message === "Email not found.") {
          setFieldError("email", "manual", "Email not registered");
        }

        if (error.response?.data.message === "Account is blocked.") {
          setFieldError("email", "manual", "Account is blocked");
        }
      }
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Login</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="mx-auto" style={{ maxWidth: "400px" }}>
        <div className="mb-3">
          <input
            {...register("email", {
              required: "Please enter your email.",
              pattern: {
                value: /^\S+@\S+\.\S+$/,
                message: "Please enter a valid email address.",
              },
            })}
            className={`form-control form-control-sm ${errors.email ? "is-invalid" : ""}`}
            placeholder="Email"
          />
          {errors.email && <div className="invalid-feedback">{errors.email.message}</div>}
        </div>

        <div className="mb-3">
          <input
            {...register("password", { required: "Please enter your password." })}
            className={`form-control form-control-sm ${errors.password ? "is-invalid" : ""}`}
            placeholder="Password"
            type="password"
          />
          {errors.password && <div className="invalid-feedback">{errors.password.message}</div>}
        </div>

        <button type="submit" className="btn btn-primary w-100">
          Login
        </button>
        <div className="text-center mt-3">
          <span>Not registered? </span>
          <button type="button" onClick={() => navigate("/register")} className="btn btn-link">
            Register
          </button>
        </div>
      </form>
    </div>
  );
};

export default Login;
