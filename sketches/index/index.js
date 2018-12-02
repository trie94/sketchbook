import React from 'react';
import { Link } from 'react-router-dom';

class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        return(
            <div>
            <p>sketchbook</p>
            <p><Link to='/sketch1'>sketch1</Link></p>
            <p><Link to='/sketch2'>sketch2</Link></p>
            <p><Link to='/sketch3'>sketch3</Link></p>
            </div>
        )
    }
}

export default Home;
