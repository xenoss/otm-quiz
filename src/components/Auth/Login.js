import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import get from 'lodash/get';
import { login, resetPassword, socialAuth, getProvidersForEmail, socialLink, passwordLink } from '../../db';
import fbIcon from './fb.svg';
import googleIcon from './google.svg';


function setErrorMsg(error) {
    return {
        loginMessage: error,
        errorField: null,
    };
}

export default class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loginMessage: null,
        };

        // prebind methods
        this.cleanLinkage = this.cleanLinkage.bind(this);
        this.doLinkage = this.doLinkage.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.doPasswordLinkage = this.doPasswordLinkage.bind(this);
    }
    handleSubmit(e) {
        e.preventDefault();
        login(this.email.value, this.pw.value)
            .catch((error) => {
                if (error.code === 'auth/invalid-email') {
                    this.setState({
                        ...setErrorMsg('Invalid email'),
                        errorField: 'email',
                    });
                } else {
                    this.setState(setErrorMsg('Invalid username/password.'));
                }
            });
    }
    socialSignin(e, provider) {
        e.preventDefault();
        socialAuth(provider)
            .catch((error) => {
                if (error.code === 'auth/popup-blocked') {
                    this.setState({
                        adblockWarning: true,
                    });
                }
                if (error.code === 'auth/account-exists-with-different-credential') {
                    return getProvidersForEmail(error.email)
                        .then((linkProvider) => {
                            this.setState({
                                passwordMode: linkProvider === 'password',
                                linkProvider,
                                linkEmail: error.email,
                                linkCredential: error.credential,
                            });
                        });
                }
                return true;
            });
    }
    doLinkage() {
        return socialLink(this.state.linkProvider, this.state.linkCredential);
    }
    doPasswordLinkage() {
        return login(this.state.linkEmail, this.lpw.value)
            .then(user => passwordLink(user, this.state.linkCredential))
            .catch((error) => {
                if (error.code === 'auth/wrong-password') {
                    this.setState({
                        linkError: 'Wrong password',
                    });
                }
            });
    }

    cleanLinkage() {
        this.setState({
            linkProvider: null,
            linkCredential: null,
        });
    }
    resetPassword() {
        resetPassword(this.email.value)
            .then(() => this.setState(setErrorMsg(`Password reset email sent to ${this.email.value}.`)))
            .catch(() => this.setState(setErrorMsg('Email address not found.')));
    }
    renderForm() {
        return (<form onSubmit={this.handleSubmit}>
            <div className="form-group">
                <input
                    className={`form-input ${this.state.errorField === 'email' ? 'is-error' : ''}`}
                    ref={(email) => { this.email = email; }}
                    placeholder="Email"
                    name="email"
                />
            </div>
            <div className="form-group">
                <input
                    type="password"
                    className="form-input"
                    placeholder="Password"
                    name="password"
                    ref={(pw) => { this.pw = pw; }}
                />
            </div>
            {
                this.state.loginMessage &&
                <div className="alert" role="alert">
                    <span className="sr-only">Error:</span>
                    &nbsp;{this.state.loginMessage} <a
                        href="#/"
                        onClick={() => this.resetPassword()}
                        className="alert-link"
                    >Forgot Password?</a>
                </div>
            }
            <button type="submit" className="btn btn-primary">Login</button>
            <div>
                Or <Link
                    to="/register"
                    className="navbar-brand mr-2"
                >Register new email account</Link>
            </div>
        </form>);
    }
    renderSocial() {
        return (<div className="columns block">
            <div
                onClick={e => this.socialSignin(e, 'facebook')}
                className="hand column col-6"
                role="button"
                onKeyPress={e => this.socialSignin(e, 'facebook')}
                tabIndex={0}
            >
                <img src={fbIcon} className="Signin" alt="signin" width="64" height="64 " />
            </div>
            <div
                onClick={e => this.socialSignin(e, 'google.com')}
                className="hand column col-6"
                role="button"
                onKeyPress={e => this.socialSignin(e, 'google.com')}
                tabIndex={0}
            >
                <img src={googleIcon} className="Signin" alt="signin" width="64" height="64 " />
            </div>
        </div>);
    }
    renderLinkageDialog() {
        return (<div className={`modal ${this.state.linkCredential ? 'active' : ''}`} id="modal-id">
            <a
                href="#close"
                className="modal-overlay"
                aria-label="Close"
                onClick={this.cleanLinkage}
            >&nbsp;</a>
            <div className="modal-container">
                <div className="modal-header">
                    <div className="modal-title h5">Another account</div>
                </div>
                <div className="modal-body">
                    <div className="content">
                        <div>We just found another account with same email.</div>
                        {this.state.passwordMode ?
                            <div>You can provide password for
                                {this.state.linkEmail} to link accounts
                                <div className="form-group">
                                    <input
                                        type="password"
                                        name="lpassword"
                                        className={`form-input ${this.state.linkError ? 'has-error' : ''}`}
                                        placeholder="Password"
                                        ref={(lpw) => { this.lpw = lpw; }}
                                    />
                                    {this.state.linkError && <div
                                        className="alert"
                                    >{this.state.linkError}</div>}
                                </div>
                                <div className="form-group right">
                                    <button
                                        className="btn btn-primary"
                                        onClick={this.doPasswordLinkage}
                                    >
                                        <i className="icon icon-link" /> Link</button>
                                </div>
                            </div> :
                            <div>You can <button
                                className="btn btn-primary"
                                onClick={this.doLinkage}
                            >
                                <i className="icon icon-link" /> Link</button> two accounts</div>}
                        <p>Or decline and login with older one
                            ({get(this.state.linkProvider, 'providerId')}).</p>
                    </div>
                </div>
                <div className="modal-footer">
                    <button
                        className="btn btn-link primary"
                        onClick={this.cleanLinkage}
                    >No, thanks</button>
                </div>
            </div>
        </div>);
    }
    render() {
        return (
            <div className="col-3 col-mx-auto col-sm-8 col-xs-8">
                <h1> Login </h1>
                {this.state.adblockWarning && <div className="toast toast-error block">
                    Please pause or turn off your ad blocking software to allow registration!
                    Due to the techincal issues it is not possible to finish registration process.
                </div>}
                <h5> Use your favorite social </h5>
                {this.renderSocial()}
                <h5> or email </h5>

                {this.renderForm()}

                {this.renderLinkageDialog()}
            </div>
        );
    }
}
