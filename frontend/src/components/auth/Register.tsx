import { JSX, useState } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { useNavigate, NavLink } from "react-router-dom";
import { authService } from "../../services/AuthService";
import { useLang } from "../../state/lang-state";
import { translate } from "../../state/translations";
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
    const lang = useLang();
    const dir = lang === 'he' ? 'rtl' : 'ltr';

    async function onSubmit(data: IRegisterForm): Promise<void> {
        if (!gender) { setGenderError(true); return; }
        try {
            await authService.register(data.firstName, data.lastName, data.email, data.password, gender);
            navigate("/");
        } catch (err) {
            const message = axios.isAxiosError<{ message?: string }>(err) ? err.response?.data?.message : undefined;
            alert(message || translate('registrationFailed', lang));
        }
    }

    return (
        <div className="auth-page">
            <div className="auth-card" dir={dir}>
                <h2 className="auth-title">
                    {translate('createAccount', lang)}
                </h2>
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="auth-form">
                    <label>
                        {translate('firstName', lang)}
                    </label>
                    <input {...register("firstName", { required: translate('firstNameRequired', lang) })} />
                    {
                        errors.firstName &&
                        <span className="auth-error">
                            {errors.firstName.message}
                        </span>
                    }

                    <label>
                        {translate('lastName', lang)}
                    </label>
                    <input {...register("lastName", { required: translate('lastNameRequired', lang) })} />
                    {
                        errors.lastName &&
                        <span className="auth-error">
                            {errors.lastName.message}
                        </span>
                    }

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
                    <input type="password" {...register("password", {
                        required: translate('passwordRequired', lang),
                        minLength: { value: 4, message: translate('passwordMinLength', lang) }
                    })} />
                    {
                        errors.password &&
                        <span className="auth-error">
                            {errors.password.message}
                        </span>
                    }

                    <label>{translate('iAmA', lang)}</label>
                    <div className="auth-gender-toggle">
                        <button
                            type="button"
                            className={`auth-gender-btn${gender === 'male' ? ' active' : ''}`}
                            onClick={() => { setGender('male'); setGenderError(false); }}
                        >{translate('genderMale', lang)}</button>
                        <button
                            type="button"
                            className={`auth-gender-btn${gender === 'female' ? ' active' : ''}`}
                            onClick={() => { setGender('female'); setGenderError(false); }}
                        >{translate('genderFemale', lang)}</button>
                    </div>
                    {genderError && <span className="auth-error">{translate('selectGender', lang)}</span>}

                    <button
                        type="submit"
                        className="auth-btn">
                        {translate('register', lang)}
                    </button>
                </form>
                <p className="auth-link-text">
                    {translate('alreadyHaveAccount', lang)}
                <NavLink to="/login">
                    {translate('login', lang)}
                </NavLink></p>
            </div>
        </div>
    );
}

export default Register;
