'use strict';

import React from 'react';
import $ from 'jquery';
import PropTypes from 'prop-types';
import Config from './../../../../config.json';
import Commands from './../../../../assets/json/commands.json';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import {
    faBookmark, faListUl, faHome, faPenFancy, faPause, faListOl, faHeadphonesAlt, faWindowClose, faQuestion,
    faStepForward, faTrashAlt, faRss, faPlay, faSyncAlt, faEraser, faSignOutAlt, faSearch, faForward, faStop,
    faSignInAlt, faReply
} from '@fortawesome/free-solid-svg-icons';
library.add(faBookmark);
library.add(faListUl);
library.add(faHome);
library.add(faPenFancy);
library.add(faPause);
library.add(faListOl);
library.add(faHeadphonesAlt);
library.add(faWindowClose);
library.add(faQuestion);
library.add(faStepForward);
library.add(faTrashAlt);
library.add(faRss);
library.add(faPlay);
library.add(faSyncAlt);
library.add(faEraser);
library.add(faSignOutAlt);
library.add(faSignInAlt);
library.add(faSearch);
library.add(faForward);
library.add(faStop);
library.add(faReply);

export default class Sidebar extends React.Component {
    handleMouseEnter(index) {
        if ($('.docs_content_command')[index]) {
            $('.docs_content_command')[index].children[0].style.background = 'linear-gradient(45deg, rgba(121,75,139,1) 0%, rgba(134,31,43,1) 100%)';
            $('.docs_content_command')[index].children[1].style.background = 'rgb(236, 236, 236)';
            $('.docs_content_command')[index].style.transform = 'translateY(-20px)';
        }
    }

    handleMouseLeave(index) {
        if ($('.docs_content_command')[index]) {
            $('.docs_content_command')[index].children[0].style.background = '';
            $('.docs_content_command')[index].children[1].style.background = '';
            $('.docs_content_command')[index].style.transform = '';
        }
    }

    handleMouseEnterContactBtn() {
        if ($('.contact-btn')[0]) {
            $('.contact-btn')[0].style.paddingLeft = '2rem';
            $('.contact-btn')[0].style.paddingRight = '2rem';
            $('.contact-btn')[0].style.letterSpacing = '2px';
        }
    }

    handleMouseLeaveContactBtn() {
        if ($('.contact-btn')[0]) {
            $('.contact-btn')[0].style.paddingLeft = '';
            $('.contact-btn')[0].style.paddingRight = '';
            $('.contact-btn')[0].style.letterSpacing = '';
        }
    }

    handleOnClickSideMenu() {
        $('#sidebar').toggleClass('active');
        $('#sidebarCollapse').toggleClass('active');
    }

    render() {
        return (
            <nav id='sidebar'>
                <div className='sidebar-header'>
                    <h3><FontAwesomeIcon icon='bookmark' />Menu</h3>
                </div>
                <div
                    className='toggleSideMenu'
                    onClick={this.handleOnClickSideMenu}
                >
                    <button type='button' id='sidebarCollapse' className='navbar-btn'>
                        <span />
                        <span />
                        <span />
                    </button>
                </div>
                <ul className='list-unstyled components'>
                    <li className={!this.props.command ? 'active' : ''}>
                        <a href='/docs'><FontAwesomeIcon icon='home' /> Accueil</a>
                    </li>
                    <li className={this.props.command === 'contact' ? 'active' : ''}>
                        <a
                            href='/docs/contact'
                            onMouseEnter={this.handleMouseEnterContactBtn}
                            onMouseLeave={this.handleMouseLeaveContactBtn}
                        >
                            <FontAwesomeIcon icon='pen-fancy' />
                            Me contacter
                        </a>
                    </li>
                    <a href='/'>
                        <div className='website-btn'>
                            <FontAwesomeIcon icon='reply' /> Accéder au site
                        </div>
                    </a>
                    <a href={Config.OAuth.add_url}>
                        <div className='website-add-bot-btn'>
                            <FontAwesomeIcon icon='plus-circle' /> Ajouter le bot
                        </div>
                    </a>
                    <h5 id='command_list_title'><FontAwesomeIcon icon='list-ul' />Liste des commandes</h5>
                    <li id='command_list'>
                        {Commands.map((obj, index) => {
                            return (
                                <a
                                    href={`/docs/${obj.name.toLowerCase()}`}
                                    className={this.props.command === obj.name.toLowerCase() ? 'active' : ''}
                                    key={index}
                                    onMouseEnter={() => this.handleMouseEnter(index)}
                                    onMouseLeave={() => this.handleMouseLeave(index)}
                                >
                                    <FontAwesomeIcon icon={obj.icon} />{obj.name}
                                </a>
                            );
                        })}
                    </li>
                </ul>
            </nav>
        );
    }
}

Sidebar.propTypes = {
    command: PropTypes.string.isRequired
};
