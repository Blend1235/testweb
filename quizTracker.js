class QuizTracker {
	
	openFullscreen() {
        let elem = document.documentElement;
        if (elem.requestFullscreen) {
            elem.requestFullscreen();
        } else if (elem.mozRequestFullScreen) { /* Firefox */
            elem.mozRequestFullScreen();
        } else if (elem.webkitRequestFullscreen) { /* Chrome, Safari and Opera */
            elem.webkitRequestFullscreen();
        } else if (elem.msRequestFullscreen) { /* IE/Edge */
            elem.msRequestFullscreen();
        }
    }

    goFullscreen() {
        this.openFullscreen();
    }
    constructor() {
        this.questions_attempted = 0;
        this.questions_not_attempted = 0;
        this.correct_answers = 0;
        this.incorrect_answers = 0;
        this.user_inputs = [];
        this.history = JSON.parse(localStorage.getItem('quizHistory')) || [];
        this.correct_answer_value = 5; // default value
        this.incorrect_answer_value = -1; // default value
    }
	reset() {
        this.history.push({
            timestamp: new Date().toISOString(),
            results: {
                questions_attempted: this.questions_attempted,
                questions_not_attempted: this.questions_not_attempted,
                correct_answers: this.correct_answers,
                incorrect_answers: this.incorrect_answers,
                total_marks: this.calculate_total_marks(),
                max_marks: this.calculate_max_marks(),
                percentage: this.calculate_percentage(),
                nonnegative_percentage: this.calculate_nonnegative_percentage()
            }
        });
        localStorage.setItem('quizHistory', JSON.stringify(this.history));
        this.questions_attempted = 0;
        this.questions_not_attempted = 0;
        this.correct_answers = 0;
        this.incorrect_answers = 0;
        this.user_inputs = [];
        this.display_results();
    }
    display_history() {
        let historyText = this.history.map((entry, index) => 
            `Quiz ${index + 1} (${new Date(entry.timestamp).toLocaleString()}):\n` +
            `Questions Attempted: ${entry.results.questions_attempted}\n` +
            `Questions Not Attempted: ${entry.results.questions_not_attempted}\n` +
            `Correct Answers: ${entry.results.correct_answers}\n` +
            `Incorrect Answers: ${entry.results.incorrect_answers}\n` +
            `Total Marks: ${entry.results.total_marks}/${entry.results.max_marks}\n` +
            `Percentage: ${entry.results.percentage.toFixed(2)}%\n` +
            `Nonnegative Percentage: ${entry.results.nonnegative_percentage.toFixed(2)}%\n`
        ).join('\n');
        let blob = new Blob([historyText], {type: "text/plain;charset=utf-8"});
        let url = URL.createObjectURL(blob);
        window.open(url);
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
        return this.correct_answers * this.correct_answer_value;
    }
    calculate_negative_marks() {
        return this.incorrect_answers * this.incorrect_answer_value;
    }
    calculate_total_marks() {
        return this.calculate_positive_marks() + this.calculate_negative_marks();
    }
    calculate_max_marks() {
        return (this.questions_attempted + this.questions_not_attempted) * this.correct_answer_value;
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

    let resultsText = `
        Quiz Results\n
        Questions Attempted: ${this.questions_attempted}\n
        Questions Not Attempted: ${this.questions_not_attempted}\n
        Correct Answers: ${this.correct_answers}\n
        Incorrect Answers: ${this.incorrect_answers}\n
        Positive Marks: ${this.calculate_positive_marks()}\n
        Negative Marks: ${this.calculate_negative_marks()}\n
        Total Marks: ${total_marks}/${max_marks}\n
        Percentage: ${percentage.toFixed(2)}%\n
        If None Were Incorrect: ${this.calculate_positive_marks()}/${max_marks}\n
        Nonnegative Percentage: ${nonnegative_percentage.toFixed(2)}%\n`;

    let blob = new Blob([resultsText], {type: "text/plain;charset=utf-8"});
    let url = URL.createObjectURL(blob);

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
            <a href="${url}" download="results.txt">Save Results</a>
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

document.getElementById('fullScreen').addEventListener('click', () => quiz.goFullscreen());
document.getElementById('resetButton').addEventListener('click', () => quiz.reset());
document.getElementById('historyButton').addEventListener('click', () => quiz.display_history());
document.getElementById('settingsButton').addEventListener('click', () => {
    let correct_value = prompt("Enter the value for a correct answer:", quiz.correct_answer_value);
    let incorrect_value = prompt("Enter the value for an incorrect answer:", quiz.incorrect_answer_value);
    if (correct_value !== null && incorrect_value !== null) {
        quiz.correct_answer_value = Number(correct_value);
        quiz.incorrect_answer_value = Number(incorrect_value);
    }
});