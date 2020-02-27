'use strict';

import React from 'react';
import $ from 'jquery';
import PropTypes from 'prop-types';
import Commands from './../../../assets/json/commands.json';
import Play from './play/play.jsx';
import Contact from './contact/contact.jsx';
import Sidebar from './sidebar/sidebar.jsx';
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faMusic, faCogs } from '@fortawesome/free-solid-svg-icons';
import './docs.css';
library.add(faCheck);
library.add(faMusic);
library.add(faCogs);

export default class Docs extends React.Component {
    constructor(props) {
        super();
        let page = null;
        const goodCommand = props.command;
        if (goodCommand === 'play') {
            page = <Play />;
        }
        else if (goodCommand === 'contact') {
            page = <Contact />;
        }
        this.state = {
            command: goodCommand,
            page: page
        };
        window.document.addEventListener('scroll', (e) => {
            $('.toggleSideMenu').css('transform', 'translateY(' + e.path[1].scrollY + 'px)');
            $('.radio_container').css('transform', 'translateY(' + e.path[1].scrollY + 'px)');
        });
    }

    componentDidMount() {
        // Appear effect
        setTimeout(() => {
            $('.syx_container h1').addClass('load');
            if ($('.docs_panel')) {
                setTimeout(() => {
                    $('.docs_panel').addClass('load');
                }, 300);
            }
            if ($('.div_docs_content_command')) {
                setTimeout(() => {
                    $('.div_docs_content_command').addClass('load');
                }, 400);
            }
            if (this.state.command === 'contact') {
                if ($('.docs-contact')) {
                    setTimeout(() => {
                        $('.docs-contact').addClass('load');
                    }, 400);
                }
            }
        }, 200);
    }

    handleMouseEnter(index) {
        // Set hover effect for sidebar element
        $('#command_list a')[index].style.color = 'rgb(93, 67, 126)';
        $('#command_list a')[index].style.letterSpacing = '5px';
        $('#command_list a')[index].style.background = '#f0f0f0';
        $('#command_list a')[index].style.borderLeft = '5px solid rgba(93, 67, 126, 0.74)';
        $('#command_list a')[index].style.boxShadow = '-5px 0px 4px rgb(93, 67, 126, 1)';
    }

    handleMouseLeave(index) {
        // Remove hover effect for sidebar element
        $('#command_list a')[index].style.color = '';
        $('#command_list a')[index].style.background = '';
        $('#command_list a')[index].style.borderLeft = '';
        $('#command_list a')[index].style.boxShadow = '';
        $('#command_list a')[index].style.letterSpacing = '';
    }

    handleMouseEnterContactBtn() {
        // Set hover effect for sidebar contact element
        $('.components')[0].children[1].children[0].style.color = 'rgb(93, 67, 126)';
        $('.components')[0].children[1].style.letterSpacing = '5px';
        $('.components')[0].children[1].style.background = '#f0f0f0';
        $('.components')[0].children[1].children[0].style.borderLeft = '5px solid rgba(93, 67, 126, 0.74)';
        $('.components')[0].children[1].style.boxShadow = '-5px 0px 4px rgb(93, 67, 126, 1)';
    }

    handleMouseLeaveContactBtn() {
        // Remove hover effect for sidebar contact element
        $('.components')[0].children[1].children[0].style.color = '';
        $('.components')[0].children[1].style.letterSpacing = '';
        $('.components')[0].children[1].style.background = '';
        $('.components')[0].children[1].children[0].style.borderLeft = '';
        $('.components')[0].children[1].style.boxShadow = '';
    }

    render() {
        if (this.state.page) {
            return (
                <div className='wrapper'>
                    <Sidebar command={this.state.command} />
                    <div id='content' className='content'>
                        {this.state.page}
                    </div>
                </div>
            );
        }
        else {
            return (
                <div className='wrapper'>
                    <Sidebar command={this.state.command} />
                    <div id='content' className='content'>
                        <div className='syx_container'>
                            <h1><FontAwesomeIcon icon='home' />
                                Accueil
                            </h1>
                            <div className='docs_content'>
                                <div className='docs_panel'>
                                    <p className='h5'>Bienvenue sur la docs de syxbot</p>
                                    <p>N'hésitez pas à me contacter pour toute(s) question(s), idée(s) de modification(s), etc ...</p>
                                    <a href='/docs/contact'>
                                        <button
                                            className='contact-btn'
                                            onMouseEnter={this.handleMouseEnterContactBtn}
                                            onMouseLeave={this.handleMouseLeaveContactBtn}
                                        >
                                            Me contacter
                                        </button>
                                    </a>
                                </div>
                                <div className='div_docs_content_command'>
                                    <h4><FontAwesomeIcon icon='check' /> Les commandes disponibles</h4>
                                    {Commands.map((obj, index) => {
                                        return (
                                            <a
                                                href={`/docs/${obj.name.toLowerCase()}`}
                                                className='docs_content_command'
                                                key={index}
                                                onMouseEnter={() => this.handleMouseEnter(index)}
                                                onMouseLeave={() => this.handleMouseLeave(index)}
                                            >
                                                <h5><FontAwesomeIcon icon={obj.icon} />{obj.name}</h5>
                                                <div className='command_desc'>
                                                    <p>{obj.description}</p>
                                                </div>
                                            </a>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }
    }
}

Docs.propTypes = {
    command: PropTypes.string.isRequired
};
