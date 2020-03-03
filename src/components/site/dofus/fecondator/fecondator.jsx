'use strict';

import React from 'react';
import Axios from 'axios';
import _ from 'lodash';
// import { Tooltip } from '@material-ui/core';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import PropTypes from 'prop-types';

export default class Fecondator extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            user: this.props.user,
            dragodindes: [],
            showedDragodindes: [],
            selectedDrago: [],
            last: false,
            wait: true,
            input: false
        };
        this.handleChange = this.handleChange.bind(this);
    }

    componentDidMount() {
        Axios.post('/api/dofus/dragodindes', {
            userId: this.state.user.id
        })
            .then(res => {
                if (res.data && res.data.length) {
                    const ddFecond = res.data.filter(d => d.last.status);
                    this.setState({
                        dragodindes: _.sortBy(res.data.filter(d => !d.last.status), 'duration', 'desc'),
                        showedDragodindes: _.sortBy(res.data.filter(d => !d.last.status), 'duration', 'desc'),
                        last: ddFecond && ddFecond[0] ? ddFecond[0] : false,
                        wait: false
                    });
                }
                else {
                    this.setState({
                        wait: false
                    });
                }
            });
    }

    handleChange(e) {
        const filtered = this.state.dragodindes.filter(d => d.name.toLowerCase().indexOf(e.target.value.toLowerCase()) !== -1);
        this.setState({
            showedDragodindes: _.sortBy(filtered, 'duration', 'desc')
        });
    }

    render() {
        return (
            <div className='principal-container'>
                <h2 className='craft-title text-center'>Fécondator</h2>
                <div className='notes-btn col-sm-12 text-center'>
                    <a href='/dofus/dragodindes'>
                        <button>Mes dragodindes</button>
                    </a>
                    <a href='/dofus'>
                        <button>Retour au menu</button>
                    </a>
                </div>
                <div className='text-center fecondator-last-dragodinde col-sm-11 col-md-10 col-lg-8 col-xl-6'>
                    <p>{this.state.last.name}</p>
                </div>
                {this.state.dragodindes.length ?
                    <div className='text-center principal-dragodindes-div col-sm-11 col-md-10 col-lg-8 col-xl-6'>
                        <input
                            className='input-parcho'
                            placeholder='Rechercher'
                            onChange={this.handleChange}
                        />
                        <div className='my-dragodindes-container'>
                            {this.state.showedDragodindes.length ?
                                this.state.showedDragodindes.map((drago, index) => {
                                    return (
                                        <div
                                            className='my-drago-line'
                                            key={index}
                                        >
                                            <div className='my-dragodindes-name col-12'>
                                                <p>{drago.name}</p>
                                            </div>
                                        </div>
                                    );
                                }) :
                                <div className='empty-drago-line'>
                                    <div className='my-dragodindes-name'>
                                        <p>Aucun résultat</p>
                                    </div>
                                </div>}
                        </div>
                    </div> :
                    this.state.wait ?
                        <div className='text-center loading-notes-message'>
                            <h1>Chargement des dragodindes <span className='custom-spinner-notes' /></h1>
                        </div> :
                        <div className='text-center no-notes-message'>
                            <h1>Pas de dragodindes actuellement</h1>
                        </div>}
            </div>
        );
    }
}

Fecondator.propTypes = {
    user: PropTypes.oneOfType([
        PropTypes.object.isRequired,
        PropTypes.bool.isRequired
    ])
};
