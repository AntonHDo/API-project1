// frontend/src/components/LoginFormModal/index.js
import React, { useEffect, useState } from "react";
import * as sessionActions from "../../store/session";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import "./LoginForm.css";
import { Link } from "react-router-dom";

function LoginFormModal() {
    const dispatch = useDispatch();
    const [credential, setCredential] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState([]);
    const [showErrorsList, setShowErrorsList] = useState(false);
    const [disabled, setDisabled] = useState(true)
    const [loginButtonClassName, setLoginButtonClassName] = useState("disabled")
    const { closeModal } = useModal();

    const handleSubmit = (e) => {
        e.preventDefault();
        setErrors([]);
        return dispatch(sessionActions.login({ credential, password }))
            .then(closeModal)
            .catch(
                async (res) => {
                    const data = await res.json();
                    if (data && data.errors) setErrors(data.errors);
                }
            );
    };

    const handleSubmit2 = (e) => {
        e.preventDefault();
        setErrors([]);
        return dispatch(sessionActions.login({ credential: "Demo-lition", password: "password" }))
            .then(closeModal)
            .catch(
                async (res) => {
                    setShowErrorsList(true)
                    const data = await res.json();
                    if (data && data.errors) setErrors(data.errors);
                }
            );
    };

    useEffect(() => {
        if (credential.length < 4 || password.length < 6) {
            setDisabled(true)
            setLoginButtonClassName("disabled")
            return
        }
        setLoginButtonClassName("enabled")
        setDisabled(false)
    }, [password, credential])

    const errorsListName = "error-list" + (showErrorsList ? "" : " hidden");

    const formForLogin = "login-form" + (showErrorsList ? " with-errors1" : "");


    return (
        <>
            <h1>Log In</h1>
            <form className={formForLogin} onSubmit={handleSubmit}>
                <ul className={errorsListName}>
                    {errors.map((error, idx) => (
                        <li key={idx}>{error}</li>
                    ))}
                </ul>
                <label className="login-form-label">
                    Username or Email
                    <input
                        type="text"
                        value={credential}
                        onChange={(e) => setCredential(e.target.value)}
                        required
                    />
                </label>
                <label className="login-form-label">
                    Password
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </label>
                <br></br>
                <button type="submit" className={loginButtonClassName} disabled={disabled}>Log In</button>
                <br></br>
                <Link onClick={handleSubmit2}>Demo User</Link>
            </form>
        </>
    );
}

export default LoginFormModal;
