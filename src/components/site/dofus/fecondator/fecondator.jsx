'use strict';

import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import _ from 'lodash';
import dateFormat from 'dateformat';
import $ from 'jquery';
import FecondatorModal from './modal.jsx';
import { Tooltip } from '@material-ui/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faSync } from '@fortawesome/free-solid-svg-icons';
import PropTypes from 'prop-types';

library.add(faSync);

const Fecondator = (props) => {
    const [user] = useState(props.user);
    const [dragodindes, setDragodindes] = useState([]);
    const [showedDragodindes, setShowedDragodindes] = useState([]);
    const [selectedDrago, setSelectedDrago] = useState({ used: [], last: [] });
    const [show, setShow] = useState(false);
    const [accouchDate, setAccouchDate] = useState(false);
    const [finishTime, setFinishTime] = useState(false);
    const [lateCountdown, setLateCountdown] = useState(false);
    const [last, setLast] = useState(false);
    const [wait, setWait] = useState(true);
    const [loaded, setLoaded] = useState(false);
    const interval = [{}];

    useEffect(() => {
        if (wait && !loaded) {
            getDataAndSetConst();
            setLoaded(true);
        }
    });

    const getDataAndSetConst = async () => {
        const res = await Axios.post('/api/dofus/dragodindes', {
            userId: user.id
        });
        if (res.data && res.data.length) {
            const now = Date.now();
            let ddFecond = res.data.filter(d => d.last.status);
            ddFecond = ddFecond && ddFecond[0] ? ddFecond[0] : false;
            const filteredDrago = res.data.filter(d => !d.last.status && !d.used);
            let sortedDragodindes = filteredDrago.length ? _.reverse(_.sortBy(filteredDrago, 'duration', 'asc')) : false;
            sortedDragodindes = calculateTime(now, ddFecond, sortedDragodindes);
            setDragodindes(sortedDragodindes);
            setShowedDragodindes(sortedDragodindes);
            const newAccouchDate = getAccouchDate(now, ddFecond, sortedDragodindes);
            setAccouchDate(newAccouchDate);
            if (ddFecond) {
                setLast(ddFecond);
            }
            countdown(sortedDragodindes);
            countDownInterval(ddFecond, sortedDragodindes);
            setWait(false);
        }
        else if (wait) {
            setWait(false);
        }
    };

    const countDownInterval = (ddFecond, sortedDragodindes) => {
        if (ddFecond && user.countdown) {
            interval[0] = setInterval(() => {
                if (user.countdown && (sortedDragodindes || ddFecond)) {
                    countdown(calculateTime(Date.now(), ddFecond, sortedDragodindes));
                }
            }, 1000);
        }
    };

    const countdown = (timedDragodindes) => {
        let ended = false;
        if ($('.fecondator-line').length) {
            $('.fecondator-line').map((index, line) => {
                const fecondTimeDiv = $(line.children[1])[0].children;
                if (fecondTimeDiv.length === 2) {
                    const dragoName = $(line.children[0])[0].children[1].innerHTML.trim();
                    const countdownContent = fecondTimeDiv[0].children[0];
                    const findDrago = _.find(timedDragodindes, { name: dragoName });
                    if (countdownContent.innerHTML.substr(0, 10) !== 'Maintenant') {
                        if (findDrago.end.time.substr(0, 10) !== 'Maintenant') {
                            countdownContent.innerHTML = findDrago.end.time;
                        }
                        else {
                            // Dragodindes prête(s)
                            ended = true;
                        }
                    }
                }
            });
            if (ended) {
                clearInterval(interval[0]);
                getDataAndSetConst();
            }
        }
    };

    const getAccouchDate = (now, ddFecond, sortedDragodindes) => {
        let date = sortedDragodindes.length ? dateFormat(now + (sortedDragodindes[0].duration * 60 * 60 * 1000), 'dd/mm/yyyy HH:MM:ss') : false;
        if (ddFecond) {
            const hoursDiff = Math.floor((now - Date.parse(ddFecond.last.date)) / (1000 * 60 * 60));
            if (sortedDragodindes.length && hoursDiff >= ddFecond.duration - sortedDragodindes[0].duration) {
                date = dateFormat(Date.now() + (sortedDragodindes[0].duration * 60 * 60 * 1000), 'dd/mm/yyyy HH:MM:ss');
            }
            else {
                date = dateFormat(Date.parse(ddFecond.last.date) + (ddFecond.duration * 60 * 60 * 1000), 'dd/mm/yyyy HH:MM:ss');
            }
        }
        return date;
    };

    const calculateTime = (now, ddFecond, sortedDragodindes) => {
        let setDrago = false;
        const baseDate = ddFecond ? Date.parse(ddFecond.last.date) : now;
        const hoursLate = ddFecond ? Math.floor((now - baseDate) / (1000 * 60 * 60)) : 0;
        let secondDiff = ddFecond ? Math.floor((now - baseDate) / 1000) : 0;
        secondDiff = ddFecond ? secondDiff - Math.floor(secondDiff / 60) * 60 : 0;
        let minDiff = ddFecond ? Math.floor((now - baseDate) / (1000 * 60)) : 0;
        minDiff = ddFecond ? minDiff - (Math.floor(minDiff / 60) * 60) : 0;
        if (ddFecond && sortedDragodindes && hoursLate >= ddFecond.duration - sortedDragodindes[0].duration) {
            getLateCountdown(secondDiff, minDiff, hoursLate, ddFecond, sortedDragodindes);
        }
        minDiff = 60 - minDiff;
        secondDiff = 60 - secondDiff;
        if (sortedDragodindes) {
            setDrago = makeDragodindesParams(baseDate, ddFecond, sortedDragodindes, hoursLate, minDiff, secondDiff);
        }
        else if (ddFecond && hoursLate <= ddFecond.duration && !sortedDragodindes) {
            calculateFinishTime(baseDate, now, ddFecond, hoursLate);
        }
        return setDrago;
    };

    const calculateFinishTime = (baseDate, now, ddFecond, hoursLate) => {
        if (hoursLate < ddFecond.duration) {
            const endDate = (baseDate + (ddFecond.duration * 60 * 60 * 1000) - now);
            const endHours = Math.floor(endDate / (1000 * 60 * 60));
            let endMin = Math.floor(endDate / (1000 * 60));
            let endSec = Math.floor(endDate / 1000);
            endMin -= Math.floor(endMin / 60) * 60;
            endSec -= Math.floor(endSec / 60) * 60;
            if (!finishTime) {
                setFinishTime(setLateTimeRemaining(endHours, endMin, endSec));
            }
            else {
                $('.finish-countdown')[0].innerHTML = setLateTimeRemaining(endHours, endMin, endSec);
            }
        }
        else {
            setFinishTime('Maintenant');
        }
    };

    const getLateCountdown = (secondDiff, minDiff, hoursLate, ddFecond, sortedDragodindes) => {
        if (ddFecond) {
            let goodHours = '';
            if (sortedDragodindes && hoursLate >= ddFecond.duration - sortedDragodindes[0].duration) {
                goodHours = hoursLate - (ddFecond.duration - sortedDragodindes[0].duration);
            }
            else if (!sortedDragodindes && hoursLate >= ddFecond.duration) {
                goodHours = hoursLate - ddFecond.duration;
            }
            const stringDuration = setLateTimeRemaining(goodHours, minDiff, secondDiff);
            if (!lateCountdown) {
                setLateCountdown(stringDuration);
            }
            if ($('.late-countdown')[0]) {
                $('.late-countdown')[0].innerHTML = stringDuration;
            }
        }
    };

    const makeDragodindesParams = (baseDate, ddFecond, sortedDragodindes, hoursDiff, minDiff, secondDiff) => {
        let estimatedTime = 0;
        let prevDrago = false;
        let isEnded = false;
        sortedDragodindes.map((drago, index) => {
            let goodTime = '';
            let goodDate = '';
            if ((prevDrago && prevDrago.end.time.substr(0, 10) === 'Maintenant') || isEnded) {
                estimatedTime += prevDrago.duration - drago.duration;
                goodTime = estimatedTime === 0 ? 'Maintenant' : estimatedTime + 'H';
                goodDate = dateFormat(Date.now() + (estimatedTime * 60 * 60 * 1000), 'dd/mm/yyyy HH:MM:ss');
                isEnded = true;
            }
            else if (ddFecond && index === 0 && ddFecond.duration !== drago.duration && hoursDiff < ddFecond.duration - drago.duration) {
                estimatedTime += ddFecond.duration - drago.duration;
                goodDate = dateFormat(baseDate + ((ddFecond.duration - drago.duration) * 60 * 60 * 1000), 'dd/mm/yyyy HH:MM:ss');
                const showedTime = setTimeRemaining(estimatedTime, hoursDiff, minDiff, secondDiff);
                goodTime = showedTime;
            }
            else if ((!ddFecond && !prevDrago && index === 0) || (ddFecond && ddFecond.duration === drago.duration) || (hoursDiff >= ddFecond.duration - drago.duration)) {
                goodTime = 'Maintenant';
                goodDate = ddFecond && hoursDiff >= ddFecond.duration - drago.duration ? dateFormat(baseDate + (hoursDiff * 1000 * 60 * 60), 'dd/mm/yyyy HH:MM:ss') : dateFormat(baseDate, 'dd/mm/yyyy HH:MM:ss');
                baseDate = ddFecond && hoursDiff >= ddFecond.duration - drago.duration ? baseDate + (hoursDiff * 60 * 60 * 1000) : baseDate;
            }
            else {
                if (prevDrago.duration !== drago.duration) {
                    estimatedTime += prevDrago.duration - drago.duration;
                }
                const showedTime = setTimeRemaining(estimatedTime, hoursDiff, minDiff, secondDiff);
                goodTime = estimatedTime === 0 ? 'Maintenant' : showedTime;
                goodDate = dateFormat(baseDate + (estimatedTime * 60 * 60 * 1000), 'dd/mm/yyyy HH:MM:ss');
            }
            drago.end = {
                time: goodTime,
                date: goodDate
            };
            prevDrago = drago;
        });
        return sortedDragodindes;
    };

    const setLateTimeRemaining = (hours, minutes, seconds) => {
        const goodMinutes = (minutes >= 0 && minutes < 10 ? '0' + minutes + 'M' : minutes + 'M');
        const goodSeconds = (seconds >= 0 && seconds < 10 ? '0' + seconds + 'S' : seconds + 'S');
        return hours > 0 ? hours + 'H' + goodMinutes + goodSeconds : goodMinutes + goodSeconds;
    };

    const setTimeRemaining = (duration, hours, minutes, seconds) => {
        let goodHours = duration - hours;
        goodHours = minutes > 0 || seconds > 0 ? goodHours - 1 : goodHours;
        minutes = seconds > 0 ? minutes - 1 : minutes;
        if (seconds === 60) {
            minutes += 1;
        }
        else if (minutes > 0 && seconds === 0) {
            minutes -= 1;
        }
        const stringMinutes = (minutes > 0 && minutes < 10 ? '0' + minutes + 'M' : minutes + 'M');
        const stringSeconds = (seconds > 0 && seconds < 10 ? '0' + seconds + 'S' : seconds + 'S');
        if (seconds !== 60 && minutes !== 60) {
            return goodHours > 0 ? goodHours + 'H' + stringMinutes + stringSeconds : stringMinutes + stringSeconds;
        }
        else if (seconds === 60 && minutes === 60) {
            goodHours = goodHours <= 0 ? '1H' : goodHours + 1;
            return goodHours === '1H' ? goodHours : goodHours + 'H';
        }
        else if (seconds === 60 && minutes !== 60) {
            return goodHours <= 0 ? stringMinutes + '00S' : goodHours + 'H' + stringMinutes + '00S';
        }
    };

    const handleAutomateFecond = (index) => {
        const used = [];
        const localLast = [];
        dragodindes.map((drago, mapIndex) => {
            if (mapIndex < index) {
                used.push(drago);
            }
            else if (mapIndex === index) {
                localLast.push(drago);
            }
        });
        if (last) {
            used.push(last);
        }
        setSelectedDrago({ used: used, last: localLast });
        setShow(true);
    };

    const handleCallAutomateAPI = () => {
        Promise.all([
            Axios.post('/api/dofus/dragodindes/status/used/update', {
                userId: user.id,
                dragodindes: selectedDrago.used
            }),
            Axios.post('/api/dofus/dragodindes/status/last/update', {
                userId: user.id,
                dragodindes: selectedDrago.last
            })
        ]).then(() => {
            handleClose();
            clearInterval(interval[0]);
            getDataAndSetConst();
        }).catch(() => {
            setTimeout(() => {
                handleCallAutomateAPI();
            }, 1500);
        });
    };

    const handleClose = () => {
        setShow(false);
        setSelectedDrago({ used: [], last: [] });
    };

    const handleChange = (e) => {
        const filtered = dragodindes.filter(d => d.name.toLowerCase().indexOf(e.target.value.toLowerCase()) !== -1);
        setShowedDragodindes(_.reverse(_.sortBy(filtered, 'duration', 'asc')));
    };

    return (
        <div className='principal-container'>
            <FecondatorModal
                handleClose={handleClose}
                handleCallAutomateAPI={handleCallAutomateAPI}
                show={show}
                dragodindes={selectedDrago}
            />
            <h1 className='craft-title text-center col-12 col-md-6'>Fécondator</h1>
            <div className='notes-btn col-sm-12 text-center'>
                <a href='/dofus/dragodindes'>
                    <button>Mes dragodindes</button>
                </a>
            </div>
            <div className='text-center fecondator-last-dragodinde col-sm-11 col-md-10 col-lg-9 col-xl-8'>
                {last ?
                    <div className='fecondator-last-div col-9 col-sm-8 col-md-6'>
                        <h4 className='col-12'>Dragodinde fécondée</h4>
                        <img className='col-4' alt='dd_icon' src={'/assets/img/dragodindes/' + last.name.toLowerCase().split(' ').join('-') + '.png'} />
                        <div className='fecondator-last-infos col-7'>
                            <p className='label'>Nom</p>
                            <p className='value'>{last.name}</p>
                            <p className='label'>Fécondation</p>
                            <p className='value'>{dateFormat(last.last.date, 'dd/mm/yyyy HH:MM:ss')}</p>
                        </div>
                    </div> : ''}
                {accouchDate || lateCountdown || finishTime ?
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
            {dragodindes.length ?
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
                                            <img src={'/assets/img/dragodindes/' + drago.name.toLowerCase().split(' ').join('-') + '.png'} alt='dd_icon' />
                                            <p> {drago.name}</p>
                                        </div>
                                        <div className='fecondator-time col-4'>
                                            {drago.end.time.substr(0, 10) === 'Maintenant' ?
                                                <div className='fecondator-time-now'>
                                                    {(showedDragodindes[index + 1] && showedDragodindes[index + 1].end.time.substr(0, 10) !== 'Maintenant') || (!showedDragodindes[index + 1]) ?
                                                        <>
                                                            <p className='fecondator-automate-time col-10 text-center'>Maintenant</p>
                                                            <Tooltip
                                                                title='Définir comme la dernière dragodinde fécondée et définir les dragodindes précédentes comme utilisées'
                                                                placement='top'
                                                            >
                                                                <span
                                                                    className='fecondator-automate-icon col-2'
                                                                    onClick={() => handleAutomateFecond(index)}
                                                                >
                                                                    <FontAwesomeIcon icon='sync' />
                                                                </span>
                                                            </Tooltip>
                                                        </> :
                                                        <p className='col-10 text-center'>Maintenant</p>}
                                                </div> :
                                                <>
                                                    <div className='fecondator-time-duration'>
                                                        <p>{drago.end.time}</p>
                                                    </div>
                                                    <div className='fecondator-time-date'>
                                                        <p>{drago.end.date}</p>
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
                    <div className='text-center loading-notes-message'>
                        <h1>Chargement des dragodindes <span className='custom-spinner-notes' /></h1>
                    </div> :
                    <div className='text-center no-notes-message'>
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
