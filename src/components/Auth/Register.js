import React, { Component } from 'react';
import { auth } from '../../db';

function setErrorMsg(error) {
    return {
        registerMessage: error.message,
    };
}

export default class Register extends Component {
    constructor(props) {
        super(props);
        this.state = {
            registerMessage: null,
        };
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    handleSubmit(e) {
        e.preventDefault();
        auth(this.email.value, this.pw.value)
            .catch(error => this.setState(setErrorMsg(error)));
    }
    render() {
        return (
            <div className="col-3 col-mx-auto col-sm-8 col-xs-8">
                <h1>Register</h1>
                <form onSubmit={this.handleSubmit}>
                    <div className="form-group">
                        <input
                            className={`form-input ${this.state.errorField === 'email' ? 'is-error' : ''}`}
                            ref={(email) => { this.email = email; }}
                            placeholder="Email"
                        />
                    </div>
                    <div className="form-group">
                        <input
                            type="password"
                            className="form-input"
                            placeholder="Password"
                            ref={(pw) => { this.pw = pw; }}
                        />
                    </div>
                    {
                        this.state.registerMessage &&
                        <div className="alert" role="alert">
                            <span className="sr-only">Error:</span>
                            &nbsp;{this.state.registerMessage}
                        </div>
                    }
                    <button type="submit" className="btn btn-primary">Register</button>
                </form>
            </div>
        );
    }
}
