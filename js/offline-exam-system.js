/**
 * Offline Exam System - No CORS Issues
 * Works by simply opening index.html in any browser
 */

window.offlineExamSystem = {
    currentExam: null,
    currentQuestionIndex: 0,
    userAnswers: {},
    startTime: null,
    timeLimit: 0,
    timerInterval: null,
    isExamActive: false,

    // Initialize the system
    init: function() {
        console.log('🚀 Initializing Offline Exam System...');
        this.populateDropdowns();
        this.setupEventListeners();
        console.log('✅ Offline Exam System ready');
    },

    // Populate class dropdown
    populateDropdowns: function() {
        const classSelect = document.getElementById('classSelect');
        if (!classSelect) return;

        // Clear existing options
        classSelect.innerHTML = '<option value="">Choose Class...</option>';

        // Add classes from embedded data
        window.examData.structure.classes.forEach((classObj, classIndex) => {
            const option = document.createElement('option');
            option.value = classIndex;
            option.textContent = classObj.name;
            classSelect.appendChild(option);
        });

        console.log(`📚 Loaded ${window.examData.structure.classes.length} classes`);
    },

    // Setup event listeners
    setupEventListeners: function() {
        const classSelect = document.getElementById('classSelect');
        const subjectSelect = document.getElementById('subjectSelect');
        const topicSelect = document.getElementById('topicSelect');
        const paperSelect = document.getElementById('paperSelect');
        const startBtn = document.getElementById('startExamBtn');

        if (classSelect) {
            classSelect.addEventListener('change', (e) => this.handleClassChange(e.target.value));
        }

        if (subjectSelect) {
            subjectSelect.addEventListener('change', (e) => this.handleSubjectChange(e.target.value));
        }

        if (topicSelect) {
            topicSelect.addEventListener('change', (e) => this.handleTopicChange(e.target.value));
        }

        if (paperSelect) {
            paperSelect.addEventListener('change', (e) => this.handlePaperChange(e.target.value));
        }

        if (startBtn) {
            startBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.startExam();
            });
        }
    },

    // Handle class selection
    handleClassChange: function(classIndex) {
        const subjectSelect = document.getElementById('subjectSelect');
        const topicSelect = document.getElementById('topicSelect');
        const paperSelect = document.getElementById('paperSelect');
        const startBtn = document.getElementById('startExamBtn');

        if (!classIndex) {
            this.resetDropdown(subjectSelect, 'First select a class');
            this.resetDropdown(topicSelect, 'First select a subject');
            this.resetDropdown(paperSelect, 'First select a topic');
            startBtn.disabled = true;
            return;
        }

        const selectedClass = window.examData.structure.classes[classIndex];
        if (!selectedClass) return;

        // Populate subjects
        subjectSelect.innerHTML = '<option value="">Choose Subject...</option>';
        selectedClass.subjects.forEach((subject, subjectIndex) => {
            const option = document.createElement('option');
            option.value = `${classIndex}-${subjectIndex}`;
            option.textContent = subject.name;
            subjectSelect.appendChild(option);
        });
        subjectSelect.disabled = false;

        // Reset subsequent dropdowns
        this.resetDropdown(topicSelect, 'First select a subject');
        this.resetDropdown(paperSelect, 'First select a topic');
        startBtn.disabled = true;
    },

    // Handle subject selection
    handleSubjectChange: function(value) {
        const topicSelect = document.getElementById('topicSelect');
        const paperSelect = document.getElementById('paperSelect');
        const startBtn = document.getElementById('startExamBtn');

        if (!value) {
            this.resetDropdown(topicSelect, 'First select a subject');
            this.resetDropdown(paperSelect, 'First select a topic');
            startBtn.disabled = true;
            return;
        }

        const [classIndex, subjectIndex] = value.split('-').map(Number);
        const selectedSubject = window.examData.structure.classes[classIndex].subjects[subjectIndex];
        if (!selectedSubject) return;

        // Populate topics
        topicSelect.innerHTML = '<option value="">Choose Topic...</option>';
        selectedSubject.topics.forEach((topic, topicIndex) => {
            const option = document.createElement('option');
            option.value = `${classIndex}-${subjectIndex}-${topicIndex}`;
            option.textContent = topic.name;
            topicSelect.appendChild(option);
        });
        topicSelect.disabled = false;

        // Reset subsequent dropdown
        this.resetDropdown(paperSelect, 'First select a topic');
        startBtn.disabled = true;
    },

    // Handle topic selection
    handleTopicChange: function(value) {
        const paperSelect = document.getElementById('paperSelect');
        const startBtn = document.getElementById('startExamBtn');

        if (!value) {
            this.resetDropdown(paperSelect, 'First select a topic');
            startBtn.disabled = true;
            return;
        }

        const [classIndex, subjectIndex, topicIndex] = value.split('-').map(Number);
        const selectedTopic = window.examData.structure.classes[classIndex].subjects[subjectIndex].topics[topicIndex];
        if (!selectedTopic) return;

        // Populate papers
        paperSelect.innerHTML = '<option value="">Choose Paper...</option>';
        selectedTopic.papers.forEach((paper, paperIndex) => {
            const option = document.createElement('option');
            option.value = `${classIndex}-${subjectIndex}-${topicIndex}-${paperIndex}`;
            option.textContent = `${paper.name} (${paper.duration} min, ${paper.questions} questions)`;
            option.disabled = paper.status === 'coming_soon';
            if (paper.status === 'coming_soon') {
                option.textContent += ' - Coming Soon';
            }
            paperSelect.appendChild(option);
        });
        paperSelect.disabled = false;
        startBtn.disabled = true;
    },

    // Handle paper selection
    handlePaperChange: function(value) {
        const startBtn = document.getElementById('startExamBtn');
        startBtn.disabled = !value;
    },

    // Reset dropdown
    resetDropdown: function(select, placeholderText) {
        if (select) {
            select.innerHTML = `<option value="">${placeholderText}</option>`;
            select.disabled = true;
        }
    },

    // Start exam
    startExam: function() {
        const paperSelect = document.getElementById('paperSelect');
        const selectedValue = paperSelect.value;

        if (!selectedValue) {
            alert('Please select all options before starting the exam.');
            return;
        }

        const [classIndex, subjectIndex, topicIndex, paperIndex] = selectedValue.split('-').map(Number);
        const paper = window.examData.structure.classes[classIndex].subjects[subjectIndex].topics[topicIndex].papers[paperIndex];

        if (paper.status === 'coming_soon') {
            alert('This exam is coming soon. Please select another paper.');
            return;
        }

        // Get question data
        const questionData = window.examData.questions[paper.jsonFile];
        if (!questionData) {
            alert('Question data not available for this exam.');
            return;
        }

        // Initialize exam
        this.currentExam = {
            paper: paper,
            questions: questionData.questions,
            info: questionData.paper_info
        };
        this.currentQuestionIndex = 0;
        this.userAnswers = {};
        this.startTime = new Date();
        this.timeLimit = paper.duration * 60; // Convert minutes to seconds
        this.isExamActive = true;

        // Display exam interface
        this.displayExamInterface();
    },

    // Display exam interface
    displayExamInterface: function() {
        const exam = this.currentExam;

        document.body.innerHTML = `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="utf-8">
                <title>Exam in Progress - ${exam.info.name}</title>
                <meta name="viewport" content="width=device-width, initial-scale=1">
                <link href="css/bootstrap.css" rel="stylesheet">
                <link href="css/style.css" rel="stylesheet">
                <link href="css/enhanced-style.css" rel="stylesheet">
                <link href="css/exam-interface.css" rel="stylesheet">
                <style>
                    /* FontAwesome Icon Base Styles */
                    .fas, .far, .fab, .fa {
                        display: inline-block;
                        font-style: normal;
                        font-variant: normal;
                        text-rendering: auto;
                        line-height: 1;
                        margin-right: 5px;
                    }

                    /* Icon replacements using Unicode characters */
                    .fa-clock::before { content: "🕐"; }
                    .fa-chevron-left::before { content: "◀"; }
                    .fa-chevron-right::before { content: "▶"; }
                    .fa-check::before { content: "✓"; }
                    .fa-trophy::before { content: "🏆"; }
                    .fa-print::before { content: "🖨"; }
                    .fa-home::before { content: "🏠"; }
                </style>
            </head>
            <body>
                <div class="exam-interface">
                    <div class="exam-header">
                        <div class="exam-title">
                            <h2>${exam.info.name}</h2>
                            <div class="exam-info">
                                <span>${exam.info.class}</span>
                                <span>${exam.info.subject}</span>
                                <span>${exam.info.topic}</span>
                            </div>
                        </div>
                        <div class="exam-timer">
                            <i class="fas fa-clock"></i>
                            <span id="timer">--:--</span>
                        </div>
                    </div>

                    <div class="exam-content">
                        <div class="question-navigation">
                            <h4>Questions</h4>
                            <div id="question-numbers">
                                <!-- Navigation buttons will be generated here -->
                            </div>
                        </div>

                        <div class="question-area">
                            <div class="question-header">
                                <div id="question-counter">Question 1 of ${exam.questions.length}</div>
                            </div>

                            <div class="question-content">
                                <div id="question-text">
                                    <!-- Question will be displayed here -->
                                </div>
                                <div id="options-container">
                                    <!-- Options will be displayed here -->
                                </div>
                            </div>

                            <div class="question-controls">
                                <button id="prevBtn" class="btn btn-secondary" style="display: none;">
                                    <i class="fas fa-chevron-left"></i> Previous
                                </button>
                                <button id="nextBtn" class="btn btn-primary">
                                    Next <i class="fas fa-chevron-right"></i>
                                </button>
                                <button id="submitBtn" class="btn btn-success" style="display: none;">
                                    <i class="fas fa-check"></i> Submit Exam
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <script>
                    // Prevent accidental page refresh
                    window.addEventListener('beforeunload', function(e) {
                        if (window.offlineExamSystem.isExamActive) {
                            e.preventDefault();
                            e.returnValue = '';
                            return '';
                        }
                    });
                </script>
            </body>
            </html>
        `;

        // Reinitialize exam system in the new page
        this.initExamInterface();
    },

    // Initialize exam interface
    initExamInterface: function() {
        this.generateQuestionNavigator();
        this.displayCurrentQuestion();
        this.startTimer();
        this.setupExamEventListeners();
    },

    // Setup exam event listeners
    setupExamEventListeners: function() {
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');
        const submitBtn = document.getElementById('submitBtn');

        if (prevBtn) {
            prevBtn.addEventListener('click', () => this.previousQuestion());
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', () => this.nextQuestion());
        }

        if (submitBtn) {
            submitBtn.addEventListener('click', () => this.submitExam());
        }
    },

    // Generate question navigator
    generateQuestionNavigator: function() {
        const container = document.getElementById('question-numbers');
        if (!container) return;

        let navHTML = '';
        for (let i = 0; i < this.currentExam.questions.length; i++) {
            const isAnswered = this.userAnswers.hasOwnProperty(i);
            const isCurrent = i === this.currentQuestionIndex;

            let className = 'question-nav';
            if (isCurrent) className += ' current';
            if (isAnswered) className += ' answered';

            navHTML += `
                <button onclick="window.offlineExamSystem.goToQuestion(${i})" class="${className}">
                    ${i + 1}
                </button>
            `;
        }
        container.innerHTML = navHTML;
    },

    // Display current question
    displayCurrentQuestion: function() {
        const questionTextContainer = document.getElementById('question-text');
        const optionsContainer = document.getElementById('options-container');
        const counterElement = document.getElementById('question-counter');

        if (!questionTextContainer || !optionsContainer) return;

        const question = this.currentExam.questions[this.currentQuestionIndex];
        const questionNumber = this.currentQuestionIndex + 1;
        const currentAnswer = this.userAnswers[this.currentQuestionIndex];

        // Update question counter
        if (counterElement) {
            counterElement.textContent = `Question ${questionNumber} of ${this.currentExam.questions.length}`;
        }

        // Display question text
        questionTextContainer.innerHTML = `<h4>${question.question}</h4>`;

        // Display options
        let optionsHTML = '';
        if (question.type === 'multiple_choice' && question.options) {
            question.options.forEach((option, index) => {
                const isChecked = currentAnswer === index ? 'checked' : '';
                optionsHTML += `
                    <div class="option">
                        <label>
                            <input type="radio" name="question_${this.currentQuestionIndex}"
                                   value="${index}" ${isChecked}
                                   onchange="window.offlineExamSystem.submitAnswer(${index})">
                            <span class="option-text">${option}</span>
                        </label>
                    </div>
                `;
            });
        }
        optionsContainer.innerHTML = optionsHTML;

        // Render math in questions and options using KaTeX
        setTimeout(() => {
            if (window.renderMathInElement) {
                window.renderMathInElement(questionTextContainer);
                window.renderMathInElement(optionsContainer);
            }
        }, 10);

        this.updateNavigationButtons();
        this.generateQuestionNavigator();
    },

    // Submit answer
    submitAnswer: function(answerIndex) {
        this.userAnswers[this.currentQuestionIndex] = answerIndex;
        this.generateQuestionNavigator(); // Refresh navigator to show answered state
    },

    // Navigation methods
    previousQuestion: function() {
        if (this.currentQuestionIndex > 0) {
            this.currentQuestionIndex--;
            this.displayCurrentQuestion();
        }
    },

    nextQuestion: function() {
        if (this.currentQuestionIndex < this.currentExam.questions.length - 1) {
            this.currentQuestionIndex++;
            this.displayCurrentQuestion();
        }
    },

    goToQuestion: function(questionIndex) {
        if (questionIndex >= 0 && questionIndex < this.currentExam.questions.length) {
            this.currentQuestionIndex = questionIndex;
            this.displayCurrentQuestion();
        }
    },

    // Update navigation buttons
    updateNavigationButtons: function() {
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');
        const submitBtn = document.getElementById('submitBtn');

        const isFirstQuestion = this.currentQuestionIndex === 0;
        const isLastQuestion = this.currentQuestionIndex === this.currentExam.questions.length - 1;

        if (prevBtn) {
            prevBtn.style.display = isFirstQuestion ? 'none' : 'inline-block';
        }

        if (nextBtn) {
            nextBtn.style.display = isLastQuestion ? 'none' : 'inline-block';
        }

        if (submitBtn) {
            submitBtn.style.display = isLastQuestion ? 'inline-block' : 'none';
        }
    },

    // Timer functions
    startTimer: function() {
        this.updateTimerDisplay();
        this.timerInterval = setInterval(() => {
            this.updateTimerDisplay();
            if (this.getTimeRemaining() <= 0) {
                this.submitExam();
            }
        }, 1000);
    },

    updateTimerDisplay: function() {
        const timerElement = document.getElementById('timer');
        if (!timerElement) return;

        const timeRemaining = this.getTimeRemaining();
        const minutes = Math.floor(timeRemaining / 60);
        const seconds = timeRemaining % 60;
        timerElement.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

        // Change color when time is running out
        if (timeRemaining <= 300) { // 5 minutes
            timerElement.style.color = '#e74c3c';
        }
    },

    getTimeRemaining: function() {
        const elapsed = Math.floor((new Date() - this.startTime) / 1000);
        return Math.max(0, this.timeLimit - elapsed);
    },

    // Submit exam
    submitExam: function() {
        if (!confirm('Are you sure you want to submit the exam? This action cannot be undone.')) {
            return;
        }

        this.isExamActive = false;
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
        }

        const results = this.calculateResults();
        this.displayResults(results);
    },

    // Calculate results
    calculateResults: function() {
        let correctAnswers = 0;
        const totalQuestions = this.currentExam.questions.length;
        const answeredQuestions = Object.keys(this.userAnswers).length;

        this.currentExam.questions.forEach((question, index) => {
            if (this.userAnswers[index] === question.correct) {
                correctAnswers++;
            }
        });

        const percentage = Math.round((correctAnswers / totalQuestions) * 100);
        const duration = Math.floor((new Date() - this.startTime) / 1000);

        let grade = 'F';
        if (percentage >= 90) grade = 'A+';
        else if (percentage >= 80) grade = 'A';
        else if (percentage >= 70) grade = 'B';
        else if (percentage >= 60) grade = 'C';
        else if (percentage >= 50) grade = 'D';

        return {
            correctAnswers,
            totalQuestions,
            answeredQuestions,
            unansweredQuestions: totalQuestions - answeredQuestions,
            percentage,
            grade,
            duration,
            details: {
                paperName: this.currentExam.info.name,
                className: this.currentExam.info.class,
                subjectName: this.currentExam.info.subject,
                topicName: this.currentExam.info.topic
            }
        };
    },

    // Display results
    displayResults: function(results) {
        document.body.innerHTML = `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="utf-8">
                <title>Exam Results - ${results.details.paperName}</title>
                <meta name="viewport" content="width=device-width, initial-scale=1">
                <link href="css/bootstrap.css" rel="stylesheet">
                <link href="css/style.css" rel="stylesheet">
                <link href="css/enhanced-style.css" rel="stylesheet">
                <link href="css/exam-interface.css" rel="stylesheet">
                <style>
                    .fas, .far, .fab, .fa {
                        display: inline-block;
                        font-style: normal;
                        font-variant: normal;
                        text-rendering: auto;
                        line-height: 1;
                        margin-right: 5px;
                    }
                    .fa-trophy::before { content: "🏆"; }
                    .fa-print::before { content: "🖨"; }
                    .fa-home::before { content: "🏠"; }
                </style>
            </head>
            <body>
                <div class="exam-results">
                    <div class="results-header">
                        <h2><i class="fas fa-trophy"></i> Exam Results</h2>
                        <h3>${results.details.paperName}</h3>
                        <div class="exam-info">
                            <span>${results.details.className}</span>
                            <span>${results.details.subjectName}</span>
                            <span>${results.details.topicName}</span>
                        </div>
                    </div>

                    <div class="score-summary">
                        <div class="score-circle">
                            ${results.percentage}%
                        </div>
                        <div class="score-details">
                            <p><strong>Grade:</strong> ${results.grade}</p>
                            <p><strong>Correct Answers:</strong> ${results.correctAnswers} out of ${results.totalQuestions}</p>
                            <p><strong>Answered Questions:</strong> ${results.answeredQuestions}</p>
                            <p><strong>Unanswered Questions:</strong> ${results.unansweredQuestions}</p>
                            <p><strong>Time Taken:</strong> ${Math.floor(results.duration / 60)}:${(results.duration % 60).toString().padStart(2, '0')}</p>
                        </div>
                    </div>

                    <div class="results-actions">
                        <button onclick="window.print()" class="btn btn-primary">
                            <i class="fas fa-print"></i> Print Results
                        </button>
                        <button onclick="location.reload()" class="btn btn-success">
                            <i class="fas fa-home"></i> Back to Home
                        </button>
                    </div>
                </div>
            </body>
            </html>
        `;

        // Render math in results page using KaTeX
        setTimeout(() => {
            if (window.renderAllMath) {
                window.renderAllMath();
            }
        }, 100);
    }
};
