'use strict';

import React, { useState, useEffect } from 'react';
import Site from './../site/site.jsx';
import Docs from './../docs/docs.jsx';
import Radio from './../radio/radio.jsx';
import './scrollbar.css';

const Router = () => {
    const [page, setPage] = useState('');
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        if (!loaded) {
            const url = window.location.href.split('/');
            const wLocation = url[3] === '' || url[3] === '//' ? '/' : url[3];
            const pageArg = url[4] ? url[4] : '';
            if (wLocation && wLocation.substr(0, 4) === 'docs') {
                setPage(<Docs command={pageArg} />);
            }
            else {
                setPage(<Site page={wLocation} urlArg={pageArg} />);
            }
            setLoaded(true);
        }
    });

    return (
        <span>
            <Radio />
            {page}
        </span>
    );
};

export default Router;
