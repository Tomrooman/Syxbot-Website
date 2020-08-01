'use strict';

import React, { useState, useEffect, ChangeEvent } from 'react';
import Axios from 'axios';
import _ from 'lodash';
import $ from 'jquery';
import NotesModal from './modal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { noteType, createNoteType, modifyNoteType } from '../../../../@types/notes';
import Config from '../../../../../config.json';

const Notes = (): React.ReactElement => {
    const [showInput, setShowInput] = useState('');
    const [showContent, setShowContent] = useState('');
    const [removeNote, setRemoveNote] = useState({} as noteType);
    const [wait, setWait] = useState(true);
    const [input, setInput] = useState('');
    const [notes, setNotes] = useState([] as noteType[]);
    const [show, setShow] = useState(false);
    const [title, setTitle] = useState('');
    const [noteTitle, setNoteTitle] = useState('');
    const [content, setContent] = useState('');
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        if (wait && !loaded) {
            const getNotesAPI = async () => {
                const { data } = await Axios.post('/api/dofus/notes', { token: Config.security.token });
                if (data) {
                    setNotes(_.orderBy(data, 'title', 'asc'));
                }
                setWait(false);
            };
            getNotesAPI();
            setLoaded(true);
        }
    });

    const handleClose = () => {
        setShow(false);
        setTitle('');
    };

    const handleClick = (newTitle: string, oldContent: string) => {
        if (input !== content) {
            updateNoteAPI('/api/dofus/notes/update', {
                title: newTitle,
                oldContent: oldContent,
                newContent: input
            });
        }
    };

    const updateNoteAPI = async (url: string, paramsObj: createNoteType | modifyNoteType) => {
        const res = await Axios.post(url, { ...paramsObj, token: Config.security.token });
        if (res.data) {
            setNotes(_.orderBy(res.data, 'title', 'asc'));
        }
        setShowInput('');
        setShowContent('');
    };

    const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
        setInput(e.target.value);
    };

    const handleChangeModal = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.tagName === 'INPUT') {
            setNoteTitle(e.target.value);
        } else {
            setContent(e.target.value);
        }
    };

    const handleCreateNote = () => {
        if (noteTitle && content) {
            updateNoteAPI('/api/dofus/notes/create', {
                title: noteTitle,
                content: content
            });
            handleClose();
        }
    };

    const handleRemoveNote = () => {
        updateNoteAPI('/api/dofus/notes/remove', {
            title: removeNote.title,
            content: removeNote.content
        });
        handleClose();
    };

    const handleModifyInfos = (e: any, newTitle: string, newContent: string) => {
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

    const showModal = (choice: string, noteObj = {} as noteType) => {
        setShow(true);
        setNoteTitle('');
        setContent('');
        setRemoveNote(noteObj);
        setTitle(choice === 'new' ? 'Créer une note' : 'Supprimer la note');
    };

    return (
        <div className='principal-container'>
            <NotesModal
                handleClose={handleClose}
                handleChangeModal={handleChangeModal}
                handleCreateNote={handleCreateNote}
                handleRemoveNote={handleRemoveNote}
                show={show}
                title={title}
                removeNote={removeNote}
            />
            <h2 className='infos-title text-center'>
                Mes notes
            </h2>
            <div className='notes-btn col-sm-12 text-center'>
                <button onClick={() => showModal('new')}>Ajouter une note</button>
            </div>
            <div className='container col-10 notes-container row'>
                {notes && notes.length ?
                    notes.map((note, index) => {
                        return (
                            <div
                                className='one_infos text-center col-sm-12 col-md-5 col-lg-5'
                                onClick={(e: any) => handleModifyInfos(e, note.title, note.content)}
                                key={index}
                            >
                                <h4>
                                    {note.title}
                                    <span className='infos-remove-svg'>
                                        <FontAwesomeIcon icon='times-circle' />
                                    </span>
                                </h4>
                                {showInput === note.title && showContent === note.content ?
                                    <>
                                        <textarea
                                            className='infos-input'
                                            rows={3}
                                            autoFocus
                                            onChange={handleChange}
                                        />
                                        <button
                                            onClick={() => handleClick(note.title, note.content)}
                                        >
                                            Valider
                                        </button>
                                    </> :
                                    <p>{note.content}</p>}
                            </div>
                        );
                    }) :
                    wait ?
                        <div className='text-center loading-notes-message'>
                            <h1>Chargement des notes <span className='custom-spinner-notes' /></h1>
                        </div> :
                        !wait && loaded ?
                            <div className='text-center no-notes-message'>
                                <h1>Pas de notes actuellement</h1>
                            </div> : <></>}
            </div>
        </div>
    );
};

export default Notes;
