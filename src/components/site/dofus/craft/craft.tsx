'use strict';

import React, { useState } from 'react';
import Crafts from './../../../../../assets/json/crafts.json';

const Craft = (): React.ReactElement => {
    const [showedCrafts] = useState(Crafts.map(c => c.category));

    const handleClickCategory = (craft: string) => {
        console.log('selected : ', craft);
        console.log('showed craft : ', showedCrafts);
    };

    return (
        <div className='principal-container'>
            {showedCrafts.map((craft, index) => {
                return (
                    <div
                        className='craft-category'
                        key={index}
                        onClick={() => handleClickCategory(craft)}
                    >
                        <p>{craft}</p>
                    </div>
                );
            })}
        </div>
    );
};

export default Craft;
