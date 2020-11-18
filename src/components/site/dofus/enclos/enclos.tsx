'use strict';

import React, { useState, useEffect, ChangeEvent } from 'react';
import Axios from 'axios';
import _ from 'lodash';
import $ from 'jquery';
import EnclosModal from './modal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { enclosType, callEnclosAPIType } from '../../../../@types/enclos';
import Config from '../../../../../config.json';

const Enclos = (): React.ReactElement => {
    const [showInput, setShowInput] = useState('');
    const [removeEnclos, setRemoveEnclos] = useState({} as enclosType);
    const [wait, setWait] = useState(true);
    const [input, setInput] = useState('');
    const [enclos, setEnclos] = useState([] as enclosType[]);
    const [show, setShow] = useState(false);
    const [title, setTitle] = useState('');
    const [enclosTitle, setEnclosTitle] = useState('');
    const [content, setContent] = useState('');
    const [loaded, setLoaded] = useState(false);

    useEffect((): void => {
        if (wait && !loaded) {
            const getEnclosAPI = async (): Promise<void> => {
                try {
                    const security = {
                        token: Config.security.token,
                        type: 'site'
                    };
                    const { data } = await Axios.post('/api/dofus/enclos', security);
                    if (data) setEnclos(_.orderBy(data, 'title', 'asc'));
                    setWait(false);
                }
                catch (e) {
                    console.log('Error /api/dofus/enclos : ', e.message);
                }
            };
            getEnclosAPI();
            setLoaded(true);
        }
    });

    const handleClose = (): void => {
        setShow(false);
        setTitle('');
    };

    const handleClick = (id: string, title: string, newContent: string): void => {
        if (input !== newContent) {
            updateEnclosAPI('/api/dofus/enclos/modify', {
                enclosID: id,
                title: title,
                content: newContent
            });
        }
    };

    const updateEnclosAPI = async (url: string, paramsObj: callEnclosAPIType): Promise<void> => {
        try {
            const res = await Axios.post(url, { ...paramsObj, token: Config.security.token, type: 'site' });
            if (res.data) setEnclos(_.orderBy(res.data, 'title', 'asc'));
            setShowInput('');
        }
        catch (e) {
            console.log(`Error ${url} : `, e.message);
        }
    };

    const handleChange = (e: ChangeEvent<HTMLTextAreaElement>): void => {
        setInput(e.target.value);
    };

    const handleChangeModal = (e: ChangeEvent<HTMLInputElement>): void => {
        if (e.target.tagName === 'INPUT') return setEnclosTitle(e.target.value);
        setContent(e.target.value);
    };

    const handleCreateEnclos = (): void => {
        if (enclosTitle && content) {
            updateEnclosAPI('/api/dofus/enclos/modify', {
                title: enclosTitle,
                content: content
            });
            handleClose();
        }
    };

    const handleRemoveEnclos = (): void => {
        updateEnclosAPI('/api/dofus/enclos/modify', {
            action: 'remove',
            enclosID: removeEnclos._id
        });
        handleClose();
    };

    const handleModifyInfos = (e: any, id: string, newTitle: string, newContent: string): void => {
        if (e.target.tagName === 'svg' || e.target.tagName === 'SPAN' || e.target.tagName === 'path')
            showModal('remove', { _id: id, title: newTitle, content: newContent });
        else if (e.target.type !== 'textarea') {
            setInput(newContent);
            setShowInput(showInput === newTitle ? '' : newTitle);
            if ($('textarea')[0]) $('textarea')[0].setAttribute('value', String(input));
        }
    };

    const showModal = (choice: string, enclosObj = {} as enclosType): void => {
        setShow(true);
        setEnclosTitle('');
        setContent('');
        setRemoveEnclos(enclosObj);
        setTitle(choice === 'new' ? 'Rajouter un enclos' : 'Supprimer l\'enclos');
    };

    return (
        <div className='principal-container'>
            <EnclosModal
                handleClose={handleClose}
                handleChangeModal={handleChangeModal}
                handleCreateEnclos={handleCreateEnclos}
                handleRemoveEnclos={handleRemoveEnclos}
                show={show}
                title={title}
                removeEnclos={removeEnclos}
            />
            <div className='top-btn col-sm-12 text-center'>
                <button onClick={(): void => showModal('new')}>Ajouter un enclos</button>
            </div>
            <div className='container col-10 enclos-container row'>
                {enclos && enclos.length ?
                    enclos.map((enclo, index) => {
                        return (
                            <div
                                className='one_infos text-center col-sm-12 col-md-5 col-lg-5'
                                onClick={(e: any): void => handleModifyInfos(e, enclo._id, enclo.title, enclo.content)}
                                key={index}
                            >
                                <h4>
                                    {enclo.title}
                                    <span className='infos-remove-svg'>
                                        <FontAwesomeIcon icon='times-circle' />
                                    </span>
                                </h4>
                                {showInput === enclo._id.toString() ?
                                    <>
                                        <textarea
                                            className='infos-input'
                                            rows={3}
                                            autoFocus
                                            onChange={handleChange}
                                        />
                                        <button
                                            onClick={(): void => handleClick(enclo._id, enclo.title, input)}
                                        >
                                            Valider
                                        </button>
                                    </> :
                                    <p>{enclo.content}</p>}
                            </div>
                        );
                    }) :
                    wait ?
                        <div className='text-center loading-enclos-message'>
                            <h1>Chargement des enclos <span className='custom-spinner-enclos' /></h1>
                        </div> :
                        !wait && loaded ?
                            <div className='text-center no-enclos-message'>
                                <h1>Pas d'enclos actuellement</h1>
                            </div> : <></>}
            </div>
        </div>
    );
};

export default Enclos;
