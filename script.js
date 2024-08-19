let questions = [];
let currentQuestionIndex = 0;

async function loadQuestions() {
    try {
        const response = await fetch('questions.json');
        if (!response.ok) throw new Error('网络错误');
        questions = await response.json();
        if (questions.length > 0) {
            loadQuestion(); // 加载第一题
            updateStats(); // 更新题目总数
        } else {
            console.error('题目数据为空');
        }
    } catch (error) {
        console.error('加载题目失败:', error);
    }
}

function loadQuestion() {
    const question = questions[currentQuestionIndex];
    if (!question) {
        console.error('当前题目无效');
        return;
    }
    document.getElementById('question-text').innerText = question.text;
    const optionsDiv = document.getElementById('options');
    optionsDiv.innerHTML = '';
    question.options.forEach((option, index) => {
        const optionElement = document.createElement('div');
        optionElement.innerHTML = `
            <input type="radio" name="option" value="${index}" id="option${index}">
            <label for="option${index}">${option}</label>
        `;
        optionsDiv.appendChild(optionElement);
    });
    updateProgress(); // 更新当前题目索引
}

function checkAnswer() {
    const selectedOption = document.querySelector('input[name="option"]:checked');
    if (!selectedOption) {
        document.getElementById('result-text').innerText = '请选择一个选项';
        return;
    }
    const answerIndex = parseInt(selectedOption.value);
    const question = questions[currentQuestionIndex];
    const resultText = answerIndex === question.answer ? '回答正确!' : '回答错误!';
    document.getElementById('result-text').innerText = resultText;
    document.getElementById('correct-answer').innerText = `正确答案：${question.options[question.answer]}`;
    document.getElementById('explanation').innerText = question.explanation;
}

function updateStats() {
    document.getElementById('total-questions').innerText = questions.length;
}

function updateProgress() {
    document.getElementById('progress').innerText = `${currentQuestionIndex + 1} / ${questions.length}`;
}

document.getElementById('prev-btn').addEventListener('click', () => {
    if (currentQuestionIndex > 0) {
        currentQuestionIndex--;
        loadQuestion();
    }
});

document.getElementById('next-btn').addEventListener('click', () => {
    if (currentQuestionIndex < questions.length - 1) {
        currentQuestionIndex++;
        loadQuestion();
    }
});

document.getElementById('submit-btn').addEventListener('click', () => {
    checkAnswer();
});

loadQuestions(); // 初始加载题目数据
