/**
 * JSON-Based Exam System Loader
 * This module handles loading the entire exam structure and questions from JSON files
 * Educators can manage everything through JSON files without touching JavaScript
 */

window.examDataLoader = {
    structureCache: null,
    questionCache: {},
    isStructureLoaded: false,
    isQuestionsPreloaded: false,
    preloadPromise: null,

    /**
     * Load the exam structure from JSON
     * @returns {Promise} - Promise that resolves to exam structure
     */
    loadExamStructure: async function() {
        if (this.structureCache) {
            return this.structureCache;
        }

        try {
            console.log('Loading exam structure from JSON...');
            const response = await fetch('data/exam-structure.json');
            if (!response.ok) {
                throw new Error(`Failed to load exam structure: ${response.status}`);
            }

            const structureData = await response.json();

            if (structureData && structureData.classes && Array.isArray(structureData.classes)) {
                this.structureCache = structureData;
                this.isStructureLoaded = true;
                console.log(`✅ Loaded exam structure: ${structureData.classes.length} classes`);

                // Collect JSON files for preloading
                this.jsonFiles = this.collectJSONFiles(structureData);

                return structureData;
            } else {
                throw new Error('Invalid exam structure JSON format');
            }
        } catch (error) {
            console.error('Error loading exam structure:', error);
            throw error;
        }
    },

    /**
     * Collect all JSON files that need to be preloaded
     * @param {Object} structureData - The exam structure data
     */
    collectJSONFiles: function(structureData) {
        const jsonFiles = [];

        structureData.classes.forEach(classObj => {
            classObj.subjects.forEach(subject => {
                subject.topics.forEach(topic => {
                    topic.papers.forEach(paper => {
                        if (paper.jsonFile && !jsonFiles.includes(paper.jsonFile)) {
                            jsonFiles.push(paper.jsonFile);
                        }
                    });
                });
            });
        });

        console.log(`📋 Found ${jsonFiles.length} JSON files to preload`);
        return jsonFiles;
    },

    /**
     * Preload question files
     * @param {Array} jsonFiles - Array of JSON filenames to preload
     */
    preloadQuestionFiles: async function(jsonFiles) {
        const promises = jsonFiles.map(filename =>
            window.questionLoader.loadQuestionsFromJSON(filename)
        );
        await Promise.all(promises);
        console.log(`✅ Preloaded ${jsonFiles.length} question files`);
    },

    /**
     * Get exam structure in the format expected by the existing system
     * @returns {Object} - Exam data in legacy format
     */
    getExamDataForLegacySystem: function() {
        if (!this.structureCache) {
            console.warn('Exam structure not loaded yet');
            return { classes: [] };
        }

        // Convert JSON structure to the format expected by existing code
        const examData = {
            classes: this.structureCache.classes.map(classObj => ({
                ...classObj,
                subjects: classObj.subjects.map(subject => ({
                    ...subject,
                    topics: subject.topics.map(topic => ({
                        ...topic,
                        papers: topic.papers.map(paper => {
                            // Simply return the paper as-is now that IDs are removed
                            return paper;
                        })
                    }))
                }))
            }))
        };

        return examData;
    },

    /**
     * Initialize the exam system with JSON-based data
     * @returns {Promise} - Promise that resolves when system is ready
     */
    initializeExamSystem: async function() {
        try {
            // Load exam structure
            await this.loadExamStructure();

            // Expose the exam structure for easy access
            this.examStructure = this.structureCache;

            // Preload questions if question loader is available
            if (window.questionLoader && this.jsonFiles) {
                await this.preloadQuestionFiles(this.jsonFiles);
                this.isQuestionsPreloaded = true;
                // Update our question cache reference
                this.questionCache = window.questionLoader.cache || {};
                // Set the question loader's preloaded flag
                window.questionLoader.isPreloaded = true;
            }

            // Set up the global examData object for backward compatibility
            window.examData = this.getExamDataForLegacySystem();

            // Add legacy methods for backward compatibility
            window.examData.getClassById = function(classId) {
                return this.classes.find(c => c.id === classId);
            };

            console.log('🎉 JSON-based exam system initialized successfully!');
            return true;
        } catch (error) {
            console.error('Failed to initialize exam system:', error);
            throw error;
        }
    },

    /**
     * Get statistics about the loaded exam system
     * @returns {Object} - Statistics object
     */
    getSystemStats: function() {
        if (!this.structureCache) {
            return { error: 'Structure not loaded' };
        }

        let totalSubjects = 0;
        let totalTopics = 0;
        let totalPapers = 0;
        let availablePapers = 0;
        let comingSoonPapers = 0;

        this.structureCache.classes.forEach(classObj => {
            totalSubjects += classObj.subjects.length;
            classObj.subjects.forEach(subject => {
                totalTopics += subject.topics.length;
                subject.topics.forEach(topic => {
                    totalPapers += topic.papers.length;
                    topic.papers.forEach(paper => {
                        if (paper.jsonFile) {
                            availablePapers++;
                        } else if (paper.status === 'coming_soon') {
                            comingSoonPapers++;
                        } else if (paper.hasHardcodedQuestions) {
                            availablePapers++;
                        }
                    });
                });
            });
        });

        return {
            classes: this.structureCache.classes.length,
            subjects: totalSubjects,
            topics: totalTopics,
            totalPapers,
            availablePapers,
            comingSoonPapers,
            structureLoaded: this.isStructureLoaded,
            questionsPreloaded: this.isQuestionsPreloaded
        };
    },

    /**
     * Add a new class to the exam structure (for future use)
     * @param {Object} classData - Class data to add
     */
    addClass: function(classData) {
        if (this.structureCache) {
            this.structureCache.classes.push(classData);
            // Update the global examData
            window.examData = this.getExamDataForLegacySystem();
        }
    },

    /**
     * Get all papers that have JSON files available
     * @returns {Array} - Array of paper objects with JSON files
     */
    getAvailablePapers: function() {
        if (!this.structureCache) return [];

        const availablePapers = [];
        this.structureCache.classes.forEach((classObj, classIndex) => {
            classObj.subjects.forEach((subject, subjectIndex) => {
                subject.topics.forEach((topic, topicIndex) => {
                    topic.papers.forEach((paper, paperIndex) => {
                        if (paper.jsonFile || paper.hasHardcodedQuestions) {
                            availablePapers.push({
                                ...paper,
                                className: classObj.name,
                                subjectName: subject.name,
                                topicName: topic.name,
                                classIndex,
                                subjectIndex,
                                topicIndex,
                                paperIndex
                            });
                        }
                    });
                });
            });
        });

        return availablePapers;
    }
};
