'use strict';

import React from 'react';
import $ from 'jquery';
import PropTypes from 'prop-types';
import Config from './../../../../config.json';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faPlusCircle } from '@fortawesome/free-solid-svg-icons';

library.add(faPlusCircle);

export default class Sidebar extends React.Component {
    componentDidMount() {
        if (this.props.command === '/') {
            $('#website-sidebar').css('display', 'none');
        }
        else if (this.props.command === 'controls' || (this.props.command === 'dofus' && this.props.urlArg === 'craft')) {
            $('#website-sidebar').css('height', '90vh');
        }
    }

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
                            <FontAwesomeIcon icon='plus-circle' /> Ajouter le bot
                        </a>
                    </li>
                    <li className='sidebar-docs-btn'>
                        <a href='/docs'>
                            <FontAwesomeIcon icon='book' /> Documentation
                        </a>
                    </li>
                </ul>
                <ul className='nav nav-tabs sidebar-nav' id='myTab' role='tablist'>
                    <li className='nav-item'>
                        <a className={this.props.command === 'dofus' ? 'nav-link active' : 'nav-link'} id='home-tab' data-toggle='tab' href='#dofus' role='tab' aria-controls='dofus' aria-selected='true'>Dofus</a>
                    </li>
                    <li className='nav-item'>
                        <a className={this.props.command === 'controls' ? 'nav-link active' : 'nav-link'} id='profile-tab' data-toggle='tab' href='#controls' role='tab' aria-controls='controls' aria-selected='false'>Controls</a>
                    </li>
                </ul>
                <div className='tab-content sidebar-tab-content' id='myTabContent'>
                    <div className={this.props.command === 'dofus' ? 'tab-pane fade show active' : 'tab-pane fade'} id='dofus' role='tabpanel' aria-labelledby='home-tab'>
                        <a
                            href='/dofus/notes'
                            className={this.props.urlArg === 'notes' ? 'dropdown-item active' : 'dropdown-item'}
                        >
                            Mes notes {!this.props.user ? <span className='dofus-need-connection'><p>(connexion nécessaire)</p></span> : ''}
                        </a>
                        <a
                            href='/dofus/craft'
                            className={this.props.urlArg === 'craft' ? 'dropdown-item active' : 'dropdown-item'}
                        >
                            Crafts
                        </a>
                        <a
                            href='/dofus/parchment'
                            className={this.props.urlArg === 'parchment' ? 'dropdown-item active' : 'dropdown-item'}
                        >
                            Parchemins
                        </a>
                        <a
                            href='/dofus/gestation'
                            className={this.props.urlArg === 'gestation' ? 'dropdown-item active' : 'dropdown-item'}
                        >
                            Temps de gestation
                        </a>
                        <a
                            href='/dofus/dragodindes'
                            className={this.props.urlArg === 'dragodindes' ? 'dropdown-item active' : 'dropdown-item'}
                        >
                            Mes dragodindes {!this.props.user ? <span className='dofus-need-connection'><p>(connexion nécessaire)</p></span> : ''}
                        </a>
                        <a
                            href='/dofus/fecondator'
                            className={this.props.urlArg === 'fecondator' ? 'dropdown-item active' : 'dropdown-item'}
                        >
                            Fécondator {!this.props.user ? <span className='dofus-need-connection'><p>(connexion nécessaire)</p></span> : ''}
                        </a>
                    </div>
                    <div className={this.props.command === 'controls' ? 'tab-pane fade show active' : 'tab-pane fade'} id='controls' role='tabpanel' aria-labelledby='profile-tab'>Controls content</div>
                </div>
            </div>
        );
    }
}

Sidebar.propTypes = {
    command: PropTypes.string.isRequired,
    urlArg: PropTypes.string.isRequired,
    user: PropTypes.oneOfType([
        PropTypes.object.isRequired,
        PropTypes.bool.isRequired
    ])
};
