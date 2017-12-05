import React, { Component } from 'react';
import { db } from '../../firebase';
import Question from './Question';
import { shuffle, getScore } from '../../utils/common';
import config from '../../config';
import { saveUserScores } from '../../db';

export default class Quiz extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            currentQuestion: 0,
            positiveAnswers: 0,
        };
        this.nextStep = this.nextStep.bind(this);
        this.reset = this.reset.bind(this);

        this.qty = config.quiz.questions;
    }

    componentWillMount() {
        return db().ref('/questions').once('value').then((snapshot) => {
            const questions = snapshot.val();
            if (questions && questions.length >= 0) {
                this.setState({
                    loading: false,
                    questions: shuffle(questions).slice(0, 5),
                });
            }
        });
    }
    reset() {
        return db().ref('/questions').once('value').then((snapshot) => {
            const questions = snapshot.val();
            if (questions && questions.length >= 0) {
                this.setState({
                    loading: false,
                    questions: shuffle(questions).slice(0, 5),
                    currentQuestion: 0,
                    positiveAnswers: 0,
                    finished: false,
                });
            }
        });
    }
    nextStep(result) {
        if (this.state.currentQuestion === (this.state.questions.length - 1)) {
            const positiveAnswers = result ?
                this.state.positiveAnswers + 1 :
                this.state.positiveAnswers;
            return saveUserScores(getScore(positiveAnswers, this.qty))
                .then(() => {
                    this.setState({
                        positiveAnswers,
                        finished: true,
                    });
                });
        }
        return this.setState({
            currentQuestion: this.state.currentQuestion + 1,
            positiveAnswers: result ? this.state.positiveAnswers + 1 : this.state.positiveAnswers,
        });
    }
    render() {
        if (this.state.loading) {
            return <div><progress className="progress" max="100" /></div>;
        }
        const data = this.state.questions[this.state.currentQuestion];
        if (this.state.finished) {
            return (<div>
                <h3>Thank you!</h3>
                <h4>Your results:
                    {(this.qty * this.state.positiveAnswers) / this.qty} / {this.qty}</h4>
                <button
                    onClick={this.reset}
                    className="btn btn-primary "
                >START AGAIN <i className="icon icon-emoji" /></button>
            </div>);
        }
        return (
            <div >
                <Question
                    question={data.question}
                    answers={data.answers}
                    onFinish={this.nextStep}
                    total={this.qty}
                    current={this.state.currentQuestion}
                />
            </div>
        );
    }
}
