'use strict';

import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import _ from 'lodash';
import dragoJSON from './../../../../../assets/json/dragodindes.json';
import DragodindesModal from './modal.jsx';
import { Tooltip } from '@material-ui/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faHeart, faHeartBroken, faToggleOff, faToggleOn, faCheck, faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import PropTypes from 'prop-types';

library.add(faHeart);
library.add(faHeartBroken);
library.add(faToggleOff);
library.add(faToggleOn);
library.add(faCheck);
library.add(faTimesCircle);

const Dragodindes = (props) => {
    const [user] = useState(props.user);
    const [dragodindes, setDragodindes] = useState([]);
    const [showedDragodindes, setShowedDragodindes] = useState([]);
    const [selectedDrago, setSelectedDrago] = useState([]);
    const [wait, setWait] = useState(true);
    const [loaded, setLoaded] = useState(false);
    const [show, setShow] = useState(false);
    const [action, setAction] = useState('default');
    const [title, setTitle] = useState('');
    const [input, setInput] = useState(false);
    const [dragoJSONConst, setDragoJSONConst] = useState(dragoJSON.sort((a, b) => a.name.localeCompare(b.name)));

    useEffect(() => {
        if (wait && !loaded) {
            const getDragodindesAPI = async () => {
                const res = await Axios.post('/api/dofus/dragodindes', {
                    userId: user.id
                });
                if (res.data && res.data.length) {
                    setDragodindes(res.data.sort((a, b) => a.name.localeCompare(b.name)));
                    setShowedDragodindes(res.data.sort((a, b) => a.name.localeCompare(b.name)));
                }
                setWait(false);
            };
            getDragodindesAPI();
            setLoaded(true);
        }
    });

    const updateDragodindesAPI = async (url, paramsObj) => {
        const res = await Axios.post(url, paramsObj);
        setDragodindes(res.data.sort((a, b) => a.name.localeCompare(b.name)));
        setShowedDragodindes(res.data.sort((a, b) => a.name.localeCompare(b.name)));
        setAction('default');
    };

    const handleAddModalDrago = (name, duration, generation, selected) => {
        let localDragodindes = selectedDrago;
        let JSONselected = '';
        if (!selected) {
            JSONselected = setDragoJSON(dragoJSON, name);
            localDragodindes.push({ name: name, duration: duration, generation: generation });
        }
        else {
            localDragodindes = removeDragodindeFromArray(name, localDragodindes);
            JSONselected = setRemoveDragoJSON(name);
        }
        setSelectedDrago(localDragodindes.sort((a, b) => a.name.localeCompare(b.name)));
        setDragoJSONConst(input ? JSONselected.filter(d => d.name.toLowerCase().indexOf(input) !== -1).sort((a, b) => a.name.localeCompare(b.name)) : JSONselected.sort((a, b) => a.name.localeCompare(b.name)));
    };

    const removeDragodindeFromArray = (name, localDragodindes) => {
        const arrayDrago = localDragodindes;
        localDragodindes.map((drago, index) => {
            if (drago.name === name) {
                delete arrayDrago[index];
            }
        });
        return _.compact(arrayDrago);
    };

    const setRemoveDragoJSON = (name) => {
        const JSONselected = [];
        dragoJSON.map(d => {
            const check = checkAlreadySelected(d);
            if (d.name === name || !check) {
                JSONselected.push(d);
            }
            else {
                JSONselected.push({ ...d, selected: true });
            }
        });
        return JSONselected;
    };

    const setDragoJSON = (array, name) => {
        const JSONselected = [];
        array.map(d => {
            const check = checkAlreadySelected(d);
            if (d.name === name || check) {
                JSONselected.push({ ...d, selected: true });
            }
            else {
                JSONselected.push(d);
            }
        });
        return JSONselected;
    };

    const checkAlreadySelected = (dragodinde) => {
        let check = false;
        selectedDrago.map(drago => {
            if (drago.name === dragodinde.name) {
                check = true;
            }
        });
        return check;
    };

    const handleChange = (e) => {
        const filtered = dragodindes.filter(d => d.name.toLowerCase().indexOf(e.target.value.toLowerCase()) !== -1);
        setShowedDragodindes(filtered.sort((a, b) => a.name.localeCompare(b.name)));
    };

    const handleChangeModal = (e) => {
        const filtered = dragoJSON.filter(d => d.name.toLowerCase().indexOf(e.target.value.toLowerCase()) !== -1);
        setDragoJSONConst(setDragoJSON(filtered, false).sort((a, b) => a.name.localeCompare(b.name)));
        setInput(e.target.value === '' ? false : e.target.value.toLowerCase());
    };

    const handleCallAPI = (url) => {
        if (selectedDrago.length) {
            updateDragodindesAPI(url, {
                userId: user.id,
                dragodindes: selectedDrago
            });
            handleClose();
        }
    };

    const handleSelectMyDragodindes = (name, duration, generation, selected) => {
        const _showedDragodindes = showedDragodindes;
        let _selectedDrago = selectedDrago;
        _showedDragodindes.map(drago => {
            if (drago.name === name) {
                drago.selected = !selected;
            }
        });
        if (selected) {
            selectedDrago.map((drago, index) => {
                if (drago.name === name) {
                    delete _selectedDrago[index];
                    _selectedDrago = _.compact(_selectedDrago);
                }
            });
        }
        else {
            _selectedDrago.push({ name: name, duration: duration, generation: generation });
            _selectedDrago = _.compact(_selectedDrago);
        }
        setSelectedDrago(_selectedDrago);
        setShowedDragodindes(_showedDragodindes.sort((a, b) => a.name.localeCompare(b.name)));
        setAction(_selectedDrago.length === 0 ? 'default' : 'remove');
    };

    const handleUnusedDragodindes = (drago) => {
        const selected = selectedDrago;
        selected.push({ name: drago.name });
        setSelectedDrago(selected);
        if (!drago.used) {
            showModal('unused');
        }
        else {
            showModal('remove-unused');
        }
    };

    const handleLastDragodinde = (drago) => {
        const selected = selectedDrago;
        selected.push({ name: drago.name });
        setSelectedDrago(selected);
        if (!drago.last.status) {
            showModal('last');
        }
        else {
            showModal('remove-last');
        }
    };

    const handleClose = () => {
        setShow(false);
        setTitle('');
        setSelectedDrago([]);
        setDragoJSONConst(dragoJSON.sort((a, b) => a.name.localeCompare(b.name)));
        setInput(false);
    };

    const showModal = (choice) => {
        let goodTitle = '';
        if (choice === 'new') {
            goodTitle = 'Ajouter des dragodindes';
        }
        else if (choice === 'last') {
            goodTitle = 'Définir comme fécondée ?';
        }
        else if (choice === 'remove-last') {
            goodTitle = 'Retirer la fécondation ?';
        }
        else if (choice === 'unused') {
            goodTitle = 'Définir comme déjà utilisée ?';
        }
        else if (choice === 'remove-unused') {
            goodTitle = 'Définir comme disponible ?';
        }
        setShow(true);
        setTitle(goodTitle);
    };

    return (
        <div className='principal-container'>
            <DragodindesModal
                handleClose={handleClose}
                handleChangeModal={handleChangeModal}
                handleAddModalDrago={handleAddModalDrago}
                handleCallAPI={handleCallAPI}
                show={show}
                title={title}
                dragodindes={dragodindes}
                dragoJSON={dragoJSONConst}
            />
            <h2 className='craft-title text-center'>Mes dragodindes</h2>
            <div className='notes-btn col-sm-12 text-center'>
                {!selectedDrago.length ?
                    <button
                        className='my-dragodindes-add-btn'
                        onClick={() => showModal('new')}
                    >
                        Ajouter des dragodindes
                    </button> :
                    <button
                        className='my-dragodindes-add-btn'
                        disabled
                    >
                        Ajouter des dragodindes
                    </button>}
                {action === 'remove' ?
                    <button
                        className='my-dragodindes-add-btn'
                        onClick={() => handleCallAPI('/api/dofus/dragodindes/remove')}
                    >
                        Supprimer la sélection
                    </button> :
                    <button
                        className='my-dragodindes-add-btn'
                        disabled
                    >
                        Supprimer la sélection
                    </button>}
                <a href='/dofus/fecondator'>
                    <button>Fécondator</button>
                </a>
            </div>
            {dragodindes.length ?
                <div className='text-center principal-dragodindes-div col-sm-11 col-md-10 col-lg-8 col-xl-6'>
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
                                        className={drago.selected ? 'my-drago-line-selected' : drago.last.status ? 'my-drago-line-last' : drago.used ? 'my-drago-line-used' : 'my-drago-line'}
                                        key={index}
                                    >
                                        <div className='my-dragodindes-name col-9'>
                                            <img src={'/assets/img/dragodindes/' + drago.name.toLowerCase().split(' ').join('-') + '.png'} alt='dd_icon' />
                                            {drago.last.status ?
                                                <p>{drago.name}<span className='my-drago-fecond-message'> - Fécondée</span></p> : drago.used ?
                                                    <p>{drago.name}<span className='my-drago-used-message'> - Utilisée</span></p> :
                                                    <p>{drago.name}</p>}
                                        </div>
                                        <div className='my-dragodindes-icons col-3'>
                                            {!drago.used && action !== 'remove' ?
                                                <Tooltip
                                                    title='Définir comme déjà utilisée'
                                                    placement='top'
                                                >
                                                    <span
                                                        className='icon-used'
                                                        onClick={() => handleUnusedDragodindes(drago)}
                                                    >
                                                        <FontAwesomeIcon icon='toggle-off' />
                                                    </span>
                                                </Tooltip> : drago.used && action !== 'remove' ?
                                                    <Tooltip
                                                        title='Définir comme disponible'
                                                        placement='top'
                                                    >
                                                        <span
                                                            className='icon-used'
                                                            onClick={() => handleUnusedDragodindes(drago)}
                                                        >
                                                            <FontAwesomeIcon icon='toggle-on' />
                                                        </span>
                                                    </Tooltip> : ''}
                                            {(!selectedDrago.length || show) && !drago.last.status ?
                                                <Tooltip
                                                    title='Définir comme la dernière dragodinde fécondée'
                                                    placement='top'
                                                >
                                                    <span
                                                        className='icon-heart'
                                                        onClick={() => handleLastDragodinde(drago)}
                                                    >
                                                        <FontAwesomeIcon icon='heart' />
                                                    </span>
                                                </Tooltip> : (!selectedDrago.length || show) && drago.last.status ?
                                                    <Tooltip
                                                        title='Retirer la fécondation'
                                                        placement='top'
                                                    >
                                                        <span
                                                            className='icon-heart'
                                                            onClick={() => handleLastDragodinde(drago)}
                                                        >
                                                            <FontAwesomeIcon icon='heart-broken' />
                                                        </span>
                                                    </Tooltip> : ''}
                                            {action !== 'unused' ?
                                                <Tooltip title={drago.selected ? 'Retirer de la sélection' : 'Sélectionner pour la suppression'} placement='top'>
                                                    <span
                                                        className='icon-cross'
                                                        onClick={() => handleSelectMyDragodindes(drago.name, drago.duration, drago.generation, drago.selected)}
                                                    >
                                                        <FontAwesomeIcon icon='times-circle' />
                                                    </span>
                                                </Tooltip> : ''}
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
                    </div> : !wait && loaded ?
                        <div className='text-center no-notes-message'>
                            <h1>Pas de dragodindes actuellement</h1>
                        </div> : <></>}
        </div>
    );
};

Dragodindes.propTypes = {
    user: PropTypes.oneOfType([
        PropTypes.object.isRequired,
        PropTypes.bool.isRequired
    ])
};

export default Dragodindes;
