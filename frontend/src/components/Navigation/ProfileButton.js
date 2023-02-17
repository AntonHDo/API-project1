import React, { useState, useEffect, useRef } from "react";
import { useDispatch } from 'react-redux';
import * as sessionActions from '../../store/session';
import OpenModalMenuItem from './OpenModalMenuItem';
import LoginFormModal from '../LoginFormModal';
import SignupFormModal from '../SignupFormModal';
import { NavLink, useHistory } from "react-router-dom";

function ProfileButton({ user }) {
    const history = useHistory()
    const dispatch = useDispatch();
    const [showMenu, setShowMenu] = useState(false);
    const ulRef = useRef();

    const openMenu = () => {
        if (showMenu) return;
        setShowMenu(true);
    };

    useEffect(() => {
        if (!showMenu) return;

        const closeMenu = (e) => {
            if (!ulRef.current.contains(e.target)) {
                setShowMenu(false);
            }
        };

        document.addEventListener('click', closeMenu);

        return () => document.removeEventListener("click", closeMenu);
    }, [showMenu]);

    const closeMenu = () => setShowMenu(false);

    const logout = (e) => {
        e.preventDefault();
        dispatch(sessionActions.logout());
        closeMenu();
        history.push('/')
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const credential = "Demo-lition";
        const password = "password";
        dispatch(sessionActions.login({ credential, password })).then(closeMenu)
    };


    const ulClassName = "profile-dropdown" + (showMenu ? "" : " hidden");

    return (
        <>
            <button className="profile-btn" onClick={openMenu}>
                <div className="user-box-container">
                    <i className="fa-sharp fa-solid fa-bars"></i>
                    <i className="fas fa-user-circle" />
                </div>
            </button>

            <ul className={ulClassName} ref={ulRef}>
                {user ? (

                    <nav>
                        {/* <li>Hello, {user.username}</li> */}
                        <li>Hello, {user.firstName} {user.lastName}</li>
                        <li>{user.email}</li>
                        <hr></hr>
                        <li><NavLink to={'/spots/current'} className='manage-spot-link'>Manage Spots</NavLink></li>
                        <hr></hr>
                        <li>
                            <button className="site-button" onClick={logout}>Log Out</button>
                        </li>
                    </nav>
                ) : (
                    <>
                        <OpenModalMenuItem
                            itemText="Log In"
                            onItemClick={closeMenu}
                            modalComponent={<LoginFormModal />}
                        />
                        <OpenModalMenuItem
                            itemText="Sign Up"
                            onItemClick={closeMenu}
                            modalComponent={<SignupFormModal />}
                        />
                        <OpenModalMenuItem
                            itemText="Demo"
                            onItemClick={closeMenu}
                            modalComponent={<form onSubmit={handleSubmit}>
                                <button type="submit">Login</button>
                            </form>}

                        />
                    </>
                )}
            </ul>
        </>
    );
}

export default ProfileButton;
