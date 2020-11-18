'use strict';

import React, { useState, useEffect, ChangeEvent } from 'react';
import Axios from 'axios';
import _ from 'lodash';
import dateFormat from 'dateformat';
import $ from 'jquery';
import FecondatorModal from './modal';
import { Tooltip } from '@material-ui/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faSync } from '@fortawesome/free-solid-svg-icons';
import PropTypes from 'prop-types';
import * as T from '../../../../@types/dragodindes';
import { userType } from '../../../../@types/user';
import Config from '../../../../../config.json';

library.add(faSync);

interface propsType {
    user: userType;
}

const Fecondator = (props: propsType): React.ReactElement => {
    const [user] = useState(props.user || undefined);
    const [dragodindes, setDragodindes] = useState([] as T.sortedDragoType[]);
    const [showedDragodindes, setShowedDragodindes] = useState([] as T.sortedDragoType[]);
    const [selectedDrago, setSelectedDrago] = useState({} as T.usedAndLastArrayDragoType);
    const [show, setShow] = useState(false);
    const [accouchDate, setAccouchDate] = useState('');
    const [finishTime, setFinishTime] = useState('');
    const [lateCountdown, setLateCountdown] = useState('');
    const [last, setLast] = useState({} as T.ddFecondType);
    const [wait, setWait] = useState(true);
    const [loaded, setLoaded] = useState(false);
    let interval: any = {};

    useEffect(() => {
        if (wait && !loaded) {
            getDataAndSetConst();
            setLoaded(true);
        }
        return (): void => {
            clearInterval(interval);
        };
    }, [props]);

    const getDataAndSetConst = async (): Promise<void> => {
        try {
            const res = await Axios.post('/api/dofus/dragodindes/fecondator', {
                token: Config.security.token,
                type: 'site'
            });
            if (res.data && res.data.dragodindes) {
                const sortedDragodindes = res.data.dragodindes;
                const now = Date.now();
                const ddFecond = res.data.ddFecond && Object.keys(res.data.ddFecond).length ? res.data.ddFecond : false;
                setDragodindes(sortedDragodindes);
                setShowedDragodindes(sortedDragodindes);
                const newAccouchDate = getAccouchDate(now, ddFecond, sortedDragodindes);
                setAccouchDate(newAccouchDate);
                if (ddFecond) setLast(ddFecond);
                countdown(Date.now(), ddFecond, sortedDragodindes);
                countDownInterval(ddFecond, sortedDragodindes);
                setWait(false);
            }
            else if (wait) setWait(false);
        }
        catch (e) {
            console.log('Error /api/dofus/dragodindes/fecondator : ', e.message);
        }
    };

    const countDownInterval = (ddFecond: T.ddFecondType, sortedDragodindes: T.sortedDragoType[]): void => {
        if (ddFecond && user.countdown) {
            interval = setInterval(() => {
                if (user.countdown && (sortedDragodindes || ddFecond)) {
                    countdown(Date.now(), ddFecond, sortedDragodindes);
                    calculateFinishAndLateTime(Date.now(), ddFecond, sortedDragodindes);
                }
            }, 1000);
        }
    };

    const countdown = (now: number, ddFecond: T.ddFecondType, sortedDragodindes: T.sortedDragoType[]): void => {
        let ended = false;
        if ($('.fecondator-line').length) {
            $('.fecondator-line').map((_index, line) => {
                const fecondTimeDiv = $(line.children[1])[0].children;
                if (fecondTimeDiv.length === 2) {
                    const dragoName = $(line.children[0])[0].children[1].innerHTML.trim();
                    const countdownContent = fecondTimeDiv[0].children[0];
                    const findDrago = _.find(sortedDragodindes, { name: dragoName }) as T.sortedDragoType;
                    if (countdownContent.innerHTML.substr(0, 10) !== 'Maintenant' && ddFecond) {
                        const timeRemaining = setCountdownTime(now, findDrago);
                        countdownContent.innerHTML = timeRemaining;
                        if (timeRemaining === 'Maintenant') {
                            // Dragodindes prête(s)
                            ended = true;
                        }
                    }
                }
            });
            if (ended) {
                clearInterval(interval);
                window.location.reload();
            }
        }
    };

    const setCountdownTime = (now: number, drago: T.sortedDragoType): string => {
        const timeDiff = getTimeDif(Number(drago.end.date), now);
        if (timeDiff.hoursLate <= 0 && timeDiff.minDiff <= 0 && timeDiff.secondDiff <= 0)
            return 'Maintenant';
        return setLateTimeRemaining(timeDiff.hoursLate, timeDiff.minDiff, timeDiff.secondDiff);
    };

    const getAccouchDate = (now: number, ddFecond: T.ddFecondType | false, sortedDragodindes: T.sortedDragoType[]): string => {
        let date = sortedDragodindes.length ?
            dateFormat(now + (sortedDragodindes[0].duration * 60 * 60 * 1000), 'dd/mm/yyyy HH:MM:ss') :
            false;
        if (ddFecond) {
            const parsed = Date.parse(ddFecond.last.date);
            const hoursDiff = Math.floor((now - parsed) / (1000 * 60 * 60));
            if (sortedDragodindes.length && hoursDiff >= ddFecond.duration - sortedDragodindes[0].duration)
                date = dateFormat(Date.now() + (sortedDragodindes[0].duration * 60 * 60 * 1000), 'dd/mm/yyyy HH:MM:ss');
            else
                date = dateFormat(parsed + (ddFecond.duration * 60 * 60 * 1000), 'dd/mm/yyyy HH:MM:ss');
        }
        return date;
    };

    const calculateFinishAndLateTime = (now: number, ddFecond: T.ddFecondType, sortedDragodindes: T.sortedDragoType[]): T.sortedDragoType[] => {
        const baseDate = Date.parse(ddFecond.last.date);
        const timeDif = getTimeDif(now, baseDate);
        const hoursLate = timeDif.hoursLate;
        let secondDiff = timeDif.secondDiff;
        let minDiff = timeDif.minDiff;
        if (ddFecond && sortedDragodindes.length && hoursLate >= ddFecond.duration - sortedDragodindes[0].duration)
            getLateCountdown(secondDiff, minDiff, hoursLate, ddFecond, sortedDragodindes);
        minDiff = 60 - minDiff;
        secondDiff = 60 - secondDiff;
        if (ddFecond && hoursLate <= ddFecond.duration && !sortedDragodindes.length)
            calculateFinishTime(baseDate, now, ddFecond, hoursLate);
        return sortedDragodindes;
    };

    const getTimeDif = (now: number, baseDate: number): { hoursLate: number, secondDiff: number, minDiff: number } => {
        const hoursLate = Math.floor((now - baseDate) / (1000 * 60 * 60));
        let secondDiff = Math.floor((now - baseDate) / 1000);
        secondDiff = secondDiff - Math.floor(secondDiff / 60) * 60;
        let minDiff = Math.floor((now - baseDate) / (1000 * 60));
        minDiff = minDiff - (Math.floor(minDiff / 60) * 60);
        return {
            hoursLate,
            secondDiff,
            minDiff
        };
    };

    const calculateFinishTime = (baseDate: number, now: number, ddFecond: T.ddFecondType, hoursLate: number): void => {
        if (hoursLate < ddFecond.duration) {
            const endDate = (baseDate + (ddFecond.duration * 60 * 60 * 1000) - now);
            const endHours = Math.floor(endDate / (1000 * 60 * 60));
            let endMin = Math.floor(endDate / (1000 * 60));
            let endSec = Math.floor(endDate / 1000);
            endMin -= Math.floor(endMin / 60) * 60;
            endSec -= Math.floor(endSec / 60) * 60;
            if (!finishTime) return setFinishTime(setLateTimeRemaining(endHours, endMin, endSec));
            $('.finish-countdown')[0].innerHTML = setLateTimeRemaining(endHours, endMin, endSec);
        }
        else setFinishTime('Maintenant');
    };

    const getLateCountdown = (secondDiff: number, minDiff: number, hoursLate: number, ddFecond: T.ddFecondType, sortedDragodindes: T.dragoType[] | T.sortedDragoType[]): void => {
        if (ddFecond) {
            let goodHours = 0;
            if (sortedDragodindes && hoursLate >= ddFecond.duration - sortedDragodindes[0].duration)
                goodHours = hoursLate - (ddFecond.duration - sortedDragodindes[0].duration);
            else if (!sortedDragodindes && hoursLate >= ddFecond.duration)
                goodHours = hoursLate - ddFecond.duration;
            const stringDuration = setLateTimeRemaining(goodHours, minDiff, secondDiff);
            if (!lateCountdown) setLateCountdown(stringDuration);
            if ($('.late-countdown')[0]) $('.late-countdown')[0].innerHTML = stringDuration;
        }
    };

    const setLateTimeRemaining = (hours: number, minutes: number, seconds: number): string => {
        const goodMinutes = (minutes >= 0 && minutes < 10 ? '0' + minutes + 'M' : minutes + 'M');
        const goodSeconds = (seconds >= 0 && seconds < 10 ? '0' + seconds + 'S' : seconds + 'S');
        return hours > 0 ? hours + 'H' + goodMinutes + goodSeconds : goodMinutes + goodSeconds;
    };

    const handleAutomaticFecond = (index: number): void => {
        const used: T.dragoType[] = [];
        const localLast: T.dragoType[] = [];
        dragodindes.map((drago, mapIndex) => {
            if (mapIndex < index) used.push(drago);
            else if (mapIndex === index) localLast.push(drago);
        });
        if (Object.keys(last).length) used.push(last);
        setSelectedDrago({ used: used, last: localLast });
        setShow(true);
    };

    const handleCallAutomaticAPI = async (): Promise<void> => {
        try {
            await Axios.post('/api/dofus/dragodindes/fecondator/automatic', {
                dragodindes: selectedDrago,
                token: Config.security.token,
                type: 'site'
            });
            handleClose();
            clearInterval(interval[0]);
            window.location.reload();
        }
        catch (e) {
            console.log('Error /api/dofus/dragodindes/status/:type/:action : ', e.message);
        }
    };

    const handleClose = (): void => {
        setShow(false);
        setSelectedDrago({ used: [], last: [] });
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
        const filtered = dragodindes.filter(d => d.name.toLowerCase().indexOf(e.target.value.toLowerCase()) !== -1);
        setShowedDragodindes(_.reverse(_.sortBy(filtered, 'duration', 'asc')));
    };

    /* eslint-disable max-len */
    return (
        <div className='principal-container'>
            <FecondatorModal
                handleClose={handleClose}
                handleCallAutomaticAPI={handleCallAutomaticAPI}
                show={show}
                dragodindes={selectedDrago}
            />
            <div className='text-center fecondator-last-dragodinde col-sm-11 col-md-10 col-lg-9 col-xl-8'>
                {Object.keys(last).length ?
                    <div className='fecondator-last-div col-9 col-sm-8 col-md-6'>
                        <h4 className='col-12'>Dragodinde fécondée</h4>
                        <img className='col-4' alt='dd_icon' src={'/assets/img/dofus/dragodindes/' + last.name.toLowerCase().split(' ').join('-') + '.png'} />
                        <div className='fecondator-last-infos col-7'>
                            <p className='label'>Nom</p>
                            <p className='value'>{last.name}</p>
                            <p className='label'>Fécondation</p>
                            <p className='value'>{dateFormat(last.last?.date, 'dd/mm/yyyy HH:MM:ss')}</p>
                        </div>
                    </div> : ''}
                {accouchDate !== '' || lateCountdown !== '' || finishTime !== '' ?
                    <div className='fecondator-infos col-7 col-sm-7 col-md-5'>
                        <h4 className='col-12'>Informations</h4>
                        <div className='fecondator-infos-content col-10'>
                            <p className='label'>Accouchement</p>
                            <p className='value'>{accouchDate}</p>
                            {lateCountdown ?
                                <>
                                    <p className='label'>Retard</p>
                                    <p className='late-countdown value'>{lateCountdown}</p>
                                </> : ''}
                            {finishTime ?
                                <>
                                    <p className='label'>Dans</p>
                                    <p className='finish-countdown value'>{finishTime}</p>
                                </> : ''}
                        </div>
                    </div> : ''}
            </div>
            {dragodindes && dragodindes.length ?
                <div className='text-center principal-dragodindes-div col-sm-11 col-md-10 col-lg-8 col-xl-8'>
                    <input
                        className='input-parcho'
                        placeholder='Rechercher'
                        onChange={handleChange}
                    />
                    <div className='my-dragodindes-container'>
                        {showedDragodindes.length ?
                            showedDragodindes.map((drago, index) => {
                                return (
                                    <div
                                        className='fecondator-line'
                                        key={index}
                                    >
                                        <div className='fecondator-name col-8'>
                                            <img src={'/assets/img/dofus/dragodindes/' + drago.name.toLowerCase().split(' ').join('-') + '.png'} alt='dd_icon' />
                                            <p> {drago.name}</p>
                                        </div>
                                        <div className='fecondator-time col-4'>
                                            {drago.end?.time.substr(0, 10) === 'Maintenant' ?
                                                <div className='fecondator-time-now'>
                                                    {(showedDragodindes[index + 1] && showedDragodindes[index + 1].end?.time.substr(0, 10) !== 'Maintenant') || (!showedDragodindes[index + 1]) ?
                                                        <>
                                                            <p className='fecondator-automatic-time col-10 text-center'>Maintenant</p>
                                                            <Tooltip
                                                                title='Définir comme la dernière dragodinde fécondée et définir les dragodindes précédentes comme utilisées'
                                                                placement='top'
                                                            >
                                                                <span
                                                                    className='fecondator-automatic-icon col-2'
                                                                    onClick={(): void => handleAutomaticFecond(index)}
                                                                >
                                                                    <FontAwesomeIcon icon='sync' />
                                                                </span>
                                                            </Tooltip>
                                                        </> :
                                                        <p className='col-10 text-center'>Maintenant</p>}
                                                </div> :
                                                <>
                                                    <div className='fecondator-time-duration'>
                                                        <p>{drago.end?.time}</p>
                                                    </div>
                                                    <div className='fecondator-time-date'>
                                                        <p> {dateFormat(drago.end.date, 'dd/mm/yyyy HH:MM:ss')} </p>
                                                    </div>
                                                </>}
                                        </div>
                                    </div>
                                );
                            }) :
                            <div className='empty-drago-line'>
                                <div className='my-dragodindes-name'>
                                    <p>Aucun résultat</p>
                                </div>
                            </div>}
                    </div>
                </div> :
                wait ?
                    <div className='text-center loading-enclos-message'>
                        <h1>Chargement des dragodindes <span className='custom-spinner-enclos' /></h1>
                    </div> :
                    <div className='text-center no-enclos-message'>
                        <h1>Pas de dragodindes actuellement</h1>
                    </div>}
        </div>
    );
};

Fecondator.propTypes = {
    user: PropTypes.oneOfType([
        PropTypes.object.isRequired,
        PropTypes.bool.isRequired
    ])
};

export default Fecondator;
