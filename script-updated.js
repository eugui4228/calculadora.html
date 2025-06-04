// JavaScript corrigido para a Calculadora Interativa

// Variáveis globais
let displayValue = '0';
let currentExpression = '';
let lastInputType = 'none'; // Para rastrear o tipo do último input (número, operador, etc.)
let gameActive = false;
let correctAnswer = 0;
let options = [];
let currentScore = 0;
let attemptsLeft = 3;
let correctAnswerIndex = 0;
let maxScore = 10;
let waitingForOperand = false; // Flag para indicar se estamos esperando um operando após um operador

// Elementos DOM
const display = document.getElementById('display');
const gameOptions = document.getElementById('game-options');
const messageArea = document.getElementById('message-area');
const scoreElement = document.getElementById('score');
const attemptsElement = document.getElementById('attempts');
const startButton = document.getElementById('start-btn');
const optionButtons = [
    document.getElementById('option1'),
    document.getElementById('option2'),
    document.getElementById('option3'),
    document.getElementById('option4')
];

// Inicialização
document.addEventListener('DOMContentLoaded', function() {
    // Configurar o botão de iniciar
    startButton.addEventListener('click', startGame);
    
    // Inicializar o display
    updateDisplay();
});

// Função para iniciar o jogo
function startGame() {
    gameActive = true;
    currentScore = 0;
    attemptsLeft = 3;
    updateScore();
    updateAttempts();
    
    // Limpar o display e a expressão
    displayValue = '0';
    currentExpression = '';
    lastInputType = 'none';
    waitingForOperand = false;
    updateDisplay();
    
    // Esconder as opções de resposta inicialmente
    gameOptions.style.display = 'none';
    
    // Mostrar mensagem para o usuário
    showMessage('Clique nos botões da calculadora para começar!', 'normal');
}

// Função corrigida para processar os botões pressionados
function pressButton(value) {
    if (!gameActive) return;
    
    switch(value) {
        case 'off':
            gameActive = false;
            displayValue = '';
            currentExpression = '';
            lastInputType = 'none';
            waitingForOperand = false;
            gameOptions.style.display = 'none';
            showMessage('Calculadora desligada. Clique em Iniciar para jogar novamente.', 'normal');
            updateDisplay();
            break;
            
        case 'on':
            displayValue = '0';
            currentExpression = '';
            lastInputType = 'none';
            waitingForOperand = false;
            updateDisplay();
            showMessage('Calculadora ligada. Faça seus cálculos!', 'normal');
            break;
            
        case 'c':
            if (!gameActive) return;
            displayValue = '0';
            currentExpression = '';
            lastInputType = 'none';
            waitingForOperand = false;
            updateDisplay();
            if (gameOptions.style.display === 'block') {
                gameOptions.style.display = 'none';
            }
            showMessage('Display limpo', 'normal');
            break;
            
        case '=':
            if (currentExpression) {
                try {
                    calculateAndShowOptions();
                    lastInputType = 'equals';
                    waitingForOperand = true;
                } catch (e) {
                    showMessage('Expressão inválida. Tente novamente.', 'error');
                    displayValue = 'Erro';
                    updateDisplay();
                }
            }
            break;
            
        case 'sqrt':
            if (!gameActive) return;
            try {
                const num = parseFloat(displayValue);
                if (num >= 0) {
                    const result = Math.sqrt(num);
                    const formattedResult = result % 1 !== 0 ? parseFloat(result.toFixed(4)).toString() : result.toString();
                    displayValue = formattedResult;
                    if (currentExpression.match(/[\+\-\*\/]/) && lastInputType === 'number') {
                        const parts = currentExpression.split(/([+\-*/])/);
                        parts[parts.length - 1] = formattedResult;
                        currentExpression = parts.join('');
                    } else {
                        currentExpression = formattedResult;
                    }
                    updateDisplay();
                    lastInputType = 'number';
                    waitingForOperand = false;
                    showMessage(`Raiz quadrada de ${num} = ${formattedResult}`, 'normal');
                } else {
                    showMessage('Não é possível calcular raiz de número negativo.', 'error');
                }
            } catch (e) {
                showMessage('Operação inválida.', 'error');
            }
            break;
            
        case '%':
            if (!gameActive) return;
            try {
                if (currentExpression.match(/[\+\-\*\/]/) && lastInputType === 'number') {
                    const parts = currentExpression.split(/([+\-*/])/);
                    const lastOperator = parts[parts.length - 2];
                    const firstNumber = parseFloat(parts[parts.length - 3] || 0);
                    const secondNumber = parseFloat(displayValue);
                    let result;
                    switch (lastOperator) {
                        case '+':
                        case '-':
                            result = firstNumber * (secondNumber / 100);
                            break;
                        case '*':
                        case '/':
                            result = secondNumber / 100;
                            break;
                        default:
                            result = secondNumber / 100;
                    }
                    const formattedResult = result % 1 !== 0 ? parseFloat(result.toFixed(4)).toString() : result.toString();
                    displayValue = formattedResult;
                    parts[parts.length - 1] = formattedResult;
                    currentExpression = parts.join('');
                    if (lastOperator === '+' || lastOperator === '-') {
                        showMessage(`${secondNumber}% de ${firstNumber} = ${formattedResult}`, 'normal');
                    } else {
                        showMessage(`${secondNumber}% = ${formattedResult}`, 'normal');
                    }
                } else {
                    const num = parseFloat(displayValue);
                    const result = num / 100;
                    const formattedResult = result % 1 !== 0 ? parseFloat(result.toFixed(4)).toString() : result.toString();
                    displayValue = formattedResult;
                    currentExpression = formattedResult;
                    showMessage(`${num}% = ${formattedResult}`, 'normal');
                }
                updateDisplay();
                lastInputType = 'number';
                waitingForOperand = false;
            } catch (e) {
                showMessage('Operação inválida de porcentagem.', 'error');
            }
            break;
            
        case '.':
            if (!gameActive) return;
            if (!displayValue.includes('.')) {
                if (waitingForOperand || displayValue === '0' || lastInputType === 'operator' || lastInputType === 'equals') {
                    displayValue = '0.';
                    if (waitingForOperand || lastInputType === 'equals') {
                        if (lastInputType === 'equals') {
                            currentExpression = '0.';
                        } else {
                            currentExpression += '0.';
                        }
                    } else {
                        if (currentExpression === '' || currentExpression === '0') {
                            currentExpression = '0.';
                        } else {
                            currentExpression += '0.';
                        }
                    }
                } else {
                    displayValue += '.';
                    currentExpression += '.';
                }
                lastInputType = 'decimal';
                waitingForOperand = false;
                updateDisplay();
                showMessage('Ponto decimal adicionado', 'normal');
            } else {
                showMessage('Já existe um ponto decimal neste número', 'error');
            }
            break;
            
        case '+':
        case '-':
        case '*':
        case '/':
            if (lastInputType === 'operator') {
                currentExpression = currentExpression.slice(0, -1) + value;
            } else {
                currentExpression += value;
            }
            displayValue = value === '*' ? 'x' : value;
            lastInputType = 'operator';
            waitingForOperand = true;
            updateDisplay();
            break;
            
        default:
            if (waitingForOperand || displayValue === '0' || lastInputType === 'operator' || lastInputType === 'equals') {
                displayValue = value;
                if (waitingForOperand || lastInputType === 'equals') {
                    if (lastInputType === 'equals') {
                        currentExpression = value;
                    } else {
                        currentExpression += value;
                    }
                    waitingForOperand = false;
                } else {
                    currentExpression = currentExpression.slice(0, -1) + value;
                }
            } else {
                displayValue += value;
                currentExpression += value;
            }
            lastInputType = 'number';
            updateDisplay();
            break;
    }
}

// Função para atualizar o display
function updateDisplay() {
    display.textContent = displayValue;
}

// Função para calcular o resultado e mostrar opções
function calculateAndShowOptions() {
    try {
        // Substituir 'x' por '*' para avaliação
        let expressionToEvaluate = currentExpression.replace(/x/g, '*');
        
        // Calcular o resultado correto
        correctAnswer = eval(expressionToEvaluate);
        
        // Arredondar para 2 casas decimais se for um número decimal
        if (correctAnswer % 1 !== 0) {
            correctAnswer = parseFloat(correctAnswer.toFixed(2));
        }
        
        // Gerar opções de resposta
        generateOptions(correctAnswer);
        
        // Mostrar as opções
        displayOptions();
        
        // Atualizar o display para mostrar a expressão completa
        displayValue = currentExpression;
        updateDisplay();
        
    } catch (e) {
        showMessage('Erro ao calcular. Verifique a expressão.', 'error');
        console.error(e);
    }
}

// Função para gerar opções de resposta
function generateOptions(correctAnswer) {
    options = [];
    
    // Adicionar a resposta correta
    options.push(correctAnswer);
    
    // Gerar 3 respostas incorretas
    for (let i = 0; i < 3; i++) {
        let incorrectAnswer;
        do {
            // Gerar uma resposta incorreta baseada na correta
            const variation = Math.random() > 0.5 ? 1 : -1;
            const factor = Math.random() * 0.5 + 0.1; // Entre 10% e 60% de variação
            
            incorrectAnswer = correctAnswer + (correctAnswer * factor * variation);
            
            // Arredondar para 2 casas decimais se for um número decimal
            if (incorrectAnswer % 1 !== 0) {
                incorrectAnswer = parseFloat(incorrectAnswer.toFixed(2));
            } else {
                incorrectAnswer = Math.round(incorrectAnswer);
            }
            
        } while (options.includes(incorrectAnswer) || incorrectAnswer === correctAnswer);
        
        options.push(incorrectAnswer);
    }
    
    // Embaralhar as opções
    shuffleArray(options);
    
    // Guardar o índice da resposta correta
    correctAnswerIndex = options.indexOf(correctAnswer);
}

// Função para embaralhar um array
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

// Função para mostrar as opções
function displayOptions() {
    // Atualizar o texto dos botões de opção
    for (let i = 0; i < 4; i++) {
        optionButtons[i].textContent = options[i];
    }
    
    // Mostrar a área de opções
    gameOptions.style.display = 'block';
    
    // Mostrar mensagem para o usuário
    showMessage('Escolha a resposta correta!', 'normal');
}

// Função para verificar a resposta escolhida
function checkAnswer(optionIndex) {
    if (!gameActive) return;
    
    if (optionIndex === correctAnswerIndex) {
        // Resposta correta
        if (attemptsLeft === 3) {
            // Acertou de primeira
            showMessage('Parabéns! Você acertou de primeira! Ganhou 1 ponto.', 'success');
            currentScore++;
            updateScore();
        } else {
            // Acertou, mas não de primeira
            showMessage('Correto! Ganhou 1 ponto.', 'success');
            currentScore++;
            updateScore();
        }
        
        // Verificar se atingiu a pontuação máxima
        if (currentScore >= maxScore) {
            gameActive = false;
            showMessage('Parabéns! Você atingiu a pontuação máxima de ' + maxScore + ' pontos!', 'success');
            return;
        }
        
        // Resetar tentativas para o próximo cálculo
        attemptsLeft = 3;
        updateAttempts();
        
        // Esconder as opções
        gameOptions.style.display = 'none';
        
        // Limpar o display para o próximo cálculo
        displayValue = '0';
        currentExpression = '';
        lastInputType = 'none';
        waitingForOperand = false;
        updateDisplay();
        
    } else {
        // Resposta incorreta
        attemptsLeft--;
        updateAttempts();
        
        if (attemptsLeft === 0) {
            // Esgotou as tentativas
            gameActive = false;
            showMessage('Você errou! Suas tentativas acabaram. Jogo reiniciado.', 'error');
            
            // Reiniciar o jogo
            currentScore = 0;
            updateScore();
            
            // Esconder as opções
            gameOptions.style.display = 'none';
            
            return;
        }
        
        showMessage('Resposta incorreta! Tentativas restantes: ' + attemptsLeft, 'error');
    }
}

// Função para mostrar mensagens
function showMessage(message, type) {
    messageArea.textContent = message;
    
    // Remover classes anteriores
    messageArea.classList.remove('success-message', 'error-message');
    
    // Adicionar classe baseada no tipo
    if (type === 'success') {
        messageArea.classList.add('success-message');
    } else if (type === 'error') {
        messageArea.classList.add('error-message');
    }
}

// Função para atualizar a pontuação
function updateScore() {
    scoreElement.textContent = currentScore;
}

// Função para atualizar as tentativas
function updateAttempts() {
    attemptsElement.textContent = attemptsLeft;
}
document.addEventListener('keydown', (event) => {
    if (!gameActive) return;
    const keyMap = {
        '0': '0', '1': '1', '2': '2', '3': '3', '4': '4',
        '5': '5', '6': '6', '7': '7', '8': '8', '9': '9',
        '+': '+', '-': '-', '*': '*', '/': '/', '.': '.',
        'Enter': '=', 'Escape': 'c'
    };
    if (keyMap[event.key]) {
        pressButton(keyMap[event.key]);
    }
});