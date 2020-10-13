'use strict';

import React, { useState, useEffect } from 'react';
import { userType } from '../../../@types/user';
import PropTypes from 'prop-types';

interface propsType {
    user: userType;
    urlArg: URLSearchParams | boolean;
}

const Warframe = (props: propsType): React.ReactElement => {
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
        if (choice === 'craft' && props.user) {
            console.log('CRAFT CHOICE');
            setContent(<p>content de test</p>);
            // setContent(<Craft user={props.user} urlArg={props.urlArg} />);
            // setContent(<Craft urlArg={props.urlArg} />);
        }
    };

    return (
        <>
            <div className='dofus-menu-container'>
                <a href='#?p=craft'>
                    <h5
                        className={menuChoice === 'craft' ? 'active' : ''}
                        onClick={(): void => setChoice('craft')}
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

Warframe.propTypes = {
    user: PropTypes.oneOfType([
        PropTypes.object.isRequired,
        PropTypes.bool.isRequired
    ]),
    urlArg: PropTypes.oneOfType([
        PropTypes.object.isRequired,
        PropTypes.bool.isRequired
    ])
};

export default Warframe;
