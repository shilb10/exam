/**
 * Embedded Exam Data - Offline Version
 * All exam structure and questions embedded to prevent CORS issues
 * This allows the system to work by simply opening index.html
 */

window.examData = {
    // Embedded exam structure
    structure: {
        "classes": [
            {
                "name": "Class 10",
                "subjects": [
                    {
                        "name": "Physics (Board)",
                        "topics": [
                            {
                                "name": "Light - Reflection and Refraction",
                                "papers": [
                                    {
                                        "name": "Laws of Reflection - Test 1",
                                        "duration": 50,
                                        "questions": 4,
                                        "jsonFile": "class_10_physics_reflection_laws_test1.json"
                                    },
                                    {
                                        "name": "Spherical Mirrors - Test 1",
                                        "duration": 45,
                                        "questions": 4,
                                        "jsonFile": "class_10_physics_spherical_mirrors_test1.json"
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        "name": "Chemistry (Board)",
                        "topics": [
                            {
                                "name": "Acids, Bases and Salts",
                                "papers": [
                                    {
                                        "name": "Acid and Base Properties - Test 1",
                                        "duration": 55,
                                        "questions": 4,
                                        "jsonFile": "class_10_chemistry_acid_base_properties_test1.json"
                                    }
                                ]
                            }
                        ]
                    }
                ]
            },
            {
                "name": "Class 06",
                "subjects": [
                    {
                        "name": "Elementary Mathematics",
                        "topics": [
                            {
                                "name": "Numbers and Operations",
                                "papers": [
                                    {
                                        "name": "Basic Numbers - Test 1",
                                        "duration": 30,
                                        "questions": 2,
                                        "jsonFile": "class_06_math_numbers_basic_test1.json"
                                    }
                                ]
                            }
                        ]
                    }
                ]
            },
            {
                "name": "Class 12",
                "subjects": [
                    {
                        "name": "Mathematics (Advanced)",
                        "topics": [
                            {
                                "name": "Calculus",
                                "papers": [
                                    {
                                        "name": "Calculus Fundamentals - Test 1",
                                        "duration": 60,
                                        "questions": 7,
                                        "jsonFile": "class_12_mathematics_calculus_test1.json"
                                    }
                                ]
                            }
                        ]
                    }
                ]
            },
            {
                "name": "General Knowledge & Aptitude",
                "subjects": [
                    {
                        "name": "General Knowledge",
                        "topics": [
                            {
                                "name": "Indian History",
                                "papers": [
                                    {
                                        "name": "Ancient India - Test 1",
                                        "duration": 45,
                                        "questions": 4,
                                        "jsonFile": "general_history_ancient_india_test1.json"
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }
        ]
    },

    // Embedded question data - no external file loading needed
    questions: {
        'class_10_physics_reflection_laws_test1.json': {
            "paper_info": {
                "name": "Laws of Reflection - Test 1",
                "subject": "Physics (Board)",
                "topic": "Light - Reflection and Refraction",
                "class": "Class 10"
            },
            "questions": [
                {
                    "type": "multiple_choice",
                    "question": "The first law of reflection states that:",
                    "options": [
                        "The incident ray, reflected ray and normal all lie in the same plane",
                        "The angle of incidence equals the angle of reflection",
                        "Light travels in straight lines",
                        "Light can be refracted"
                    ],
                    "correct": 0,
                    "explanation": "The first law of reflection states that the incident ray, reflected ray and normal all lie in the same plane"
                },
                {
                    "type": "multiple_choice",
                    "question": "If the angle of incidence is 30°, what is the angle of reflection?",
                    "options": [
                        "15°",
                        "30°",
                        "60°",
                        "90°"
                    ],
                    "correct": 1,
                    "explanation": "According to the second law of reflection, the angle of incidence equals the angle of reflection, so both are 30°"
                },
                {
                    "type": "multiple_choice",
                    "question": "A ray of light strikes a plane mirror at an angle of 45° to the normal. The angle between the incident ray and reflected ray is:",
                    "options": [
                        "45°",
                        "90°",
                        "135°",
                        "180°"
                    ],
                    "correct": 1,
                    "explanation": "When the angle of incidence is 45°, the angle of reflection is also 45°. The angle between incident and reflected rays is 45° + 45° = 90°"
                },
                {
                    "type": "multiple_choice",
                    "question": "Which type of reflection occurs from a rough surface?",
                    "options": [
                        "Regular reflection",
                        "Irregular reflection",
                        "Total internal reflection",
                        "Partial reflection"
                    ],
                    "correct": 1,
                    "explanation": "Irregular reflection (also called diffuse reflection) occurs when light rays fall on a rough surface and scatter in different directions"
                }
            ]
        },

        'class_10_physics_spherical_mirrors_test1.json': {
            "paper_info": {
                "name": "Spherical Mirrors - Test 1",
                "subject": "Physics (Board)",
                "topic": "Light - Reflection and Refraction",
                "class": "Class 10"
            },
            "questions": [
                {
                    "type": "multiple_choice",
                    "question": "A concave mirror has a focal length of 20 cm. Where should an object be placed to get a real image at the same distance?",
                    "options": [
                        "At 10 cm",
                        "At 20 cm",
                        "At 40 cm",
                        "At infinity"
                    ],
                    "correct": 2,
                    "explanation": "For a real image at the same distance as the object, the object should be placed at the center of curvature ($2f = 40$ cm)"
                },
                {
                    "type": "multiple_choice",
                    "question": "The magnification produced by a plane mirror is:",
                    "options": [
                        "+1",
                        "-1",
                        "0",
                        "∞"
                    ],
                    "correct": 0,
                    "explanation": "A plane mirror produces an image of the same size as the object, so magnification = +1 (positive indicates erect image)"
                },
                {
                    "type": "multiple_choice",
                    "question": "Which mirror is used in car headlights?",
                    "options": [
                        "Plane mirror",
                        "Concave mirror",
                        "Convex mirror",
                        "Cylindrical mirror"
                    ],
                    "correct": 1,
                    "explanation": "Concave mirrors are used in car headlights because they can produce a parallel beam of light when the source is placed at the focus"
                },
                {
                    "type": "multiple_choice",
                    "question": "A convex mirror always forms an image that is:",
                    "options": [
                        "Real and inverted",
                        "Real and erect",
                        "Virtual and inverted",
                        "Virtual and erect"
                    ],
                    "correct": 3,
                    "explanation": "A convex mirror always forms a virtual, erect, and diminished image regardless of the object position"
                }
            ]
        },

        'class_10_chemistry_acid_base_properties_test1.json': {
            "paper_info": {
                "name": "Acid and Base Properties - Test 1",
                "subject": "Chemistry (Board)",
                "topic": "Acids, Bases and Salts",
                "class": "Class 10"
            },
            "questions": [
                {
                    "type": "multiple_choice",
                    "question": "Which of the following is a characteristic of acids?",
                    "options": [
                        "Turn blue litmus red",
                        "Feel soapy to touch",
                        "Have pH greater than 7",
                        "Release OH⁻ ions in water"
                    ],
                    "correct": 0,
                    "explanation": "Acids turn blue litmus paper red. This is one of the characteristic properties of acids"
                },
                {
                    "type": "multiple_choice",
                    "question": "The pH of pure water at 25°C is:",
                    "options": [
                        "0",
                        "7",
                        "14",
                        "1"
                    ],
                    "correct": 1,
                    "explanation": "Pure water has a pH of 7 at 25°C, making it neutral (neither acidic nor basic)"
                },
                {
                    "type": "multiple_choice",
                    "question": "Which gas is evolved when zinc reacts with hydrochloric acid?",
                    "options": [
                        "Oxygen",
                        "Hydrogen",
                        "Carbon dioxide",
                        "Chlorine"
                    ],
                    "correct": 1,
                    "explanation": "When zinc reacts with hydrochloric acid, hydrogen gas is evolved: Zn + 2HCl → ZnCl₂ + H₂"
                },
                {
                    "type": "multiple_choice",
                    "question": "Milk of magnesia is:",
                    "options": [
                        "Acidic",
                        "Basic",
                        "Neutral",
                        "Amphoteric"
                    ],
                    "correct": 1,
                    "explanation": "Milk of magnesia [Mg(OH)₂] is basic in nature and is used as an antacid to neutralize excess stomach acid"
                }
            ]
        },

        'class_06_math_numbers_basic_test1.json': {
            "paper_info": {
                "name": "Basic Numbers - Test 1",
                "subject": "Elementary Mathematics",
                "topic": "Numbers and Operations",
                "class": "Class 06"
            },
            "questions": [
                {
                    "type": "multiple_choice",
                    "question": "What is the largest single-digit number?",
                    "options": [
                        "8",
                        "9",
                        "10",
                        "1"
                    ],
                    "correct": 1,
                    "explanation": "The largest single-digit number is 9, as single-digit numbers range from 0 to 9"
                },
                {
                    "type": "multiple_choice",
                    "question": "Which of the following is an even number?",
                    "options": [
                        "7",
                        "9",
                        "12",
                        "15"
                    ],
                    "correct": 2,
                    "explanation": "12 is an even number because it is divisible by 2 (12 ÷ 2 = 6)"
                }
            ]
        },

        'class_12_mathematics_calculus_test1.json': {
            "paper_info": {
                "name": "Calculus Fundamentals - Test 1",
                "subject": "Mathematics (Advanced)",
                "topic": "Calculus",
                "class": "Class 12"
            },
            "questions": [
                {
                    "type": "multiple_choice",
                    "question": "The derivative of $x^2$ with respect to $x$ is:",
                    "options": [
                        "$x$",
                        "$2x$",
                        "$x^2$",
                        "$2$"
                    ],
                    "correct": 1,
                    "explanation": "Using the power rule $\\frac{d}{dx}(x^n) = nx^{n-1}$, the derivative of $x^2$ is $2x^1 = 2x$"
                },
                {
                    "type": "multiple_choice",
                    "question": "$\\int 2x \\, dx =$",
                    "options": [
                        "$x^2 + C$",
                        "$2x^2 + C$",
                        "$\\frac{x^2}{2} + C$",
                        "$2x + C$"
                    ],
                    "correct": 0,
                    "explanation": "$\\int 2x \\, dx = 2\\int x \\, dx = 2\\left(\\frac{x^2}{2}\\right) + C = x^2 + C$"
                },
                {
                    "type": "multiple_choice",
                    "question": "The limit of $\\frac{\\sin x}{x}$ as $x$ approaches $0$ is:",
                    "options": [
                        "$0$",
                        "$1$",
                        "$\\infty$",
                        "Does not exist"
                    ],
                    "correct": 1,
                    "explanation": "This is a standard limit: $\\lim_{x \\to 0} \\frac{\\sin x}{x} = 1$"
                },
                {
                    "type": "multiple_choice",
                    "question": "If $f(x) = 3x^2 + 2x + 1$, then $f'(x) =$",
                    "options": [
                        "$6x + 2$",
                        "$3x + 2$",
                        "$6x + 1$",
                        "$3x^2 + 1$"
                    ],
                    "correct": 0,
                    "explanation": "$f'(x) = \\frac{d}{dx}(3x^2) + \\frac{d}{dx}(2x) + \\frac{d}{dx}(1) = 6x + 2 + 0 = 6x + 2$"
                },
                {
                    "type": "multiple_choice",
                    "question": "The area under the curve $y = 2$ from $x = 0$ to $x = 3$ is:",
                    "options": [
                        "$2$",
                        "$3$",
                        "$6$",
                        "$5$"
                    ],
                    "correct": 2,
                    "explanation": "Area = $\\int_0^3 2 \\, dx = 2x\\Big|_0^3 = 2(3) - 2(0) = 6$"
                },
                {
                    "type": "multiple_choice",
                    "question": "What is the value of $\\lim_{x \\to \\infty} \\frac{2x^2 + 3x + 1}{x^2 + 5}$?",
                    "options": [
                        "$0$",
                        "$1$",
                        "$2$",
                        "$\\infty$"
                    ],
                    "correct": 2,
                    "explanation": "Divide numerator and denominator by $x^2$: $\\lim_{x \\to \\infty} \\frac{2 + \\frac{3}{x} + \\frac{1}{x^2}}{1 + \\frac{5}{x^2}} = \\frac{2 + 0 + 0}{1 + 0} = 2$"
                },
                {
                    "type": "multiple_choice",
                    "question": "The solution to the differential equation $\\frac{dy}{dx} = ky$ is:",
                    "options": [
                        "$y = Ce^{kx}$",
                        "$y = Cx^k$",
                        "$y = C + kx$",
                        "$y = C\\ln(kx)$"
                    ],
                    "correct": 0,
                    "explanation": "This is a separable differential equation. Separating variables: $\\frac{dy}{y} = k \\, dx$. Integrating both sides: $\\ln|y| = kx + C_1$, so $y = Ce^{kx}$"
                }
            ]
        },

        'general_history_ancient_india_test1.json': {
            "paper_info": {
                "name": "Ancient India - Test 1",
                "subject": "General Knowledge",
                "topic": "Indian History",
                "class": "General Knowledge & Aptitude"
            },
            "questions": [
                {
                    "type": "multiple_choice",
                    "question": "The Indus Valley Civilization is also known as:",
                    "options": [
                        "Vedic Civilization",
                        "Harappan Civilization",
                        "Mauryan Civilization",
                        "Gupta Civilization"
                    ],
                    "correct": 1,
                    "explanation": "The Indus Valley Civilization is also called the Harappan Civilization, named after Harappa, one of the first sites discovered"
                },
                {
                    "type": "multiple_choice",
                    "question": "Who was the founder of the Mauryan Empire?",
                    "options": [
                        "Ashoka",
                        "Chandragupta Maurya",
                        "Bindusara",
                        "Chanakya"
                    ],
                    "correct": 1,
                    "explanation": "Chandragupta Maurya founded the Mauryan Empire around 321 BCE with the help of his advisor Chanakya"
                },
                {
                    "type": "multiple_choice",
                    "question": "The ancient Indian text 'Arthashastra' was written by:",
                    "options": [
                        "Valmiki",
                        "Vyasa",
                        "Chanakya (Kautilya)",
                        "Kalidasa"
                    ],
                    "correct": 2,
                    "explanation": "The Arthashastra, a treatise on economics, politics and military strategy, was written by Chanakya (also known as Kautilya)"
                },
                {
                    "type": "multiple_choice",
                    "question": "The Gupta period is known as the:",
                    "options": [
                        "Dark Age of India",
                        "Golden Age of India",
                        "Iron Age of India",
                        "Bronze Age of India"
                    ],
                    "correct": 1,
                    "explanation": "The Gupta period (4th-6th centuries CE) is called the Golden Age of India due to significant achievements in arts, science, and literature"
                }
            ]
        }
    }
};
