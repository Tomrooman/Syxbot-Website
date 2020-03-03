'use strict';

import React from 'react';
import PropTypes from 'prop-types';

export default class Controls extends React.Component {
    render() {
        return (
            this.props.user ?
                <h1>Control page</h1> :
                <h2>Connectez-vous pour utiliser la reconnaissance vocale</h2>
        );
    }
}

Controls.propTypes = {
    user: PropTypes.oneOfType([
        PropTypes.object.isRequired,
        PropTypes.bool.isRequired
    ])
};
