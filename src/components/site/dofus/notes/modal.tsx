'use strict';

import React from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import PropTypes from 'prop-types';

const NotesModal = (props) => {
    if (props.show && props.title === 'Créer une note') {
        return (
            <div>
                <Modal
                    isOpen={props.show}
                    toggle={props.handleClose}
                >
                    <span className='notes-modal-title col-12'>
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
                                className='notes-modal-create-btn'
                                onClick={props.handleCreateNote}
                            >
                                Créer
                            </button>
                        </span>
                        <span className='col-6 text-right'>
                            <button
                                className='notes-modal-close-btn'
                                onClick={props.handleClose}
                            >
                                Fermer
                            </button>
                        </span>
                    </ModalFooter>
                </Modal>
            </div>
        );
    }
    else if (props.show && props.title === 'Supprimer la note') {
        return (
            <div>
                <Modal
                    isOpen={props.show}
                    toggle={props.handleClose}
                >
                    <span className='notes-modal-title col-12'>
                        <ModalHeader>
                            {props.title}
                        </ModalHeader>
                    </span>
                    <ModalBody>
                        <div className='row'>
                            <div className='form-group col-8'>
                                <h3>Titre</h3>
                                <p>{props.removeNote.title}</p>
                            </div>
                        </div>
                        <div className='row'>
                            <div className='form-group col-12'>
                                <h3>Contenu</h3>
                                <p>{props.removeNote.content}</p>
                            </div>
                        </div>

                    </ModalBody>
                    <ModalFooter>
                        <span className='col-6 text-left'>
                            <button
                                className='notes-modal-create-btn'
                                onClick={props.handleRemoveNote}
                            >
                                Supprimer
                            </button>
                        </span>
                        <span className='col-6 text-right'>
                            <button
                                className='notes-modal-close-btn'
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
    else {
        return null;
    }
};

NotesModal.propTypes = {
    show: PropTypes.bool.isRequired,
    handleClose: PropTypes.func.isRequired,
    handleChangeModal: PropTypes.func.isRequired,
    handleCreateNote: PropTypes.func.isRequired,
    handleRemoveNote: PropTypes.func.isRequired,
    title: PropTypes.string.isRequired,
    removeNote: PropTypes.object.isRequired
};

export default NotesModal;
