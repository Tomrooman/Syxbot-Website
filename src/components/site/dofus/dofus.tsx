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
    urlArg: URLSearchParams | boolean;
}

const Dofus = (props: propsType): React.ReactElement => {
    const [content, setContent] = useState(<></>);
    const [loaded, setLoaded] = useState(false);
    const [menuChoice, setMenuChoice] = useState((props.urlArg as URLSearchParams).get('p') || '');

    useEffect(() => {
        if (!loaded) {
            setContentFunc(menuChoice);
            setLoaded(true);
        }
    });

    const setChoice = (choice: string): void => {
        if (choice !== menuChoice || choice === 'craft') {
            setMenuChoice(choice);
            setContentFunc(choice);
        }
    };

    const setContentFunc = (choice: string): void => {
        if (choice === 'enclos' && props.user && (menuChoice !== choice || !loaded)) {
            setContent(<Enclos />);
        } else if (choice === 'dragodindes' && props.user && (menuChoice !== choice || !loaded)) {
            setContent(<Dragodindes />);
        } else if (choice === 'fecondator' && props.user && (menuChoice !== choice || !loaded)) {
            setContent(<Fecondator user={props.user} />);
        } else if (choice === 'craft') {
            // setContent(<Craft user={props.user} urlArg={props.urlArg} />);
            setContent(<Craft urlArg={props.urlArg} />);
        }
    };

    return (
        <>
            <div className='dofus-menu-container'>
                <a href='#?p=enclos'>
                    <h5
                        className={menuChoice === 'enclos' ? 'active' : ''}
                        onClick={() => setChoice('enclos')}
                    >
                        Mes enclos
                    </h5>
                </a>
                <a href='#?p=dragodindes'>
                    <h5
                        className={menuChoice === 'dragodindes' ? 'active' : ''}
                        onClick={() => setChoice('dragodindes')}
                    >
                        Mes dragodindes
                    </h5>
                </a>
                <a href='#?p=fecondator'>
                    <h5
                        className={menuChoice === 'fecondator' ? 'active' : ''}
                        onClick={() => setChoice('fecondator')}
                    >
                        Fécondator
                    </h5>
                </a>
                <a href='#?p=craft'>
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
    urlArg: PropTypes.oneOfType([
        PropTypes.object.isRequired,
        PropTypes.bool.isRequired
    ])
};

export default Dofus;
