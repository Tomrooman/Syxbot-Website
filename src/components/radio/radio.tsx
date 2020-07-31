'use strict';

import React, { useState, useEffect, ChangeEvent } from 'react';
import $ from 'jquery';
import { useCookies } from 'react-cookie';
import Radios from './../../../assets/json/radios.json';
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretUp, faPlay, faPause } from '@fortawesome/free-solid-svg-icons';
import './radio.css';

library.add(faCaretUp);
library.add(faPlay);
library.add(faPause);

const Radio = (): React.ReactElement => {
    const [cookies, setCookie] = useCookies(['syxbot_radio']);
    const [dropdownTitle, setDropdownTitle] = useState('Radios disponibles');
    const [index, setIndex] = useState(99);
    const [radioName, setRadioName] = useState('');
    const [radio, setRadio] = useState(cookies.syxbot_radio || false);
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        if (!loaded) {
            $('.radio_png').css('display', 'none');
        }
        if (radio && radio.index !== 99 && !loaded) {
            const playArg = radio.play;
            const { imagePath, radioUrl } = getRadio(radio.index);
            setLoaded(true);
            setRadioSourceAndInfos(imagePath, radioUrl, radio.index, radio.name, radio.volume);
            if (!playArg) {
                $('audio')[0].removeAttribute('autoPlay');
                setDropdownTitle(radio.name.indexOf('&amp;') !== -1 ? radio.name.split('&amp;').join(' & ') : radio.name);
            }
        } else if (radio && radio.volume && !loaded) {
            ($('audio')[0] as HTMLAudioElement).volume = radio.volume;
            $('.slider')[0].setAttribute('value', String(radio.volume * 100));
            setLoaded(true);
        } else if (!loaded) {
            ($('audio')[0] as HTMLAudioElement).volume = 0.2;
            $('.slider')[0].setAttribute('value', String(20));
            setLoaded(true);
        }
    });

    const getRadio = (_index: number) => {
        const returnedObj = {
            imagePath: '',
            radioUrl: ''
        };
        Radios.map((r, i) => {
            if (i === _index) {
                returnedObj.imagePath = `/assets/img/radio/${r.name.toLowerCase()}.png`;
                returnedObj.radioUrl = r.url;
            }
        });
        return returnedObj;
    };

    const handleClick = (image: string, _index: number, _radioName: string, url: string) => {
        const _audio = $('audio')[0] as HTMLMediaElement;
        setRadioSourceAndInfos(image, url, _index, _radioName, _audio.volume);
        setRadioCookie(true, _index, _audio.volume, _radioName);
        _audio.play();
    };

    const setRadioSourceAndInfos = (imagePath: string, radioUrl: string, _index: number, _radioName: string, volume: number) => {
        $('.radio_png').css('display', 'initial');
        ($('audio')[0] as HTMLAudioElement).volume = volume;
        $('.slider')[0].setAttribute('value', String(volume * 100));
        const radioImg = document.createElement('img');
        radioImg.src = imagePath;
        $('.radio_png')[0].innerHTML = '';
        $('.radio_png').append(radioImg);
        $('audio')[0].setAttribute('src', radioUrl);
        setDropdownTitle('Chargement');
        setIndex(_index);
        setRadioName(_radioName);
    };

    const handleVolumeChange = (e: ChangeEvent<HTMLInputElement>) => {
        const _audio = $('audio')[0] as HTMLMediaElement;
        const _radioName = radioName.indexOf('&amp;') !== -1 ? radioName.split('&amp;').join(' & ') : radioName;
        ($('audio')[0] as HTMLAudioElement).volume = parseInt(e.target.value, 10) / 100;
        if (_audio.paused) {
            setRadioCookie(false, index, ($('audio')[0] as HTMLAudioElement).volume, _radioName);
        } else {
            setRadioCookie(true, index, ($('audio')[0] as HTMLAudioElement).volume, _radioName);
        }
    };

    const handlePause = () => {
        const _radioName = radioName.indexOf('&amp;') !== -1 ? radioName.split('&amp;').join(' & ') : radioName;
        setRadioCookie(false, index, ($('audio')[0] as HTMLAudioElement).volume, _radioName);
    };

    const handlePlay = () => {
        const _radioName = radioName.indexOf('&amp;') !== -1 ? radioName.split('&amp;').join(' & ') : radioName;
        setDropdownTitle(_radioName);
        setRadioCookie(true, index, ($('audio')[0] as HTMLAudioElement).volume, _radioName);
    };

    const handleTogglePlay = () => {
        if (radioName) {
            const _audio = $('audio')[0] as HTMLMediaElement;
            if (_audio.paused) {
                _audio.play();
            } else {
                _audio.pause();
            }
        }
    };

    const setRadioCookie = (play: boolean, _index: number, volume: number, name: string) => {
        if (!radio || (radio && (radio.play !== play || radio.index !== _index || radio.volume !== volume || radio.name !== name))) {
            const oneDay = 1000 * 60 * 60 * 24;
            const expireDate = new Date(Date.now() + (oneDay * 10));
            const cookieData = {
                play: play,
                index: index,
                volume: volume,
                name: name
            };
            setCookie('syxbot_radio', cookieData, {
                path: '/',
                httpOnly: false,
                expires: expireDate,
                secure: true,
                sameSite: true
            });
            setRadio(cookieData);
        }
    };

    const showMenu = () => {
        if ($('.radio_player').css('opacity') === '1') {
            $('.radio_player').css('opacity', 0);
            $('.radio_player').css('transform', 'translateY(-50px)');
            $('.radio_player').css('visibility', 'hidden');
        } else {
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
                                    key={_index}
                                    onClick={() => { handleClick(`/assets/img/radio/${obj.name.toLowerCase()}.png`, _index, obj.name, obj.url); }}
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
                        {radio && !radio.play ? <FontAwesomeIcon icon='play' /> : <FontAwesomeIcon icon='pause' />}
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

export default Radio;
