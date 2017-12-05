import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { shuffle } from '../../utils/common';

export default class Question extends Component {
    constructor(props) {
        super(props);
        this.state = {
            answers: shuffle(props.answers),
            selected: null,
            timeleft: 10,
        };
    }
    componentWillMount() {
        this.startTimer();
    }
    componentWillReceiveProps(nextProps) {
        clearInterval(this.timer);
        this.setState({
            answers: shuffle(nextProps.answers),
            selected: null,
            timeleft: 10,
        }, () => this.startTimer());
    }
    componentWillUnmount() {
        clearInterval(this.timer);
    }
    startTimer() {
        this.timer = setInterval(() => {
            const timeleft = this.state.timeleft - 1;
            if (timeleft <= 0) {
                clearInterval(this.timer);
                this.finish({ forcedFalse: true });
                return;
            }
            this.setState({
                timeleft,
            });
        }, 1000);
    }

    finish(props = {}) {
        const { forcedFalse } = props;
        if (forcedFalse) {
            return this.props.onFinish(false);
        }
        return this.props
            .onFinish(this.state.answers[this.state.selected] === this.props.answers[0]);
    }
    selectQuestion(e, i) {
        e.preventDefault();
        this.setState({ selected: i });
    }
    renderQuestion(x, i) {
        return (<div
            className={`question ${this.state.selected === i ? 'selected' : ''}`}
            onClick={e => this.selectQuestion(e, i)}
            key={i}
            role="button"
            onKeyPress={e => this.selectQuestion(e, i)}
            tabIndex={((-1) * i)}
        >
            {x}
        </div>);
    }
    render() {
        return (
            <div className="quiz">

                <div className={`${this.state.timeleft < 3 ? 'danger' : ''}`}>{this.state.timeleft}</div>
                <div className="card">
                    <div className="card-image">
                        <div className="card-header">
                            <div className="card-title h5">{this.props.question}</div>
                            <div className="card-subtitle text-gray">{this.props.current + 1}/{this.props.total}</div>
                        </div>
                        <div className="card-body">
                            {this.state.answers.map((x, i) => (this.renderQuestion(x, i)))}
                        </div>
                        <div className="card-footer">
                            <button
                                className={`btn btn-primary ${this.state.selected === null ? 'disabled' : ''}`}
                                onClick={() => this.finish()}
                            >Answer <i className="icon icon-check" /></button>
                        </div>
                    </div>

                </div>
            </div>
        );
    }
}


Question.propTypes = {
    answers: PropTypes.array.isRequired,
    onFinish: PropTypes.func.isRequired,
    current: PropTypes.number.isRequired,
    total: PropTypes.number.isRequired,
    question: PropTypes.string.isRequired,
};
