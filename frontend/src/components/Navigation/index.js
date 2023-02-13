// frontend/src/components/Navigation/index.js
import React from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import './Navigation.css';
import logo from '../assets/demologo.PNG'

function Navigation({ isLoaded }) {
    const sessionUser = useSelector(state => state.session.user);

    return (
        <ul className='nav-bar'>
            <li>
                <NavLink className='homeBtn' exact to="/"><img className='demologo' src={logo} /></NavLink>
            </li>
            {isLoaded && (
                <li className='profileBtnContainer'>
                    <ProfileButton user={sessionUser} />
                </li>
            )}
        </ul>
    );
}

export default Navigation;
