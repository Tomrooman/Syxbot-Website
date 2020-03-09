'use strict';

import React from 'react';
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

export default class Fecondator extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            user: this.props.user,
            dragodindes: [],
            showedDragodindes: [],
            selectedDrago: {
                used: [],
                last: []
            },
            show: false,
            accouchDate: [],
            finishTime: false,
            lateCountdown: false,
            last: false,
            wait: true,
            input: false
        };
        this.interval = {};
        this.handleChange = this.handleChange.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.handleCallAutomateAPI = this.handleCallAutomateAPI.bind(this);
    }

    componentDidMount() {
        this.getDataAndSetState();
    }

    getDataAndSetState() {
        Axios.post('/api/dofus/dragodindes', {
            userId: this.state.user.id
        })
            .then(res => {
                if (res.data && res.data.length) {
                    const now = Date.now();
                    let ddFecond = res.data.filter(d => d.last.status);
                    ddFecond = ddFecond && ddFecond[0] ? ddFecond[0] : false;
                    const filteredDrago = res.data.filter(d => !d.last.status && !d.used);
                    let sortedDragodindes = filteredDrago.length ? _.reverse(_.sortBy(filteredDrago, 'duration', 'asc')) : false;
                    sortedDragodindes = this.calculateTime(now, ddFecond, sortedDragodindes);
                    this.countdown(sortedDragodindes);
                    this.setDidMountState(now, ddFecond, sortedDragodindes);
                }
                else {
                    this.setState({
                        wait: false
                    });
                }
            })
            .catch(e => {
                console.log('error : ', e.message);
                this.setState({
                    wait: false
                });
            });
    }

    setDidMountState(now, ddFecond, sortedDragodindes) {
        const accouchDate = this.getAccouchDate(now, ddFecond, sortedDragodindes);
        this.setState({
            dragodindes: sortedDragodindes,
            showedDragodindes: sortedDragodindes,
            last: ddFecond,
            accouchDate: accouchDate,
            wait: false
        }, () => {
            if (ddFecond && this.state.user.countdown) {
                this.interval = setInterval(() => {
                    if (this.state.user.countdown && (sortedDragodindes || ddFecond)) {
                        this.countdown(this.calculateTime(Date.now(), ddFecond, sortedDragodindes));
                    }
                }, 1000);
            }
        });
    }

    countdown(dragodindes) {
        let ended = false;
        if ($('.fecondator-line').length) {
            $('.fecondator-line').map((index, line) => {
                const fecondTimeDiv = $(line.children[1])[0].children;
                if (fecondTimeDiv.length === 2) {
                    const dragoName = $(line.children[0])[0].children[1].innerHTML.trim();
                    const countdownContent = fecondTimeDiv[0].children[0];
                    const findDrago = _.find(dragodindes, { name: dragoName });
                    if (countdownContent.innerHTML.substr(0, 10) !== 'Maintenant') {
                        if (findDrago.end.time.substr(0, 10) !== 'Maintenant') {
                            countdownContent.innerHTML = findDrago.end.time;
                        }
                        else {
                            // Countdown ended
                            ended = true;
                        }
                    }
                }
            });
            if (ended) {
                clearInterval(this.interval);
                this.getDataAndSetState();
            }
        }
    }

    getAccouchDate(now, last, dragodindes) {
        let date = dragodindes.length ? dateFormat(now + (dragodindes[0].duration * 60 * 60 * 1000), 'dd/mm/yyyy HH:MM:ss') : false;
        if (last) {
            const hoursDiff = Math.floor((now - Date.parse(last.last.date)) / (1000 * 60 * 60));
            if (dragodindes.length && hoursDiff >= last.duration - dragodindes[0].duration) {
                date = dateFormat(Date.now() + (dragodindes[0].duration * 60 * 60 * 1000), 'dd/mm/yyyy HH:MM:ss');
            }
            else {
                date = dateFormat(Date.parse(last.last.date) + (last.duration * 60 * 60 * 1000), 'dd/mm/yyyy HH:MM:ss');
            }
        }
        return date;
    }

    calculateTime(now, last, dragodindes) {
        let setDrago = false;
        const baseDate = last ? Date.parse(last.last.date) : now;
        const hoursLate = last ? Math.floor((now - baseDate) / (1000 * 60 * 60)) : 0;
        let secondDiff = last ? Math.floor((now - baseDate) / 1000) : 0;
        secondDiff = last ? secondDiff - Math.floor(secondDiff / 60) * 60 : 0;
        let minDiff = last ? Math.floor((now - baseDate) / (1000 * 60)) : 0;
        minDiff = last ? minDiff - (Math.floor(minDiff / 60) * 60) : 0;
        if (last && dragodindes && hoursLate >= last.duration - dragodindes[0].duration) {
            this.getLateCountdown(secondDiff, minDiff, hoursLate, last, dragodindes);
        }
        minDiff = 60 - minDiff;
        secondDiff = 60 - secondDiff;
        if (dragodindes) {
            setDrago = this.setDragodindes(baseDate, last, dragodindes, hoursLate, minDiff, secondDiff);
        }
        else if (last && hoursLate <= last.duration && !dragodindes) {
            this.setFinishTime(baseDate, now, last, hoursLate);
        }
        return setDrago;
    }

    setFinishTime(baseDate, now, last, hoursLate) {
        if (hoursLate < last.duration) {
            const endDate = (baseDate + (last.duration * 60 * 60 * 1000) - now);
            const endHours = Math.floor(endDate / (1000 * 60 * 60));
            let endMin = Math.floor(endDate / (1000 * 60));
            let endSec = Math.floor(endDate / 1000);
            endMin -= Math.floor(endMin / 60) * 60;
            endSec -= Math.floor(endSec / 60) * 60;
            if (!this.state.finishTime) {
                this.setState({
                    finishTime: this.setLateTimeRemaining(endHours, endMin, endSec)
                });
            }
            else {
                $('.finish-countdown')[0].innerHTML = this.setLateTimeRemaining(endHours, endMin, endSec);
            }
        }
        else {
            this.setState({
                finishTime: 'Maintenant'
            });
        }
    }

    getLateCountdown(secondDiff, minDiff, hoursLate, last, dragodindes) {
        if (last) {
            let goodHours = '';
            if (dragodindes && hoursLate >= last.duration - dragodindes[0].duration) {
                goodHours = hoursLate - (last.duration - dragodindes[0].duration);
            }
            else if (!dragodindes && hoursLate >= last.duration) {
                goodHours = hoursLate - last.duration;
            }
            const stringDuration = this.setLateTimeRemaining(goodHours, minDiff, secondDiff);
            if (!this.state.lateCountdown) {
                this.setState({
                    lateCountdown: stringDuration
                });
            }
            if ($('.late-countdown')[0]) {
                $('.late-countdown')[0].innerHTML = stringDuration;
            }
        }
    }

    setDragodindes(baseDate, last, dragodindes, hoursDiff, minDiff, secondDiff) {
        let estimatedTime = 0;
        let prevDrago = false;
        let isEnded = false;
        dragodindes.map((drago, index) => {
            let goodTime = '';
            let goodDate = '';
            if ((prevDrago && prevDrago.end.time.substr(0, 10) === 'Maintenant') || isEnded) {
                estimatedTime += prevDrago.duration - drago.duration;
                goodTime = estimatedTime === 0 ? 'Maintenant' : estimatedTime + 'H';
                goodDate = dateFormat(Date.now() + (estimatedTime * 60 * 60 * 1000), 'dd/mm/yyyy HH:MM:ss');
                isEnded = true;
            }
            else if (last && index === 0 && last.duration !== drago.duration && hoursDiff < last.duration - drago.duration) {
                estimatedTime += last.duration - drago.duration;
                goodDate = dateFormat(baseDate + ((last.duration - drago.duration) * 60 * 60 * 1000), 'dd/mm/yyyy HH:MM:ss');
                const showedTime = this.setTimeRemaining(estimatedTime, hoursDiff, minDiff, secondDiff);
                goodTime = showedTime;
            }
            else if ((!last && !prevDrago && index === 0) || (last && last.duration === drago.duration) || (hoursDiff >= last.duration - drago.duration)) {
                goodTime = 'Maintenant';
                goodDate = last && hoursDiff >= last.duration - drago.duration ? dateFormat(baseDate + (hoursDiff * 1000 * 60 * 60), 'dd/mm/yyyy HH:MM:ss') : dateFormat(baseDate, 'dd/mm/yyyy HH:MM:ss');
                baseDate = last && hoursDiff >= last.duration - drago.duration ? baseDate + (hoursDiff * 60 * 60 * 1000) : baseDate;
            }
            else {
                if (prevDrago.duration !== drago.duration) {
                    estimatedTime += prevDrago.duration - drago.duration;
                }
                const showedTime = this.setTimeRemaining(estimatedTime, hoursDiff, minDiff, secondDiff);
                goodTime = estimatedTime === 0 ? 'Maintenant' : showedTime;
                goodDate = dateFormat(baseDate + (estimatedTime * 60 * 60 * 1000), 'dd/mm/yyyy HH:MM:ss');
            }
            drago.end = {
                time: goodTime,
                date: goodDate
            };
            prevDrago = drago;
        });
        return dragodindes;
    }

    setLateTimeRemaining(hours, minutes, seconds) {
        const goodMinutes = (minutes >= 0 && minutes < 10 ? '0' + minutes + 'M' : minutes + 'M');
        const goodSeconds = (seconds >= 0 && seconds < 10 ? '0' + seconds + 'S' : seconds + 'S');
        return hours > 0 ? hours + 'H' + goodMinutes + goodSeconds : goodMinutes + goodSeconds;
    }

    setTimeRemaining(duration, hours, minutes, seconds) {
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
    }

    handleAutomateFecond(index) {
        const used = [];
        const last = [];
        this.state.dragodindes.map((drago, mapIndex) => {
            if (mapIndex < index) {
                used.push(drago);
            }
            else if (mapIndex === index) {
                last.push(drago);
            }
        });
        if (this.state.last) {
            used.push(this.state.last);
        }
        this.setState({
            selectedDrago: {
                used: used,
                last: last
            },
            show: true
        });
    }

    handleCallAutomateAPI() {
        Promise.all([
            Axios.post('/api/dofus/dragodindes/used/update', {
                userId: this.state.user.id,
                dragodindes: this.state.selectedDrago.used
            }),
            Axios.post('/api/dofus/dragodindes/last/update', {
                userId: this.state.user.id,
                dragodindes: this.state.selectedDrago.last
            })
        ]).then(() => {
            this.handleClose();
            clearInterval(this.interval);
            this.getDataAndSetState();
        }).catch(() => {
            setTimeout(() => {
                this.handleCallAutomateAPI();
            }, 1500);
        });
    }

    handleClose() {
        this.setState({
            show: false,
            selectedDrago: {
                used: [],
                last: []
            }
        });
    }

    handleChange(e) {
        const filtered = this.state.dragodindes.filter(d => d.name.toLowerCase().indexOf(e.target.value.toLowerCase()) !== -1);
        this.setState({
            showedDragodindes: _.reverse(_.sortBy(filtered, 'duration', 'asc'))
        });
    }

    render() {
        return (
            <div className='principal-container'>
                <FecondatorModal
                    handleClose={this.handleClose}
                    handleCallAutomateAPI={this.handleCallAutomateAPI}
                    show={this.state.show}
                    dragodindes={this.state.selectedDrago}
                />
                <h1 className='craft-title text-center col-12 col-md-6'>Fécondator</h1>
                <div className='notes-btn col-sm-12 text-center'>
                    <a href='/dofus/dragodindes'>
                        <button>Mes dragodindes</button>
                    </a>
                </div>
                <div className='text-center fecondator-last-dragodinde col-sm-11 col-md-10 col-lg-9 col-xl-8'>
                    {this.state.last ?
                        <div className='fecondator-last-div col-9 col-sm-8 col-md-6'>
                            <h4 className='col-12'>Dragodinde fécondée</h4>
                            <img className='col-4' alt='dd_icon' src={'/assets/img/dragodindes/' + this.state.last.name.toLowerCase().split(' ').join('-') + '.png'} />
                            <div className='fecondator-last-infos col-7'>
                                <p className='label'>Nom</p>
                                <p className='value'>{this.state.last.name}</p>
                                <p className='label'>Fécondation</p>
                                <p className='value'>{dateFormat(this.state.last.last.date, 'dd/mm/yyyy HH:MM:ss')}</p>
                            </div>
                        </div> : ''}
                    <div className='fecondator-infos col-7 col-sm-7 col-md-5'>
                        <h4 className='col-12'>Informations</h4>
                        <div className='fecondator-infos-content col-10'>
                            <p className='label'>Accouchement</p>
                            <p className='value'>{this.state.accouchDate}</p>
                            {this.state.lateCountdown ?
                                <>
                                    <p className='label'>Retard</p>
                                    <p className='late-countdown value'>{this.state.lateCountdown}</p>
                                </> : ''}
                            {this.state.finishTime ?
                                <>
                                    <p className='label'>Dans</p>
                                    <p className='finish-countdown value'>{this.state.finishTime}</p>
                                </> : ''}
                        </div>
                    </div>
                </div>
                {this.state.dragodindes.length ?
                    <div className='text-center principal-dragodindes-div col-sm-11 col-md-10 col-lg-8 col-xl-8'>
                        <input
                            className='input-parcho'
                            placeholder='Rechercher'
                            onChange={this.handleChange}
                        />
                        <div className='my-dragodindes-container'>
                            {this.state.showedDragodindes.length ?
                                this.state.showedDragodindes.map((drago, index) => {
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
                                                        {(this.state.showedDragodindes[index + 1] && this.state.showedDragodindes[index + 1].end.time.substr(0, 10) !== 'Maintenant') || (!this.state.showedDragodindes[index + 1]) ?
                                                            <>
                                                                <p className='fecondator-automate-time col-10 text-center'>Maintenant</p>
                                                                <Tooltip
                                                                    title='Définir comme la dernière dragodinde fécondée et définir les dragodindes précédentes comme utilisées'
                                                                    placement='top'
                                                                >
                                                                    <span
                                                                        className='fecondator-automate-icon col-2'
                                                                        onClick={() => this.handleAutomateFecond(index)}
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
                    this.state.wait ?
                        <div className='text-center loading-notes-message'>
                            <h1>Chargement des dragodindes <span className='custom-spinner-notes' /></h1>
                        </div> :
                        <div className='text-center no-notes-message'>
                            <h1>Pas de dragodindes actuellement</h1>
                        </div>}
            </div>
        );
    }
}

Fecondator.propTypes = {
    user: PropTypes.oneOfType([
        PropTypes.object.isRequired,
        PropTypes.bool.isRequired
    ])
};
