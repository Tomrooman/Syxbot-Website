'use strict';

import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Notes from './notes/notes.jsx';
import Dragodindes from './dragodindes/dragodindes.jsx';
import Fecondator from './fecondator/fecondator.jsx';
import Craft from './craft/craft.jsx';
import Config from './../../../../config.json';

import './dofus.css';

const Dofus = (props) => {
    const [content, setContent] = useState(false);
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        if (!loaded) {
            if (props.urlArg === 'notes' && props.user) {
                setContent(<Notes user={props.user} />);
            }
            else if (props.urlArg === 'dragodindes' && props.user) {
                setContent(<Dragodindes user={props.user} />);
            }
            else if (props.urlArg === 'fecondator' && props.user) {
                setContent(<Fecondator user={props.user} />);
            }
            else if (props.urlArg === 'craft') {
                setContent(<Craft user={props.user} />);
            }
            else {
                window.location.href = Config.OAuth.redirect_url;
            }
            setLoaded(true);
        }
    });

    if (content) {
        return (
            content
        );
    }
    else {
        return (
            <></>
        );
    }
};

Dofus.propTypes = {
    user: PropTypes.oneOfType([
        PropTypes.object.isRequired,
        PropTypes.bool.isRequired
    ]),
    urlArg: PropTypes.string.isRequired
};

export default Dofus;
