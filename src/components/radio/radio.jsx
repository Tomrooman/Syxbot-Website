'use strict';

import React, { useState, useEffect } from 'react';
import $ from 'jquery';
import { instanceOf } from 'prop-types';
import { withCookies, Cookies } from 'react-cookie';
import Radios from './../../../assets/json/radios.json';
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretUp } from '@fortawesome/free-solid-svg-icons';
import './radio.css';

library.add(faCaretUp);

const Radio = (props) => {
    const [dropdownTitle, setDropdownTitle] = useState('Radios disponibles');
    const [index, setIndex] = useState('');
    const [radioName, setRadioName] = useState('');
    const [radio, setRadio] = useState(props.cookies.get('syxbot_radio', { path: '/' }) || false);
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        if (!loaded) {
            $('.radio_png').css('display', 'none');
        }
        if (radio && radio.index && !loaded) {
            const playArg = radio.play;
            const imagePath = $('#radio_choices')[0].children[radio.index].getAttribute('image');
            const radioUrl = $('#radio_choices')[0].children[radio.index].getAttribute('url');
            setLoaded(true);
            setRadioSourceAndInfos(imagePath, radioUrl, radio.index, radio.name, radio.volume);
            if (!playArg) {
                $('audio')[0].removeAttribute('autoPlay');
                setDropdownTitle(radio.name.indexOf('&amp;') !== -1 ? radio.name.split('&amp;').join(' & ') : radio.name);
            }
        }
        else if (radio && radio.volume && !loaded) {
            const volume = radio.volume;
            $('audio')[0].volume = volume;
            $('.slider')[0].value = volume * 100;
            setLoaded(true);
        }
        else if (!loaded) {
            $('audio')[0].volume = 0.2;
            $('.slider')[0].value = 20;
            setLoaded(true);
        }
    });

    const handleClick = (e) => {
        const image = e.target.getAttribute('image');
        const url = e.target.getAttribute('url');
        const _index = e.target.getAttribute('index');
        const _radioName = e.target.getAttribute('name');
        setRadioSourceAndInfos(image, url, _index, _radioName, $('audio')[0].volume);
        setRadioCookie(true, _index, $('audio')[0].volume, _radioName);
        $('audio')[0].play();
    };

    const setRadioSourceAndInfos = (imagePath, radioUrl, _index, _radioName, volume) => {
        $('.radio_png').css('display', 'initial');
        $('audio')[0].volume = volume;
        $('.slider')[0].value = volume * 100;
        const radioImg = document.createElement('img');
        radioImg.src = imagePath;
        $('.radio_png')[0].innerHTML = '';
        $('.radio_png').append(radioImg);
        $('audio')[0].src = radioUrl;
        setDropdownTitle('Chargement');
        setIndex(_index);
        setRadioName(_radioName);
    };

    const handleVolumeChange = (e) => {
        const _radioName = radioName.indexOf('&amp;') !== -1 ? radioName.split('&amp;').join(' & ') : radioName;
        $('audio')[0].volume = parseInt(e.target.value, 10) / 100;
        if ($('audio')[0].paused) {
            setRadioCookie(false, index, $('audio')[0].volume, _radioName);
        }
        else {
            setRadioCookie(true, index, $('audio')[0].volume, _radioName);
        }
    };

    const handlePause = () => {
        const _radioName = radioName.indexOf('&amp;') !== -1 ? radioName.split('&amp;').join(' & ') : radioName;
        setRadioCookie(false, index, $('audio')[0].volume, _radioName);
    };

    const handlePlay = () => {
        const _radioName = radioName.indexOf('&amp;') !== -1 ? radioName.split('&amp;').join(' & ') : radioName;
        setDropdownTitle(_radioName);
        setRadioCookie(true, index, $('audio')[0].volume, _radioName);
    };

    const handleTogglePlay = () => {
        if (radioName) {
            if ($('audio')[0].paused) {
                $('audio')[0].play();
            }
            else {
                $('audio')[0].pause();
            }
        }
    };

    const setRadioCookie = (play, _index, volume, name) => {
        const radioCookie = props.cookies.get('syxbot_radio', { path: '/' });
        if (!radioCookie || (radioCookie && (radioCookie.play !== play || radioCookie.index !== _index || radioCookie.volume !== volume || radioCookie.name !== name))) {
            const oneDay = 1000 * 60 * 60 * 24;
            const expireDate = new Date(Date.now() + (oneDay * 10));
            props.cookies.set('syxbot_radio', {
                play: play,
                index: index,
                volume: volume,
                name: name
            }, {
                path: '/',
                expires: expireDate
            });
            setRadio({
                play: play,
                index: index,
                volume: volume,
                name: name
            });
        }
    };

    const showMenu = () => {
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
    };

    return (
        <div className='radio_container'>
            <div className='radio_player'>
                <div className='dropdown'>
                    <button type='button' className='radio_select dropdown-toggle' id='dropdownMenu2' data-toggle='dropdown' aria-haspopup='true' aria-expanded='false'>
                        {dropdownTitle === 'Chargement' ?
                            <span>{dropdownTitle} <div className='custom-spinner-radio' /></span> :
                            'Radios disponibles'}
                        <FontAwesomeIcon icon='caret-up' />
                    </button>
                    <div id='radio_choices' className='dropdown-menu dropdown-menu-right' aria-labelledby='dropdownMenu2'>
                        {Radios.map((obj, _index) => {
                            return (
                                <button
                                    className='dropdown-item'
                                    url={obj.url}
                                    image={`/assets/img/radio/${obj.name.toLowerCase()}.png`}
                                    key={_index}
                                    index={_index}
                                    name={obj.name}
                                    onClick={handleClick}
                                >
                                    {obj.name}
                                </button>
                            );
                        })}
                    </div>
                </div>
                <audio
                    autoPlay
                    onPlay={handlePlay}
                    onPause={handlePause}
                />
                <div className='radio_controls col-12'>
                    <div
                        className='radio_controls_play col-3'
                        onClick={handleTogglePlay}
                    >
                        {radio && radio.play ? <FontAwesomeIcon icon='pause' /> : <FontAwesomeIcon icon='play' />}
                    </div>
                    <div className='slidecontainer col-9'>
                        <input
                            type='range'
                            min='1'
                            max='100'
                            className='slider'
                            id='myRange'
                            onChange={handleVolumeChange}
                        />
                    </div>
                </div>
            </div>
            <div
                className='radio_floating'
                onClick={showMenu}
            >
                <div className='radio_name'>
                    <div className='radio_png'>
                        <img src='#' alt='radio_img' />
                    </div>
                    {radioName ?
                        dropdownTitle === 'Chargement' ? <div className='custom-spinner-radio' /> : radioName :
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
};

Radio.propTypes = {
    cookies: instanceOf(Cookies).isRequired
};

export default withCookies(Radio);
