'use strict';

import React, { useState, useEffect, ChangeEvent } from 'react';
import Axios from 'axios';
import _ from 'lodash';
import $ from 'jquery';
import EnclosModal from './modal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { enclosType, createEnclosType, modifyEnclosType } from '../../../../@types/enclos';
import Config from '../../../../../config.json';

const Enclos = (): React.ReactElement => {
    const [showInput, setShowInput] = useState('');
    const [showContent, setShowContent] = useState('');
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
                    const { data } = await Axios.post('/api/dofus/enclos', { token: Config.security.token, type: 'site' });
                    if (data) {
                        setEnclos(_.orderBy(data, 'title', 'asc'));
                    }
                    setWait(false);
                } catch (e) {
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

    const handleClick = (newTitle: string, oldContent: string): void => {
        if (input !== content) {
            updateEnclosAPI('/api/dofus/enclos/update', {
                title: newTitle,
                oldContent: oldContent,
                newContent: input
            });
        }
    };

    const updateEnclosAPI = async (url: string, paramsObj: createEnclosType | modifyEnclosType): Promise<void> => {
        try {
            const res = await Axios.post(url, { ...paramsObj, token: Config.security.token, type: 'site' });
            if (res.data) {
                setEnclos(_.orderBy(res.data, 'title', 'asc'));
            }
            setShowInput('');
            setShowContent('');
        } catch (e) {
            console.log(`Error ${url} : `, e.message);
        }
    };

    const handleChange = (e: ChangeEvent<HTMLTextAreaElement>): void => {
        setInput(e.target.value);
    };

    const handleChangeModal = (e: ChangeEvent<HTMLInputElement>): void => {
        if (e.target.tagName === 'INPUT') {
            return setEnclosTitle(e.target.value);
        }
        setContent(e.target.value);
    };

    const handleCreateEnclos = (): void => {
        if (enclosTitle && content) {
            updateEnclosAPI('/api/dofus/enclos/create', {
                title: enclosTitle,
                content: content
            });
            handleClose();
        }
    };

    const handleRemoveEnclos = (): void => {
        updateEnclosAPI('/api/dofus/enclos/remove', {
            title: removeEnclos.title,
            content: removeEnclos.content
        });
        handleClose();
    };

    const handleModifyInfos = (e: any, newTitle: string, newContent: string): void => {
        if (e.target.tagName === 'svg' || e.target.tagName === 'SPAN' || e.target.tagName === 'path') {
            showModal('remove', { title: newTitle, content: newContent });
        } else if (e.target.type !== 'textarea') {
            setInput(newContent);
            setShowInput(showInput === newTitle ? '' : newTitle);
            setShowContent(showContent === newContent ? '' : newContent);
            if ($('textarea')[0]) {
                $('textarea')[0].setAttribute('value', String(input));
            }
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
                <button onClick={() => showModal('new')}>Ajouter un enclos</button>
            </div>
            <div className='container col-10 enclos-container row'>
                {enclos && enclos.length ?
                    enclos.map((enclo, index) => {
                        return (
                            <div
                                className='one_infos text-center col-sm-12 col-md-5 col-lg-5'
                                onClick={(e: any) => handleModifyInfos(e, enclo.title, enclo.content)}
                                key={index}
                            >
                                <h4>
                                    {enclo.title}
                                    <span className='infos-remove-svg'>
                                        <FontAwesomeIcon icon='times-circle' />
                                    </span>
                                </h4>
                                {showInput === enclo.title && showContent === enclo.content ?
                                    <>
                                        <textarea
                                            className='infos-input'
                                            rows={3}
                                            autoFocus
                                            onChange={handleChange}
                                        />
                                        <button
                                            onClick={() => handleClick(enclo.title, enclo.content)}
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
