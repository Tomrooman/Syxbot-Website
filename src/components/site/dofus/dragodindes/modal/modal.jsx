'use strict';

import React from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import PropTypes from 'prop-types';

export default class DragodindesModal extends React.Component {
    render() {
        if (this.props.show && this.props.title === 'Ajouter des dragodindes') {
            return (
                <div>
                    <Modal
                        isOpen={this.props.show}
                        toggle={this.props.handleClose}
                    >
                        <span className='notes-modal-title col-12'>
                            <ModalHeader>
                                {this.props.title}
                            </ModalHeader>
                        </span>
                        <ModalBody>
                            <div className='col-10 offset-1 text-center'>
                                <input
                                    type='text'
                                    placeholder='Rechercher'
                                    onChange={this.props.handleChangeModal}
                                />
                            </div>
                            <div className='add-drago-list'>
                                {this.props.dragoJSON.length ?
                                    this.props.dragoJSON.map((drago, index) => {
                                        if (!this.props.dragodindes.filter(d => d.name === drago.name)[0]) {
                                            return (
                                                <div
                                                    className={drago.selected ? 'drago-line-selected' : 'drago-line'}
                                                    key={index}
                                                    onClick={() => this.props.handleAddModalDrago(drago.name, drago.duration, drago.generation, drago.selected)}
                                                >
                                                    {drago.selected ?
                                                        <span>
                                                            <FontAwesomeIcon icon='check' /> {drago.name}
                                                        </span> :
                                                        <>
                                                            <span className='add-drago-check-over'>
                                                                <FontAwesomeIcon icon='check' />
                                                            </span>
                                                            {drago.name}
                                                        </>}
                                                </div>
                                            );
                                        }
                                    }) :
                                    <div className='empty-drago-line'>
                                        <div className='my-dragodindes-name'>
                                            <p>Aucun résultat</p>
                                        </div>
                                    </div>}
                            </div>
                        </ModalBody>
                        <ModalFooter>
                            <span className='col-6 text-left'>
                                <button
                                    className='notes-modal-create-btn'
                                    onClick={() => this.props.handleCallAPI('/api/dofus/dragodindes/create')}
                                >
                                    Ajouter
                                </button>
                            </span>
                            <span className='col-6 text-right'>
                                <button
                                    className='notes-modal-close-btn'
                                    onClick={this.props.handleClose}
                                >
                                    Annuler
                                </button>
                            </span>
                        </ModalFooter>
                    </Modal>
                </div>
            );
        }
        else if (this.props.show && this.props.title === 'Définir comme fécondée ?') {
            return (
                <div>
                    <Modal
                        isOpen={this.props.show}
                        toggle={this.props.handleClose}
                    >
                        <span className='notes-modal-title col-12'>
                            <ModalHeader>
                                {this.props.title}
                            </ModalHeader>
                        </span>
                        <ModalBody>
                            <div className='last-drago-modal-infos'>
                                <p>Définir une dragodinde comme fécondée signifie que cette dragodinde sera utilisée comme référence pour les calculs du fécondator (savoir à quel moment faire féconder ses dragodindes) et vous permettre d'afficher le temps et les dates par rapport à cette dragodinde.</p>
                            </div>
                        </ModalBody>
                        <ModalFooter>
                            <span className='col-6 text-left'>
                                <button
                                    className='notes-modal-create-btn'
                                    onClick={() => this.props.handleCallAPI('/api/dofus/dragodindes/last/update')}
                                >
                                    Confirmer
                                </button>
                            </span>
                            <span className='col-6 text-right'>
                                <button
                                    className='notes-modal-close-btn'
                                    onClick={this.props.handleClose}
                                >
                                    Annuler
                                </button>
                            </span>
                        </ModalFooter>
                    </Modal>
                </div>
            );
        }
        else {
            return (
                <div>
                    <Modal
                        isOpen={this.props.show}
                        toggle={this.props.handleClose}
                    >
                        <span className='notes-modal-title col-12'>
                            <ModalHeader>
                                {this.props.title}
                            </ModalHeader>
                        </span>
                        <ModalFooter>
                            <span className='col-6 text-left'>
                                <button
                                    className='notes-modal-create-btn'
                                    onClick={() => this.props.handleCallAPI('/api/dofus/dragodindes/last/remove')}
                                >
                                    Retirer la fécondation
                                </button>
                            </span>
                            <span className='col-6 text-right'>
                                <button
                                    className='notes-modal-close-btn'
                                    onClick={this.props.handleClose}
                                >
                                    Annuler
                                </button>
                            </span>
                        </ModalFooter>
                    </Modal>
                </div>
            );
        }
    }
}

DragodindesModal.propTypes = {
    show: PropTypes.bool.isRequired,
    handleClose: PropTypes.func.isRequired,
    handleAddModalDrago: PropTypes.func.isRequired,
    handleCallAPI: PropTypes.func.isRequired,
    dragodindes: PropTypes.array.isRequired,
    dragoJSON: PropTypes.array.isRequired,
    handleChangeModal: PropTypes.func.isRequired,
    title: PropTypes.string.isRequired
};
