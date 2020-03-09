'use strict';

import React from 'react';
import $ from 'jquery';
// import PropTypes from 'prop-types';
import Config from './../../../../config.json';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default class Sidebar extends React.Component {
    handleOnClickSideMenu() {
        $('#website-sidebar').toggleClass('active');
        $('#sidebarCollapse').toggleClass('active');
    }

    render() {
        return (
            <div id='website-sidebar'>
                <div
                    className='toggleSideMenuWeb'
                    onClick={this.handleOnClickSideMenu}
                >
                    <button type='button' id='sidebarCollapse' className='navbar-btn'>
                        <span />
                        <span />
                        <span />
                    </button>
                </div>
                <ul className='list-unstyled components'>
                    <li className='sidebar-add-bot-btn'>
                        <a href={Config.OAuth.add_url}>
                            Ajouter le bot
                        </a>
                    </li>
                    <li className='sidebar-docs-btn'>
                        <a href='/docs'>
                            <FontAwesomeIcon icon='book' /> Documentation
                        </a>
                    </li>
                </ul>
            </div>
        );
    }
}

// Sidebar.propTypes = {
//     command: PropTypes.string.isRequired,
//     urlArg: PropTypes.string.isRequired
// };
