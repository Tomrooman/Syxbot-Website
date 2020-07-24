'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import * as Config from './../../../../config.json';
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt, faUserCircle, faBook } from '@fortawesome/free-solid-svg-icons';
import { faDiscord } from '@fortawesome/free-brands-svg-icons';

library.add(faSignOutAlt);
library.add(faDiscord);
library.add(faUserCircle);
library.add(faBook);

const Navbar = (props) => {
    return (
        <nav className='navbar navbar-expand-lg navbar-dark navbar-site'>
            <a className='navbar-brand' href='/'>
                Syxbot
            </a>
            <button className='navbar-toggler' type='button' data-toggle='collapse' data-target='#navbarSupportedContent' aria-controls='navbarSupportedContent' aria-expanded='false' aria-label='Toggle navigation'>
                <span className='navbar-toggler-icon' />
            </button>
            <div className='collapse navbar-collapse' id='navbarSupportedContent'>
                <ul className='navbar-nav mr-auto'>
                    <li className={props.page === '/' ? 'nav-item active' : 'nav-item'}>
                        <a className='nav-link' href='/'><p> Accueil </p></a>
                    </li>
                    <li className={props.page === 'dofus' ? 'nav-item active' : 'nav-item'}>
                        <div className='dropdown'>
                            <button className='dofus-dropdown dropdown-toggle' type='button' id='dropdownMenuButton' data-toggle='dropdown' aria-haspopup='true' aria-expanded='false'>
                                <img src='/assets/img/dofus.png' alt='dofus_icon' />
                                <p>Dofus</p>
                            </button>
                            <div className='dropdown-menu dropdown-menu-left dofus-dropdown-list' aria-labelledby='dropdownMenuButton'>
                                <a
                                    href='/dofus/notes'
                                    className={props.urlArg === 'notes' ? 'dropdown-item active' : 'dropdown-item'}
                                >
                                    Mes notes {!props.user ? <span className='dofus-need-connection'><p>(connexion nécessaire)</p></span> : ''}
                                </a>
                                <a
                                    href='/dofus/craft'
                                    className={props.urlArg === 'craft' ? 'dropdown-item active' : 'dropdown-item'}
                                >
                                    Crafts
                                </a>
                                <a
                                    href='/dofus/parchment'
                                    className={props.urlArg === 'parchment' ? 'dropdown-item active' : 'dropdown-item'}
                                >
                                    Parchemins
                                </a>
                                <a
                                    href='/dofus/gestation'
                                    className={props.urlArg === 'gestation' ? 'dropdown-item active' : 'dropdown-item'}
                                >
                                    Temps de gestation
                                </a>
                                <a
                                    href='/dofus/dragodindes'
                                    className={props.urlArg === 'dragodindes' ? 'dropdown-item active' : 'dropdown-item'}
                                >
                                    Mes dragodindes {!props.user ? <span className='dofus-need-connection'><p>(connexion nécessaire)</p></span> : ''}
                                </a>
                                <a
                                    href='/dofus/fecondator'
                                    className={props.urlArg === 'fecondator' ? 'dropdown-item active' : 'dropdown-item'}
                                >
                                    Fécondator {!props.user ? <span className='dofus-need-connection'><p>(connexion nécessaire)</p></span> : ''}
                                </a>
                            </div>
                        </div>
                    </li>
                </ul>
            </div>
            <div className='form-inline my-2 my-lg-0'>
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
            </div>
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
    disconnect: PropTypes.func.isRequired,
    urlArg: PropTypes.string.isRequired
};

export default Navbar;
