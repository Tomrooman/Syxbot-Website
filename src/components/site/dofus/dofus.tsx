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
    const [menuChoice, setMenuChoice] = useState(props.urlArg);

    useEffect(() => {
        if (!loaded) {
            setContentFunc(menuChoice);
            setLoaded(true);
        }
    });

    const setChoice = (choice: string): void => {
        if (choice !== menuChoice) {
            setMenuChoice(choice);
            setContentFunc(choice);
        }
    };

    const setContentFunc = (choice: string): void => {
        if (choice === 'notes' && props.user) {
            setContent(<Notes />);
        } else if (choice === 'dragodindes' && props.user) {
            setContent(<Dragodindes />);
        } else if (choice === 'fecondator' && props.user) {
            setContent(<Fecondator user={props.user} />);
        } else if (choice === 'craft') {
            setContent(<Craft />);
        }
    };

    // return (
    //     String(content.type) !== 'Symbol(react.fragment)' ? content : <></>
    // );
    return (
        <>
            <div className='dofus-menu-container'>
                <a href='#notes'>
                    <h5
                        className={menuChoice === 'notes' ? 'active' : ''}
                        onClick={() => setChoice('notes')}
                    >
                        Mes notes
                    </h5>
                </a>
                <a href='#dragodindes'>
                    <h5
                        className={menuChoice === 'dragodindes' ? 'active' : ''}
                        onClick={() => setChoice('dragodindes')}
                    >
                        Mes dragodindes
                    </h5>
                </a>
                <a href='#fecondator'>
                    <h5
                        className={menuChoice === 'fecondator' ? 'active' : ''}
                        onClick={() => setChoice('fecondator')}
                    >
                        Fécondator
                    </h5>
                </a>
            </div>
            {String(content.type) !== 'Symbol(react.fragment)' ?
                content :
                <div>
                    <h1>Veuillez faire un choix</h1>
                </div>}
        </>
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
