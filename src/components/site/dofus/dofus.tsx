'use strict';

import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Notes from './notes/notes';
import Dragodindes from './dragodindes/dragodindes';
import Fecondator from './fecondator/fecondator';
import Craft from './craft/craft';
import { userType } from '../../../@types/user';

import './dofus.css';
import './dofus_menu.css';

interface propsType {
    user: userType;
    urlArg: string;
}

const Dofus = (props: propsType): React.ReactElement => {
    const [content, setContent] = useState(<></>);
    const [loaded, setLoaded] = useState(false);

    useEffect((): void => {
        if (!loaded) {
            if (props.urlArg === 'notes' && props.user) {
                setContent(<Notes />);
            } else if (props.urlArg === 'dragodindes' && props.user) {
                setContent(<Dragodindes />);
            } else if (props.urlArg === 'fecondator' && props.user) {
                setContent(<Fecondator user={props.user} />);
            } else if (props.urlArg === 'craft') {
                setContent(<Craft />);
            }
            setLoaded(true);
        }
    });

    // return (
    //     String(content.type) !== 'Symbol(react.fragment)' ? content : <></>
    // );
    return (
        <div className='dofus-menu-container'>
            <h5>Mes notes</h5>
            <h5>Mes dragodindes</h5>
            <h5>Fécondator</h5>
        </div>
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
