import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { getUserScores } from '../../db';

export default class Dashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            scores: null,
            loading: true,
        };
    }
    componentWillMount() {
        return getUserScores().then((snapshot) => {
            const userStats = snapshot.val();
            if (userStats && userStats.scores >= 0) {
                return this.setState({
                    scores: userStats.scores,
                    loading: false,
                });
            }
            return this.setState({
                loading: false,
            });
        });
    }
    render() {
        if (this.state.loading) {
            return <div><progress className="progress" max="100" /></div>;
        }
        return (
            <div>
                <h3>Welcome!</h3>
                {(this.state.scores === null) ?
                    <div>Try to complete quiz to gain scores </div> :
                    <div>Your previous score: {this.state.scores}</div>}
                <div className="block">
                    <Link to="/quiz" className="btn btn-primary ">START <i className="icon icon-emoji" /></Link>
                </div>
            </div>
        );
    }
}
