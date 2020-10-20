'use strict';

import React, { ChangeEvent } from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import PropTypes from 'prop-types';
import { dragoSelectedtype, dragoType } from '../../../../@types/dragodindes';

interface propsType {
    dragoJSON: dragoSelectedtype[];
    dragodindes: dragoType[];
    handleAddModalDrago(name: string, duration: number, generation: number, selected: boolean): void;
    handleCallAPI(url: string): void;
    handleChangeModal(e: ChangeEvent): void;
    handleClose(): void;
    show: boolean;
    title: string;
}

const DragodindesModal = (props: propsType): React.ReactElement => {
    /* eslint-disable max-len */
    if (props.show && props.title === 'Ajouter des dragodindes') {
        return (
            <div>
                <Modal
                    isOpen={props.show}
                    toggle={props.handleClose}
                >
                    <span className='enclos-modal-title col-12'>
                        <ModalHeader>
                            {props.title}
                        </ModalHeader>
                    </span>
                    <ModalBody>
                        <div className='col-10 offset-1 text-center'>
                            <input
                                type='text'
                                placeholder='Rechercher'
                                onChange={props.handleChangeModal}
                            />
                        </div>
                        <div className='add-drago-list'>
                            {props.dragoJSON.length ?
                                props.dragoJSON.map((drago, index) => {
                                    if (!props.dragodindes.filter(d => d.name === drago.name)[0]) {
                                        return (
                                            <div
                                                className={drago.selected ? 'drago-line-selected' : 'drago-line'}
                                                key={index}
                                                onClick={(): void => props.handleAddModalDrago(drago.name, drago.duration, drago.generation, drago.selected || false)}
                                            >
                                                {drago.selected ?
                                                    <span>
                                                        <FontAwesomeIcon icon='check' />
                                                        <img src={'/assets/img/dofus/dragodindes/' + drago.name.toLowerCase().split(' ').join('-') + '.png'} alt='dd_icon' />
                                                        {drago.name}
                                                    </span> :
                                                    <>
                                                        <span className='add-drago-check-over'>
                                                            <FontAwesomeIcon icon='check' />
                                                        </span>
                                                        <img src={'/assets/img/dofus/dragodindes/' + drago.name.toLowerCase().split(' ').join('-') + '.png'} alt='dd_icon' />
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
                                className='enclos-modal-create-btn'
                                onClick={(): void => props.handleCallAPI('/api/dofus/dragodindes/create')}
                            >
                                Ajouter
                            </button>
                        </span>
                        <span className='col-6 text-right'>
                            <button
                                className='enclos-modal-close-btn'
                                onClick={props.handleClose}
                            >
                                Annuler
                            </button>
                        </span>
                    </ModalFooter>
                </Modal>
            </div>
        );
    }
    else if (props.show && props.title === 'Définir comme fécondée ?') {
        return (
            <div>
                <Modal
                    isOpen={props.show}
                    toggle={props.handleClose}
                >
                    <span className='enclos-modal-title col-12'>
                        <ModalHeader>
                            {props.title}
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
                                className='enclos-modal-create-btn'
                                onClick={(): void => props.handleCallAPI('/api/dofus/dragodindes/status/last/update')}
                            >
                                Confirmer
                            </button>
                        </span>
                        <span className='col-6 text-right'>
                            <button
                                className='enclos-modal-close-btn'
                                onClick={props.handleClose}
                            >
                                Annuler
                            </button>
                        </span>
                    </ModalFooter>
                </Modal>
            </div>
        );
    }
    else if (props.show && props.title === 'Retirer la fécondation ?') {
        return (
            <div>
                <Modal
                    isOpen={props.show}
                    toggle={props.handleClose}
                >
                    <span className='enclos-modal-title col-12'>
                        <ModalHeader>
                            {props.title}
                        </ModalHeader>
                    </span>
                    <ModalFooter>
                        <span className='col-6 text-left'>
                            <button
                                className='enclos-modal-create-btn'
                                onClick={(): void => props.handleCallAPI('/api/dofus/dragodindes/status/last/remove')}
                            >
                                Retirer la fécondation
                            </button>
                        </span>
                        <span className='col-6 text-right'>
                            <button
                                className='enclos-modal-close-btn'
                                onClick={props.handleClose}
                            >
                                Annuler
                            </button>
                        </span>
                    </ModalFooter>
                </Modal>
            </div>
        );
    }
    else if (props.show && props.title === 'Définir comme déjà utilisée ?') {
        return (
            <div>
                <Modal
                    isOpen={props.show}
                    toggle={props.handleClose}
                >
                    <span className='enclos-modal-title col-12'>
                        <ModalHeader>
                            {props.title}
                        </ModalHeader>
                    </span>
                    <ModalFooter>
                        <span className='col-6 text-left'>
                            <button
                                className='enclos-modal-create-btn'
                                onClick={(): void => props.handleCallAPI('/api/dofus/dragodindes/status/used/update')}
                            >
                                Définir comme déjà utilisée
                            </button>
                        </span>
                        <span className='col-6 text-right'>
                            <button
                                className='enclos-modal-close-btn'
                                onClick={props.handleClose}
                            >
                                Annuler
                            </button>
                        </span>
                    </ModalFooter>
                </Modal>
            </div>
        );
    }
    else if (props.show && props.title === 'Définir comme disponible ?') {
        return (
            <div>
                <Modal
                    isOpen={props.show}
                    toggle={props.handleClose}
                >
                    <span className='enclos-modal-title col-12'>
                        <ModalHeader>
                            {props.title}
                        </ModalHeader>
                    </span>
                    <ModalFooter>
                        <span className='col-6 text-left'>
                            <button
                                className='enclos-modal-create-btn'
                                onClick={(): void => props.handleCallAPI('/api/dofus/dragodindes/status/used/remove')}
                            >
                                Définir comme disponible
                            </button>
                        </span>
                        <span className='col-6 text-right'>
                            <button
                                className='enclos-modal-close-btn'
                                onClick={props.handleClose}
                            >
                                Annuler
                            </button>
                        </span>
                    </ModalFooter>
                </Modal>
            </div>
        );
    }
    else return (<></>);
};

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

export default DragodindesModal;
