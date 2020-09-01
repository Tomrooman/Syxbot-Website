'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import Config from '../../../../config.json';
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt, faUserCircle, faBook, faHome, faChevronCircleDown } from '@fortawesome/free-solid-svg-icons';
import { faDiscord } from '@fortawesome/free-brands-svg-icons';
import { userType } from '../../../@types/user';

import './sidebar.css';

library.add(faSignOutAlt);
library.add(faDiscord);
library.add(faUserCircle);
library.add(faBook);
library.add(faHome);
library.add(faChevronCircleDown);

interface propsType {
    page: string;
    randStr: string;
    user: userType;
    disconnect(): void;
}

const Sidebar = (props: propsType): React.ReactElement => {
    // return (
    //     <nav className='navbar navbar-expand-md navbar-dark navbar-site'>
    //         <a className='navbar-brand' href='/'>
    //             Syxbot
    //         </a>
    //         <button className='navbar-toggler' type='button' data-toggle='collapse' data-target='#toHide' aria-controls='toHide' aria-expanded='false' aria-label='Toggle navigation'>
    //             <span className='navbar-toggler-icon' />
    //         </button>
    //         <ul className='nav navbar-nav mr-auto collapse navbar-collapse' id='toHide'>
    //             <a href='/'>
    //                 <li className={props.page === '/' ? 'nav-item active' : 'nav-item'}>
    //                     <span className='nav-link'>
    //                         <img src='/assets/img/ico/home.png' alt='home_icon' />
    //                         <p> Accueil </p>
    //                     </span>
    //                 </li>
    //             </a>
    //             <a href='/dofus'>
    //                 <li className={props.page === 'dofus' ? 'nav-item active' : 'nav-item'}>
    //                     <span className='nav-link'>
    //                         <img src='/assets/img/ico/dofus.png' alt='dofus_icon' />
    //                         <p> Dofus </p>
    //                     </span>
    //                 </li>
    //             </a>
    //         </ul>
    //         <ul className='form-inline my-2 my-lg-0'>
    //             {
    //                 props.user ?
    //                     <div className='dropdown'>
    //                         <div className='user-dropdown dropdown-toggle' id='dropdownMenuButton' data-toggle='dropdown' aria-haspopup='true' aria-expanded='false'>
    //                             <div className='user-dropdown-nav'>
    //                                 <FontAwesomeIcon icon='user-circle' />
    //                                 <p>
    //                                     <span className='username'>
    //                                         {props.user.username.length > 10 ? props.user.username.substr(0, 9) + '...' : props.user.username}
    //                                     </span>
    //                                 </p>
    //                             </div>
    //                         </div>
    //                         <div className='dropdown-menu dropdown-menu-right user-dropdown-list' aria-labelledby='dropdownMenuButton'>
    //                             <p
    //                                 className='dropdown-item dropdown-disconnect'
    //                                 onClick={() => props.disconnect()}
    //                             >
    //                                 <FontAwesomeIcon icon='sign-out-alt' /> Se déconnecter
    //                             </p>
    //                         </div>
    //                     </div> :
    //                     <a href={`${Config.OAuth.connection_url}&state=${props.randStr}`}>
    //                         <button className='connect-btn'>
    //                             <FontAwesomeIcon icon={['fab', 'discord']} />
    //                             <p>Se connecter</p>
    //                         </button>
    //                     </a>
    //             }
    //         </ul>
    //     </nav>
    // );
    return (
        <div className='sidenav'>
            <a href='/'>
                <div className={props.page === '/' ? 'nav-link home active' : 'nav-link home'}>
                    <FontAwesomeIcon icon='home' />
                    <p> Accueil </p>
                </div>
            </a>
            <div className='nav-category'>
                <p>Jeux</p>
                <div className='nav-category-bottom-arrow'>
                    <FontAwesomeIcon icon='chevron-circle-down' />
                </div>
            </div>
            <a href='/dofus'>
                <div className={props.page === 'dofus' ? 'nav-link dofus active' : 'nav-link dofus'}>
                    <img src='/assets/img/dofus/logo.png' alt='dofus_icon' />
                    <p> Dofus </p>
                </div>
            </a>
            <a href='/warframe'>
                <div className={props.page === 'warframe' ? 'nav-link warframe active' : 'nav-link warframe'}>
                    <img src='/assets/img/warframe/logo.png' alt='warframe_icon' />
                    <p> Warframe </p>
                </div>
            </a>
            {props.user ?
                <div className='nav-bottom'>
                    <div className='nav-category'>
                        <p>Profil</p>
                        <div className='nav-category-bottom-arrow'>
                            <FontAwesomeIcon icon='chevron-circle-down' />
                        </div>
                    </div>
                    <a href='/profil'>
                        <div className='nav-link profile'>
                            <FontAwesomeIcon icon='user-circle' />
                            <p>{props.user.username.length > 10 ? props.user.username.substr(0, 9) + '...' : props.user.username}</p>
                        </div>
                    </a>
                    <p
                        className='nav-disconnect'
                        onClick={() => props.disconnect()}
                    >
                        {/* <FontAwesomeIcon icon='sign-out-alt' /> */}
                        Déconnexion
                    </p>
                </div> :
                <a href={`${Config.OAuth.connection_url}&state=${props.randStr}`}>
                    <div className='nav-link connexion'>
                        <FontAwesomeIcon icon={['fab', 'discord']} />
                        <p>Connexion</p>
                    </div>
                </a>}
        </div>
    );
};

Sidebar.propTypes = {
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

export default Sidebar;
