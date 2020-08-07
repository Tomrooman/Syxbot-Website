'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import Config from './../../../../config.json';
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt, faUserCircle, faBook } from '@fortawesome/free-solid-svg-icons';
import { faDiscord } from '@fortawesome/free-brands-svg-icons';
import { userType } from '../../../@types/user';

import './navbar.css';

library.add(faSignOutAlt);
library.add(faDiscord);
library.add(faUserCircle);
library.add(faBook);

interface propsType {
    page: string;
    randStr: string;
    user: userType;
    disconnect(): void;
}

const Navbar = (props: propsType): React.ReactElement => {
    return (
        <nav className='navbar navbar-expand-md navbar-dark navbar-site'>
            <a className='navbar-brand' href='/'>
                Syxbot
            </a>
            <ul className='nav navbar-nav mr-auto'>
                <a href='/'>
                    <li className={props.page === '/' ? 'nav-item active' : 'nav-item'}>
                        <span className='nav-link'>
                            <img src='/assets/img/ico/home.png' alt='home_icon' />
                            <p> Accueil </p>
                        </span>
                    </li>
                </a>
                <a href='/dofus'>
                    <li className={props.page === 'dofus' ? 'nav-item active' : 'nav-item'}>
                        <span className='nav-link'>
                            <img src='/assets/img/ico/dofus.png' alt='dofus_icon' />
                            <p> Dofus </p>
                        </span>
                    </li>
                </a>
            </ul>
            <ul className='form-inline my-2 my-lg-0'>
                {
                    props.user ?
                        <div className='dropdown'>
                            <div className='user-dropdown dropdown-toggle' id='dropdownMenuButton' data-toggle='dropdown' aria-haspopup='true' aria-expanded='false'>
                                <div className='user-dropdown-nav'>
                                    <FontAwesomeIcon icon='user-circle' />
                                    <p>
                                        <span className='username'>
                                            {props.user.username}
                                        </span>
                                        <span className='discriminator'>
                                            #{props.user.discriminator}
                                        </span>
                                    </p>
                                </div>
                            </div>
                            <div className='dropdown-menu dropdown-menu-right user-dropdown-list' aria-labelledby='dropdownMenuButton'>
                                <p
                                    className='dropdown-item dropdown-disconnect'
                                    onClick={() => props.disconnect()}
                                >
                                    <FontAwesomeIcon icon='sign-out-alt' /> Se déconnecter
                                </p>
                            </div>
                        </div> :
                        <a href={`${Config.OAuth.connection_url}&state=${props.randStr}`}>
                            <button className='connect-btn'>
                                <FontAwesomeIcon icon={['fab', 'discord']} />
                                <p>Se connecter</p>
                            </button>
                        </a>
                }
            </ul>
        </nav>
    );
};

Navbar.propTypes = {
    page: PropTypes.string.isRequired,
    randStr: PropTypes.oneOfType([
        PropTypes.string.isRequired,
        PropTypes.bool.isRequired
    ]),
    user: PropTypes.oneOfType([
        PropTypes.object.isRequired,
        PropTypes.bool.isRequired
    ]),
    disconnect: PropTypes.func.isRequired
};

export default Navbar;
