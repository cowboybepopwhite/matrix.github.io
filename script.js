let questions = [];
let currentQuestionIndex = 0;
let finishedQuestion = 0;
let rightAnswer = 0;

async/*异步函数*/ function loadQuestions() {
    try {
        const response = await fetch('questions.json');

        if (!response.ok) throw new Error('网络错误');

        questions = await response.json();
        document.getElementById('total-questions').innerText = questions.length;//加载总题数
        loadQuestion(); // 加载第一题
    } catch (error) {
        console.error('加载题目失败:', error);
    }
}

document.getElementById('progress').innerText = finishedQuestion;
document.getElementById('accuracy').innerText = rightAnswer / questions.length;


function loadQuestion() {
    const question = questions[currentQuestionIndex];//加载当前题
    if (!question) return;//若不存在则返回

    document.getElementById('question-text').innerText = question.text;//加载题目文本

    const optionsDiv = document.getElementById('options');
    optionsDiv.innerHTML = '';//为输入框元素设置空字符串 '' 以清空它

    question.options.forEach((option, index) => {
        const optionElement = document.createElement('div');//创建节点
        optionElement.innerHTML = `
            <input type="radio" name="option" value="${index}" id="option${index}">
            <label for="option${index}">${option}</label>
        `;/*radio 类型的 <input> 元素通常用于一个单选组中，其中包含一组描述一系列相关选项的单选按钮。*/
        optionsDiv.appendChild(optionElement);
    });
}


function checkAnswer() {
    const selectedOption = document.querySelector('input[name="option"]:checked');//选中的选项
    if (!selectedOption){
        document.getElementById('result-text').innerText = '请选择一个选项';
        document.getElementById('correct-answer').innerText ='';
        document.getElementById('explanation').innerText ='';
        return;
    }

    finishedQuestion += 1;
    if(finishedQuestion > questions.length){
        finishedQuestion = questions.length;
    }

    const answerIndex = parseInt(selectedOption.value);
    const question = questions[currentQuestionIndex];
    const resultText = answerIndex === question.answer ? '回答正确!' : '回答错误!';

    if(answerIndex === question.answer){
        rightAnswer++;
        document.getElementById('total-questions').innerText = questions.length;
    }

    document.getElementById('result-text').innerText = resultText;
    document.getElementById('correct-answer').innerText = `正确答案：${question.options[question.answer]}`;
    document.getElementById('explanation').innerText = question.explanation;
    document.getElementById('progress').innerText = finishedQuestion;
    document.getElementById('accuracy').innerText = rightAnswer / questions.length;
}


document.getElementById('prev-botton').addEventListener('onclick', () => {
    if (currentQuestionIndex > 0) {
        currentQuestionIndex--;
        loadQuestion();
    }
});


document.getElementById('next-botton').addEventListener('onclick', () => {
    if (currentQuestionIndex < questions.length - 1) {
        currentQuestionIndex++;
        loadQuestion();
    }
});


document.getElementById('submit-botton').addEventListener('onclick', () => {
    checkAnswer();
});


loadQuestions(); // 初始加载题目数据


