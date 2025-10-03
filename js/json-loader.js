/**
 * JSON Question Loader - Loads questions from JSON files
 * This module handles loading and caching of question data from JSON files
 */

window.questionLoader = {
    cache: {},
    isPreloaded: false,
    preloadPromise: null,

    // Map paper IDs to JSON filenames
    paperToFileMap: {
        'reflection_laws_test1': 'class_10_physics_reflection_laws_test1.json',
        'spherical_mirrors_test1': 'class_10_physics_spherical_mirrors_test1.json',
        'acid_base_properties_test1': 'class_10_chemistry_acid_base_properties_test1.json'
    },

    /**
     * Load questions from a JSON file
     * @param {string} filename - The JSON filename to load
     * @returns {Promise} - Promise that resolves to question data
     */
    loadQuestionsFromJSON: async function(filename) {
        if (this.cache[filename]) {
            return this.cache[filename];
        }

        try {
            const response = await fetch(`data/questions/${filename}`);
            if (!response.ok) {
                throw new Error(`Failed to load ${filename}: ${response.status}`);
            }

            const jsonData = await response.json();

            if (jsonData && jsonData.questions && Array.isArray(jsonData.questions)) {
                // Automatically assign IDs to questions based on array index (1-based)
                jsonData.questions.forEach((question, index) => {
                    if (!question.id) {
                        question.id = index + 1;
                    }
                });

                this.cache[filename] = jsonData;
                return jsonData;
            } else {
                throw new Error(`Invalid JSON structure in ${filename}: missing questions array`);
            }
        } catch (error) {
            console.error('Error loading JSON file:', error);
            return null;
        }
    },

    /**
     * Preload all JSON question files
     * @returns {Promise} - Promise that resolves when all files are loaded
     */
    preloadAllQuestions: async function() {
        if (this.preloadPromise) {
            return this.preloadPromise;
        }

        this.preloadPromise = (async () => {
            console.log('Preloading all JSON question files...');
            const loadPromises = [];

            // Load all JSON files in parallel
            for (const filename of Object.values(this.paperToFileMap)) {
                loadPromises.push(this.loadQuestionsFromJSON(filename));
            }

            try {
                const results = await Promise.all(loadPromises);
                const successCount = results.filter(result => result !== null).length;

                this.isPreloaded = true;
                console.log(`Successfully preloaded ${successCount}/${results.length} JSON question files`);

                // Log which files were loaded
                Object.entries(this.paperToFileMap).forEach(([paperId, filename]) => {
                    if (this.cache[filename]) {
                        const questionCount = this.cache[filename].questions.length;
                        console.log(`✓ ${paperId}: ${questionCount} questions loaded from ${filename}`);
                    } else {
                        console.warn(`✗ ${paperId}: Failed to load ${filename}`);
                    }
                });

            } catch (error) {
                console.error('Error preloading JSON files:', error);
                // Don't throw the error, just log it - the system should work with hardcoded questions
            }
        })();

        return this.preloadPromise;
    },

    /**
     * Get question data for a specific paper (synchronous after preloading)
     * @param {string} paperId - The paper ID to load questions for
     * @returns {Array|null} - Question array or null if not found
     */
    getQuestionsForPaper: function(paperId) {
        const filename = this.paperToFileMap[paperId];
        if (!filename) {
            console.warn(`No JSON file found for paper: ${paperId}`);
            return null;
        }

        const data = this.cache[filename];
        if (data && data.questions && Array.isArray(data.questions)) {
            // Ensure all questions have IDs (in case they were added without IDs)
            const questions = data.questions.map((question, index) => ({
                ...question,
                id: question.id || (index + 1)
            }));
            return questions;
        }

        console.warn(`No questions found for paper: ${paperId} in file: ${filename}`);
        return null;
    },

    /**
     * Get question data for a specific paper (async version for backward compatibility)
     * @param {string} paperId - The paper ID to load questions for
     * @returns {Promise} - Promise that resolves to question array
     */
    getQuestionsForPaperAsync: async function(paperId) {
        // If not preloaded, wait for preloading to complete
        if (!this.isPreloaded && this.preloadPromise) {
            await this.preloadPromise;
        }

        return this.getQuestionsForPaper(paperId);
    },

    /**
     * Get paper info for a specific paper
     * @param {string} paperId - The paper ID to get info for
     * @returns {Object|null} - Paper info object or null if not found
     */
    getPaperInfo: function(paperId) {
        const filename = this.paperToFileMap[paperId];
        if (!filename) {
            return null;
        }

        const data = this.cache[filename];
        return data ? data.paper_info : null;
    },

    /**
     * Get all available paper IDs
     * @returns {Array} - Array of paper IDs
     */
    getAvailablePaperIds: function() {
        return Object.keys(this.paperToFileMap);
    },

    /**
     * Check if a paper has been loaded
     * @param {string} paperId - The paper ID to check
     * @returns {boolean} - True if loaded, false otherwise
     */
    isPaperLoaded: function(paperId) {
        const filename = this.paperToFileMap[paperId];
        return filename && this.cache[filename] !== undefined;
    },

    /**
     * Get cache statistics
     * @returns {Object} - Statistics about loaded files
     */
    getCacheStats: function() {
        const totalFiles = Object.keys(this.paperToFileMap).length;
        const loadedFiles = Object.keys(this.cache).length;
        const totalQuestions = Object.values(this.cache).reduce((sum, data) => {
            return sum + (data && data.questions ? data.questions.length : 0);
        }, 0);

        return {
            totalFiles,
            loadedFiles,
            totalQuestions,
            isPreloaded: this.isPreloaded,
            loadedPapers: Object.keys(this.paperToFileMap).filter(paperId => this.isPaperLoaded(paperId))
        };
    }
};
