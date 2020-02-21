'use strict';

import React from 'react';
import $ from 'jquery';
import Cookies from 'universal-cookie';
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretSquareUp } from '@fortawesome/free-solid-svg-icons';
import './radio.css';
library.add(faCaretSquareUp);

const cookies = new Cookies();

export default class Radio extends React.Component {
    constructor() {
        super();
        this.state = {
            dropdown_title: 'Radios disponibles',
            index: '',
            radioName: '',
            radio: cookies.get('syxbot_radio') || false
        };
        this.createRadiosArray();
        this.handlePlay = this.handlePlay.bind(this);
        this.handlePause = this.handlePause.bind(this);
        this.handleVolumeChange = this.handleVolumeChange.bind(this);
    }

    componentDidMount() {
        $('.radio_png').css('display', 'none');
        if (this.state.radio && this.state.radio.index) {
            const index = this.state.radio.index;
            const playArg = this.state.radio.play;
            const imagePath = $('#radio_choices')[0].children[index].getAttribute('image');
            const radioUrl = $('#radio_choices')[0].children[index].value;
            const radioName = this.state.radio.name;
            const volume = this.state.radio.volume;
            this.setRadioSourceAndInfos(imagePath, radioUrl, index, radioName, volume);
            if (!playArg) {
                $('audio')[0].removeAttribute('autoPlay');
                this.setState({
                    dropdown_title: radioName.indexOf('&amp;') !== -1 ? radioName.split('&amp;').join(' & ') : radioName
                });
            }
        }
        else {
            $('audio')[0].volume = 0.2;
        }
    }

    createRadiosArray() {
        this.radios = [
            { name: 'Nrj', image: '/img/radio/nrj.png', url: 'https://scdn.nrjaudio.fm/fr/30001/aac_64.mp3?origine=playerweb;playerid:nrj&origine=playernrj&aw_0_req.userConsent=BOvEk5hOvEk5hAKAABENC9-AAAAuFr_7__7-_9_-_f__9uj3Or_v_f__32ccL59v_h_7v-_7fi_20nV4u_1vft9yfk1-5ctDztp507iakiPHmqNeb9n9mz1e5pRP78k89r7337Ew_v8_v-b7BCON_YxE&cdn_path=audio_lbs7' },
            { name: 'Subarashii', image: '/img/radio/subarashii.png', url: 'https://listen.radionomy.com/subarashii.mp3' },
            { name: 'Bel RTL', image: '/img/radio/bel-rtl.png', url: 'https://belrtl.ice.infomaniak.ch/belrtl-mp3-128.mp3' },
            { name: 'Contact', image: '/img/radio/contact.png', url: 'https://radiocontact.ice.infomaniak.ch/radiocontact-mp3-128.mp3' },
            { name: 'Nostalgie BE', image: '/img/radio/nostalgie-be.png', url: 'https://streamingp.shoutcast.com/NostalgiePremium-mp3' },
            { name: 'Nostalgie FR', image: '/img/radio/nostalgie-fr.png', url: 'https://scdn.nrjaudio.fm/fr/30601/aac_64.mp3?origine=playerweb;playerid:nostalgie&origine=playernostalgie&aw_0_req.userConsent=BOvHTQ8OvHTQ8AKAABENC--AAAAuhr_7__7-_9_-_f__9uj3Or_v_f__32ccL59v_h_7v-_7fi_20nV4u_1vft9yfk1-5ctDztp507iakiPHmqNeb9n9mz1e5pRP78k89r7337Ew_v8_v-b7BCON_YxEiA&cdn_path=audio_lbs8' },
            { name: 'Classic 21', image: '/img/radio/classic21.png', url: 'https://radios.rtbf.be/classic21-128.mp3' },
            { name: 'Pure FM', image: '/img/radio/pure-fm.png', url: 'https://radios.rtbf.be/pure-128.mp3' },
            { name: 'Musiq\'3', image: '/img/radio/musiq3.png', url: 'https://radios.rtbf.be/musiq3-128.mp3' },
            { name: 'VivaCité', image: '/img/radio/vivacite.png', url: 'https://radios.rtbf.be/vivabxl-128.mp3' },
            { name: 'Fun Radio', image: '/img/radio/fun-radio.png', url: 'https://icecast.rtl.fr/fun-1-44-128' },
            { name: 'Rire & Chansons', image: '/img/radio/rire&chansons.png', url: 'https://scdn.nrjaudio.fm/audio1/fr/30401/mp3_128.mp3?origine=fluxradios' },
            { name: 'Virgin', image: '/img/radio/virgin.png', url: 'https://ais-live.cloud-services.paris:8443/virgin.aac?aw_0_1st.playerid=lagardereWebVirgin' },
            { name: 'RFM', image: '/img/radio/rfm.png', url: 'https://ais-live.cloud-services.paris:8443/rfm.aac?aw_0_1st.playerid=lgrdrnwsRadiofrRFM' },
            { name: 'RMC', image: '/img/radio/rmc.png', url: 'https://rmc.bfmtv.com/rmcinfo-mp3' },
            { name: 'BFM Business', image: '/img/radio/bfm-business.png', url: 'https://chai5she.cdn.dvmr.fr/bfmbusiness' },
            { name: 'Jazz', image: '/img/radio/jazz.png', url: 'https://jazzradio.ice.infomaniak.ch/jazzradio-high.mp3' },
            { name: 'Chérie FM', image: '/img/radio/cherie-fm.png', url: 'https://scdn.nrjaudio.fm/audio1/fr/30201/mp3_128.mp3?origine=fluxradios' },
            { name: 'Europe 1', image: '/img/radio/europe1.png', url: 'https://ais-live.cloud-services.paris:8443/europe1.mp3?aw_0_1st.playerid=lgrdrnwsRadiofrE1' },
            { name: 'RTL', image: '/img/radio/rtl.png', url: 'https://icecast.rtl.fr/rtl-1-44-128?id=webRTL&aw_0_req.userConsent=BOvHiJgOvHiMPAHABBFRCv-AAAAstrv7__7-_9_-_f__9ujzOr_v_f__30ccL59v_B_zv-_7fi_20jV4u_1vft9yfk1-5ctDztp507iakivXmqdeZ9v_nz3_5phPr8k89r6337EwwAAAAAAAAAAA' },
            { name: 'RTL2', image: '/img/radio/rtl2.png', url: 'https://icecast.rtl.fr/rtl2-1-44-128?listen=webDAQODAkPCwwMAg8EBAIFCQ' },
            { name: 'Classique', image: '/img/radio/classique.png', url: 'https://radioclassique.ice.infomaniak.ch/radioclassique-high.mp3' },
            { name: 'Skyrock', image: '/img/radio/skyrock.png', url: 'https://www.skyrock.fm/stream.php/tunein16_128mp3.mp3' },
            { name: 'France Inter', image: '/img/radio/france-inter.png', url: 'https://direct.franceinter.fr/live/franceinter-midfi.mp3' },
            { name: 'France Culture', image: '/img/radio/france-culture.png', url: 'https://direct.franceculture.fr/live/franceculture-midfi.mp3' },
            { name: 'France Musique', image: '/img/radio/france-musique.png', url: 'https://direct.francemusique.fr/live/francemusique-midfi.mp3' },
            { name: 'France Bleu', image: '/img/radio/france-bleu.png', url: 'https://direct.francebleu.fr/live/fbpicardie-midfi.mp3' }
        ];
    }

    handleClick(image, url, index, radioName) {
        this.setRadioSourceAndInfos(image, url, index, radioName, $('audio')[0].volume);
        this.setRadioCookie(true, index, $('audio')[0].volume, radioName);
        $('audio')[0].play();
    }

    setRadioSourceAndInfos(imagePath, radioUrl, index, radioName, volume) {
        $('.radio_png').css('display', 'initial');
        $('audio')[0].volume = volume;
        const radioImg = document.createElement('img');
        radioImg.src = imagePath;
        $('.radio_png')[0].innerHTML = '';
        $('.radio_png').append(radioImg);
        $('audio')[0].src = radioUrl;
        this.setState({
            dropdown_title: 'Chargement',
            index: index,
            radioName: radioName
        });
    }

    handleVolumeChange() {
        const radioName = this.state.radioName.indexOf('&amp;') !== -1 ? this.state.radioName.split('&amp;').join(' & ') : this.state.radioName;
        if ($('audio')[0].paused) {
            this.setRadioCookie(false, this.state.index, $('audio')[0].volume, radioName);
        }
        else {
            this.setRadioCookie(true, this.state.index, $('audio')[0].volume, radioName);
        }
    }

    handlePause() {
        const radioName = this.state.radioName.indexOf('&amp;') !== -1 ? this.state.radioName.split('&amp;').join(' & ') : this.state.radioName;
        this.setRadioCookie(false, this.state.index, $('audio')[0].volume, radioName);
    }

    handlePlay() {
        const radioName = this.state.radioName.indexOf('&amp;') !== -1 ? this.state.radioName.split('&amp;').join(' & ') : this.state.radioName;
        this.setState({
            dropdown_title: radioName
        });
        this.setRadioCookie(true, this.state.index, $('audio')[0].volume, radioName);
    }

    setRadioCookie(play, index, volume, name) {
        const radioCookie = cookies.get('syxbot_radio');
        if (!radioCookie || (radioCookie && (radioCookie.play !== play || radioCookie.index !== index || radioCookie.volume !== volume || radioCookie.name !== name))) {
            cookies.set('syxbot_radio', {
                play: play,
                index: index,
                volume: volume,
                name: name
            });
        }
    }

    showMenu() {
        if ($('.radio_player').css('display') === 'block') {
            $('.radio_player').css('display', 'none');
            $('.radio_player').css('height', 0);
        }
        else {
            $('.radio_player').css('height', 'auto');
            $('.radio_player').css('display', 'initial');
        }
    }

    render() {
        return (
            <div className='radio_container'>
                <div className='radio_player'>
                    <div className='dropdown'>
                        <button type='button' className='radio_select btn btn-secondary dropdown-toggle' id='dropdownMenu2' data-toggle='dropdown' aria-haspopup='true' aria-expanded='false'>
                            {this.state.dropdown_title === 'Chargement' ?
                                <span>{this.state.dropdown_title} <div className='custom-spinner-radio' /></span> :
                                'Radios disponibles'}
                            <FontAwesomeIcon icon='caret-square-up' />
                        </button>
                        <div id='radio_choices' className='dropdown-menu dropdown-menu-right' aria-labelledby='dropdownMenu2'>
                            {this.radios.map((obj, index) => {
                                return (
                                    <button
                                        className='dropdown-item'
                                        value={obj.url}
                                        image={obj.image}
                                        index={index}
                                        key={index}
                                        onClick={() => this.handleClick(obj.image, obj.url, index, obj.name)}
                                    >
                                        {obj.name}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                    <audio
                        controls
                        autoPlay
                        onPlay={this.handlePlay}
                        onPause={this.handlePause}
                        onVolumeChange={this.handleVolumeChange}
                    />
                </div>
                <div
                    className='radio_floating'
                    onClick={() => this.showMenu()}
                >
                    <div className='radio_name'>
                        <div className='radio_png'>
                            <img src='#' alt='radio_img' />
                        </div>
                        {this.state.radioName ?
                            this.state.dropdown_title === 'Chargement' ? <span>Chargement  <div className='custom-spinner-radio' /></span> : this.state.radioName :
                            'Aucune radio en écoute'}
                        <div className='radio_click_text'>
                            Cliquez pour ouvrir le menu
                        </div>
                    </div>
                    <div className='radio_icon'>
                        <img src='/img/radio.png' alt='radio_icon' />
                    </div>
                </div>
            </div>
        );
    }
}
