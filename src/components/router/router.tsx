'use strict';

import React, { useState, useEffect } from 'react';
import Site from '../site/site';
import Radio from '../radio/radio';
import './scrollbar.css';

const Router = (): React.ReactElement => {
    const [page, setPage] = useState(<></>);
    const [loaded, setLoaded] = useState(false);

    useEffect((): void => {
        if (!loaded) {
            const url = window.location.href.split('/');
            let wLocation = url[3] === '' || url[3] === '//' ? '/' : url[3];
            wLocation = wLocation.indexOf('#') !== -1 ? wLocation.substr(0, wLocation.indexOf('#')) : wLocation;
            const pageArg = url[3].split('#').length >= 2 ? url[3].split('#')[1] : '';
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
