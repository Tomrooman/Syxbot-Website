'use strict';

import React, { useState, useEffect } from 'react';
import { useCookies } from 'react-cookie';
import PropTypes from 'prop-types';
// import VoiceRecognition from './voiceRecognition.jsx';
import { library } from '@fortawesome/fontawesome-svg-core';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAssistiveListeningSystems, faBookOpen, faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import Config from './../../../config.json';
import Axios from 'axios';
import $ from 'jquery';
import './site.css';
import Sidebar from './sidebar/sidebar';
import Dofus from './dofus/dofus';
import { sessionDataType } from '../../@types/user';

library.add(faAssistiveListeningSystems);
library.add(faBookOpen);
library.add(faPlusCircle);

interface propsType {
    page: string;
    urlArg: URLSearchParams | boolean;
}

const Site = (props: propsType): React.ReactElement => {
    const [randStr, setRandStr] = useState('');
    const [cookies] = useCookies(['syxbot']);
    const [user] = useState(cookies.syxbot || false);
    const [page, setPage] = useState(<></>);
    const [loaded, setLoaded] = useState(false);

    useEffect((): void => {
        if (!loaded) {
            window.document.addEventListener('scroll', (e: any) => {
                $('.radio_container').css('transform', 'translateY(' + e.path[1].scrollY + 'px)');
            });
            const fragment = new URLSearchParams(window.location.search);
            if (fragment.has('code')) {
                connectUser(fragment);
            } else if (user) {
                localStorage.removeItem('stateParameter');
                verifyTokenExpiration();
            } else {
                generateRandomString();
            }
            if (props.page === 'dofus') {
                setPage(<Dofus user={user} urlArg={props.urlArg} />);
            }
            setLoaded(true);
        }
    });

    const verifyTokenExpiration = async (): Promise<void> => {
        const diffH = Math.floor((user.expire_at - (Date.now() / 1000)) / 3600);
        // Max diffH => 167
        if (diffH <= 10) {
            try {
                const { data } = await Axios.post('/api/token/expiration', { token: Config.security.token, type: 'site' });
                if (data) {
                    updateTokenAPI(data);
                }
            } catch (e) {
                console.log('Error /api/token/expiration : ', e.message);
            }
        }
    };

    const connectUser = async (fragment: URLSearchParams): Promise<void> => {
        const urlState = String(fragment.get('state'));
        const code = fragment.get('code');
        const stateParameter = localStorage.getItem('stateParameter');
        if (stateParameter === encodeURIComponent(urlState)) {
            try {
                const { data } = await Axios.post('/api/token/connect', { code: code, token: Config.security.token, type: 'site' });
                if (data) {
                    return updateTokenAPI(data);
                }
                window.location.href = Config.OAuth.redirect_url;
            } catch (e) {
                console.log('Error /api/token/connect : ', e.message);
            }
        } else {
            alert('Bad state parameter ! Réessayez de vous connecter');
            generateRandomString();
        }
    };

    const updateTokenAPI = async (tokenObj: sessionDataType): Promise<void> => {
        tokenObj.token = Config.security.token;
        try {
            const res = await Axios.post('/api/token/update', tokenObj);
            if (res.data) {
                window.location.href = Config.OAuth.redirect_url;
            }
        } catch (e) {
            console.log('Error /api/token/update : ', e.message);
        }
    };

    const disconnect = async (): Promise<void> => {
        try {
            const { data } = await Axios.post('/api/token/remove', { token: Config.security.token, type: 'site' });
            if (data) {
                window.location.href = Config.OAuth.redirect_url;
            }
        } catch (e) {
            console.log('Error /api/token/remove : ', e.message);
        }
    };

    const generateRandomString = (): void => {
        const rand = Math.floor(Math.random() * 10);
        let generateRandStr = '';
        for (let i = 0; i < 20 + rand; i++) {
            generateRandStr += String.fromCharCode(33 + Math.floor(Math.random() * 94));
        }
        generateRandStr = encodeURIComponent(generateRandStr);
        setRandStr(generateRandStr);
        localStorage.setItem('stateParameter', generateRandStr);
    };

    if (loaded && (randStr || user)) {
        return (
            <>
                <Sidebar
                    randStr={randStr}
                    user={user}
                    disconnect={disconnect}
                    page={props.page}
                />
                <div className='website-container'>
                    {String(page.type) !== 'Symbol(react.fragment)' ?
                        page :
                        <div className='home-container' />}
                </div>
            </>);
    } else if (props.page === '/') {
        return (
            <table className='loading-table'>
                <tbody>
                    <tr>
                        <td className='align-middle loading-td'>
                            <h1>Syxbot</h1>
                            <div className='custom-spinner' />
                        </td>
                    </tr>
                </tbody>
            </table>
        );
    } else {
        return (
            <>
            </>
        );
    }
};

Site.propTypes = {
    page: PropTypes.string.isRequired,
    urlArg: PropTypes.oneOfType([
        PropTypes.object.isRequired,
        PropTypes.bool.isRequired
    ])
};

export default Site;
