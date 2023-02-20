import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import * as sessionActions from "../../store/session";
import './SignupForm.css';

function SignupFormModal() {
    const dispatch = useDispatch();
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [errors, setErrors] = useState([]);
    const [showErrors, setShowErrors] = useState(false)
    const [disableBtn, setDisableBtn] = useState(true)
    const [signUpClass, setSignUpClass] = useState("disabled")

    const { closeModal } = useModal();

    const handleSubmit = (e) => {
        e.preventDefault();
        if (password === confirmPassword) {
            setErrors([]);
            return dispatch(sessionActions.signup({ email, username, firstName, lastName, password }))
                .then(closeModal)
                .catch(async (res) => {
                    setShowErrors(true)
                    const data = await res.json();
                    if (data && data.errors) setErrors(data.errors);
                });
        }
        setShowErrors(true)
        return setErrors(['Confirm Password field must be the same as the Password field']);
    };

    useEffect(() => {
        if (email.length < 1 || username.length < 1 || firstName.length < 1 || lastName.length < 1 || password.length < 1 || confirmPassword.length < 1 || password !== confirmPassword || password.length < 6) {
            setDisableBtn(true)
            setSignUpClass('disabled')
            return
        }
        setSignUpClass('enabled')
        setDisableBtn(false)
    }, [email, username, firstName, lastName, password, confirmPassword])



    return (
        <>
            <h1>Sign Up</h1>
            <form onSubmit={handleSubmit} >
                <ul>
                    {errors.map((error, idx) => <li key={idx}>{error}</li>)}
                </ul>
                <label className="signup-label">
                    First Name
                    <input
                        type="text"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        required
                    />
                </label>
                <label className="signup-label">
                    Last Name
                    <input
                        type="text"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        required
                    />
                </label>
                <label className="signup-label">
                    Email
                    <input
                        type="text"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </label>
                <label className="signup-label">
                    Username
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </label>
                <label className="signup-label">
                    Password
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </label>
                <label className="signup-label">
                    Confirm Password
                    <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />
                </label>
                <button className={signUpClass} disabled={disableBtn} type="submit">Sign Up</button>
            </form>
        </>
    );
}

export default SignupFormModal;
