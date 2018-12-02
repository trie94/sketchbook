import React from 'react';
import ReactDom from 'react-dom';
import { BrowserRouter, Route, Switch, Link } from 'react-router-dom';

import Home from './sketches/index/index';
import Sketch1 from './sketches/sketch1';
import Sketch2 from './sketches/sketch2';
import Sketch3 from './sketches/sketch3';

import './style.scss';

if (process.env.NODE_ENV !== 'production') { console.log("dev mode"); }
let basename = process.env.NODE_ENV == 'production' ? "/sketchbook" : "/";

if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => {
        const oldRootElem = document.querySelector('body');
        const newRootElem = oldRootElem.cloneNode(false);
        oldRootElem.parentNode.insertBefore(newRootElem, oldRootElem);
        oldRootElem.parentNode.removeChild(oldRootElem);
    });
} else {
    enableProdMode();
}

ReactDom.render(
    <BrowserRouter basename={basename}>
    <Switch>
        <Route exact path ='/' component={Home}/>
        <Route path = '/sketch1' component={Sketch1}/>
        <Route path = '/sketch2' component={Sketch2}/>
        <Route path = '/sketch3' component={Sketch3}/>
    </Switch>
    </BrowserRouter>,
    document.getElementById('root')
);
