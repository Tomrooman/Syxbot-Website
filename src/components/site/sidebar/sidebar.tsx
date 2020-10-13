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
                    <div className='sidebar-point' />
                    <p> Dofus </p>
                </div>
            </a>
            <a href='/warframe'>
                <div className={props.page === 'warframe' ? 'nav-link warframe active' : 'nav-link warframe'}>
                    <img src='/assets/img/warframe/logo.png' alt='warframe_icon' />
                    <div className='sidebar-point' />
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
                        onClick={(): void => props.disconnect()}
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
