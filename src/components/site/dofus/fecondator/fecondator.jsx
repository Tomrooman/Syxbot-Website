'use strict';

import React from 'react';
import Axios from 'axios';
import _ from 'lodash';
import dateFormat from 'dateformat';
import $ from 'jquery';
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
            selectedDrago: [],
            accouchDate: [],
            last: false,
            wait: true,
            input: false
        };
        this.handleChange = this.handleChange.bind(this);
    }

    componentDidMount() {
        Axios.post('/api/dofus/dragodindes', {
            userId: this.state.user.id
        })
            .then(res => {
                if (res.data && res.data.length) {
                    const now = Date.now();
                    let ddFecond = res.data.filter(d => d.last.status);
                    ddFecond = ddFecond && ddFecond[0] ? ddFecond[0] : false;
                    let sortedDragodindes = _.reverse(_.sortBy(res.data.filter(d => !d.last.status && !d.last.used), 'duration', 'asc'));
                    sortedDragodindes = this.calculateTime(now, ddFecond, sortedDragodindes);
                    this.setDidMountState(now, ddFecond, sortedDragodindes);
                }
                else {
                    this.setState({
                        wait: false
                    });
                }
            })
            .catch(e => {
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
                setInterval(() => {
                    if (this.state.user.countdown) {
                        this.countdown(this.calculateTime(Date.now(), ddFecond, sortedDragodindes));
                    }
                }, 1000);
            }
        });
    }

    countdown(dragodindes) {
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
                        $(line.children[1])[0].innerHTML = '';
                        const div = document.createElement('div');
                        div.className = 'fecondator-time-now';
                        const p = document.createElement('p');
                        p.innerHTML = 'Maintenant';
                        div.appendChild(p);
                        $(line.children[1])[0].append(div);
                    }
                }
            }
        });
    }

    getAccouchDate(now, last, dragodindes) {
        let date = dateFormat(now + (dragodindes[0].duration * 60 * 60 * 1000), 'dd/mm/yyyy HH:MM:ss');
        if (last) {
            const hoursDiff = Math.floor((now - Date.parse(last.last.date)) / (1000 * 60 * 60));
            if (hoursDiff >= last.duration - dragodindes[0].duration) {
                date = dateFormat(Date.now() + (dragodindes[0].duration * 60 * 60 * 1000), 'dd/mm/yyyy HH:MM:ss');
            }
            else {
                date = dateFormat(Date.parse(last.last.date) + (last.duration * 60 * 60 * 1000), 'dd/mm/yyyy HH:MM:ss');
            }
        }
        return date;
    }

    calculateTime(now, last, dragodindes) {
        const baseDate = last ? Date.parse(last.last.date) : now;
        let secondDiff = last ? Math.floor((now - baseDate) / 1000) : 0;
        secondDiff = last ? secondDiff - Math.floor(secondDiff / 60) * 60 : 0;
        let minDiff = last ? Math.floor((now - baseDate) / (1000 * 60)) : 0;
        minDiff = last ? minDiff - (Math.floor(minDiff / 60) * 60) : 0;
        minDiff = 60 - minDiff;
        secondDiff = 60 - secondDiff;
        const hoursDiff = last ? Math.floor((now - baseDate) / (1000 * 60 * 60)) : 0;
        const setDrago = this.setDragodindes(baseDate, last, dragodindes, hoursDiff, minDiff, secondDiff);
        return setDrago;
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

    setTimeRemaining(duration, hours, minutes, seconds) {
        let modifDuration = duration - hours;
        modifDuration = minutes > 0 || seconds > 0 ? modifDuration - 1 : modifDuration;
        minutes = seconds > 0 ? minutes - 1 : minutes;
        if (seconds === 60) {
            minutes += 1;
        }
        if (seconds !== 60 && minutes !== 60) {
            if (modifDuration <= 0) {
                modifDuration = (minutes < 10 && minutes >= 0 ? '0' + minutes : minutes) + 'M' + (seconds < 10 && seconds >= 0 ? '0' + seconds : seconds) + 'S';
            }
            else {
                modifDuration += 'H' + (minutes < 10 && minutes >= 0 ? '0' + minutes : minutes) + 'M' + (seconds < 10 && seconds >= 0 ? '0' + seconds : seconds) + 'S';
            }
        }
        else if (seconds === 60 && minutes === 60) {
            modifDuration = modifDuration <= 0 ? '1H' : modifDuration + 1;
            modifDuration = modifDuration === '1H' ? modifDuration : modifDuration + 'H';
        }
        else if (seconds === 60 && minutes !== 60) {
            if (modifDuration <= 0) {
                modifDuration = (minutes < 10 && minutes >= 0 ? '0' + minutes : minutes) + 'M' + '00S';
            }
            else {
                modifDuration += 'H' + (minutes < 10 && minutes >= 0 ? '0' + minutes : minutes) + 'M' + '00S';
            }
        }
        return modifDuration;
    }

    handleFinishFecond(index) {
        console.log('clicked index : ', index);
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
                <h2 className='craft-title text-center'>Fécondator</h2>
                <div className='notes-btn col-sm-12 text-center'>
                    <a href='/dofus/dragodindes'>
                        <button>Mes dragodindes</button>
                    </a>
                    <a href='/dofus'>
                        <button>Retour au menu</button>
                    </a>
                </div>
                {this.state.last ?
                    <div className='text-center fecondator-last-dragodinde col-sm-11 col-md-10 col-lg-8 col-xl-8'>
                        <p>{this.state.last.name}</p>
                        <p>{this.state.accouchDate}</p>
                    </div> : ''}
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
                                                                        onClick={() => this.handleFinishFecond(index)}
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
