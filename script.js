const modulesData = [
    {
        id: "M1",
        name: "M.1.1 - Fondements de l'informatique",
        subjects: [
            { code: "M111", name: "Architecture des ordinateurs", vh: 20, coefficient: 0.32 },
            { code: "M112", name: "Systèmes d'exploitation", vh: 24, coefficient: 0.34 },
            { code: "M113", name: "Initiation aux réseaux informatiques", vh: 24, coefficient: 0.34 }
        ]
    },
    {
        id: "M2",
        name: "M.1.2 - Mathématiques pour l'Ingénieur",
        subjects: [
            { code: "M121", name: "Algèbre matricielle", vh: 24, coefficient: 0.34 },
            { code: "M122", name: "Théorie des graphes", vh: 24, coefficient: 0.34 },
            { code: "M123", name: "Analyse", vh: 22, coefficient: 0.32 }
        ]
    },
    {
        id: "M3",
        name: "M.1.3 - Algorithmique et Programmation",
        subjects: [
            { code: "M131", name: "Algorithmique", vh: 20, coefficient: 0.34 },
            { code: "M132", name: "Programmation en C", vh: 20, coefficient: 0.33 },
            { code: "M133", name: "Programmation en Python", vh: 20, coefficient: 0.33 }
        ]
    },
    {
        id: "M4",
        name: "M.1.4 - Technologies web et documents structurés",
        subjects: [
            { code: "M141", name: "Technologies Web", vh: 24, coefficient: 0.50 },
            { code: "M142", name: "Documents structurés", vh: 24, coefficient: 0.50 }
        ]
    },
    {
        id: "M5",
        name: "M.1.5 - Gestion du capital immatériel",
        subjects: [
            { code: "M151", name: "Knowledge Management (KM)", vh: 24, coefficient: 0.50 },
            { code: "M152", name: "Veille technologique", vh: 24, coefficient: 0.50 }
        ]
    },
    {
        id: "M6",
        name: "M.1.6 - Langues et communication 1",
        subjects: [
            { code: "M161", name: "TEC 1", vh: 24, coefficient: 0.50 },
            { code: "M162", name: "English for General Purposes 1", vh: 24, coefficient: 0.50 }
        ]
    },
    {
        id: "M7",
        name: "M.1.7 - Introduction à l'art et à la culture",
        subjects: [
            { code: "M171", name: "Introduction à la culture marocaine et africaine", vh: 24, coefficient: 0.50 },
            { code: "M172", name: "مقدمة إلى الثقافة المغربية والإفريقية", vh: 24, coefficient: 0.50 },
            { code: "M173", name: "Introduction à l'art marocain et africain", vh: 24, coefficient: 0.50 },
            { code: "M174", name: "مقدمة إلى الفن المغربي والإفريقي", vh: 24, coefficient: 0.50 }
        ]
    }
];

let notes = {};

document.addEventListener('DOMContentLoaded', function() {
    console.log("Page chargée, initialisation...");
    initNotesStorage();
    setupEventListeners();
    updateAllDisplays();
    setupBackToTopButton();
    setupSmoothNavigation();
    setupQuickCalculator();
    console.log("Initialisation terminée. Notes chargées:", notes);
});

function initNotesStorage() {
    const savedNotes = localStorage.getItem('academicNotes');
    if (savedNotes) {
        notes = JSON.parse(savedNotes);
        console.log("Notes chargées depuis le localStorage:", notes);
    } else {
        modulesData.forEach(module => {
            module.subjects.forEach(subject => {
                const noteId = getNoteId(module.id, subject.code);
                notes[noteId] = '';
            });
        });
        saveNotes();
        console.log("Nouvelles notes initialisées:", notes);
    }
}

function setupEventListeners() {
    console.log("Configuration des écouteurs d'événements...");
    
    document.querySelectorAll('.note-input').forEach(input => {
        input.addEventListener('input', function() {
            const noteId = this.id;
            const value = this.value;
            console.log(`Note modifiée: ${noteId} = ${value}`);
            notes[noteId] = value;
            saveNotes();
            updateNoteDisplay(noteId.replace('note', 'display'), value);
            updateModuleAverage(getModuleFromInputId(noteId));
            updateGlobalStats();
        });
    });
    
    document.querySelectorAll('.calc-module-btn').forEach(button => {
        button.addEventListener('click', function() {
            const moduleId = this.getAttribute('data-module');
            console.log(`Calcul demandé pour le module: ${moduleId}`);
            calculateAndDisplayModuleAverage(moduleId);
        });
    });
    
    const moduleSelect = document.getElementById('moduleSelect');
    if (moduleSelect) {
        moduleSelect.addEventListener('change', function() {
            console.log(`Module sélectionné: ${this.value}`);
            updateCalculatorInputs(this.value);
        });
    }
    
    const calculateBtn = document.getElementById('calculateBtn');
    if (calculateBtn) {
        calculateBtn.addEventListener('click', function() {
            console.log("Bouton calculer cliqué");
            calculateSelectedModule();
        });
    }
    
    const showAllBtn = document.getElementById('showAllCoefficients');
    if (showAllBtn) {
        showAllBtn.addEventListener('click', function() {
            showAllCoefficients();
        });
    }
    
    const exportBtn = document.getElementById('exportBtn');
    if (exportBtn) {
        exportBtn.addEventListener('click', exportNotes);
    }
    
    const resetBtn = document.getElementById('resetBtn');
    if (resetBtn) {
        resetBtn.addEventListener('click', resetNotes);
    }
    
    const calculateAllBtn = document.getElementById('calculateAllBtn');
    if (calculateAllBtn) {
        calculateAllBtn.addEventListener('click', calculateAllAverages);
    }
    
    const emailBtn = document.getElementById('emailResultsBtn');
    if (emailBtn) {
        emailBtn.addEventListener('click', function(e) {
            if (!confirm('Voulez-vous envoyer vos résultats par email?')) {
                e.preventDefault();
            } else {
                updateEmailBody();
            }
        });
    }
    
    console.log("Écouteurs d'événements configurés");
}

function updateNoteDisplay(displayId, value) {
    const displayElement = document.getElementById(displayId);
    if (!displayElement) {
        console.warn(`Élément non trouvé: ${displayId}`);
        return;
    }
    
    if (value && !isNaN(value) && value >= 0 && value <= 20) {
        const note = parseFloat(value);
        let className = 'note-moyenne';
        let text = `${note.toFixed(1)}/20`;
        
        if (note >= 16) {
            className = 'note-excellente';
        } else if (note >= 14) {
            className = 'note-bonne';
        } else if (note < 10) {
            className = 'note-faible';
        }
        
        displayElement.innerHTML = `<span class="${className}">${text}</span>`;
        console.log(`Affichage mis à jour: ${displayId} = ${text}`);
    } else {
        displayElement.innerHTML = '<span class="note-faible">--/20</span>';
        console.log(`Affichage réinitialisé: ${displayId}`);
    }
}

function updateAllDisplays() {
    console.log("Mise à jour de tous les affichages...");
    
    for (const noteId in notes) {
        const displayId = noteId.replace('note', 'display');
        updateNoteDisplay(displayId, notes[noteId]);
        
        const inputElement = document.getElementById(noteId);
        if (inputElement) {
            inputElement.value = notes[noteId];
        } else {
            console.warn(`Input non trouvé: ${noteId}`);
        }
    }
    
    modulesData.forEach(module => {
        updateModuleAverage(module.id);
    });
    
    updateGlobalStats();
    updateModulesResultsList();
    console.log("Tous les affichages mis à jour");
}

function calculateModuleAverage(moduleId) {
    const module = modulesData.find(m => m.id === moduleId);
    if (!module) {
        console.warn(`Module non trouvé: ${moduleId}`);
        return null;
    }
    
    console.log(`Calcul de la moyenne pour le module: ${moduleId}`);
    let totalWeighted = 0;
    let totalCoefficients = 0;
    let hasNotes = false;
    
    module.subjects.forEach(subject => {
        const noteId = getNoteId(module.id, subject.code);
        const noteValue = notes[noteId];
        console.log(`  ${subject.name}: noteId=${noteId}, valeur=${noteValue}, coeff=${subject.coefficient}`);
        
        if (noteValue && !isNaN(noteValue) && noteValue >= 0 && noteValue <= 20) {
            const note = parseFloat(noteValue);
            totalWeighted += note * subject.coefficient;
            totalCoefficients += subject.coefficient;
            hasNotes = true;
            console.log(`    Contribution: ${note} × ${subject.coefficient} = ${(note * subject.coefficient).toFixed(2)}`);
        } else {
            console.log(`    Note manquante ou invalide`);
        }
    });
    
    if (hasNotes && totalCoefficients > 0) {
        const average = totalWeighted / totalCoefficients;
        console.log(`  Résultat: total pondéré=${totalWeighted.toFixed(2)}, total coeff=${totalCoefficients.toFixed(2)}, moyenne=${average.toFixed(2)}`);
        return average;
    } else {
        console.log(`  Aucune note valide trouvée`);
        return null;
    }
}

function updateModuleAverage(moduleId) {
    console.log(`Mise à jour de l'affichage pour le module: ${moduleId}`);
    const average = calculateModuleAverage(moduleId);
    const averageElement = document.getElementById(`moyenneM${moduleId.substring(1)}`);
    const coefElement = document.getElementById(`coefM${moduleId.substring(1)}`);
    
    if (!averageElement) {
        console.warn(`Élément non trouvé: moyenneM${moduleId.substring(1)}`);
        return;
    }
    
    if (coefElement) {
        const module = modulesData.find(m => m.id === moduleId);
        const totalCoefficients = module.subjects.reduce((sum, subject) => sum + subject.coefficient, 0);
        coefElement.textContent = totalCoefficients.toFixed(2);
        console.log(`  Coefficients totaux: ${totalCoefficients.toFixed(2)}`);
    }
    
    if (average !== null) {
        averageElement.textContent = `${average.toFixed(2)}/20`;
        averageElement.classList.add('updated');
        setTimeout(() => averageElement.classList.remove('updated'), 1500);
        
        averageElement.className = 'average-grade';
        if (average >= 16) {
            averageElement.classList.add('note-excellente');
        } else if (average >= 14) {
            averageElement.classList.add('note-bonne');
        } else if (average < 10) {
            averageElement.classList.add('note-faible');
        } else {
            averageElement.classList.add('note-moyenne');
        }
        console.log(`  Moyenne affichée: ${average.toFixed(2)}/20`);
    } else {
        averageElement.textContent = '--/20';
        averageElement.className = 'average-grade';
        console.log(`  Aucune moyenne à afficher`);
    }
}

function calculateAndDisplayModuleAverage(moduleId) {
    console.log(`Calcul et affichage de la moyenne pour le module: ${moduleId}`);
    const average = calculateModuleAverage(moduleId);
    const module = modulesData.find(m => m.id === moduleId);
    
    if (!module) {
        console.error(`Module non trouvé: ${moduleId}`);
        return;
    }
    
    if (average !== null) {
        const message = `Moyenne ${module.name}: ${average.toFixed(2)}/20\n\n` +
                       `Statut: ${average >= 10 ? 'Module validé ✓' : 'Rattrapage nécessaire ✗'}\n` +
                       `Mention: ${getMention(average)}`;
        
        alert(message);
        updateModuleAverage(moduleId);
        console.log(`Message affiché: ${message}`);
    } else {
        const errorMessage = `Veuillez saisir toutes les notes pour le module ${module.name}`;
        alert(errorMessage);
        console.log(`Erreur: ${errorMessage}`);
    }
}

function getMention(average) {
    if (average >= 16) return 'Très Bien';
    if (average >= 14) return 'Bien';
    if (average >= 12) return 'Assez Bien';
    if (average >= 10) return 'Passable';
    return 'Insuffisant';
}

function updateGlobalStats() {
    console.log("Mise à jour des statistiques globales...");
    let totalWeighted = 0;
    let totalCoefficients = 0;
    let validatedModules = 0;
    
    modulesData.forEach(module => {
        const average = calculateModuleAverage(module.id);
        if (average !== null) {
            module.subjects.forEach(subject => {
                const noteId = getNoteId(module.id, subject.code);
                const noteValue = notes[noteId];
                
                if (noteValue && !isNaN(noteValue) && noteValue >= 0 && noteValue <= 20) {
                    const note = parseFloat(noteValue);
                    totalWeighted += note * subject.coefficient;
                    totalCoefficients += subject.coefficient;
                }
            });
            
            if (average >= 10) {
                validatedModules++;
            }
        }
    });
    
    console.log(`Stats calculées: total pondéré=${totalWeighted.toFixed(2)}, total coeff=${totalCoefficients.toFixed(2)}, modules validés=${validatedModules}`);
    
    const globalAverageElement = document.getElementById('globalAverage');
    const totalCoefficientsElement = document.getElementById('totalCoefficients');
    const statsValidatedElement = document.getElementById('statsValidated');
    const mentionElement = document.getElementById('mention');
    
    if (totalCoefficientsElement) {
        totalCoefficientsElement.textContent = totalCoefficients.toFixed(2);
    }
    
    if (statsValidatedElement) {
        statsValidatedElement.textContent = `${validatedModules}/${modulesData.length}`;
    }
    
    if (totalCoefficients > 0) {
        const globalAverage = totalWeighted / totalCoefficients;
        globalAverageElement.textContent = `${globalAverage.toFixed(2)}/20`;
        globalAverageElement.classList.add('updated');
        setTimeout(() => globalAverageElement.classList.remove('updated'), 1500);
        
        const mention = getMention(globalAverage);
        mentionElement.textContent = mention;
        
        mentionElement.className = 'stat-value';
        if (globalAverage >= 16) {
            mentionElement.classList.add('note-excellente');
        } else if (globalAverage >= 14) {
            mentionElement.classList.add('note-bonne');
        } else if (globalAverage < 10) {
            mentionElement.classList.add('note-faible');
        } else {
            mentionElement.classList.add('note-moyenne');
        }
        
        console.log(`Moyenne globale: ${globalAverage.toFixed(2)}/20, Mention: ${mention}`);
    } else {
        globalAverageElement.textContent = '--/20';
        mentionElement.textContent = '--';
        mentionElement.className = 'stat-value';
        console.log("Aucune statistique à afficher");
    }
    
    updateModulesResultsList();
}

function updateModulesResultsList() {
    const modulesResultsList = document.getElementById('modulesResultsList');
    if (!modulesResultsList) {
        console.warn("Élément modulesResultsList non trouvé");
        return;
    }
    
    modulesResultsList.innerHTML = '';
    
    modulesData.forEach(module => {
        const average = calculateModuleAverage(module.id);
        const moduleDiv = document.createElement('div');
        moduleDiv.className = 'module-result-item';
        
        let statusClass = 'pending';
        let statusText = 'Notes manquantes';
        
        if (average !== null) {
            statusClass = average >= 10 ? 'valid' : 'failed';
            statusText = average >= 10 ? 'Validé' : 'Rattrapage';
        }
        
        moduleDiv.innerHTML = `
            <div class="module-result-header">
                <span class="module-name">${module.name}</span>
                <span class="module-status ${statusClass}">${statusText}</span>
            </div>
            <div class="module-result-details">
                <span class="module-average">Moyenne: ${average !== null ? average.toFixed(2) : '--'}/20</span>
                <span class="module-credits">Crédits: ${getCreditsForModule(module.id)} ECTS</span>
            </div>
        `;
        
        modulesResultsList.appendChild(moduleDiv);
    });
    
    console.log("Liste des résultats des modules mise à jour");
}

function getCreditsForModule(moduleId) {
    switch(moduleId) {
        case 'M1':
        case 'M2':
        case 'M3':
            return '6';
        case 'M4':
        case 'M5':
        case 'M6':
        case 'M7':
            return '4';
        default:
            return '?';
    }
}

function updateCalculatorInputs(moduleCode) {
    const notesInputs = document.getElementById('notesInputs');
    if (!notesInputs) {
        console.warn("Élément notesInputs non trouvé");
        return;
    }
    
    if (!moduleCode) {
        notesInputs.innerHTML = '<p class="placeholder-text">Sélectionnez un module pour saisir les notes</p>';
        return;
    }
    
    const module = modulesData.find(m => m.id === moduleCode);
    if (!module) {
        console.warn(`Module non trouvé: ${moduleCode}`);
        return;
    }
    
    console.log(`Mise à jour des inputs pour le module: ${moduleCode}`);
    let inputsHTML = '<h4>Saisie des notes:</h4>';
    
    module.subjects.forEach(subject => {
        const noteId = getNoteId(module.id, subject.code);
        const noteValue = notes[noteId] || '';
        
        inputsHTML += `
            <div class="form-group">
                <label for="calc-${noteId}">${subject.name} (coef: ${subject.coefficient}):</label>
                <input type="number" id="calc-${noteId}" class="form-control calc-note-input" 
                       value="${noteValue}" min="0" max="20" step="0.1" placeholder="0-20">
            </div>
        `;
    });
    
    notesInputs.innerHTML = inputsHTML;
    
    document.querySelectorAll('.calc-note-input').forEach(input => {
        input.addEventListener('input', function() {
            const noteId = this.id.replace('calc-', '');
            const value = this.value;
            console.log(`Note du calculateur modifiée: ${noteId} = ${value}`);
            notes[noteId] = value;
            saveNotes();
            
            const mainInput = document.getElementById(noteId);
            if (mainInput) {
                mainInput.value = value;
                console.log(`Input principal mis à jour: ${noteId}`);
            } else {
                console.warn(`Input principal non trouvé: ${noteId}`);
            }
            
            updateNoteDisplay(noteId.replace('note', 'display'), value);
            updateModuleAverage(getModuleFromInputId(noteId));
            updateGlobalStats();
        });
    });
    
    console.log(`Inputs mis à jour pour ${module.subjects.length} matières`);
}

function calculateSelectedModule() {
    console.log("Calcul du module sélectionné...");
    const moduleSelect = document.getElementById('moduleSelect');
    if (!moduleSelect) {
        console.error("Élément moduleSelect non trouvé");
        return;
    }
    
    const moduleCode = moduleSelect.value;
    
    if (!moduleCode) {
        alert('Veuillez sélectionner un module.');
        return;
    }
    
    const module = modulesData.find(m => m.id === moduleCode);
    if (!module) {
        console.error(`Module non trouvé: ${moduleCode}`);
        return;
    }
    
    console.log(`Calcul détaillé pour le module: ${moduleCode}`);
    let totalWeighted = 0;
    let totalCoefficients = 0;
    let calculationDetails = '';
    let hasAllNotes = true;
    
    module.subjects.forEach(subject => {
        const noteId = getNoteId(module.id, subject.code);
        const noteValue = notes[noteId];
        
        if (noteValue && !isNaN(noteValue) && noteValue >= 0 && noteValue <= 20) {
            const note = parseFloat(noteValue);
            const weighted = note * subject.coefficient;
            totalWeighted += weighted;
            totalCoefficients += subject.coefficient;
            calculationDetails += `${subject.name}: ${note} × ${subject.coefficient} = ${weighted.toFixed(2)}<br>`;
            console.log(`  ${subject.name}: ${note} × ${subject.coefficient} = ${weighted.toFixed(2)}`);
        } else {
            hasAllNotes = false;
            calculationDetails += `${subject.name}: Note manquante<br>`;
            console.log(`  ${subject.name}: Note manquante`);
        }
    });
    
    const resultContainer = document.getElementById('resultContainer');
    const calculationResult = document.getElementById('calculationResult');
    const resultText = document.getElementById('resultText');
    
    if (!resultContainer || !calculationResult || !resultText) {
        console.error("Éléments de résultat non trouvés");
        return;
    }
    
    resultContainer.style.display = 'block';
    
    if (hasAllNotes && totalCoefficients > 0) {
        const average = totalWeighted / totalCoefficients;
        calculationResult.innerHTML = `
            <div class="result-details">
                <p>${calculationDetails}</p>
                <p><strong>Total pondéré:</strong> ${totalWeighted.toFixed(2)}</p>
                <p><strong>Total des coefficients:</strong> ${totalCoefficients.toFixed(2)}</p>
                <p class="final-result"><strong>Moyenne du module:</strong> ${average.toFixed(2)}/20</p>
            </div>
        `;
        
        let message = getMention(average);
        if (average >= 16) {
            message = 'Excellent! Mention Très Bien.';
        } else if (average >= 14) {
            message = 'Très bon! Mention Bien.';
        } else if (average >= 12) {
            message = 'Bon travail! Mention Assez Bien.';
        } else if (average >= 10) {
            message = 'Module validé.';
        } else {
            message = 'Module non validé. Rattrapage nécessaire.';
        }
        
        resultText.textContent = message;
        console.log(`Résultat: Moyenne = ${average.toFixed(2)}/20, ${message}`);
        
        updateModuleAverage(moduleCode);
        updateGlobalStats();
    } else {
        calculationResult.innerHTML = '<p class="error">Veuillez saisir des notes valides pour toutes les matières de ce module.</p>';
        resultText.textContent = '';
        console.log("Erreur: notes manquantes ou invalides");
    }
}

function getNoteId(moduleId, subjectCode) {
    const noteId = `note${moduleId}${subjectCode}`;
    console.log(`Génération ID note: module=${moduleId}, sujet=${subjectCode} => ${noteId}`);
    return noteId;
}

function getModuleFromInputId(inputId) {
    const match = inputId.match(/note(M\d+)/);
    if (match && match[1]) {
        console.log(`Module extrait de ${inputId}: ${match[1]}`);
        return match[1];
    }
    console.warn(`Impossible d'extraire le module de: ${inputId}`);
    return null;
}

function saveNotes() {
    localStorage.setItem('academicNotes', JSON.stringify(notes));
    console.log("Notes sauvegardées dans le localStorage");
}

function showAllCoefficients() {
    let coefficientsText = "Tous les coefficients:\n\n";
    
    modulesData.forEach(module => {
        coefficientsText += `${module.name}:\n`;
        module.subjects.forEach(subject => {
            coefficientsText += `  ${subject.name}: ${subject.coefficient} (${subject.vh}VH)\n`;
        });
        coefficientsText += "\n";
    });
    
    alert(coefficientsText);
    console.log("Tous les coefficients affichés");
}

function exportNotes() {
    console.log("Export des notes...");
    let exportText = "Résultats Académiques - Semestre 1\n";
    exportText += "=====================================\n\n";
    
    exportText += "Date: " + new Date().toLocaleDateString('fr-FR') + "\n\n";
    
    modulesData.forEach(module => {
        exportText += `${module.name}\n`;
        exportText += "".padEnd(module.name.length, "-") + "\n";
        
        module.subjects.forEach(subject => {
            const noteId = getNoteId(module.id, subject.code);
            const noteValue = notes[noteId] || 'Non saisi';
            exportText += `  ${subject.name}: ${noteValue}/20 (coef: ${subject.coefficient})\n`;
        });
        
        const moduleAverage = calculateModuleAverage(module.id);
        exportText += `  → Moyenne module: ${moduleAverage !== null ? moduleAverage.toFixed(2) : '--'}/20\n\n`;
    });
    
    let totalWeighted = 0;
    let totalCoefficients = 0;
    
    modulesData.forEach(module => {
        module.subjects.forEach(subject => {
            const noteId = getNoteId(module.id, subject.code);
            const noteValue = notes[noteId];
            
            if (noteValue && !isNaN(noteValue) && noteValue >= 0 && noteValue <= 20) {
                const note = parseFloat(noteValue);
                totalWeighted += note * subject.coefficient;
                totalCoefficients += subject.coefficient;
            }
        });
    });
    
    const globalAverage = totalCoefficients > 0 ? (totalWeighted / totalCoefficients) : 0;
    
    exportText += `\nSYNTHÈSE\n`;
    exportText += `--------\n`;
    exportText += `Moyenne générale: ${globalAverage.toFixed(2)}/20\n`;
    exportText += `Total des coefficients: ${totalCoefficients.toFixed(2)}\n`;
    
    const mention = getMention(globalAverage);
    exportText += `Mention: ${mention}\n`;
    
    let validatedModules = 0;
    modulesData.forEach(module => {
        const average = calculateModuleAverage(module.id);
        if (average !== null && average >= 10) {
            validatedModules++;
        }
    });
    
    exportText += `Modules validés: ${validatedModules}/${modulesData.length}\n`;
    
    const blob = new Blob([exportText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `resultats_semestre1_${new Date().toISOString().slice(0,10)}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    alert('Les résultats ont été exportés dans un fichier texte.');
    console.log("Export terminé");
}

function resetNotes() {
    if (confirm('Voulez-vous vraiment réinitialiser toutes les notes? Toutes les données seront effacées.')) {
        console.log("Réinitialisation des notes...");
        notes = {};
        modulesData.forEach(module => {
            module.subjects.forEach(subject => {
                const noteId = getNoteId(module.id, subject.code);
                notes[noteId] = '';
            });
        });
        saveNotes();
        updateAllDisplays();
        alert('Toutes les notes ont été réinitialisées.');
        console.log("Notes réinitialisées");
    }
}

function calculateAllAverages() {
    console.log("Calcul de toutes les moyennes...");
    let calculatedCount = 0;
    
    modulesData.forEach(module => {
        const average = calculateModuleAverage(module.id);
        if (average !== null) {
            calculatedCount++;
            updateModuleAverage(module.id);
        }
    });
    
    updateGlobalStats();
    
    const button = document.getElementById('calculateAllBtn');
    if (!button) {
        console.error("Bouton calculateAllBtn non trouvé");
        return;
    }
    
    const originalText = button.textContent;
    
    if (calculatedCount > 0) {
        button.textContent = `✓ ${calculatedCount} moyennes calculées!`;
        button.classList.add('success');
        console.log(`${calculatedCount} moyennes calculées`);
    } else {
        button.textContent = 'Aucune note saisie';
        button.classList.add('error');
        console.log("Aucune note saisie pour calculer");
    }
    
    setTimeout(() => {
        button.textContent = originalText;
        button.classList.remove('success', 'error');
    }, 3000);
}

function updateEmailBody() {
    console.log("Mise à jour du corps de l'email...");
    let emailBody = "Bonjour,\n\n";
    emailBody += "Voici mes résultats académiques pour le semestre 1:\n\n";
    
    modulesData.forEach(module => {
        emailBody += `${module.name}:\n`;
        
        module.subjects.forEach(subject => {
            const noteId = getNoteId(module.id, subject.code);
            const noteValue = notes[noteId] || 'Non saisi';
            emailBody += `  - ${subject.name}: ${noteValue}/20 (coef: ${subject.coefficient})\n`;
        });
        
        const moduleAverage = calculateModuleAverage(module.id);
        emailBody += `  → Moyenne: ${moduleAverage !== null ? moduleAverage.toFixed(2) : '--'}/20\n\n`;
    });
    
    let totalWeighted = 0;
    let totalCoefficients = 0;
    
    modulesData.forEach(module => {
        module.subjects.forEach(subject => {
            const noteId = getNoteId(module.id, subject.code);
            const noteValue = notes[noteId];
            
            if (noteValue && !isNaN(noteValue) && noteValue >= 0 && noteValue <= 20) {
                const note = parseFloat(noteValue);
                totalWeighted += note * subject.coefficient;
                totalCoefficients += subject.coefficient;
            }
        });
    });
    
    const globalAverage = totalCoefficients > 0 ? (totalWeighted / totalCoefficients) : 0;
    
    emailBody += `Moyenne générale: ${globalAverage.toFixed(2)}/20\n`;
    emailBody += `Total des coefficients: ${totalCoefficients.toFixed(2)}\n\n`;
    emailBody += "Cordialement,\n";
    emailBody += "[Votre nom]";
    
    const emailLink = document.getElementById('emailResultsBtn');
    if (emailLink) {
        emailLink.href = `mailto:professeur@universite.edu?subject=Résultats%20Semestre%201&body=${encodeURIComponent(emailBody)}`;
        console.log("Lien email mis à jour");
    } else {
        console.error("Lien email non trouvé");
    }
}

function setupBackToTopButton() {
    const backToTopButton = document.getElementById("back-to-top");
    if (!backToTopButton) {
        console.error("Bouton back-to-top non trouvé");
        return;
    }
    
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            backToTopButton.classList.add('visible');
        } else {
            backToTopButton.classList.remove('visible');
        }
    });
    
    backToTopButton.addEventListener("click", function() {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
        console.log("Retour en haut");
    });
    
    console.log("Bouton retour en haut configuré");
}

function setupSmoothNavigation() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 100,
                    behavior: 'smooth'
                });
                console.log(`Navigation vers: ${targetId}`);
            }
        });
    });
    
    console.log("Navigation fluide configurée");
}

function setupQuickCalculator() {
    const quickCalcBtn = document.getElementById('quickCalcBtn');
    const quickResult = document.getElementById('quickResult');
    
    if (!quickCalcBtn || !quickResult) {
        console.warn("Calculateur rapide non trouvé");
        return;
    }
    
    quickCalcBtn.addEventListener('click', function() {
        console.log("Calculateur rapide déclenché");
        const note1 = parseFloat(document.getElementById('quickNote1').value);
        const coef1 = parseFloat(document.getElementById('quickCoef1').value);
        const note2 = parseFloat(document.getElementById('quickNote2').value);
        const coef2 = parseFloat(document.getElementById('quickCoef2').value);
        
        console.log(`Données: note1=${note1}, coef1=${coef1}, note2=${note2}, coef2=${coef2}`);
        
        if (isNaN(note1) || isNaN(coef1) || isNaN(note2) || isNaN(coef2)) {
            quickResult.innerHTML = '<p class="error">Veuillez saisir toutes les valeurs</p>';
            console.log("Erreur: valeurs manquantes");
            return;
        }
        
        if (note1 < 0 || note1 > 20 || note2 < 0 || note2 > 20) {
            quickResult.innerHTML = '<p class="error">Les notes doivent être entre 0 et 20</p>';
            console.log("Erreur: notes hors limites");
            return;
        }
        
        if (coef1 <= 0 || coef2 <= 0) {
            quickResult.innerHTML = '<p class="error">Les coefficients doivent être positifs</p>';
            console.log("Erreur: coefficients non positifs");
            return;
        }
        
        const totalWeighted = (note1 * coef1) + (note2 * coef2);
        const totalCoefficients = coef1 + coef2;
        const average = totalWeighted / totalCoefficients;
        
        let resultClass = 'note-moyenne';
        if (average >= 16) resultClass = 'note-excellente';
        else if (average >= 14) resultClass = 'note-bonne';
        else if (average < 10) resultClass = 'note-faible';
        
        quickResult.innerHTML = `
            <p><strong>Calcul:</strong> (${note1} × ${coef1}) + (${note2} × ${coef2}) = ${totalWeighted.toFixed(2)}</p>
            <p><strong>Coefficients totaux:</strong> ${totalCoefficients.toFixed(2)}</p>
            <p class="final-result ${resultClass}"><strong>Moyenne:</strong> ${average.toFixed(2)}/20</p>
        `;
        
        console.log(`Résultat rapide: moyenne = ${average.toFixed(2)}/20`);
    });
    
    console.log("Calculateur rapide configuré");
}