'use strict';

import React from 'react';
import { withCookies, Cookies } from 'react-cookie';
import PropTypes, { instanceOf } from 'prop-types';
// import VoiceRecognition from './voiceRecognition.jsx';
import FormData from 'form-data';
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Sidebar from './sidebar/sidebar.jsx';
import { faAssistiveListeningSystems, faBookOpen } from '@fortawesome/free-solid-svg-icons';
import Config from './../../../config.json';
import Axios from 'axios';
import $ from 'jquery';
import './site.css';
import Navbar from './navbar/navbar.jsx';
import Dofus from './dofus/dofus.jsx';
import Controls from './controls/controls.jsx';

library.add(faAssistiveListeningSystems);
library.add(faBookOpen);

class Site extends React.Component {
    constructor(props) {
        super(props);
        const { cookies } = props;
        this.generateRandomString = this.generateRandomString.bind(this);
        this.disconnect = this.disconnect.bind(this);
        this.state = {
            randStr: false,
            user: cookies.get('syxbot', { path: '/' }) || false,
            page: false
        };
        window.document.addEventListener('scroll', (e) => {
            $('.toggleSideMenuWeb').css('transform', 'translateY(' + e.path[1].scrollY + 'px)');
            $('.radio_container').css('transform', 'translateY(' + e.path[1].scrollY + 'px)');
        });
    }

    componentDidMount() {
        const fragment = new URLSearchParams(window.location.search);
        let content = false;
        if (fragment.has('code')) {
            this.connectUser(fragment);
        }
        else if (this.state.user) {
            this.verifyTokenExpiration();
        }
        else {
            this.generateRandomString();
        }
        if (this.props.page === 'dofus') {
            content = <Dofus user={this.state.user} urlArg={this.props.urlArg} />;
        }
        else if (this.props.page === 'controls') {
            content = <Controls user={this.state.user} />;
        }
        if (content) {
            this.setState({
                page: content
            });
        }
    }

    verifyTokenExpiration() {
        const diffH = Math.floor((this.state.user.expire_at - (Date.now() / 1000)) / 3600);
        if (diffH <= 10) {
            Axios.post('/api/token/get', { userId: this.state.user.id })
                .then(res => {
                    const data = new FormData();
                    data.append('client_id', Config.clientId);
                    data.append('client_secret', Config.secret);
                    data.append('grant_type', 'refresh_token');
                    data.append('refresh_token', res.data.refresh_token);
                    data.append('redirect_uri', Config.OAuth.redirect_url);
                    data.append('scope', Config.OAuth.scope);
                    this.getToken(data);
                });
        }
    }

    connectUser(fragment) {
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
            this.getToken(data);
        }
        else {
            alert('Bad state parameter ! Réessayez de vous connecter');
            this.generateRandomString();
        }
    }

    getToken(data) {
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
                        this.updateTokenAPI(tokenObj);
                    });
            })
            .catch(() => {
                setTimeout(() => {
                    window.location.href = Config.OAuth.redirect_url;
                }, 1000);
            });
    }

    updateTokenAPI(tokenObj) {
        Axios.post('/api/token/update', tokenObj)
            .then(() => {
                const { cookies } = this.props;
                const oneDay = 1000 * 60 * 60 * 24;
                const expireDate = new Date(Date.now() + (oneDay * 10));
                cookies.set('syxbot', {
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
    }

    disconnect() {
        Axios.post('/api/token/remove', { userId: this.state.user.id })
            .then(remove => {
                if (remove) {
                    const { cookies } = this.props;
                    cookies.remove('syxbot', { path: '/' });
                    window.location.reload();
                }
            });
    }

    generateRandomString() {
        const rand = Math.floor(Math.random() * 10);
        let randStr = '';

        for (let i = 0; i < 20 + rand; i++) {
            randStr += String.fromCharCode(33 + Math.floor(Math.random() * 94));
        }
        randStr = encodeURIComponent(randStr);
        this.setState({
            randStr: randStr
        });
        localStorage.setItem('stateParameter', randStr);
    }

    render() {
        if (this.state && (this.state.randStr || this.state.user)) {
            return (
                <>
                    <Navbar
                        randStr={this.state.randStr}
                        user={this.state.user}
                        disconnect={this.disconnect}
                        page={this.props.page}
                        urlArg={this.props.urlArg}
                    />
                    <div className='website-container'>
                        <Sidebar command={this.props.page} urlArg={this.props.urlArg} user={this.state.user} />
                        {this.state.page ?
                            this.state.page :
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
                                                onMouseEnter={this.handleMouseEnterContactBtn}
                                                onMouseLeave={this.handleMouseLeaveContactBtn}
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
                                <div className='home-infos-container col-12 row'>
                                    <div className='card col-10 col-sm-7 col-md-5 col-lg-5 col-xl-3'>
                                        <img src='/assets/img/voice-recognition.jpg' className='card-img-top' alt='voice_image' />
                                        <div className='card-body'>
                                            <h5 className='card-title'>Reconnaissance vocale</h5>
                                            {this.state.user ?
                                                <p className='card-text'>Maintenant que vous êtes connectés, vous pouvez utilisé la reconnaissance vocale pour demander à Syxbot d'éffectuer certaines commandes.</p> :
                                                <p className='card-text'>Une fois que vous serez connectés gràce à vos identifiants discord, vous pourrez utilisé la reconnaissance vocale pour demander à Syxbot d'éffectuer certaines commandes.</p>}
                                            {this.state.user ?
                                                <a href='/controls' className='btn-home-control'>Contrôler le bot</a> :
                                                <a href={`${Config.OAuth.connection_url}&state=${this.state.randStr}`} className='btn-home-control'>Se connecter</a>}
                                        </div>
                                    </div>
                                    <div className='card col-10 col-sm-7 col-md-5 col-lg-5 col-xl-3'>
                                        <img src='/assets/img/book.jpg' className='card-img-top' alt='doc_image' />
                                        <div className='card-body'>
                                            <h5 className='card-title'>Documentation</h5>
                                            <p className='card-text'>Une documentation est disponible, n'hésitez pas à la consulter si vous souhaitez avoir plus d'informations sur certaines commandes.</p>
                                        </div>
                                        <div className='card-body'>
                                            <a href='/docs' className='btn-home-doc'>Voir la doc</a>
                                        </div>
                                    </div>
                                    <div className='card col-10 col-sm-7 col-md-5 col-lg-5 col-xl-3'>
                                        <img src='/assets/img/dofus.jpg' className='card-img-top' alt='dofus_image' />
                                        <div className='card-body'>
                                            <h5 className='card-title'>Dofus</h5>
                                            <p className='card-text'>Certains outils vous aideront, par exemple pour l'élevage de dragodindes, en vous disant à quel moment utilisé une dragodinde pour qu'elles accouchent toutes en même temps.</p>
                                        </div>
                                        <ul className='list-group list-group-flush'>
                                            <a href='/dofus/notes'>
                                                <li className='list-group-item'>Mes notes</li>
                                            </a>
                                            <a href='/dofus/craft'>
                                                <li className='list-group-item'>Crafts</li>
                                            </a>
                                            <a href='/dofus/parchment'>
                                                <li className='list-group-item'>Parchemins</li>
                                            </a>
                                            <a href='/dofus/gestation'>
                                                <li className='list-group-item'>Temps de gestation</li>
                                            </a>
                                            <a href='/dofus/dragodindes'>
                                                <li className='list-group-item'>Mes dragodindes</li>
                                            </a>
                                            <a href='/dofus/fecondator'>
                                                <li className='list-group-item'>Fécondator</li>
                                            </a>
                                        </ul>
                                    </div>
                                </div>
                            </div>}
                    </div>
                </>);
        }
        else {
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
    }
}

Site.propTypes = {
    page: PropTypes.string.isRequired,
    urlArg: PropTypes.string.isRequired,
    cookies: instanceOf(Cookies).isRequired
};

export default withCookies(Site);
