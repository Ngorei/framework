
const defaultTitles = [
    {
        "timestamp": "7/28/2024, 10:59:39 AM",
        "url": "http://192.168.1.112/DOM4/#home",
        "title": "Ngoreiv4.0.1",
        "target": "1"
    },
    {
        "timestamp": "7/28/2024, 10:59:39 AM",
        "url": "http://192.168.1.112/DOM4/index.html",
        "title": "Components",
        "target": "4"
    },
    {
        "timestamp": "7/28/2024, 10:59:39 AM",
        "url": "http://192.168.1.112/DOM4/#network",
        "title": "Network",
        "target": "11"
    },
    {
        "timestamp": "7/28/2024, 1:28:36 PM",
        "url": "http://192.168.1.112/DOM4/#network/from",
        "title": "From",
        "target": "3"
    },
    {
        "timestamp": "7/28/2024, 1:28:36 PM",
        "url": "http://192.168.1.112/DOM4/#network/xhr",
        "title": "XHR",
        "target": "4"
    }
];

export function generateQnA(titles = defaultTitles) {


    
    function generatequestions(titles) {
        const questions = [];
        
        titles.forEach(item => {
            const title = item.title;
            questions.push({
                question: `/Apa itu ${title}/i`,
                url: item.url
            });
            questions.push({
                question: `/Bagaimana cara menggunakan ${title}/i`,
                url: item.url
            });
            questions.push({
                question: `/Di mana ${title}/i`,
                url: item.url
            });
        });

        return questions;
    }

    function generateAnswers(questions) {
        return questions.map(item => {
            let specificAnswer;
            let cleanQuestion = item.question.replace(/^\/|\/i$/g, ''); // Menghapus / di awal dan /i di akhir pertanyaan
            if (cleanQuestion.startsWith('Apa itu')) {
                specificAnswer = `${cleanQuestion.slice(7)} adalah komponen yang dapat ditemukan di halaman berikut ini: ${item.url}`;
            } else if (cleanQuestion.startsWith('Bagaimana cara menggunakan')) {
                specificAnswer = `Panduan penggunaan ${cleanQuestion.slice(25)} dapat ditemukan di halaman berikut ini: ${item.url}`;
            } else if (cleanQuestion.startsWith('Di mana')) {
                specificAnswer = `Dapat di temukan dalam halaman berikut ini: ${item.url}`;
            } else {
                specificAnswer = `Informasi tentang ${cleanQuestion} dapat ditemukan di halaman berikut ini: ${item.url}`;
            }

            return {
                question: item.question,
                answer: specificAnswer
            };
        });
    }

    const questions = generatequestions(titles);
    const answers = generateAnswers(questions);
    return answers;
}