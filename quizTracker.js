class QuizTracker {
    constructor() {
        this.questions_attempted = 0;
        this.questions_not_attempted = 0;
        this.correct_answers = 0;
        this.incorrect_answers = 0;
        this.user_inputs = [];
    }
    update_correct_answers() {
        this.correct_answers += 1;
        this.questions_attempted += 1;
        this.user_inputs.push('+');
        this.display_results();
    }
    update_incorrect_answers() {
        this.incorrect_answers += 1;
        this.questions_attempted += 1;
        this.user_inputs.push('-');
        this.display_results();
    }
    update_not_attempted() {
        this.questions_not_attempted += 1;
        this.user_inputs.push('.');
        this.display_results();
    }
    calculate_positive_marks() {
        return this.correct_answers * 5;
    }
    calculate_negative_marks() {
        return this.incorrect_answers * -1;
    }
    calculate_total_marks() {
        return this.calculate_positive_marks() + this.calculate_negative_marks();
    }
    calculate_max_marks() {
        return (this.questions_attempted + this.questions_not_attempted) * 5;
    }
    calculate_percentage() {
        return (this.calculate_total_marks() / this.calculate_max_marks()) * 100;
    }
    calculate_nonnegative_percentage() {
        return (this.calculate_positive_marks() / this.calculate_max_marks()) * 100;
    }
    display_results() {
    let total_marks = this.calculate_total_marks();
    let max_marks = this.calculate_max_marks();
    let percentage = (total_marks / max_marks) * 100;
    let nonnegative_percentage = (this.calculate_positive_marks() / max_marks) * 100;

    document.getElementById('results').innerHTML = `
        <div id="tableWrapper">
            <table>
                <tr><th colspan="2">Quiz Results</th></tr>
                <tr><td>Questions Attempted:</td><td>${this.questions_attempted}</td><td>Questions Not Attempted:</td><td>${this.questions_not_attempted}</td></tr>
                <tr><td>Correct Answers:</td><td>${this.correct_answers}</td><td>Incorrect Answers:</td><td>${this.incorrect_answers}</td></tr>
                <tr><td>Positive Marks:</td><td>${this.calculate_positive_marks()}</td><td>Negative Marks:</td><td>${this.calculate_negative_marks()}</td></tr>
                <tr><th colspan="2">Total Marks</th></tr>
                <tr><td colspan="2">${total_marks}/${max_marks}</td></tr>
                <tr><td colspan="2">${percentage.toFixed(2)}%</td></tr>
                <tr><th colspan="2">If None Were Incorrect</th></tr>
                <tr><td colspan="2">${this.calculate_positive_marks()}/${max_marks}</td></tr>
                <tr><td colspan="2">${nonnegative_percentage.toFixed(2)}%</td></tr>
            </table>
        </div>`;
}


}

let quiz = new QuizTracker();

function updateCorrectAnswers() {
    quiz.update_correct_answers();
}

function updateIncorrectAnswers() {
    quiz.update_incorrect_answers();
}

function updateNotAttempted() {
    quiz.update_not_attempted();
}
