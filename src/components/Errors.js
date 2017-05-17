import React from 'react'
import { Link } from 'react-router-dom'

import './Errors.css'

const Background = () => (
  <div className="background">
    <div className="logo logo-1"></div>
    <div className="logo logo-2"></div>
    <div className="logo logo-3"></div>
    <div className="logo logo-4"></div>
    <div className="logo logo-5"></div>
  </div>
)

export const SocketError = () => (
  <div className="error">
    <Background />
    <div className="content">
      <h1>ERROR</h1>
      <hr/>
      <h2>Can not connect to UNIX socket</h2>
      <p>Something went wrong, please try again later.</p>
      <br/>
      <Link to="/" className="button main-button">Back to Home page</Link>
    </div>
  </div>
)

export const NoMatchError = () => (
  <div className="error">
    <Background />
    <div className="content">
      <h1>404</h1>
      <hr/>
      <h2>Page not found</h2>
      <p>The page you are looking for doesnt exist.</p>
      <br/>
      <a className="button third-button" onClick={() => history.back()}>Previous Page</a>
      <Link to="/" className="button main-button">Back to Home page</Link>
    </div>
  </div>
)
