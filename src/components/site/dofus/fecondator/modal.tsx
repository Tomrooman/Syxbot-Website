'use strict';

import React from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import PropTypes from 'prop-types';
import { usedAndLastArrayDragoType } from '../../../../@types/dragodindes';

interface propsType {
    dragodindes: usedAndLastArrayDragoType;
    handleCallAutomaticAPI(): void;
    handleClose(): void;
    show: boolean;
}

const FecondatorModal = (props: propsType): React.ReactElement => {
    if (props.show) {
        /* eslint-disable max-len */
        return (
            <div>
                <Modal
                    isOpen={props.show}
                    toggle={props.handleClose}
                >
                    <span className='enclos-modal-title col-12'>
                        <ModalHeader>
                            Mettre à jour
                        </ModalHeader>
                    </span>
                    <ModalBody>
                        {props.dragodindes.used.length > 0 ?
                            <>
                                <h3 className='used-modal-title'>{props.dragodindes.used.length > 1 ? 'Utilisées' : 'Utilisée'}</h3>
                                <div className='automatic-list'>
                                    {props.dragodindes.used.map((drago, index) => {
                                        return (
                                            <div
                                                className={drago.last?.status ? 'my-drago-line-last' : 'my-drago-line'}
                                                key={index}
                                            >
                                                <div className='my-dragodindes-name col-9'>
                                                    <img src={'/assets/img/dofus/dragodindes/' + drago.name.toLowerCase().split(' ').join('-') + '.png'} alt='dd_icon' />
                                                    {drago.last?.status ?
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
                        <div className='automatic-list'>
                            {props.dragodindes.last.map((drago, index) => {
                                return (
                                    <div
                                        className='my-drago-line'
                                        key={index}
                                    >
                                        <div className='my-dragodindes-name col-9'>
                                            <img src={'/assets/img/dofus/dragodindes/' + drago.name.toLowerCase().split(' ').join('-') + '.png'} alt='dd_icon' />
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
                                className='enclos-modal-create-btn'
                                onClick={props.handleCallAutomaticAPI}
                            >
                                Mettre à jour
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
    else return <></>;
};

FecondatorModal.propTypes = {
    show: PropTypes.bool.isRequired,
    handleClose: PropTypes.func.isRequired,
    handleCallAutomaticAPI: PropTypes.func.isRequired,
    dragodindes: PropTypes.object.isRequired
};

export default FecondatorModal;
