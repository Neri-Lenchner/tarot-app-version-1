import { JSX, useState } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { useNavigate, NavLink } from "react-router-dom";
import { authService } from "../../services/AuthService";
import "./Auth.css";

interface IRegisterForm {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
}

function Register(): JSX.Element {
    const { register, handleSubmit, formState: { errors } } = useForm<IRegisterForm>();
    const navigate = useNavigate();
    const [gender, setGender] = useState<'male' | 'female' | null>(null);
    const [genderError, setGenderError] = useState(false);

    async function onSubmit(data: IRegisterForm): Promise<void> {
        if (!gender) { setGenderError(true); return; }
        try {
            await authService.register(data.firstName, data.lastName, data.email, data.password, gender);
            navigate("/");
        } catch (err) {
            const message = axios.isAxiosError<{ message?: string }>(err) ? err.response?.data?.message : undefined;
            alert(message || "Registration failed");
        }
    }

    return (
        <div className="auth-page">
            <div className="auth-card">
                <h2 className="auth-title">
                    Create Account
                </h2>
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="auth-form">
                    <label>
                        First Name
                    </label>
                    <input {...register("firstName", { required: "First name is required" })} />
                    {
                        errors.firstName &&
                        <span className="auth-error">
                            {errors.firstName.message}
                        </span>
                    }

                    <label>
                        Last Name
                    </label>
                    <input {...register("lastName", { required: "Last name is required" })} />
                    {
                        errors.lastName &&
                        <span className="auth-error">
                            {errors.lastName.message}
                        </span>
                    }

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
                    <input type="password" {...register("password", {
                        required: "Password is required",
                        minLength: { value: 4, message: "At least 4 characters"}
                    })} />
                    {
                        errors.password &&
                        <span className="auth-error">
                            {errors.password.message}
                        </span>
                    }

                    <label>I am a...</label>
                    <div className="auth-gender-toggle">
                        <button
                            type="button"
                            className={`auth-gender-btn${gender === 'male' ? ' active' : ''}`}
                            onClick={() => { setGender('male'); setGenderError(false); }}
                        >He ♂</button>
                        <button
                            type="button"
                            className={`auth-gender-btn${gender === 'female' ? ' active' : ''}`}
                            onClick={() => { setGender('female'); setGenderError(false); }}
                        >She ♀</button>
                    </div>
                    {genderError && <span className="auth-error">Please select He or She</span>}

                    <button
                        type="submit"
                        className="auth-btn">
                        Register
                    </button>
                </form>
                <p className="auth-link-text">
                    Already have an account?
                <NavLink to="/login">
                    Login
                </NavLink></p>
            </div>
        </div>
    );
}

export default Register;
