'use strict';

import React, { useState, useEffect } from 'react';
import $ from 'jquery';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import TextField from '@material-ui/core/TextField';
import axios from 'axios';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faTimesCircle } from '@fortawesome/free-solid-svg-icons';

library.add(faTimesCircle);

const Contact = () => {
    const [mail, setMail] = useState('');
    const [object, setObject] = useState('');
    const [message, setMessage] = useState('');
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        if (!loaded) {
            $('.alert')[0].style.display = 'none';
            setLoaded(true);
        }
    });

    const sendMessage = () => {
        if (mail.length >= 1 && object.length >= 1 && message.length >= 1) {
            $('.alert')[0].style.display = 'none';
            $('.contact-submit-div')[0].children[0].innerHTML = 'Envoi du message en cours ...';
            $('.contact-submit-div button')[0].style.opacity = '';
            $('.contact-submit-div button')[0].style.cursor = '';
            $('.alert')[0].className = 'contact alert';
            axios.post('/api/docs/contact', {
                mail: mail,
                object: object,
                message: message
            })
                .then(res => {
                    $('.contact-submit-div')[0].children[0].innerHTML = 'Envoyer mon message';
                    if (res.data) {
                        setMail('');
                        setObject('');
                        setMessage('');
                        $('input')[0].textContent = '';
                        $('input')[1].textContent = '';
                        $('textarea')[0].textContent = '';
                        $('.alert').addClass('alert-success');
                        $('.alert').html('<span>' + $('.alert')[0].children[0].innerHTML + '</span><span style="display: none">' + $('.alert')[0].children[1].innerHTML + '</span> Message envoyé !');
                        $('.alert')[0].style.display = '';
                    }
                    else {
                        handleError();
                    }
                })
                .catch(() => {
                    $('.contact-submit-div')[0].children[0].innerHTML = 'Envoyer mon message';
                    handleError();
                });
        }
    };

    const handleError = () => {
        $('.contact-submit-div button')[0].style.opacity = '1';
        $('.contact-submit-div button')[0].style.cursor = 'pointer';
        $('.alert').addClass('alert-danger');
        $('.alert').html('<span style="display: none">' + $('.alert')[0].children[0].innerHTML + '</span><span>' + $('.alert')[0].children[1].innerHTML + '</span> Une erreur est survenue, veuillez réessayer ou me contacter à cette adresse : syxbot@hotmail.com');
        $('.alert')[0].style.display = '';
    };

    const handleOnChange = (type, e) => {
        if (type === 'mail') {
            setMail(e.target.value);
        }
        else if (type === 'object') {
            setObject(e.target.value);
        }
        else if (type === 'message') {
            setMessage(e.target.value);
        }

        if (mail.length >= 1 && object.length >= 1 && message.length >= 1) {
            if ($('.contact-submit-div button')[0].style.opacity === '') {
                $('.contact-submit-div button')[0].style.opacity = '1';
                $('.contact-submit-div button')[0].style.cursor = 'pointer';
            }
        }
        else if ($('.contact-submit-div button')[0].style.opacity === '1') {
            $('.contact-submit-div button')[0].style.opacity = '';
            $('.contact-submit-div button')[0].style.cursor = '';
        }
    };

    return (
        <div className='syx_container'>
            <h1><FontAwesomeIcon icon='pen-fancy' /> Me contacter</h1>
            <div className='docs_content'>
                <div className='contact alert'>
                    <span className='success-icon'><FontAwesomeIcon icon='check' /></span>
                    <span className='error-icon'><FontAwesomeIcon icon='times-circle' /></span>
                </div>
                <div className='docs-contact'>
                    <h3>Formulaire</h3>
                    <div className='contact-mail'>
                        <TextField
                            required
                            id='required-mail'
                            label='Votre adresse mail'
                            placeholder='Exemple@hotmail.com'
                            variant='outlined'
                            onChange={(e) => handleOnChange('mail', e)}
                        />
                    </div>
                    <div className='contact-object'>
                        <TextField
                            required
                            id='required-object'
                            label='Objet'
                            variant='outlined'
                            onChange={(e) => handleOnChange('object', e)}
                        />
                    </div>
                    <div className='contact-message'>
                        <label htmlFor='message'>Écrivez votre message ci-dessous *</label><br />
                        <textarea
                            rows={4}
                            cols={30}
                            id='message'
                            onChange={(e) => handleOnChange('message', e)}
                        />
                    </div>
                    <div className='contact-submit-div'>
                        <button onClick={() => sendMessage()}>Envoyer mon message</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Contact;
