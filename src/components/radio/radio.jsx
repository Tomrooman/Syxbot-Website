'use strict';

import React from 'react';
import $ from 'jquery';
import { instanceOf } from 'prop-types';
import { withCookies, Cookies } from 'react-cookie';
import Radios from './../../../assets/json/radios.json';
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretUp } from '@fortawesome/free-solid-svg-icons';
import './radio.css';

library.add(faCaretUp);

class Radio extends React.Component {
    constructor(props) {
        super(props);
        const { cookies } = props;
        this.state = {
            dropdown_title: 'Radios disponibles',
            index: '',
            radioName: '',
            radio: cookies.get('syxbot_radio', { path: '/' }) || false
        };
        this.handlePlay = this.handlePlay.bind(this);
        this.handlePause = this.handlePause.bind(this);
        this.handleVolumeChange = this.handleVolumeChange.bind(this);
        this.handleTogglePlay = this.handleTogglePlay.bind(this);
        this.handleClick = this.handleClick.bind(this);
    }

    componentDidMount() {
        $('.radio_png').css('display', 'none');
        if (this.state.radio && this.state.radio.index) {
            const index = this.state.radio.index;
            const playArg = this.state.radio.play;
            const imagePath = $('#radio_choices')[0].children[index].getAttribute('image');
            const radioUrl = $('#radio_choices')[0].children[index].getAttribute('url');
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
        else if (this.state.radio && this.state.radio.volume) {
            const volume = this.state.radio.volume;
            $('audio')[0].volume = volume;
            $('.slider')[0].value = volume * 100;
        }
        else {
            $('audio')[0].volume = 0.2;
            $('.slider')[0].value = 20;
        }
    }

    handleClick(e) {
        const image = e.target.getAttribute('image');
        const url = e.target.getAttribute('url');
        const index = e.target.getAttribute('index');
        const radioName = e.target.getAttribute('name');
        this.setRadioSourceAndInfos(image, url, index, radioName, $('audio')[0].volume);
        this.setRadioCookie(true, index, $('audio')[0].volume, radioName);
        $('audio')[0].play();
    }

    setRadioSourceAndInfos(imagePath, radioUrl, index, radioName, volume) {
        $('.radio_png').css('display', 'initial');
        $('audio')[0].volume = volume;
        $('.slider')[0].value = volume * 100;
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

    handleVolumeChange(e) {
        const radioName = this.state.radioName.indexOf('&amp;') !== -1 ? this.state.radioName.split('&amp;').join(' & ') : this.state.radioName;
        $('audio')[0].volume = parseInt(e.target.value, 10) / 100;
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

    handleTogglePlay() {
        if (this.state.radioName) {
            if ($('audio')[0].paused) {
                $('audio')[0].play();
            }
            else {
                $('audio')[0].pause();
            }
        }
    }

    setRadioCookie(play, index, volume, name) {
        const { cookies } = this.props;
        const radioCookie = cookies.get('syxbot_radio', { path: '/' });
        if (!radioCookie || (radioCookie && (radioCookie.play !== play || radioCookie.index !== index || radioCookie.volume !== volume || radioCookie.name !== name))) {
            const oneDay = 1000 * 60 * 60 * 24;
            const expireDate = new Date(Date.now() + (oneDay * 10));
            cookies.set('syxbot_radio', {
                play: play,
                index: index,
                volume: volume,
                name: name
            }, {
                path: '/',
                expires: expireDate
            });
            this.setState({
                radio: {
                    play: play,
                    index: index,
                    volume: volume,
                    name: name
                }
            });
        }
    }

    showMenu() {
        if ($('.radio_player').css('opacity') === '1') {
            $('.radio_player').css('opacity', 0);
            $('.radio_player').css('transform', 'translateY(-50px)');
            $('.radio_player').css('visibility', 'hidden');
        }
        else {
            $('.radio_player').css('opacity', 1);
            $('.radio_player').css('transform', 'translateY(0px)');
            $('.radio_player').css('visibility', 'visible');
        }
    }

    render() {
        return (
            <div className='radio_container'>
                <div className='radio_player'>
                    <div className='dropdown'>
                        <button type='button' className='radio_select dropdown-toggle' id='dropdownMenu2' data-toggle='dropdown' aria-haspopup='true' aria-expanded='false'>
                            {this.state.dropdown_title === 'Chargement' ?
                                <span>{this.state.dropdown_title} <div className='custom-spinner-radio' /></span> :
                                'Radios disponibles'}
                            <FontAwesomeIcon icon='caret-up' />
                        </button>
                        <div id='radio_choices' className='dropdown-menu dropdown-menu-right' aria-labelledby='dropdownMenu2'>
                            {Radios.map((obj, index) => {
                                return (
                                    <button
                                        className='dropdown-item'
                                        url={obj.url}
                                        image={`/assets/img/radio/${obj.name.toLowerCase()}.png`}
                                        key={index}
                                        index={index}
                                        name={obj.name}
                                        onClick={this.handleClick}
                                    >
                                        {obj.name}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                    <audio
                        autoPlay
                        onPlay={this.handlePlay}
                        onPause={this.handlePause}
                    />
                    <div className='radio_controls col-12'>
                        <div
                            className='radio_controls_play col-3'
                            onClick={this.handleTogglePlay}
                        >
                            {this.state.radio && this.state.radio.play ? <FontAwesomeIcon icon='pause' /> : <FontAwesomeIcon icon='play' />}
                        </div>
                        <div className='slidecontainer col-9'>
                            <input
                                type='range'
                                min='1'
                                max='100'
                                className='slider'
                                id='myRange'
                                onChange={this.handleVolumeChange}
                            />
                        </div>
                    </div>
                </div>
                <div
                    className='radio_floating'
                    onClick={this.showMenu}
                >
                    <div className='radio_name'>
                        <div className='radio_png'>
                            <img src='#' alt='radio_img' />
                        </div>
                        {this.state.radioName ?
                            this.state.dropdown_title === 'Chargement' ? <div className='custom-spinner-radio' /> : this.state.radioName :
                            'Aucune radio en écoute'}
                        <div className='radio_click_text'>
                            Cliquez pour ouvrir le menu
                        </div>
                    </div>
                    <div className='radio_icon'>
                        <img src='/assets/img/radio.png' alt='radio_icon' />
                    </div>
                </div>
            </div>
        );
    }
}

Radio.propTypes = {
    cookies: instanceOf(Cookies).isRequired
};

export default withCookies(Radio);
