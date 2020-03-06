'use strict';

import React from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import PropTypes from 'prop-types';

export default class NotesModal extends React.Component {
    render() {
        if (this.props.show && this.props.title === 'Créer une note') {
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
                            <div className='row'>
                                <div className='form-group col-8'>
                                    <label htmlFor='title'><h3>Titre</h3></label>
                                    <input name='title' id='title' onChange={this.props.handleChangeModal} type='text' className='form-control' />
                                </div>
                            </div>
                            <div className='row'>
                                <div className='form-group col-12'>
                                    <label htmlFor='content_new'><h3>Contenu</h3></label>
                                    <textarea name='content' id='content_new' rows='3' onChange={this.props.handleChangeModal} type='text' className='form-control' />
                                </div>
                            </div>

                        </ModalBody>
                        <ModalFooter>
                            <span className='col-6 text-left'>
                                <button
                                    className='notes-modal-create-btn'
                                    onClick={this.props.handleCreateNote}
                                >
                                    Créer
                                </button>
                            </span>
                            <span className='col-6 text-right'>
                                <button
                                    className='notes-modal-close-btn'
                                    onClick={this.props.handleClose}
                                >
                                    Fermer
                                </button>
                            </span>
                        </ModalFooter>
                    </Modal>
                </div>
            );
        }
        else if (this.props.show && this.props.title === 'Supprimer la note') {
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
                            <div className='row'>
                                <div className='form-group col-8'>
                                    <h3>Titre</h3>
                                    <p>{this.props.removeNote.title}</p>
                                </div>
                            </div>
                            <div className='row'>
                                <div className='form-group col-12'>
                                    <h3>Contenu</h3>
                                    <p>{this.props.removeNote.content}</p>
                                </div>
                            </div>

                        </ModalBody>
                        <ModalFooter>
                            <span className='col-6 text-left'>
                                <button
                                    className='notes-modal-create-btn'
                                    onClick={this.props.handleRemoveNote}
                                >
                                    Supprimer
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
            return null;
        }
    }
}

NotesModal.propTypes = {
    show: PropTypes.bool.isRequired,
    handleClose: PropTypes.func.isRequired,
    handleChangeModal: PropTypes.func.isRequired,
    handleCreateNote: PropTypes.func.isRequired,
    handleRemoveNote: PropTypes.func.isRequired,
    title: PropTypes.string.isRequired,
    removeNote: PropTypes.object.isRequired
};
