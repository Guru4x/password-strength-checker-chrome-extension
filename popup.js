document.addEventListener('DOMContentLoaded', function () {
    const generateButton = document.getElementById('generate');
    const saveButton = document.getElementById('save');
    const deleteButton = document.getElementById('delete');
    const checkStrengthButton = document.getElementById('checkStrength');
    const bruteForceTechnique = document.getElementById('bruteForceTechnique');
    const passphraseInput = document.getElementById('passphrase');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const strengthResult = document.getElementById('strengthResult');
    const bruteForceTimeResult = document.getElementById('bruteForceTimeResult');
    const savedPassphrasesList = document.getElementById('savedPassphrasesList');

    generateButton.addEventListener('click', () => {
        const passphrase = generatePassphrase();
        passphraseInput.value = passphrase;
    });

    saveButton.addEventListener('click', () => {
        const username = usernameInput.value;
        const passphrase = passphraseInput.value.trim();

        if (username && passphrase) {
            savePassphrase(username, passphrase);
            alert('Passphrase saved successfully!');
        } else {
            alert('Please enter a username and generate a passphrase.');
        }
    });

    deleteButton.addEventListener('click', deleteSelectedPassphrases);

    checkStrengthButton.addEventListener('click', () => {
        const password = passwordInput.value;
        const strength = checkPasswordStrength(password);
        strengthResult.textContent = `Strength: ${strength}`;
        strengthResult.style.color = strength === 'Strong' ? 'green' : 'red';

        const bruteForceTime = calculateBruteForceTime(password, getGuessesPerSecond());
        bruteForceTimeResult.textContent = `Estimated brute-force time: ${bruteForceTime}`;
    });

    bruteForceTechnique.addEventListener('change', getGuessesPerSecond);

    function generatePassphrase() {
        const words = ['apple', 'banana', 'cherry', 'date', 'elderberry', 'fig', 'grape', 'honeydew'];
        return Array.from({ length: 12 }, () => words[Math.floor(Math.random() * words.length)]).join('-');
    }

    function savePassphrase(username, passphrase) {
        localStorage.setItem(username, passphrase);
        displaySavedPassphrases();
    }

    function displaySavedPassphrases() {
        savedPassphrasesList.innerHTML = '';
        for (let i = 0; i < localStorage.length; i++) {
            const username = localStorage.key(i);
            const passphrase = localStorage.getItem(username);
            const listItem = document.createElement('li');
            listItem.innerHTML = `<input type="checkbox"> ${username}: ${passphrase}`;
            savedPassphrasesList.appendChild(listItem);
        }
    }

    function deleteSelectedPassphrases() {
        const checkboxes = savedPassphrasesList.querySelectorAll('input[type="checkbox"]');
        checkboxes.forEach((checkbox, index) => {
            if (checkbox.checked) {
                const username = localStorage.key(index);
                localStorage.removeItem(username);
            }
        });
        displaySavedPassphrases();
    }

    function checkPasswordStrength(password) {
        const conditions = {
            length: password.length >= 6,
            uppercase: /[A-Z]/.test(password),
            lowercase: /[a-z]/.test(password),
            number: /\d/.test(password),
            special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
        };

        // Update UI for each condition dynamically
        for (const [condition, isValid] of Object.entries(conditions)) {
            const element = document.querySelector(`li[data-condition="${condition}"]`);
            element.classList.toggle('passed', isValid);
            element.classList.toggle('failed', !isValid);
        }

        return Object.values(conditions).every(Boolean) ? 'Strong' : 'Weak';
    }

    function calculateBruteForceTime(password, guessesPerSecond = 1e9) {
        const characterSpace = calculateCharacterSpace(password);
        const totalCombinations = Math.pow(characterSpace, password.length);
        return formatTime(totalCombinations / guessesPerSecond);
    }

    function calculateCharacterSpace(password) {
        let space = 0;
        if (/[a-z]/.test(password)) space += 26;
        if (/[A-Z]/.test(password)) space += 26;
        if (/\d/.test(password)) space += 10;
        if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) space += 32;
        return space;
    }

    function formatTime(seconds) {
        if (seconds < 60) return `${Math.floor(seconds)} seconds`;
        if ((seconds /= 60) < 60) return `${Math.floor(seconds)} minutes`;
        if ((seconds /= 60) < 24) return `${Math.floor(seconds)} hours`;
        if ((seconds /= 24) < 365) return `${Math.floor(seconds)} days`;
        return `${Math.floor(seconds / 365)} years`;
    }

    function getGuessesPerSecond() {
        switch (bruteForceTechnique.value) {
            case 'atari': return 1e8;
            case 'quantum': return 1e12;
            default: return 1e9;
        }
    }

    displaySavedPassphrases();
});
