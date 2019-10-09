// Globals for tracking state of user's review material
const HIRAGANA = "hiragana";
var gbHiragana = false;
const KATAKANA = "katakana";
var gbKatakana = false;

// This is what we're currently reviewing
var gReviewCharacters = {};

// Track progress
var gTotalReviews = 0;
var gTotalCorrectAnswers = 0;

function changeReviewState(content, state)
{
    switch(content.toLowerCase())
    {
        case HIRAGANA:
            gbHiragana = state;
            break;
        case KATAKANA:
            gbKatakana = state;
            break;
        default:
            return false;
    }

    getNextCharacter(document.getElementById("currentQuestion"));
}

function getNextCharacter(currentQuestionElement)
{
    currentQuestionElement.style.fontSize = "100px";

    let hiraganaCharacters = gbHiragana ? getHirganaCharacters() : {};
    let katakanaCharacters = gbKatakana ? getKatakanaCharacters() : {};

    gReviewCharacters = {
        ...hiraganaCharacters,
        ...katakanaCharacters
    }

    let keys = Object.keys(gReviewCharacters);

    if (keys.length > 0)
    {
        let randomCharacter = keys[Math.random() * keys.length << 0];

        currentQuestionElement.innerHTML = randomCharacter;
    }
}

function checkAnswer(currentQuestionElement, userInputTextBoxElement, formElement, previousQuestionResultElement, previousQuestionElement, previousQuestionAnswerElement)
{
    let questionCharacter = currentQuestionElement.innerHTML;
    let userAnswer = userInputTextBoxElement.value;

    if (questionCharacter in gReviewCharacters)    // This should never fail
    {
        if (gReviewCharacters[questionCharacter].includes(userAnswer.toLowerCase()))
        {
            processAnswer(questionCharacter, userAnswer, true, previousQuestionResultElement, previousQuestionElement, previousQuestionAnswerElement);
            gTotalCorrectAnswers++;
        }
        else
        {
            processAnswer(questionCharacter, gReviewCharacters[questionCharacter][0], false, previousQuestionResultElement, previousQuestionElement, previousQuestionAnswerElement);
        }
        gTotalReviews++;
    }
    else
    {
        currentQuestionElement.innerHTML = "Error! Reload the page.";
    }

    formElement.reset();
}

function processAnswer(questionCharacter, questionAnswer, bCorrect, previousQuestionResultElement, previousQuestionElement, previousQuestionAnswerElement)
{
    previousQuestionResultElement.style.visibility = "visible";
    previousQuestionElement.style.visibility = "visible";
    previousQuestionAnswerElement.style.visibility = "visible";

    previousQuestionElement.innerHTML = questionCharacter;
    previousQuestionAnswerElement.innerHTML = questionAnswer;

    if (bCorrect)
    {
        previousQuestionResultElement.innerHTML = "Correct!"
    }
    else
    {
        previousQuestionResultElement.innerHTML = "Wrong!"
    }
}

function updateScore(scoreElement, percentElement)
{
    scoreElement.innerHTML = "Score: " + gTotalCorrectAnswers + " / " + gTotalReviews;
    percentElement.innerHTML = parseFloat((gTotalCorrectAnswers / gTotalReviews) * 100).toFixed(0) + "%"
}

/**
 * Data
 */
function getHirganaCharacters()
{
    return {"あ":["a"], "い":["i"], "う":["u"], "え":["e"], "お":["o"],
            "か":["ka"], "き":["ki"], "く":["ku"], "け":["ke"], "こ":["ko"],
            "さ":["sa"], "し":["shi", "si"], "す":["su"], "せ":["se"], "そ":["so"],
            "た":["ta"], "ち":["chi"], "つ":["tsu", "tu"], "て":["te"], "と":["to"],
            "な":["na"], "に":["ni"], "ぬ":["nu"], "ね":["ne"], "の":["no"],
            "は":["ha"], "ひ":["hi"], "ふ":["fu", "hu"], "へ":["he"], "ほ":["ho"],
            "ま":["ma"], "み":["mi"], "む":["mu"], "め":["me"], "も":["mo"],
            "ら":["ra", "la"], "り":["ri", "li"], "る":["ru", "lu"], "れ":["re", "le"], "ろ":["ro", "lo"],
            "や":["ya"], "ゆ":["yu"], "よ":["yo"], 
            "わ":["wa"], "を":["wo"], "ん":["n", "nn"]}
}

function getKatakanaCharacters()
{
    return {"ア":["a"], "イ":["i"], "ウ":["u"], "エ":["e"], "オ":["o"],
            "カ":["ka"], "キ":["ki"], "ク":["ku"], "ケ":["ke"], "コ":["ko"],
            "サ":["sa"], "シ":["shi", "si"], "ス":["su"], "セ":["se"], "ソ":["so"],
            "タ":["ta"], "チ":["chi"], "ツ":["tsu", "tu"], "テ":["te"], "ト":["to"],
            "ナ":["na"], "ニ":["ni"], "ヌ":["nu"], "ネ":["ne"], "ノ":["no"],
            "ハ":["ha"], "匕":["hi"], "フ":["fu", "hu"], "ヘ":["he"], "ホ":["ho"],
            "マ":["ma"], "ミ":["mi"], "ム":["mu"], "メ":["me"], "モ":["mo"],
            "ラ":["ra", "la"], "リ":["ri", "li"], "ル":["ru", "lu"], "レ":["re", "le"], "ロ":["ro", "lo"],
            "ヤ":["ya"], "ユ":["yu"], "ヨ":["yo"], 
            "ワ":["wa"], "ヲ":["wo"], "ン":["n", "nn"]}
}
