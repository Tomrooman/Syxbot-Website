'use strict';

import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Notes from './notes/notes';
import Dragodindes from './dragodindes/dragodindes';
import Fecondator from './fecondator/fecondator';
import Craft from './craft/craft';
import Config from './../../../../config.json';
import { userType } from '../../../@types/user';

import './dofus.css';

interface propsType {
    user: userType;
    urlArg: string;
}

const Dofus = (props: propsType): React.ReactElement => {
    const [content, setContent] = useState(<></>);
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        if (!loaded) {
            if (props.urlArg === 'notes' && props.user) {
                setContent(<Notes />);
            } else if (props.urlArg === 'dragodindes' && props.user) {
                setContent(<Dragodindes />);
            } else if (props.urlArg === 'fecondator' && props.user) {
                setContent(<Fecondator user={props.user} />);
            } else if (props.urlArg === 'craft') {
                setContent(<Craft />);
            } else {
                window.location.href = Config.OAuth.redirect_url;
            }
            setLoaded(true);
        }
    });

    return (
        content || <></>
    );
};

Dofus.propTypes = {
    user: PropTypes.oneOfType([
        PropTypes.object.isRequired,
        PropTypes.bool.isRequired
    ]),
    urlArg: PropTypes.string.isRequired
};

export default Dofus;
