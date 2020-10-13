'use strict';

import React, { useState } from 'react';
import _ from 'lodash';

const VoiceRecognition = (): React.ReactElement => {
    const [listening, setListening] = useState(false);
    const SpeechRecognition = window.SpeechRecognition;
    const recognition: any = new SpeechRecognition();

    const handleToggleListen = (): void => {
        if (recognition) {
            setListening(!listening);
            handleListen();
        }
        else {
            alert('Les commandes vocales ne fonctionnent pas avec ce navigateur ! Utilisez google chrome');
        }
    };

    const handleListen = (): void => {
        console.log('listening : ', listening);
        if (listening) {
            recognition.start();
            recognition.onend = (): void => {
                console.log('...continue listening...');
                recognition.start();
            };
        }
        else {
            recognition.stop();
            recognition.onend = {};
        }
        recognition.onstart = (): void => {
            console.log('Listening!');
        };
        recognition.onerror = (event: any): void => {
            console.log('Error occurred in recognition: ' + event.error);
        };
        recognition.onresult = (event: any): void => {
            getCommands(event);
        };
    };

    const getCommands = (event: any): void => {
        const finalTranscript = _.find(event.results, { isFinal: true })[0].transcript;
        console.log('transcript : ', finalTranscript);
        const finalDiv = document.getElementById('final');
        if (!finalDiv) return;
        finalDiv.innerHTML = finalTranscript;
        const commands = finalTranscript.split(' ');
        console.log('Commandes : ', commands);
        if (commands[0] === 'stop' && commands[1] === 'listening') {
            recognition.stop();
            recognition.onend = (): void => {
                console.log('Stopped listening per command');
                setListening(false);
                const finalText = finalTranscript;
                finalDiv.innerHTML = finalText;
            };
        }
    };

    return (
        <div className='microphone'>
            <button id='microphone-btn' onClick={handleToggleListen} />
            <div id='final' />
        </div>
    );
};

export default VoiceRecognition;
