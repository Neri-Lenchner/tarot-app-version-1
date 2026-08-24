import { JSX } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { useNavigate, NavLink } from "react-router-dom";
import { authService } from "../../services/AuthService";
import { useLang } from "../../state/lang-state";
import { translate } from "../../state/translations";
import "./Auth.css";

interface ILoginForm {
    email: string;
    password: string;
}

function Login(): JSX.Element {
    const { register, handleSubmit, formState: { errors } } = useForm<ILoginForm>();
    const navigate = useNavigate();
    const lang = useLang();
    const dir = lang === 'he' ? 'rtl' : 'ltr';

    async function onSubmit(data: ILoginForm): Promise<void> {
        try {
            await authService.login(data.email, data.password);
            navigate("/");
        } catch (err) {
            const message = axios.isAxiosError<{ message?: string }>(err) ? err.response?.data?.message : undefined;
            alert(message || translate('loginFailed', lang));
        }
    }

    return (
        <div className="auth-page">
            <div className="auth-card" dir={dir}>
                <h2 className="auth-title">
                    {translate('welcomeBack', lang)}
                </h2>
                <form onSubmit={handleSubmit(onSubmit)} className="auth-form">
                    <label>
                        {translate('email', lang)}
                    </label>
                    <input type="email" {...register("email", { required: translate('emailRequired', lang) })} />
                    {
                        errors.email &&
                        <span className="auth-error">
                            {errors.email.message}
                        </span>
                    }

                    <label>
                        {translate('password', lang)}
                    </label>
                    <input type="password" {...register("password", { required: translate('passwordRequired', lang) })} />
                    {
                        errors.password &&
                        <span className="auth-error">
                            {errors.password.message}
                        </span>}

                    <button type="submit" className="auth-btn">
                        {translate('login', lang)}
                    </button>
                </form>
                <p className="auth-link-text">
                    {translate('dontHaveAccount', lang)}
                    <NavLink to="/register">
                        {translate('register', lang)}
                    </NavLink>
                </p>
            </div>
        </div>
    );
}

export default Login;
