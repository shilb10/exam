/**
 * Exam Interface for handling questions and answers
 * This module handles the display and interaction of exam questions
 */

window.examInterface = {
    currentPaper: null,
    currentQuestionIndex: 0,
    userAnswers: {},
    startTime: null,
    timeLimit: 0,
    examDetails: {},
    timerInterval: null,
    originalBodyContent: null,

    /**
     * Start an exam with the given paper (using index-based navigation)
     */
    startExam: function(classIndex, subjectIndex, topicIndex, paperIndex) {
        console.log('Starting exam with:', classIndex, subjectIndex, topicIndex, paperIndex);

        // Convert string indices to numbers
        const cIndex = parseInt(classIndex);
        const sIndex = parseInt(subjectIndex);
        const tIndex = parseInt(topicIndex);
        const pIndex = parseInt(paperIndex);

        // Find the paper using index-based navigation
        if (!window.examData.classes || !window.examData.classes[cIndex]) {
            console.error('Class not found at index:', cIndex);
            alert('Class not found at index: ' + cIndex);
            return;
        }
        const classObj = window.examData.classes[cIndex];

        if (!classObj.subjects || !classObj.subjects[sIndex]) {
            console.error('Subject not found at index:', sIndex);
            alert('Subject not found at index: ' + sIndex);
            return;
        }
        const subject = classObj.subjects[sIndex];

        if (!subject.topics || !subject.topics[tIndex]) {
            console.error('Topic not found at index:', tIndex);
            alert('Topic not found at index: ' + tIndex);
            return;
        }
        const topic = subject.topics[tIndex];

        if (!topic.papers || !topic.papers[pIndex]) {
            console.error('Paper not found at index:', pIndex);
            alert('Paper not found at index: ' + pIndex);
            return;
        }
        const paper = topic.papers[pIndex];

        // Load questions from preloaded JSON data or fallback to hardcoded questions
        this.loadQuestionsAndStartExam(paper, classObj, subject, topic);
    },

    /**
     * Load questions from preloaded JSON data and start exam
     */
    loadQuestionsAndStartExam: function(paper, classObj, subject, topic) {
        try {
            // Try to get preloaded questions from JSON file
            let questions = null;
            if (window.questionLoader && window.questionLoader.isPreloaded && paper.jsonFile) {
                // Get questions directly from cache using the filename
                const questionData = window.questionLoader.cache[paper.jsonFile];
                if (questionData && questionData.questions) {
                    questions = questionData.questions;
                }
            }

            // If JSON questions not available, use hardcoded questions
            if (!questions) {
                if (paper.questionData && paper.questionData.length > 0) {
                    questions = paper.questionData;
                    console.log('Using hardcoded questions for paper:', paper.name);
                } else {
                    alert('This paper does not have questions available yet. Please select another paper.');
                    return;
                }
            } else {
                console.log('Using preloaded JSON questions for paper:', paper.name);
            }

            // Initialize exam state
            this.currentPaper = {
                ...paper,
                questionData: questions
            };
            this.currentQuestionIndex = 0;
            this.userAnswers = {};
            this.startTime = new Date();
            this.timeLimit = paper.duration * 60; // Convert minutes to seconds

            // Store exam details for display
            this.examDetails = {
                className: classObj.name,
                subjectName: subject.name,
                topicName: topic.name,
                paperName: paper.name,
                duration: paper.duration,
                questions: questions.length
            };

            // Create and show exam interface
            this.createAndShowExamInterface();

        } catch (error) {
            console.error('Error loading questions:', error);
            alert('Error loading questions. Please try again.');
        }
    },

    /**
     * Create and show the exam interface based on template structure
     */
    createAndShowExamInterface: function() {
        // Hide the main container
        const mainContainer = document.querySelector('.container');
        if (mainContainer) {
            mainContainer.style.display = 'none';
        }

        // Hide footer
        const footer = document.querySelector('.homecopyright');
        if (footer) {
            footer.style.display = 'none';
        }

        // Hide logo
        const logo = document.querySelector('.logo-container');
        if (logo) {
            logo.style.display = 'none';
        }

        // Create the exam interface based on template structure
        const examHTML = `
            <div class="newcolornav fixed-top">
                <div class="newcolornav_left">
                    <h1>RAMAKRISHNA MISSION EXAMINATION</h1>
                </div>
                <div class="newcolornav_right">
                    <h4><i class="fas fa-calendar-alt fa-lg"></i> <span id="examDate"></span></h4>
                </div>
                <div style="clear:both;"></div>
            </div>
            <div style="clear:both; height:70px;"></div>
            <div class="col-md-12">
                <div class="row">
                    <div class="col-md-3">
                        <div class="student_info">
                            <h1>
                                <i class="fas fa-user-graduate fa-lg"></i> Hi Student<br>
                            </h1>
                        </div>
                        <div class="student_attemptbg">
                            <h1 id="examAttemptInfo">You are attempting: Loading...</h1>
                        </div>
                        <div style="clear:both; height:25px;"></div>
                        <div class="student_info">
                            <h1><strong>EXAMINATION INFORMATION</strong></h1>
                        </div>
                        <div class="exam_infobg2">
                            <table width="100%" border="0" cellspacing="0" cellpadding="0">
                              <tr>
                                <td width="33%" align="center">Max.<br>Marks</td>
                                <td width="33%" align="center">No. of Questions</td>
                                <td align="center">Exam<br>Time</td>
                              </tr>
                              <tr>
                                <td><span class="smart_hr"></span></td>
                                <td><span class="smart_hr"></span></td>
                                <td><span class="smart_hr"></span></td>
                              </tr>
                              <tr>
                                <td align="center" class="maxValue" id="maxMarks">0</td>
                                <td align="center" id="totalQuestions">0</td>
                                <td align="center" id="examDuration">0 Min.</td>
                              </tr>
                            </table>
                        </div>

                        <div style="clear:both; height:25px;"></div>
                        <div class="student_info">
                            <h1>
                                <i class="fas fa-spinner fa-pulse"></i> TIME LEFT :<br>
                            </h1>
                        </div>
                        <div class="student_attemptbg" style="background:#c10f0f;">
                            <h1><center><span style="color:#FFF; font-family:'Orbitron'; font-size:30px;" id="clock">00:00:00</span></center></h1>
                        </div>

                        <div style="clear:both; height:25px;"></div>
                    </div>
                    <div class="col-md-9">
                        <div class="exam_infobg">
                            <h1><strong>QUESTION PAPER</strong></h1>
                        </div>
                        <div class="qpaperblock" style="height:580px; overflow-y: auto;">
                            <form method="post" id="examForm" enctype="multipart/form-data">
                                <div id="questionsContainer">
                                    <!-- Questions will be loaded here -->
                                </div>
                                <center><input type="button" id="submitExam" class="btn btn-success" value="SUBMIT PAPER"></center>
                            </form>
                        </div>
                        <div style="clear:both; height:100px;"></div>
                    </div>
                </div>
            </div>
            <footer class="fixed-bottom">
                <div class="footerbg">
                    <div class="footerbg_left">
                        <h4>&copy; 2025 Ramakrishna Mission Home of Service, Luxa, Varanasi, Uttar Pradesh | All Rights Reserved</h4>
                    </div>
                    <div style="clear:both;"></div>
                </div>
            </footer>
        `;

        // Store original body content if not already stored
        if (!this.originalBodyContent) {
            this.originalBodyContent = document.body.innerHTML;
        }

        // Replace body content with exam interface
        document.body.innerHTML = examHTML;

        // Initialize exam interface
        this.initializeExamInterface();
    },

    /**
     * Initialize the exam interface with data and event listeners
     */
    initializeExamInterface: function() {
        // Set current date
        document.getElementById('examDate').textContent = this.formatDate();

        // Set exam attempt info
        document.getElementById('examAttemptInfo').textContent =
            `You are attempting: ${this.examDetails.className} > ${this.examDetails.subjectName} > ${this.examDetails.topicName} > ${this.examDetails.paperName}`;

        // Set exam information
        document.getElementById('maxMarks').textContent = this.examDetails.questions;
        document.getElementById('totalQuestions').textContent = this.examDetails.questions;
        document.getElementById('examDuration').textContent = `${this.examDetails.duration} Min.`;

        // Load all questions
        this.loadAllQuestions();

        // Start timer
        this.startTimer();

        // Add submit button event listener
        document.getElementById('submitExam').addEventListener('click', () => {
            this.submitExam();
        });
    },

    /**
     * Load all questions into the interface
     */
    loadAllQuestions: function() {
        const questionsContainer = document.getElementById('questionsContainer');
        let questionsHTML = '';

        this.currentPaper.questionData.forEach((question, index) => {
            questionsHTML += `
                <div class="qblock">
                    <table width="100%" border="0" cellspacing="0" cellpadding="0">
                        <tr>
                            <td width="50%">
                                <strong style="color:#3b4354;">Question: (${index + 1}) - <i style="color:#CCC;">[MCQ Type]</i></strong>
                            </td>
                            <td width="50%" align="right"><span class="qblock_marks">Marks: 1</span></td>
                        </tr>
                        <tr>
                            <td colspan="2"><span class="qblock_qblock">${question.question}</span></td>
                        </tr>
                        <tr>
                            <td>&nbsp;</td>
                            <td>&nbsp;</td>
                        </tr>
                        <tr>
                            <td><strong style="color:#39C;">Answer:</strong></td>
                            <td>&nbsp;</td>
                        </tr>
                        <tr>
                            <td><div class="qblock_anslock">
                                <input name="mcq_${question.id}" type="radio" value="0">
                                ${question.options[0]}
                            </div></td>
                            <td><div class="qblock_anslock">
                                <input name="mcq_${question.id}" type="radio" value="1">
                                ${question.options[1]}
                            </div></td>
                        </tr>
                        <tr>
                            <td><div class="qblock_anslock">
                                <input name="mcq_${question.id}" type="radio" value="2">
                                ${question.options[2]}
                            </div></td>
                            <td><div class="qblock_anslock">
                                <input name="mcq_${question.id}" type="radio" value="3">
                                ${question.options[3]}
                            </div></td>
                        </tr>
                    </table>
                </div>
            `;
        });

        questionsContainer.innerHTML = questionsHTML;

        // Add change event listeners to save answers
        questionsContainer.addEventListener('change', (e) => {
            if (e.target.type === 'radio') {
                const questionId = e.target.name.replace('mcq_', '');
                this.userAnswers[questionId] = parseInt(e.target.value);
            }
        });
    },

    /**
     * Start the exam timer
     */
    startTimer: function() {
        const endTime = new Date(this.startTime.getTime() + this.timeLimit * 1000);

        this.timerInterval = setInterval(() => {
            const now = new Date();
            const remaining = Math.max(0, Math.floor((endTime - now) / 1000));

            const hours = Math.floor(remaining / 3600);
            const minutes = Math.floor((remaining % 3600) / 60);
            const seconds = remaining % 60;

            document.getElementById('clock').textContent =
                `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

            if (remaining <= 0) {
                alert('Your time is up!');
                this.submitExam();
            }
        }, 1000);
    },

    /**
     * Submit the exam and show results
     */
    submitExam: function() {
        clearInterval(this.timerInterval);

        // Calculate results
        const results = this.calculateResults();

        // Show results page instead of alert
        this.showResultsPage(results);
    },

    /**
     * Calculate exam results
     */
    calculateResults: function() {
        let correct = 0;
        const totalQuestions = this.currentPaper.questionData.length;
        const detailedResults = [];

        this.currentPaper.questionData.forEach((question, index) => {
            const userAnswer = this.userAnswers[question.id];
            const isCorrect = userAnswer !== undefined && userAnswer === question.correct;

            if (isCorrect) {
                correct++;
            }

            detailedResults.push({
                questionNumber: index + 1,
                question: question.question,
                userAnswer: userAnswer,
                correctAnswer: question.correct,
                options: question.options,
                isCorrect: isCorrect,
                explanation: question.explanation || ''
            });
        });

        const percentage = Math.round((correct / totalQuestions) * 100);
        const timeTaken = Math.floor((new Date() - this.startTime) / 1000);

        return {
            correct: correct,
            total: totalQuestions,
            percentage: percentage,
            timeTaken: timeTaken,
            details: detailedResults
        };
    },

    /**
     * Show results page in the format similar to answers.html
     */
    showResultsPage: function(results) {
        // Format time taken
        const hours = Math.floor(results.timeTaken / 3600);
        const minutes = Math.floor((results.timeTaken % 3600) / 60);
        const seconds = results.timeTaken % 60;
        const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

        // Generate questions HTML with results
        let questionsHTML = '';

        results.details.forEach((result) => {
            const userAnswerText = result.userAnswer !== undefined ? result.options[result.userAnswer] : 'Not answered';
            const correctAnswerText = result.options[result.correctAnswer];

            // Determine status styling
            const statusClass = result.isCorrect ? 'border-success' : 'border-danger';
            const statusIcon = result.isCorrect ? 'ok-right.png' : 'wrong-icon.png';
            const statusText = result.isCorrect ? 'Right Answer' : 'Wrong Answer';

            questionsHTML += `
                <div class="qblock">
                    <table width="100%" border="0" cellspacing="0" cellpadding="0">
                        <tr>
                            <td width="50%">
                                <strong style="color:#3b4354;">Question: (${result.questionNumber}) - <i style="color:#CCC;">[MCQ Type]</i></strong>
                            </td>
                            <td width="50%" align="right"><span class="qblock_marks">Marks: 1</span></td>
                        </tr>
                        <tr>
                            <td colspan="2"><span class="qblock_qblock">${result.question}</span></td>
                        </tr>
                        <tr>
                            <td>&nbsp;</td>
                            <td>&nbsp;</td>
                        </tr>
                        <tr>
                            <td><strong style="color:#39C;">Answer:</strong></td>
                            <td>&nbsp;</td>
                        </tr>
                        <tr>
                            <td><div class="qblock_anslock">
                                <input name="mcq_${result.questionNumber}" type="radio" value="0" ${result.userAnswer === 0 ? 'checked="checked"' : ''} disabled>
                                ${result.options[0]}
                            </div></td>
                            <td><div class="qblock_anslock">
                                <input name="mcq_${result.questionNumber}" type="radio" value="1" ${result.userAnswer === 1 ? 'checked="checked"' : ''} disabled>
                                ${result.options[1]}
                            </div></td>
                        </tr>
                        <tr>
                            <td><div class="qblock_anslock">
                                <input name="mcq_${result.questionNumber}" type="radio" value="2" ${result.userAnswer === 2 ? 'checked="checked"' : ''} disabled>
                                ${result.options[2]}
                            </div></td>
                            <td><div class="qblock_anslock">
                                <input name="mcq_${result.questionNumber}" type="radio" value="3" ${result.userAnswer === 3 ? 'checked="checked"' : ''} disabled>
                                ${result.options[3]}
                            </div></td>
                        </tr>
                        <tr>
                            <td>
                                <div class="card ${statusClass}" style="display:inline-block !important; padding:4px 7px; border:#aecda2 1px solid;">
                                    <i class="fas ${result.isCorrect ? 'fa-check-circle' : 'fa-times-circle'}" style="color: ${result.isCorrect ? '#28a745' : '#dc3545'}; margin-right: 5px;"></i>${statusText}
                                </div>
                            </td>
                            <td align="right">
                                <div class="card border-info" style="display:inline-block !important; padding:4px 7px; border:#9bc6db 1px solid; margin-right:10px;">
                                    Answer: ${correctAnswerText}
                                </div>
                            </td>
                        </tr>
                        ${result.explanation ? `
                        <tr>
                            <td colspan="2">
                                <div class="card border-warning" style="margin-top: 10px; padding: 8px; background-color: #fff3cd; border: 1px solid #ffeaa7;">
                                    <strong style="color: #856404;"><i class="fas fa-lightbulb" style="margin-right: 5px;"></i>Explanation:</strong>
                                    <div style="color: #856404; margin-top: 5px; font-size: 14px; line-height: 1.4;">
                                        ${result.explanation}
                                    </div>
                                </div>
                            </td>
                        </tr>
                        ` : ''}
                    </table>
                </div>
            `;
        });

        // Create the results page HTML
        const resultsHTML = `
            <div class="newcolornav fixed-top">
                <div class="newcolornav_left">
                    <h1>RAMAKRISHNA MISSION EXAMINATION</h1>
                </div>
                <div class="newcolornav_right">
                    <h4><i class="fas fa-calendar-alt fa-lg"></i> ${this.formatDate()}</h4>
                </div>
                <div style="clear:both;"></div>
            </div>
            <div style="clear:both; height:70px;"></div>
            <div class="col-md-12">
                <div class="row">
                    <div class="col-md-3">
                        <div class="student_info">
                            <h1>
                                <i class="fas fa-user-graduate fa-lg"></i> Hi Student<br>
                            </h1>
                        </div>
                        <div class="student_attemptbg">
                            <h1>You attempted: ${this.examDetails.className} > ${this.examDetails.subjectName} > ${this.examDetails.topicName} > ${this.examDetails.paperName}</h1>
                        </div>
                        <div style="clear:both; height:25px;"></div>
                        <div class="student_info">
                            <h1><strong>EXAMINATION INFORMATION</strong></h1>
                        </div>
                        <div class="exam_infobg2">
                            <table width="100%" border="0" cellspacing="0" cellpadding="0">
                                <tr>
                                    <td width="33%" align="center">Max.<br>Marks</td>
                                    <td width="33%" align="center">No. of Questions</td>
                                    <td align="center">Exam<br>Time</td>
                                </tr>
                                <tr>
                                    <td><span class="smart_hr"></span></td>
                                    <td><span class="smart_hr"></span></td>
                                    <td><span class="smart_hr"></span></td>
                                </tr>
                                <tr>
                                    <td align="center" class="maxValue">${results.total}</td>
                                    <td align="center">${results.total}</td>
                                    <td align="center">${this.examDetails.duration} Min.</td>
                                </tr>
                            </table>
                        </div>

                        <div style="clear:both; height:25px;"></div>
                        <div class="student_info">
                            <h1>
                                <i class="fas fa-clock-o"></i> TIME TAKEN :<br>
                            </h1>
                        </div>
                        <div class="student_attemptbg">
                            <h1><center><span style="color:#FFF; font-family:'Orbitron'; font-size:30px;" class="timeTaken">${formattedTime}</span></center></h1>
                        </div>

                        <div style="clear:both; height:25px;"></div>
                        <div class="student_info" style="background: ${results.percentage >= 60 ? '#28a745' : '#dc3545'};">
                            <h1>
                                <i class="fas fa-chart-bar"></i> YOUR SCORE:<br>
                                <span style="font-size: 24px;">${results.correct}/${results.total} (${results.percentage}%)</span>
                            </h1>
                        </div>

                        <div style="clear:both; height:25px;"></div>
                        <center>
                            <button class="btn btn-primary btn-sm" onclick="window.print();"><i class="fas fa-print fa-lg"></i> Print Results</button>
                            <button class="btn btn-success btn-sm" onclick="window.examInterface.goBackToHome();"><i class="fas fa-home fa-lg"></i> Back to Home</button>
                        </center>
                        <div style="clear:both; height:30px;"></div>
                    </div>
                    <div class="col-md-9">
                        <div class="exam_infobg">
                            <h1><strong>CHECK ANSWER SHEET</strong></h1>
                        </div>
                        <div class="qpaperblock" style="height: auto; max-height: 600px; overflow-y: auto;">
                            <form id="printMe">
                                <div class="qblock">
                                    <table width="100%" border="0" cellspacing="0" cellpadding="0">
                                        <tr>
                                            <td width="50%"><strong style="color:#3b4354; font-size:13px;">Attempted: ${this.examDetails.className} > ${this.examDetails.subjectName} > ${this.examDetails.topicName} > ${this.examDetails.paperName}</strong></td>
                                            <td width="50%" align="right"><span style="color:#3b4354; font-size:13px;">Date: ${this.formatDate()}</span></td>
                                        </tr>
                                    </table>
                                </div>
                                ${questionsHTML}
                            </form>
                        </div>
                        <div style="clear:both; height:100px;"></div>
                    </div>
                </div>
            </div>
            <footer class="fixed-bottom">
                <div class="footerbg">
                    <div class="footerbg_left">
                        <h4>&copy; 2025 Ramakrishna Mission Home of Service, Luxa, Varanasi, Uttar Pradesh | All Rights Reserved</h4>
                    </div>
                    <div style="clear:both;"></div>
                </div>
            </footer>
        `;

        // Store original body content if not already stored
        if (!this.originalBodyContent) {
            this.originalBodyContent = document.body.innerHTML;
        }

        // Replace body content with results page
        document.body.innerHTML = resultsHTML;
    },

    /**
     * Go back to home without page reload
     */
    goBackToHome: function() {
        // Clear any running timer
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }

        // Reset exam state
        this.currentPaper = null;
        this.currentQuestionIndex = 0;
        this.userAnswers = {};
        this.startTime = null;
        this.timeLimit = 0;
        this.examDetails = {};

        // Restore original body content
        if (this.originalBodyContent) {
            console.log('📄 Restoring original content. Length:', this.originalBodyContent.length);
            document.body.innerHTML = this.originalBodyContent;
            console.log('✅ Restored home page without network request');

            // Re-run any necessary initialization after content restoration
            setTimeout(() => {
                try {
                    // Re-initialize dropdown data
                    if (typeof loadClasses === 'function') {
                        loadClasses();
                        console.log('🔄 Re-initialized dropdown data');
                    }

                    // Re-bind event listeners
                    if (typeof window.bindEventListeners === 'function') {
                        window.bindEventListeners();
                        console.log('� Re-bound event listeners');
                    }
                } catch (error) {
                    console.warn('Could not re-initialize after content restoration:', error);
                }
            }, 100);
        } else {
            // Fallback to page reload if original content not stored
            console.warn('Original content not stored, falling back to page reload');
            location.reload();
        }
    },

    /**
     * Format current date
     */
    formatDate: function() {
        const d = new Date();
        const months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
        const days = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
        return `${days[d.getDay()]}, ${months[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
    }
};
