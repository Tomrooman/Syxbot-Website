'use strict';

import React, { ChangeEvent } from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import PropTypes from 'prop-types';
import { enclosType } from '../../../../@types/enclos';

interface propsType {
    handleChangeModal(e: ChangeEvent): void;
    handleClose(): void;
    handleCreateEnclos(): void;
    handleRemoveEnclos(): void;
    removeEnclos: enclosType;
    show: boolean;
    title: string;
}

const EnclosModal = (props: propsType): React.ReactElement => {
    if (props.show && props.title === 'Rajouter un enclos') {
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
                        <div className='row'>
                            <div className='form-group col-8'>
                                <label htmlFor='title'><h3>Titre</h3></label>
                                <input name='title' id='title' onChange={props.handleChangeModal} type='text' className='form-control' />
                            </div>
                        </div>
                        <div className='row'>
                            <div className='form-group col-12'>
                                <label htmlFor='content_new'><h3>Contenu</h3></label>
                                <textarea name='content' id='content_new' rows={3} onChange={props.handleChangeModal} className='form-control' />
                            </div>
                        </div>

                    </ModalBody>
                    <ModalFooter>
                        <span className='col-6 text-left'>
                            <button
                                className='enclos-modal-create-btn'
                                onClick={props.handleCreateEnclos}
                            >
                                Créer
                            </button>
                        </span>
                        <span className='col-6 text-right'>
                            <button
                                className='enclos-modal-close-btn'
                                onClick={props.handleClose}
                            >
                                Fermer
                            </button>
                        </span>
                    </ModalFooter>
                </Modal>
            </div>
        );
    } else if (props.show && props.title === 'Supprimer l\'enclos') {
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
                        <div className='row'>
                            <div className='form-group col-8'>
                                <h3>Titre</h3>
                                <p>{props.removeEnclos.title}</p>
                            </div>
                        </div>
                        <div className='row'>
                            <div className='form-group col-12'>
                                <h3>Contenu</h3>
                                <p>{props.removeEnclos.content}</p>
                            </div>
                        </div>

                    </ModalBody>
                    <ModalFooter>
                        <span className='col-6 text-left'>
                            <button
                                className='enclos-modal-create-btn'
                                onClick={props.handleRemoveEnclos}
                            >
                                Supprimer
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
    } else {
        return <></>;
    }
};

EnclosModal.propTypes = {
    show: PropTypes.bool.isRequired,
    handleClose: PropTypes.func.isRequired,
    handleChangeModal: PropTypes.func.isRequired,
    handleCreateEnclos: PropTypes.func.isRequired,
    handleRemoveEnclos: PropTypes.func.isRequired,
    title: PropTypes.string.isRequired,
    removeEnclos: PropTypes.object.isRequired
};

export default EnclosModal;
