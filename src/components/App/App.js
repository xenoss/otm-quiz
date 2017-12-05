import React, { Component } from 'react';
import { Route, BrowserRouter, Link, Switch } from 'react-router-dom';
import { auth as firebaseAuth } from 'firebase';
import { init as firebaseInit } from '../../firebase';
import { logout } from '../../db';
import Login from '../Auth/Login';
import Register from '../Auth/Register';
import Dashboard from '../Dashboard/Dashboard';
import Quiz from '../Quiz/Quiz';
import { PrivateRoute, PublicRoute } from '../Utils/Routes';
import './App.css';


const Home = () => <div>Home</div>;

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            authed: false,
            loading: true,
        };
        firebaseInit();
    }
    componentDidMount() {
        this.removeListener = firebaseAuth().onAuthStateChanged((user) => {
            if (user) {
                this.setState({
                    authed: true,
                    loading: false,
                });
            } else {
                this.setState({
                    authed: false,
                    loading: false,
                });
            }
        });
    }
    componentWillUnmount() {
        this.removeListener();
    }
    componentDidCatch(/* error, info */) {
        // Display fallback UI
        this.setState({ hasError: true });
        // You can also log the error to an error reporting service
        // logErrorToMyService(error, info);
    }
    renderHeader() {
        return (
            <header className="navbar">
                <section className="navbar-section">
                    <Link to="/" className="navbar-brand mr-2">Quizz</Link>
                </section>
                <section className="navbar-section">
                    {this.state.authed ?
                        <button
                            onClick={() => { logout(); }}
                            className="btn btn-link"
                        >Logout
                        </button>
                        :
                        null}
                </section>
            </header>);
    }
    render() {
        if (this.state.loading) {
            return <div><progress className="progress" max="100" /></div>;
        }
        if (this.state.hasError) {
            return (<div className="toast toast-error">
                Something broken and we are noticed
            </div>);
        }
        return (
            <div className="App">
                <BrowserRouter>
                    <div>
                        {this.renderHeader()}
                        <div className="container">
                            <div className="row">
                                <Switch>
                                    <PrivateRoute path="/" exact component={Home} />
                                    <PublicRoute
                                        authed={this.state.authed}
                                        path="/login"
                                        component={Login}
                                    />
                                    <PublicRoute
                                        authed={this.state.authed}
                                        path="/register"
                                        component={Register}
                                    />
                                    <PrivateRoute
                                        authed={this.state.authed}
                                        path="/dashboard"
                                        component={Dashboard}
                                    />
                                    <PrivateRoute
                                        authed={this.state.authed}
                                        path="/quiz"
                                        component={Quiz}
                                    />
                                    <Route render={() => <h3>No Match</h3>} />
                                </Switch>
                            </div>
                        </div>
                    </div>
                </BrowserRouter>
            </div>
        );
    }
}

export default App;
