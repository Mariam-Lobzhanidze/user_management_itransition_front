import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../shared/axiosInstance";
import axios from "axios";
import { RegisterFormData } from "./types";

const Register: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<RegisterFormData>({
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const navigate = useNavigate();

  const onSubmit: SubmitHandler<RegisterFormData> = async (data) => {
    try {
      const response = await axiosInstance.post("/register", data);
      console.log("Registration successful:", response.data);
      navigate("/login");
    } catch (error: unknown) {
      console.log(error);
      if (axios.isAxiosError(error)) {
        console.log("Axios error:", error.response);
        if (error.response?.data?.message === "Email already in use.") {
          setError("email", {
            type: "manual",
            message: "Email already registered.",
          });
        }
      }
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Register</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="mx-auto" style={{ maxWidth: "400px" }}>
        <div className="mb-3">
          <input
            {...register("name", { required: "Please enter your name." })}
            className={`form-control form-control-sm ${errors.name ? "is-invalid" : ""}`}
            placeholder="Name"
          />
          {errors.name && <div className="invalid-feedback">{errors.name.message}</div>}
        </div>

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
            {...register("password", {
              required: "Please enter your password.",
              minLength: { value: 1, message: "Password must be at least 1 character." },
            })}
            className={`form-control form-control-sm ${errors.password ? "is-invalid" : ""}`}
            placeholder="Password"
            type="password"
          />
        </div>
        <button type="submit" className="btn btn-primary w-100">
          Register
        </button>
        <div className="text-center mt-3">
          <span>Already registered? </span>
          <button type="button" onClick={() => navigate("/login")} className="btn btn-link">
            Login
          </button>
        </div>
      </form>
    </div>
  );
};

export default Register;
