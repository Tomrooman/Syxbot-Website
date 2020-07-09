'use strict';

import React, { useState, useEffect } from 'react';
import { withCookies, Cookies } from 'react-cookie';
import PropTypes, { instanceOf } from 'prop-types';
// import VoiceRecognition from './voiceRecognition.jsx';
import FormData from 'form-data';
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAssistiveListeningSystems, faBookOpen } from '@fortawesome/free-solid-svg-icons';
import Config from './../../../config.json';
import Axios from 'axios';
import $ from 'jquery';
import './site.css';
import Navbar from './navbar/navbar.jsx';
import Dofus from './dofus/dofus.jsx';

library.add(faAssistiveListeningSystems);
library.add(faBookOpen);

const Site = (props) => {
    const [randStr, setRandStr] = useState(false);
    const [user] = useState(props.cookies.get('syxbot', { path: '/' }) || false);
    const [page, setPage] = useState(false);
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        if (!loaded) {
            window.document.addEventListener('scroll', (e) => {
                $('.toggleSideMenuWeb').css('transform', 'translateY(' + e.path[1].scrollY + 'px)');
                $('.radio_container').css('transform', 'translateY(' + e.path[1].scrollY + 'px)');
            });
            const fragment = new URLSearchParams(window.location.search);
            if (fragment.has('code')) {
                connectUser(fragment);
            }
            else if (user) {
                verifyTokenExpiration();
            }
            else {
                generateRandomString();
            }
            if (props.page === 'dofus') {
                setPage(<Dofus user={user} urlArg={props.urlArg} />);
            }
            setLoaded(true);
        }
    });

    const verifyTokenExpiration = () => {
        const diffH = Math.floor((user.expire_at - (Date.now() / 1000)) / 3600);
        if (diffH <= 10) {
            Axios.post('/api/token/get', { userId: user.id })
                .then(res => {
                    const data = new FormData();
                    data.append('client_id', Config.clientId);
                    data.append('client_secret', Config.secret);
                    data.append('grant_type', 'refresh_token');
                    data.append('refresh_token', res.data.refresh_token);
                    data.append('redirect_uri', Config.OAuth.redirect_url);
                    data.append('scope', Config.OAuth.scope);
                    getToken(data);
                });
        }
    };

    const connectUser = (fragment) => {
        const urlState = fragment.get('state');
        const code = fragment.get('code');
        const stateParameter = localStorage.getItem('stateParameter');
        if (stateParameter === encodeURIComponent(urlState)) {
            const data = new FormData();
            data.append('client_id', Config.clientId);
            data.append('client_secret', Config.secret);
            data.append('grant_type', 'authorization_code');
            data.append('redirect_uri', Config.OAuth.redirect_url);
            data.append('scope', Config.OAuth.scope);
            data.append('code', code);
            getToken(data);
        }
        else {
            alert('Bad state parameter ! Réessayez de vous connecter');
            generateRandomString();
        }
    };

    const getToken = (data) => {
        Axios.post('https://discordapp.com/api/oauth2/token', data)
            .then(res => {
                Axios.get('https://discordapp.com/api/users/@me', {
                    headers: {
                        authorization: `${res.data.token_type} ${res.data.access_token}`
                    }
                })
                    .then(me => {
                        const tokenObj = {
                            ...res.data,
                            userId: me.data.id,
                            username: me.data.username,
                            discriminator: me.data.discriminator
                        };
                        updateTokenAPI(tokenObj);
                    });
            })
            .catch(() => {
                setTimeout(() => {
                    window.location.href = Config.OAuth.redirect_url;
                }, 1000);
            });
    };

    const updateTokenAPI = (tokenObj) => {
        Axios.post('/api/token/update', tokenObj)
            .then(() => {
                const oneDay = 1000 * 60 * 60 * 24;
                const expireDate = new Date(Date.now() + (oneDay * 10));
                props.cookies.set('syxbot', {
                    username: tokenObj.username,
                    discriminator: tokenObj.discriminator,
                    id: tokenObj.userId,
                    token_type: tokenObj.token_type,
                    expire_at: (Date.now() / 1000) + tokenObj.expires_in,
                    countdown: true
                }, {
                    path: '/',
                    expires: expireDate
                });
                window.location.href = Config.OAuth.redirect_url;
            });
    };

    const disconnect = () => {
        Axios.post('/api/token/remove', { userId: user.id })
            .then(remove => {
                if (remove) {
                    props.cookies.remove('syxbot', { path: '/' });
                    window.location.reload();
                }
            });
    };

    const generateRandomString = () => {
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
                <Navbar
                    randStr={randStr}
                    user={user}
                    disconnect={disconnect}
                    page={props.page}
                    urlArg={props.urlArg}
                />
                <div className='website-container'>
                    {page ||
                        <div className='home-container'>
                            <div className='home-top-infos'>
                                <h1 className='page-title'>Site en construction</h1>
                                <div className='docs_panel'>
                                    <p className='h5'>Bienvenue sur le site de syxbot</p>
                                    <p>N'hésitez pas à me contacter pour toute(s) question(s), idée(s) de modification(s) ou si vous avez des compétences front-end et que vous souhaitez mettre vos compétences à profit sur ce site.</p>
                                    <p className='formOrMail'>Utilisez le formulaire ou contactez moi à cette adresse : syxbot@hotmail.com</p>
                                    <a href='/docs/contact'>
                                        <button
                                            className='contact-btn'
                                        >
                                            Me contacter
                                        </button>
                                    </a>
                                    <span className='sidebar-add-bot-btn'>
                                        <a href={Config.OAuth.add_url}>
                                            <FontAwesomeIcon icon='plus-circle' /> Ajouter le bot
                                        </a>
                                    </span>
                                </div>
                            </div>
                        </div>}
                </div>
            </>);
    }
    else if (props.page === '/') {
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
    }
    else {
        return (
            <>
            </>
        );
    }
};

Site.propTypes = {
    page: PropTypes.string.isRequired,
    urlArg: PropTypes.string.isRequired,
    cookies: instanceOf(Cookies).isRequired
};

export default withCookies(Site);
