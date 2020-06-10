'use strict';

import React from 'react';
import Site from './../site/site.jsx';
import Docs from './../docs/docs.jsx';
import Radio from './../radio/radio.jsx';
import './scrollbar.css';

export default class Router extends React.Component {
    constructor() {
        super();
        this.state = {
            page: ''
        };
    }

    componentDidMount() {
        const url = window.location.href.split('/');
        const page = url[3] === '' || url[3] === '//' ? '/' : url[3];
        const pageArg = url[4] ? url[4] : '';
        if (page && page.substr(0, 4) === 'docs') {
            this.setState({
                page: <Docs command={pageArg} />
            });
        }
        else {
            this.setState({
                page: <Site page={page} urlArg={pageArg} />
            });
        }
    }

    render() {
        return (
            <span>
                <Radio />
                {this.state.page}
            </span>
        );
    }
}
