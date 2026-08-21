import { JSX } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, NavLink } from "react-router-dom";
import { authService } from "../../services/AuthService";
import "./Auth.css";

interface RegisterForm {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
}

function Register(): JSX.Element {
    const { register, handleSubmit, formState: { errors } } = useForm<RegisterForm>();
    const navigate = useNavigate();

    async function onSubmit(data: RegisterForm): Promise<void> {
        try {
            await authService.register(data.firstName, data.lastName, data.email, data.password);
            navigate("/");
        } catch (err: any) {
            alert(err.response?.data?.message || "Registration failed");
        }
    }

    return (
        <div className="auth-page">
            <div className="auth-card">
                <h2 className="auth-title">Create Account</h2>
                <form onSubmit={handleSubmit(onSubmit)} className="auth-form">
                    <label>First Name</label>
                    <input {...register("firstName", { required: "First name is required" })} />
                    {errors.firstName && <span className="auth-error">{errors.firstName.message}</span>}

                    <label>Last Name</label>
                    <input {...register("lastName", { required: "Last name is required" })} />
                    {errors.lastName && <span className="auth-error">{errors.lastName.message}</span>}

                    <label>Email</label>
                    <input type="email" {...register("email", { required: "Email is required" })} />
                    {errors.email && <span className="auth-error">{errors.email.message}</span>}

                    <label>Password</label>
                    <input type="password" {...register("password", {
                        required: "Password is required",
                        minLength: { value: 4, message: "At least 4 characters" }
                    })} />
                    {errors.password && <span className="auth-error">{errors.password.message}</span>}

                    <button type="submit" className="auth-btn">Register</button>
                </form>
                <p className="auth-link-text">Already have an account? <NavLink to="/login">Login</NavLink></p>
            </div>
        </div>
    );
}

export default Register;
