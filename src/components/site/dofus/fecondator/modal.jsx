'use strict';

import React from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import PropTypes from 'prop-types';

export default class FecondatorModal extends React.Component {
    render() {
        if (this.props.show) {
            return (
                <div>
                    <Modal
                        isOpen={this.props.show}
                        toggle={this.props.handleClose}
                    >
                        <span className='notes-modal-title col-12'>
                            <ModalHeader>
                                Mettre à jour
                            </ModalHeader>
                        </span>
                        <ModalBody>
                            {this.props.dragodindes.used.length > 0 ?
                                <>
                                    <h3 className='used-modal-title'>{this.props.dragodindes.used.length > 1 ? 'Utilisées' : 'Utilisée'}</h3>
                                    <div className='automate-list'>
                                        {this.props.dragodindes.used.map((drago, index) => {
                                            return (
                                                <div
                                                    className={drago.last.status ? 'my-drago-line-last' : 'my-drago-line'}
                                                    key={index}
                                                >
                                                    <div className='my-dragodindes-name col-9'>
                                                        <img src={'/assets/img/dragodindes/' + drago.name.toLowerCase().split(' ').join('-') + '.png'} alt='dd_icon' />
                                                        {drago.last.status ?
                                                            <p>{drago.name}<span className='my-drago-fecond-message'> - Fécondée</span></p> : drago.used ?
                                                                <p>{drago.name}<span className='my-drago-used-message'> - Utilisée</span></p> :
                                                                <p>{drago.name}</p>}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </> : ''}
                            <h3 className='last-modal-title'>La dernière fécondée</h3>
                            <div className='automate-list'>
                                {this.props.dragodindes.last.map((drago, index) => {
                                    return (
                                        <div
                                            className='my-drago-line'
                                            key={index}
                                        >
                                            <div className='my-dragodindes-name col-9'>
                                                <img src={'/assets/img/dragodindes/' + drago.name.toLowerCase().split(' ').join('-') + '.png'} alt='dd_icon' />
                                                <p>{drago.name}</p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </ModalBody>
                        <ModalFooter>
                            <span className='col-6 text-left'>
                                <button
                                    className='notes-modal-create-btn'
                                    onClick={this.props.handleCallAutomateAPI}
                                >
                                    Mettre à jour
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
            return (<></>);
        }
    }
}

FecondatorModal.propTypes = {
    show: PropTypes.bool.isRequired,
    handleClose: PropTypes.func.isRequired,
    handleCallAutomateAPI: PropTypes.func.isRequired,
    dragodindes: PropTypes.object.isRequired
};
