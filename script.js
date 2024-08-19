let questions = [];
let currentQuestionIndex = 0;
let finishedQuestion = 0;
let rightRate = 0;

// 从本地存储加载用户的选择
function loadUserSelections() {
    const savedSelections = JSON.parse(localStorage.getItem('userSelections')) || {};
    currentQuestionIndex = savedSelections.currentQuestionIndex || 0;
    finishedQuestion = savedSelections.finishedQuestion || 0;
    rightRate = savedSelections.rightRate || 0;

    if (savedSelections.answers) {
        document.querySelectorAll('input[name="option"]').forEach((input) => {
            if (savedSelections.answers[currentQuestionIndex] !== undefined) {
                const savedAnswer = savedSelections.answers[currentQuestionIndex];
                if (input.value == savedAnswer) {
                    input.checked = true;
                }
            }
        });
    }
}

async function loadQuestions() {
    try {
        const response = await fetch('questions.json');

        if (!response.ok) throw new Error('网络错误');

        questions = await response.json();
        document.getElementById('total-questions').innerText = questions.length; // 加载总题数
        loadUserSelections(); // 恢复用户的选择
        loadQuestion(); // 加载第一题
    } catch (error) {
        console.error('加载题目失败:', error);
    }
}

document.getElementById('progress').innerText = finishedQuestion;
document.getElementById('accuracy').innerText = rightRate;

function loadQuestion() {
    const question = questions[currentQuestionIndex]; // 加载当前题
    if (!question) return; // 若不存在则返回

    document.getElementById('question-text').innerText = question.text; // 加载题目文本

    const optionsDiv = document.getElementById('options');
    optionsDiv.innerHTML = ''; // 为输入框元素设置空字符串 '' 以清空它

    question.options.forEach((option, index) => {
        const optionElement = document.createElement('div'); // 创建节点
        optionElement.innerHTML = `
            <input type="radio" name="option" value="${index}" id="option${index}">
            <label for="option${index}">${option}</label>
        `; // radio 类型的 <input> 元素通常用于一个单选组中，其中包含一组描述一系列相关选项的单选按钮。
        optionsDiv.appendChild(optionElement);
    });

    // 设置之前选择的答案
    const savedSelections = JSON.parse(localStorage.getItem('userSelections')) || {};
    const savedAnswer = savedSelections.answers ? savedSelections.answers[currentQuestionIndex] : null;
    if (savedAnswer !== null) {
        document.querySelector(`input[name="option"][value="${savedAnswer}"]`).checked = true;
    }
}

function checkAnswer() {
    const selectedOption = document.querySelector('input[name="option"]:checked'); // 选中的选项
    if (!selectedOption) {
        document.getElementById('result-text').innerText = '请选择一个选项';
        document.getElementById('explanation').innerText = "";
        return;
    }

    const answerIndex = parseInt(selectedOption.value);
    const question = questions[currentQuestionIndex];
    const resultText = answerIndex === question.answer ? '回答正确!' : '回答错误!';

    if (answerIndex === question.answer) {
        rightRate += 1 / questions.length;
        document.getElementById('total-questions').innerText = questions.length;
    }

    document.getElementById('result-text').innerText = resultText;
    document.getElementById('correct-answer').innerText = `正确答案：${question.options[question.answer]}`;
    document.getElementById('explanation').innerText = question.explanation;
    document.getElementById('progress').innerText = finishedQuestion;
    document.getElementById('accuracy').innerText = rightRate;
}

function saveUserSelections() {
    const selectedOption = document.querySelector('input[name="option"]:checked');
    const savedSelections = JSON.parse(localStorage.getItem('userSelections')) || {
        answers: {},
        currentQuestionIndex: 0,
        finishedQuestion: 0,
        rightRate: 0
    };

    if (selectedOption) {
        savedSelections.answers[currentQuestionIndex] = parseInt(selectedOption.value);
    }

    savedSelections.currentQuestionIndex = currentQuestionIndex;
    savedSelections.finishedQuestion = finishedQuestion;
    savedSelections.rightRate = rightRate;

    localStorage.setItem('userSelections', JSON.stringify(savedSelections));
}

document.getElementById('prev-botton').addEventListener('click', () => {
    if (currentQuestionIndex > 0) {
        currentQuestionIndex--;
        loadQuestion();
    }
});

document.getElementById('next-botton').addEventListener('click', () => {
    if (currentQuestionIndex < questions.length - 1) {
        currentQuestionIndex++;
        loadQuestion();
    }
});

let indexnow = -1;

document.getElementById('submit-botton').addEventListener('click', () => {
    if (indexnow !== currentQuestionIndex) {
        if (finishedQuestion < questions.length) {
            finishedQuestion++;
        }
        if (finishedQuestion) checkAnswer();
        saveUserSelections(); // 保存用户的选择
    }
    indexnow = currentQuestionIndex;
});

loadQuestions(); // 初始加载题目数据
