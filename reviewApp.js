// Globals for tracking state of user's review material
const HIRAGANA = "hiragana";
var gbHiragana = false;
const HIRAGANADIACRITICSANDDIGRAPHS = "hiraganaDiacriticsAndDigraphs";
var gbHiraganaDD = false;
const KATAKANA = "katakana";
var gbKatakana = false;
const KATAKANADIACRITICSANDDIGRAPHS = "katakanaDiacriticsAndDigraphs";
var gbKatakanaDD = false;

const VOCAB1 = "vocab1";
var gbVocab1 = false;
const VOCAB2 = "vocab2";
var gbVocab2 = false;
const VOCAB3 = "vocab3";
var gbVocab3 = false;
const VOCAB4 = "vocab4";
var gbVocab4 = false;
const VOCAB5 = "vocab5";
var gbVocab5 = false;
const VOCAB6 = "vocab6";
var gbVocab6 = false;
const VOCAB7 = "vocab7";
var gbVocab7 = false;

// This is what we're currently reviewing
var gReviewCharacters = {};

// Track progress
var gTotalReviews = 0;
var gTotalCorrectAnswers = 0;

function changeReviewState(content, state)
{
    switch(content.toLowerCase())
    {
        case HIRAGANA.toLowerCase():
            gbHiragana = state;
            break;
        case HIRAGANADIACRITICSANDDIGRAPHS.toLowerCase():
            gbHiraganaDD = state;
            break;
        case KATAKANA.toLowerCase():
            gbKatakana = state;
            break;
        case KATAKANADIACRITICSANDDIGRAPHS.toLowerCase():
            gbKatakanaDD = state;
            break;
        case VOCAB1.toLowerCase():
            gbVocab1 = state;
            break;
        case VOCAB2.toLowerCase():
            gbVocab2 = state;
            break;
        case VOCAB3.toLowerCase():
            gbVocab3 = state;
            break;
        case VOCAB4.toLowerCase():
            gbVocab4 = state;
            break;
        case VOCAB5.toLowerCase():
            gbVocab5 = state;
            break;
        case VOCAB6.toLowerCase():
            gbVocab6 = state;
            break;
        case VOCAB7.toLowerCase():
            gbVocab7 = state;
            break;
        default:
            return false;
    }
    
    // User has nothing selected, tell them to select something
    if (!(gbHiragana || gbHiraganaDD || gbKatakana || gbKatakanaDD || gbVocab1 || gbVocab2 || gbVocab3 || gbVocab4 || gbVocab5 || gbVocab6 || gbVocab7))
    {
        resetQuestionElement();
        return false;
    }

    // Reset global and add review characters to it based on what the user has checked
    gReviewCharacters = {};

    let hiraganaCharacters = gbHiragana ? getHirganaCharacters() : {};
    let hiraganaDDCharacters = gbHiraganaDD ? getHirganaDDCharacters() : {};
    let katakanaCharacters = gbKatakana ? getKatakanaCharacters() : {};
    let katakanaDDCharacters = gbKatakanaDD ? getKatakanaDDCharacters() : {};
    let vocab1Characters = gbVocab1 ? getVocabSet1() : {};
    let vocab2Characters = gbVocab2 ? getVocabSet2() : {};
    let vocab3Characters = gbVocab3 ? getVocabSet3() : {};
    let vocab4Characters = gbVocab4 ? getVocabSet4() : {};
    let vocab5Characters = gbVocab5 ? getVocabSet5() : {};
    let vocab6Characters = gbVocab6 ? getVocabSet6() : {};

    gReviewCharacters = {
        ...hiraganaCharacters,
        ...hiraganaDDCharacters,
        ...katakanaCharacters,
        ...katakanaDDCharacters,
        ...vocab1Characters,
        ...vocab2Characters,
        ...vocab3Characters,
        ...vocab4Characters,
        ...vocab5Characters,
        ...vocab6Characters
    };

    getNextCharacter(document.getElementById("currentQuestion"));
}

function getNextCharacter(currentQuestionElement)
{
    currentQuestionElement.style.fontSize = "100px";

    let keys = Object.keys(gReviewCharacters);

    if (keys.length > 0)
    {
        let randomCharacter = keys[getRndInteger(0, keys.length)];

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
        currentQuestionElement.innerHTML = "Error! Reload the page.";   // We should never get here
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
        previousQuestionResultElement.style.color = "Green"
    }
    else
    {
        previousQuestionResultElement.innerHTML = "Wrong!"
        previousQuestionResultElement.style.color = "Red"
    }
}

function updateScore(scoreElement, percentElement)
{
    scoreElement.innerHTML = "Score: " + gTotalCorrectAnswers + " / " + gTotalReviews;
    percentElement.innerHTML = parseFloat((gTotalCorrectAnswers / gTotalReviews) * 100).toFixed(0) + "%"
}

function resetQuestionElement()
{
    const currentQuestionElement = document.getElementById("currentQuestion")
    currentQuestionElement.style.fontSize = "25px";
    currentQuestionElement.innerHTML = "Select material on the left to review";
}

function getRndInteger(min, max) 
{
    return Math.floor(mulberry32(Date.now())() * (max - min) ) + min;
}

function mulberry32(a) {
    return function() {
      var t = a += 0x6D2B79F5;
      t = Math.imul(t ^ t >>> 15, t | 1);
      t ^= t + Math.imul(t ^ t >>> 7, t | 61);
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    }
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

function getHirganaDDCharacters()
{
    return {"が":["ga"],"ぎ":["gi"],"ぐ":["gu"],"げ":["ge"],"ご":["go"],
            "ざ":["za"],"じ":["ji"],"ず":["zu"],"ぜ":["ze"],"ぞ":["zo"],
            "だ":["da"],"ぢ":["di","ji"],"づ":["du","zu"],"で":["de"],"ど":["do"],
            "ば":["ba"],"び":["bi"],"ぶ":["bu"],"べ":["be"],"ぼ":["bo"],
            "ぱ":["pa"],"ぴ":["pi"],"ぷ":["pu"],"ぺ":["pe"],"ぽ":["po"],
            
            "きゃ":["kya"],"きゅ":["kyu"],"きょ":["kyo"],
            "しゃ":["sha"],"しゅ":["shu"],"しょ":["sho"],
            "ちゃ":["cha"],"ちゅ":["chu"],"ちょ":["cho"],
            "にゃ":["nya"],"にゅ":["nyu"],"にょ":["nyo"],
            "ひゃ":["hya"],"ひゅ":["hyu"],"ひょ":["hyo"],
            "みゃ":["mya"],"みゅ":["myu"],"みょ":["myo"],
            "りゃ":["rya"],"りゅ":["ryu"],"りょ":["ryo"],

            "ぎゃ":["gya"],"ぎゅ":["gyu"],"ぎょ":["gyo"],
            "じゃ":["jya"],"じゅ":["jyu"],"じょ":["jyo"],
            "びゃ":["bya"],"びゅ":["byu"],"びょ":["byo"],
            "ぴゃ":["pya"],"ぴゅ":["pyu"],"ぴょ":["pyo"]}
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

function getKatakanaDDCharacters()
{
    return {"ガ":["ga"],"ギ":["gi"],"グ":["gu"],"ゲ":["ge"],"ゴ":["go"],
            "ザ":["za"],"ジ":["ji"],"ズ":["zu"],"ゼ":["ze"],"ゾ":["zo"],
            "ダ":["da"],"ヂ":["di","ji"],"ヅ":["du","zu"],"デ":["de"],"ド":["do"],
            "バ":["ba"],"ビ":["bi"],"ブ":["bu"],"ベ":["be"],"ボ":["bo"],
            "パ":["pa"],"ピ":["pi"],"プ":["pu"],"ペ":["pe"],"ポ":["po"],
            
            "キャ":["kya"],"キュ":["kyu"],"キョ":["kyo"],
            "シャ":["sha"],"シュ":["shu"],"ショ":["sho"],
            "チャ":["cha"],"チュ":["chu"],"チョ":["cho"],
            "ニャ":["nya"],"ニュ":["nyu"],"ニョ":["nyo"],
            "ヒャ":["hya"],"ヒュ":["hyu"],"ヒョ":["hyo"],
            "ミャ":["mya"],"ミュ":["myu"],"ミョ":["myo"],
            "リャ":["rya"],"リュ":["ryu"],"リョ":["ryo"],

            "ギャ":["gya"],"ギュ":["gyu"],"ギョ":["gyo"],
            "ジャ":["jya"],"ジュ":["jyu"],"ジョ":["jyo"],
            "ビャ":["bya"],"ビュ":["byu"],"ビョ":["byo"],
            "ピャ":["pya"],"ピュ":["pyu"],"ピョ":["pyo"]}
}

function getVocabSet1()
{
    return {"おちゃ":["tea"],"りんご":["apple"],"パン":["bread"],"あめ":["hard candy", "rain"],"みず":["water"],
            "犬":["dog"],"ねこ":["cat"],"とり":["bird"],"ぶた":["pig"],"さかな":["fish"],
            "くるま":["car"],"ひこうき":["airplane","plane"],"じてんしゃ":["bicycle"],"バス":["bus"],"タクシー":["taxi"],
            "いす":["chair"],"テーブル":["table"],"つくえ":["desk"],"テレビ":["tv", "television"],"ベッド":["bed"]}
}

function getVocabSet2()
{
    return {"上手":["good at","skillful"],"下手":["bad at","unskillful"],"かんたん":["easy"],"だめ":["no good"],
            "すてき":["splendid","lovely","amazing"],"いろいろ":["various"],"たくさん":["a lot", "many"],"きけん":["dangerous"],
            "きれい":["pretty","clean"],"ていねい":["polite"],"しつれい":["rude"],"ゆうめい":["famous"],"まじめ":["dilligent","serious"],"りっぱ":["splendid","fine"],
            "たいせつ":["important"],"ひつよう":["necessary"],"べんり":["convenient"],"ふべん":["inconvenient"],"とくべつ":["special"],"たいへん":["serious","very","grave","great"]}
}

function getVocabSet3()
{
    return {"大きい":["big"],"小さい":["small"],"おそい":["late","slow"],"はやい":["early","fast"],"おおい":["many"],
            "すくない":["few"],"あたらしい":["new"],"ふるい":["old"],"ひろい":["wide"],"せまい":["narrow"],
            "よい":["good"],"わるい":["bad"],"かるい":["light"],"おもい":["heavy"],"高い":["high","tall","expensive"],
            "安い":["cheap","inexpensive"],"つよい":["strong"],"よわい":["weak"],"あつい":["hot","thick"],"さむい":["cold"]}
}

function getVocabSet4()
{
    return {"ペン":["pen"],"えんぴつ":["pencil"],"かみ":["paper","god","hair"],"せんせい":["teacher"],"きょうしつ":["classroom"],
            "きょうかしょ":["textbook"],"本":["book"],"としょかん":["library"],"せんぱい":["one's senior"],"こうはい":["one's junior"],
            "おとうさん":["father"],"おかあさん":["mother"],"おにいさん":["older brother"],"おとうとさん":["younger brother"],"おねえさん":["older sister"],
            "いもうとさん":["younger sister"],"おや":["parent"],"子ども":["children"],"きょうだい":["siblings","brothers"],"かぞく":["family"]}
}

function getVocabSet5()
{
    return {"日":["sun"],"月":["moon"],"ほし":["star"],"木":["tree"],"くさ":["grass"],
            "山":["mountain"],"川":["river"],"海":["sea"],"かいがん":["beach"],"こうえん":["park"],
            "いえ":["house"],"マンション":["apartment"],"だいどころ":["kitchen"],"へや":["room"],"おてあらい":["bathroom"],
            "わたし":["i","me"],"あなた":["you"],"かれ":["he","him"],"かのじょ":["she","her"],"もの":["thing","physical thing"]}
}

function getVocabSet6()
{
    return {"言う":["to say"],"話す":["to talk"],"いく":["to go"],"くる":["to come"],"でかける":["to go out"],
            "かえる":["to return home","to go home","to change"],"食べる":["to eat"],"飲む":["to drink"],"みる":["to see","to watch"],"みせる":["to show"],
            "あそぶ":["to play"],"あるく":["to walk"],"はしる":["to run"],"およぐ":["to swim"],"うたう":["to sing"],
            "きく":["to listen","to hear","to ask"],"みえる":["to be seen","to be visible","to be able to see"],"のぼる":["to climb"],"つかれる":["to get tired"],"やすむ":["to rest"]}
}

function getVocabSet7()
{
    return {"":[""],"":[""],"":[""],"":[""],"":[""],
            "":[""],"":[""],"":[""],"":[""],"":[""],
            "":[""],"":[""],"":[""],"":[""],"":[""],
            "":[""],"":[""],"":[""],"":[""],"":[""]}
}
