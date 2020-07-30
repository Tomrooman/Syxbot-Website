'use strict';

import React, { useState } from 'react';
import _ from 'lodash';

const VoiceRecognition = () => {
    const [listening, setListening] = useState(false);
    const SpeechRecognition = window.SpeechRecognition;
    const recognition: any = new SpeechRecognition();

    const handleToggleListen = () => {
        if (recognition) {
            setListening(!listening);
            handleListen();
        }
        else {
            alert('Les commandes vocales ne fonctionnent pas avec ce navigateur ! Utilisez google chrome');
        }
    };

    const handleListen = () => {
        console.log('listening : ', listening);
        if (listening) {
            recognition.start();
            recognition.onend = () => {
                console.log('...continue listening...');
                recognition.start();
            };
        }
        else {
            recognition.stop();
            recognition.onend = {};
        }
        recognition.onstart = () => {
            console.log('Listening!');
        };
        recognition.onerror = (event: any) => {
            console.log('Error occurred in recognition: ' + event.error);
        };
        recognition.onresult = (event: any) => {
            getCommands(event);
        };
    };

    const getCommands = (event: any) => {
        const finalTranscript = _.find(event.results, { isFinal: true })[0].transcript;
        console.log('transcript : ', finalTranscript);
        document.getElementById('final')!.innerHTML = finalTranscript;
        const commands = finalTranscript.split(' ');
        console.log('Commandes : ', commands);
        if (commands[0] === 'stop' && commands[1] === 'listening') {
            recognition.stop();
            recognition.onend = () => {
                console.log('Stopped listening per command');
                setListening(false);
                const finalText = commands.join(' ');
                document.getElementById('final')!.innerHTML = finalText;
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
