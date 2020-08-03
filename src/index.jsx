import Post from '@/Post';
import PostImage from './assets/images/user-image.jpg';
import './babel.js';
import React from 'react';
import { render } from 'react-dom';

import './assets/styles/style.css';
import './assets/styles/style.scss';

const post = new Post('This is a new Post', PostImage);

console.log('Post to string', post.toString());

const App = () => (
    <>
        <h1>Webpack Course</h1>
        <hr />
        <div className="logo"></div>
    </>
);

render(<App />, document.getElementById('app'));
