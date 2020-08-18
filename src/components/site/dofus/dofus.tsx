'use strict';

import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Enclos from './enclos/enclos';
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
        if (choice === 'enclos' && props.user) {
            setContent(<Enclos />);
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
                <a href='#enclos'>
                    <h5
                        className={menuChoice === 'enclos' ? 'active' : ''}
                        onClick={() => setChoice('enclos')}
                    >
                        Mes enclos
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
                <a href='#craft'>
                    <h5
                        className={menuChoice === 'craft' ? 'active' : ''}
                        onClick={() => setChoice('craft')}
                    >
                        Craft
                    </h5>
                </a>
            </div>
            {String(content.type) !== 'Symbol(react.fragment)' ?
                content :
                <div className='dofus-no-choice'>
                    <h1>Aucune catégorie sélectionnée</h1>
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
