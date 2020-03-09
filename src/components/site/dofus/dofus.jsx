'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import Notes from './notes/notes.jsx';
import Dragodindes from './dragodindes/dragodindes.jsx';
import Fecondator from './fecondator/fecondator.jsx';
import Config from './../../../../config.json';

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
        else {
            window.location.href = Config.OAuth.redirect_url;
        }
        this.state = {
            content: content
        };
    }

    render() {
        if (this.state.content) {
            return (
                this.state.content
            );
        }
        else {
            return (
                <></>
            );
        }
    }
}

Dofus.propTypes = {
    user: PropTypes.oneOfType([
        PropTypes.object.isRequired,
        PropTypes.bool.isRequired
    ]),
    urlArg: PropTypes.string.isRequired
};
