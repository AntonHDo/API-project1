// frontend/src/components/Navigation/index.js
import React from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import './Navigation.css';
import logo from '../assets/demologo2.PNG'



function Navigation({ isLoaded }) {

    const sessionUser = useSelector(state => state.session.user);
    return (
        <header className="site-header">
            <nav>
                <NavLink className='homeBtn' exact to="/">
                    <div className="site-logo">
                        <img className='demologo' src={logo} />
                    </div>
                </NavLink>
                <ul className='nav-bar' >
                    {isLoaded && (
                        <li className='profileBtnContainer'>
                            {sessionUser ? (
                                <NavLink to={'/spots/new'}>
                                    <button className='create-spot-link site-button' >
                                        <span><i className="fa-sharp fa-solid fa-plus"></i></span>New Spot</button></NavLink>

                            )
                                : ""
                            }
                            <div>
                                <ProfileButton user={sessionUser} />
                            </div>
                        </li>

                    )}
                </ul>
            </nav>
        </header>
    );
}

export default Navigation;
