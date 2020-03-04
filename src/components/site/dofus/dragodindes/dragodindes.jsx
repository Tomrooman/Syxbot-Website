'use strict';

import React from 'react';
import Axios from 'axios';
import _ from 'lodash';
import dragoJSON from './../../../../../assets/json/dragodindes.json';
import DragodindesModal from './modal/modal.jsx';
import { Tooltip } from '@material-ui/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faHeart, faHeartBroken } from '@fortawesome/free-solid-svg-icons';
import PropTypes from 'prop-types';

library.add(faHeart);
library.add(faHeartBroken);

export default class Dragodindes extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            user: this.props.user,
            dragodindes: [],
            showedDragodindes: [],
            selectedDrago: [],
            wait: true,
            show: false,
            title: '',
            input: false,
            dragoJSON: dragoJSON.sort((a, b) => a.name.localeCompare(b.name))
        };
        this.handleAddModalDrago = this.handleAddModalDrago.bind(this);
        this.handleCallAPI = this.handleCallAPI.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleChangeModal = this.handleChangeModal.bind(this);
    }

    componentDidMount() {
        Axios.post('/api/dofus/dragodindes', {
            userId: this.state.user.id
        })
            .then(res => {
                if (res.data && res.data.length) {
                    this.setState({
                        dragodindes: res.data.sort((a, b) => a.name.localeCompare(b.name)),
                        showedDragodindes: res.data.sort((a, b) => a.name.localeCompare(b.name)),
                        wait: false
                    });
                }
                else {
                    this.setState({
                        wait: false
                    });
                }
            });
    }

    updateDragodindesAPI(url, paramsObj) {
        Axios.post(url, paramsObj)
            .then(res => {
                this.setState({
                    dragodindes: res.data.sort((a, b) => a.name.localeCompare(b.name)),
                    showedDragodindes: res.data.sort((a, b) => a.name.localeCompare(b.name))
                });
            });
    }

    handleAddModalDrago(name, duration, generation, selected) {
        let dragodindes = this.state.selectedDrago;
        let JSONselected = '';
        if (!selected) {
            JSONselected = this.setDragoJSON(dragoJSON, name);
            dragodindes.push({ name: name, duration: duration, generation: generation });
        }
        else {
            dragodindes = this.removeDragodindeFromArray(name, dragodindes);
            JSONselected = this.setRemoveDragoJSON(name);
        }
        this.setState({
            selectedDrago: dragodindes.sort((a, b) => a.name.localeCompare(b.name)),
            dragoJSON: this.state.input ? JSONselected.filter(d => d.name.toLowerCase().indexOf(this.state.input) !== -1).sort((a, b) => a.name.localeCompare(b.name)) : JSONselected.sort((a, b) => a.name.localeCompare(b.name))
        });
    }

    removeDragodindeFromArray(name, dragodindes) {
        const array = dragodindes;
        dragodindes.map((drago, index) => {
            if (drago.name === name) {
                delete array[index];
            }
        });
        return _.compact(array);
    }

    setRemoveDragoJSON(name) {
        const JSONselected = [];
        dragoJSON.map(d => {
            const check = this.checkAlreadySelected(d);
            if (d.name === name || !check) {
                JSONselected.push(d);
            }
            else {
                JSONselected.push({ ...d, selected: true });
            }
        });
        return JSONselected;
    }

    setDragoJSON(array, name) {
        const JSONselected = [];
        array.map(d => {
            const check = this.checkAlreadySelected(d);
            if (d.name === name || check) {
                JSONselected.push({ ...d, selected: true });
            }
            else {
                JSONselected.push(d);
            }
        });
        return JSONselected;
    }

    checkAlreadySelected(dragodinde) {
        let check = false;
        this.state.selectedDrago.map(drago => {
            if (drago.name === dragodinde.name) {
                check = true;
            }
        });
        return check;
    }

    handleChange(e) {
        const filtered = this.state.dragodindes.filter(d => d.name.toLowerCase().indexOf(e.target.value.toLowerCase()) !== -1);
        this.setState({
            showedDragodindes: filtered.sort((a, b) => a.name.localeCompare(b.name))
        });
    }

    handleChangeModal(e) {
        const filtered = dragoJSON.filter(d => d.name.toLowerCase().indexOf(e.target.value.toLowerCase()) !== -1);
        this.setState({
            dragoJSON: this.setDragoJSON(filtered, false).sort((a, b) => a.name.localeCompare(b.name)),
            input: e.target.value === '' ? false : e.target.value.toLowerCase()
        });
    }

    handleCallAPI(url) {
        if (this.state.selectedDrago.length) {
            this.updateDragodindesAPI(url, {
                userId: this.state.user.id,
                dragodindes: this.state.selectedDrago
            });
            this.handleClose();
        }
    }

    handleSelectMyDragodindes(name, duration, generation, selected) {
        const dragodindes = this.state.showedDragodindes;
        let selectedDrago = this.state.selectedDrago;
        dragodindes.map(drago => {
            if (drago.name === name) {
                drago.selected = !selected;
            }
        });
        if (selected) {
            this.state.selectedDrago.map((drago, index) => {
                if (drago.name === name) {
                    delete selectedDrago[index];
                    selectedDrago = _.compact(selectedDrago);
                }
            });
        }
        else {
            selectedDrago.push({ name: name, duration: duration, generation: generation });
        }
        this.setState({
            showedDragodindes: dragodindes.sort((a, b) => a.name.localeCompare(b.name)),
            selectedDrago: selectedDrago
        });
    }

    handleLastDragodinde(drago) {
        const selected = this.state.selectedDrago;
        selected.push({ name: drago.name });
        this.setState({
            selectedDrago: selected
        });
        if (!drago.last.status) {
            this.showModal('last');
        }
        else {
            this.showModal('remove-last');
        }
    }

    handleClose() {
        this.setState({
            show: false,
            title: '',
            selectedDrago: [],
            dragoJSON: dragoJSON.sort((a, b) => a.name.localeCompare(b.name)),
            input: false
        });
    }

    showModal(choice) {
        this.setState({
            show: true,
            title: choice === 'new' ? 'Ajouter des dragodindes' : choice === 'last' ? 'Définir comme fécondée ?' : 'Retirer la fécondation ?'
        });
    }

    render() {
        return (
            <div className='principal-container'>
                <DragodindesModal
                    handleClose={this.handleClose}
                    handleChangeModal={this.handleChangeModal}
                    handleAddModalDrago={this.handleAddModalDrago}
                    handleCallAPI={this.handleCallAPI}
                    show={this.state.show}
                    title={this.state.title}
                    dragodindes={this.state.dragodindes}
                    dragoJSON={this.state.dragoJSON}
                />
                <h2 className='craft-title text-center'>Mes dragodindes</h2>
                <div className='notes-btn col-sm-12 text-center'>
                    {this.state.selectedDrago.length && !this.state.show ?
                        <>
                            <button
                                className='my-dragodindes-add-btn'
                                disabled
                            >
                                Ajouter des dragodindes
                            </button>
                            <button
                                className='my-dragodindes-remove-btn'
                                onClick={() => this.handleCallAPI('/api/dofus/dragodindes/remove')}
                            >
                                Supprimer la sélection
                            </button>
                        </> :
                        <>
                            <button
                                className='my-dragodindes-add-btn'
                                onClick={() => this.showModal('new')}
                            >
                                Ajouter des dragodindes
                            </button>
                            <button
                                className='my-dragodindes-remove-btn'
                                disabled
                            >
                                Supprimer la sélection
                            </button>
                        </>}
                    <a href='/dofus/fecondator'>
                        <button>Fécondator</button>
                    </a>
                    <a href='/dofus'>
                        <button>Retour au menu</button>
                    </a>
                </div>
                {this.state.dragodindes.length ?
                    <div className='text-center principal-dragodindes-div col-sm-11 col-md-10 col-lg-8 col-xl-6'>
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
                                            className={drago.selected ? 'my-drago-line-selected' : drago.last.status ? 'my-drago-line-last' : 'my-drago-line'}
                                            key={index}
                                        >
                                            <div className='my-dragodindes-name col-9 col-sm-10'>
                                                {drago.last.status ?
                                                    <p>{drago.name}<span className='my-drago-fecond-message'> - Fécondée</span></p> :
                                                    <p>{drago.name}</p>}
                                            </div>
                                            <div className='my-dragodindes-icons col-3 col-sm-2'>
                                                {(!this.state.selectedDrago.length || this.state.show) && !drago.last.status ?
                                                    <Tooltip
                                                        title='Définir comme la dernière dragodinde fécondée'
                                                        placement='top'
                                                    >
                                                        <span
                                                            className='icon-heart'
                                                            onClick={() => this.handleLastDragodinde(drago)}
                                                        >
                                                            <FontAwesomeIcon icon='heart' />
                                                        </span>
                                                    </Tooltip> : (!this.state.selectedDrago.length || this.state.show) && drago.last.status ?
                                                        <Tooltip
                                                            title='Retirer la fécondation'
                                                            placement='top'
                                                        >
                                                            <span
                                                                className='icon-heart'
                                                                onClick={() => this.handleLastDragodinde(drago)}
                                                            >
                                                                <FontAwesomeIcon icon='heart-broken' />
                                                            </span>
                                                        </Tooltip> : ''}
                                                <Tooltip title={drago.selected ? 'Retirer de la sélection' : 'Sélectionner pour la suppression'} placement='top'>
                                                    <span
                                                        className='icon-cross'
                                                        onClick={() => this.handleSelectMyDragodindes(drago.name, drago.duration, drago.generation, drago.selected || false)}
                                                    >
                                                        <FontAwesomeIcon icon='times-circle' />
                                                    </span>
                                                </Tooltip>
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

Dragodindes.propTypes = {
    user: PropTypes.oneOfType([
        PropTypes.object.isRequired,
        PropTypes.bool.isRequired
    ])
};
