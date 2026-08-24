import { JSX } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { useNavigate, NavLink } from "react-router-dom";
import { authService } from "../../services/AuthService";
import "./Auth.css";

interface ILoginForm {
    email: string;
    password: string;
}

function Login(): JSX.Element {
    const { register, handleSubmit, formState: { errors } } = useForm<ILoginForm>();
    const navigate = useNavigate();

    async function onSubmit(data: ILoginForm): Promise<void> {
        try {
            await authService.login(data.email, data.password);
            navigate("/");
        } catch (err) {
            const message = axios.isAxiosError<{ message?: string }>(err) ? err.response?.data?.message : undefined;
            alert(message || "Login failed");
        }
    }

    return (
        <div className="auth-page">
            <div className="auth-card">
                <h2 className="auth-title">
                    Welcome Back
                </h2>
                <form onSubmit={handleSubmit(onSubmit)} className="auth-form">
                    <label>
                        Email
                    </label>
                    <input type="email" {...register("email", { required: "Email is required" })} />
                    {
                        errors.email &&
                        <span className="auth-error">
                            {errors.email.message}
                        </span>
                    }

                    <label>
                        Password
                    </label>
                    <input type="password" {...register("password", { required: "Password is required" })} />
                    {
                        errors.password &&
                        <span className="auth-error">
                            {errors.password.message}
                        </span>}

                    <button type="submit" className="auth-btn">
                        Login
                    </button>
                </form>
                <p className="auth-link-text">
                    Don't have an account?
                    <NavLink to="/register">
                        Register
                    </NavLink>
                </p>
            </div>
        </div>
    );
}

export default Login;
