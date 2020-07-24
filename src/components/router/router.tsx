'use strict';

import React, { useState, useEffect } from 'react';
import Site from '../site/site';
import Radio from '../radio/radio';
import './scrollbar.css';

const Router = () => {
    const [page, setPage] = useState('');
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        if (!loaded) {
            const url = window.location.href.split('/');
            const wLocation = url[3] === '' || url[3] === '//' ? '/' : url[3];
            const pageArg = url[4] ? url[4] : '';
            setPage(<Site page={wLocation} urlArg={pageArg} />);
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
