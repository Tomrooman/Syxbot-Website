'use strict';

import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import _ from 'lodash';
import $ from 'jquery';
import NotesModal from './modal.jsx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import PropTypes from 'prop-types';

const Notes = (props) => {
    const [showInput, setShowInput] = useState(false);
    const [showContent, setShowContent] = useState(false);
    const [removeNote, setRemoveNote] = useState({});
    const [wait, setWait] = useState(true);
    const [input, setInput] = useState(false);
    const [notes, setNotes] = useState([]);
    const [show, setShow] = useState(false);
    const [title, setTitle] = useState('');
    const [noteTitle, setNoteTitle] = useState('');
    const [content, setContent] = useState('');
    const [user] = useState(props.user);

    useEffect(() => {
        if (wait) {
            Axios.post('/api/dofus/notes', { userId: user.id })
                .then(res => {
                    setNotes(_.orderBy(res.data, 'title', 'asc'));
                    setWait(false);
                });
        }
    });

    const handleClose = () => {
        setShow(false);
        setTitle('');
    };

    const handleClick = (newTitle, oldContent) => {
        if (input !== content) {
            updateNoteAPI('/api/dofus/notes/update', {
                userId: user.id,
                title: newTitle,
                oldContent: oldContent,
                newContent: input
            });
        }
    };

    const updateNoteAPI = (url, paramsObj) => {
        Axios.post(url, paramsObj)
            .then(res => {
                setNotes(_.orderBy(res.data, 'title', 'asc'));
                setShowInput(false);
                setShowContent(false);
            });
    };

    const handleChange = (e) => {
        setInput(e.target.value);
    };

    const handleChangeModal = (e) => {
        if (e.target.tagName === 'INPUT') {
            setNoteTitle(e.target.value);
        }
        else {
            setContent(e.target.value);
        }
    };

    const handleCreateNote = () => {
        if (noteTitle && content) {
            updateNoteAPI('/api/dofus/notes/create', {
                userId: user.id,
                title: noteTitle,
                content: content
            });
            handleClose();
        }
    };

    const handleRemoveNote = () => {
        updateNoteAPI('/api/dofus/notes/remove', {
            userId: user.id,
            title: removeNote.title,
            content: removeNote.content
        });
        handleClose();
    };

    const handleModifyInfos = (e, newTitle, newContent) => {
        if (e.target.tagName === 'svg' || e.target.tagName === 'SPAN' || e.target.tagName === 'path') {
            showModal('remove', { title: newTitle, content: newContent });
        }
        else if (e.target.type !== 'textarea') {
            setInput(newContent);
            setShowInput(showInput === newTitle ? false : newTitle);
            setShowContent(showContent === newContent ? false : newContent);
            if ($('textarea')[0]) {
                $('textarea')[0].value = input;
            }
        }
    };

    const showModal = (choice, noteObj = {}) => {
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
                                onClick={(e) => handleModifyInfos(e, note.title, note.content)}
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
                                            type='text'
                                            rows='3'
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
                        <div className='text-center no-notes-message'>
                            <h1>Pas de notes actuellement</h1>
                        </div>}
            </div>
        </div>
    );
};

Notes.propTypes = {
    user: PropTypes.oneOfType([
        PropTypes.object.isRequired,
        PropTypes.bool.isRequired
    ])
};

export default Notes;
