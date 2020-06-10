'use strict';

import React from 'react';
import Axios from 'axios';
import _ from 'lodash';
import $ from 'jquery';
import NotesModal from './modal.jsx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import PropTypes from 'prop-types';

export default class Notes extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showInput: false,
            showContent: false,
            removeNote: {},
            wait: true,
            input: false,
            notes: [],
            show: false,
            title: '',
            note_title: '',
            content: '',
            user: this.props.user
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleChangeModal = this.handleChangeModal.bind(this);
        this.handleCreateNote = this.handleCreateNote.bind(this);
        this.handleRemoveNote = this.handleRemoveNote.bind(this);
        this.handleClose = this.handleClose.bind(this);
    }

    componentDidMount() {
        Axios.post('/api/dofus/notes', { userId: this.state.user.id })
            .then(res => {
                this.setState({
                    notes: _.orderBy(res.data, 'title', 'asc'),
                    wait: false
                });
            });
    }

    handleClose() {
        this.setState({
            show: false,
            title: ''
        });
    }

    handleClick(title, content) {
        if (this.state.input !== content) {
            this.updateNoteAPI('/api/dofus/notes/update', {
                userId: this.state.user.id,
                title: title,
                oldContent: content,
                newContent: this.state.input
            });
        }
    }

    updateNoteAPI(url, paramsObj) {
        Axios.post(url, paramsObj)
            .then(res => {
                this.setState({
                    notes: _.orderBy(res.data, 'title', 'asc'),
                    showInput: false,
                    showcontent: false
                });
            });
    }

    handleChange(e) {
        this.setState({
            input: e.target.value
        });
    }

    handleChangeModal(e) {
        const modal = e.target.tagName === 'INPUT' ? 'note_title' : 'content';
        this.setState({
            [modal]: e.target.value
        });
    }

    handleCreateNote() {
        if (this.state.note_title && this.state.content) {
            this.updateNoteAPI('/api/dofus/notes/create', {
                userId: this.state.user.id,
                title: this.state.note_title,
                content: this.state.content
            });
            this.handleClose();
        }
    }

    handleRemoveNote() {
        this.updateNoteAPI('/api/dofus/notes/remove', {
            userId: this.state.user.id,
            title: this.state.removeNote.title,
            content: this.state.removeNote.content
        });
        this.handleClose();
    }

    handleModifyInfos(e, title, content) {
        if (e.target.tagName === 'svg' || e.target.tagName === 'SPAN' || e.target.tagName === 'path') {
            this.showModal('remove', { title: title, content: content });
        }
        else if (e.target.type !== 'textarea') {
            this.setState({
                input: content,
                showInput: this.state.showInput === title ? false : title,
                showContent: this.state.showContent === content ? false : content
            }, () => {
                if ($('textarea')[0]) {
                    $('textarea')[0].value = this.state.input;
                }
            });
        }
    }

    showModal(choice, noteObj = {}) {
        this.setState({
            show: true,
            note_title: '',
            content: '',
            removeNote: noteObj,
            title: choice === 'new' ? 'Créer une note' : 'Supprimer la note'
        });
    }

    render() {
        return (
            <div className='principal-container'>
                <NotesModal
                    handleClose={this.handleClose}
                    handleChangeModal={this.handleChangeModal}
                    handleCreateNote={this.handleCreateNote}
                    handleRemoveNote={this.handleRemoveNote}
                    show={this.state.show}
                    title={this.state.title}
                    removeNote={this.state.removeNote}
                />
                <h2 className='infos-title text-center'>
                    Mes notes
                </h2>
                <div className='notes-btn col-sm-12 text-center'>
                    <button onClick={() => this.showModal('new')}>Ajouter une note</button>
                </div>
                <div className='container col-10 notes-container row'>
                    {this.state.notes && this.state.notes.length ?
                        this.state.notes.map((note, index) => {
                            return (
                                <div
                                    className='one_infos text-center col-sm-12 col-md-5 col-lg-5'
                                    onClick={(e) => this.handleModifyInfos(e, note.title, note.content)}
                                    key={index}
                                >
                                    <h4>
                                        {note.title}
                                        <span className='infos-remove-svg'>
                                            <FontAwesomeIcon icon='times-circle' />
                                        </span>
                                    </h4>
                                    {this.state.showInput === note.title && this.state.showContent === note.content ?
                                        <>
                                            <textarea
                                                className='infos-input'
                                                type='text'
                                                rows='3'
                                                autoFocus
                                                onChange={this.handleChange}
                                            />
                                            <button
                                                onClick={() => this.handleClick(note.title, note.content)}
                                            >
                                                Valider
                                            </button>
                                        </> :
                                        <p>{note.content}</p>}
                                </div>
                            );
                        }) :
                        this.state.wait ?
                            <div className='text-center loading-notes-message'>
                                <h1>Chargement des notes <span className='custom-spinner-notes' /></h1>
                            </div> :
                            <div className='text-center no-notes-message'>
                                <h1>Pas de notes actuellement</h1>
                            </div>}
                </div>
            </div>
        );
    }
}

Notes.propTypes = {
    user: PropTypes.oneOfType([
        PropTypes.object.isRequired,
        PropTypes.bool.isRequired
    ])
};
