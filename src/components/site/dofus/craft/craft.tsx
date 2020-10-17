'use strict';

import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Crafts from './../../../../../assets/json/crafts.json';
// import { userType } from '../../../../@types/user';
import _ from 'lodash';
import $ from 'jquery';

interface propsType {
    // user: userType;
    urlArg: URLSearchParams | boolean;
}

const Craft = (props: propsType): React.ReactElement => {
    // const [user] = useState(props.user);
    const [categories] = useState(Crafts.map(c => c.category));
    const [selectedCategory, setSelectedCategory] = useState((props.urlArg as URLSearchParams).get('c') || '');
    const [showedItems, setShowedItems] = useState({});
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        if (selectedCategory !== '' && !loaded) {
            if (_.indexOf(categories, selectedCategory) === -1) setSelectedCategory('');
            else setShowedItems(Crafts.filter(c => c.category === selectedCategory)[0]);
        }
        if (!loaded) setLoaded(true);

        return (): void => {
            setSelectedCategory('');
        };
    }, [props]);

    const handleClickCategory = (category: string): void => {
        setSelectedCategory(category);
        setShowedItems(Crafts.filter(c => c.category === category)[0]);
    };

    const handleOnScroll = (e: React.WheelEvent<HTMLDivElement>): void => {
        if (e.currentTarget.className.indexOf('little') !== -1)
            $(e.currentTarget).scrollLeft(Number($(e.currentTarget).scrollLeft()) + e.deltaY);
    };

    /* eslint-disable max-len */
    return (
        <div className='principal-container'>
            <div
                className={'craft-category-container' + (selectedCategory !== '' && _.indexOf(categories, selectedCategory) !== -1 ? ' little' : '')}
                onWheel={handleOnScroll}
            >
                {categories.map((category: string, index: number) => {
                    return (
                        <a
                            href={`#?p=craft&c=${category}`}
                            key={index}
                            className={'craft-category' + (selectedCategory === category ? ' active' : '')}
                        >
                            <div
                                onClick={(): void => handleClickCategory(category)}
                            >
                                <img src={`/assets/img/dofus/items/categories/${category.toLowerCase()}.png`} alt={category.toLowerCase()} />
                                <p>{category}</p>
                            </div>
                        </a>
                    );
                })}
            </div>
            {selectedCategory !== '' && _.indexOf(categories, selectedCategory) !== -1 ?
                <div className='craft-items-container'>
                    {Object.keys(showedItems).map((key: string, index: number) => {
                        if (key !== 'category') {
                            return (
                                <div
                                    className='craft-list-item'
                                    key={index}
                                >
                                    <img src={`/assets/img/dofus/items/categories/${key.toLowerCase()}.png`} alt={key.toLowerCase()} />
                                    <p>{key}</p>
                                </div>
                            );
                        }
                    })}
                </div> : ''}
        </div>
    );
};

Craft.propTypes = {
    // user: PropTypes.oneOfType([
    //     PropTypes.object.isRequired,
    //     PropTypes.bool.isRequired
    // ]),
    urlArg: PropTypes.oneOfType([
        PropTypes.object.isRequired,
        PropTypes.bool.isRequired
    ])
};

export default Craft;
