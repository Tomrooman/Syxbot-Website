'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import Notes from './notes/notes.jsx';
import Dragodindes from './dragodindes/dragodindes.jsx';
import Fecondator from './fecondator/fecondator.jsx';

import './dofus.css';

export default class Dofus extends React.Component {
    constructor(props) {
        super(props);
        let content = false;
        if (this.props.urlArg === 'notes' && this.props.user) {
            content = <Notes user={this.props.user} />;
        }
        else if (this.props.urlArg === 'dragodindes' && this.props.user) {
            content = <Dragodindes user={this.props.user} />;
        }
        else if (this.props.urlArg === 'fecondator' && this.props.user) {
            content = <Fecondator user={this.props.user} />;
        }
        this.state = {
            content: content
        };
    }

    setContent(param) {
        this.setState({
            content: param
        });
    }

    render() {
        if (this.state) {
            return (
                this.state.content ?
                    this.state.content :
                    <>
                        <div className='top-infos' />
                        <div className='principal-container home-menu'>
                            <a href='/dofus/notes'>
                                <button className='btn btn-infos'>
                                    Mes notes {!this.props.user ? <div className='dofus-need-connection'>connexion nécessaire</div> : ''}
                                </button>
                            </a>
                            <button className='btn btn-craft'>Crafts</button>
                            <button className='btn btn-parchemin'>Parchemins</button>
                            <button className='btn btn-gestation'>Gestation des dragodindes</button>
                            <a href='/dofus/dragodindes'>
                                <button className='btn btn-mydd'>
                                    Mes dragodindes {!this.props.user ? <div className='dofus-need-connection'>connexion nécessaire</div> : ''}
                                </button>
                            </a>
                            <a href='/dofus/fecondator'>
                                <button className='btn btn-fecondation-calculator'>
                                    Fécondator {!this.props.user ? <div className='dofus-need-connection'>connexion nécessaire</div> : ''}
                                </button>
                            </a>
                        </div>
                    </>
            );
        }
        return (
            <></>
        );
    }
}

Dofus.propTypes = {
    user: PropTypes.oneOfType([
        PropTypes.object.isRequired,
        PropTypes.bool.isRequired
    ]),
    urlArg: PropTypes.string.isRequired
};
