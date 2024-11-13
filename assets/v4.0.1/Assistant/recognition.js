import { GoogleGenerativeAI } from "https://esm.run/@google/generative-ai";
import { generateQnA } from './model.js';
export function recognition(row) {
  const Tds = new Dom.Components();
  const STG=new Dom.Storage();
// console.log(generateQnA())
  const API_KEY = "AIzaSyA8OHc_7x2gCbasUsZ8svDzPI8Gf8kJ_VY";
  const genAI = new GoogleGenerativeAI(API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  function cleanTextForSpeech(text) {
    // Menghapus karakter khusus, simbol yang dapat mengganggu, dan tanda **
    return text
      .replace(/\*\*/g, "")
      .replace(/[^\w\s.,?!]/g, "")
      .replace(/\s+/g, " ")
      .trim();
  }
  let history = [];
  const chat = model.startChat({ history });
 // const casanra=Tds.localStorage('sitemap').get()
 // console.log(casanra)
  const QnA=STG.localStorage('sitemap').get()



  const latihanAI2=generateQnA(QnA);
  const latihanAIStatis = [
    { question: /halo/i, answer: "Halo! Apa yang bisa saya bantu hari ini?" },
    { question: /marisa/i, answer: "Ya, apa yang bisa saya bantu?" },
    { question: /apa kabar/i, answer: "Saya baikbaik saja, terima kasih! Bagaimana dengan Anda?" },
  ];
//console.log(latihanAI2)
  let isSpeaking = false; // Tambahkan deklarasi ini di awal file atau sebelum fungsi yang menggunakannya
  async function run(prompt) {
    // Cek latihanAI2 terlebih dahulu
    for (let item of latihanAI2) {
      if (checkMatch(item, prompt)) {
        try {
          var redData = extractDataFromText(item.answer);
          isSpeaking = true;
          
          // Periksa apakah redData adalah objek dan memiliki properti title
          if (typeof redData === 'object' && redData.hasOwnProperty('title')) {
            responsiveVoice.speak(redData.title, "Indonesian Female", {
              onend: () => {
                isSpeaking = false;
                updateButtonAppearance("default");
                onLink(redData.link)
              },
              onerror: (e) => {
                console.error("Kesalahan saat berbicara:", e);
                isSpeaking = false;
                updateButtonAppearance("default");
              }
            });
          } else {
            // Jika redData bukan objek atau tidak memiliki properti title, gunakan item.answer langsung
            responsiveVoice.speak(item.answer, "Indonesian Female", {
              onend: () => {
                isSpeaking = false;
                updateButtonAppearance("default");
              },
              onerror: (e) => {
                console.error("Kesalahan saat berbicara:", e);
                isSpeaking = false;
                updateButtonAppearance("default");
              }
            });
          }
          
          return;
        } catch (error) {
          console.error("Terjadi kesalahan:", error);
          isSpeaking = false;
          updateButtonAppearance("default");
        }
      }
    }
    
    // Jika tidak ada yang cocok, cek latihanAIStatis
    for (let item of latihanAIStatis) {
      if (checkMatch(item, prompt)) {
        console.log("Jawaban dari latihanAIStatis:", item.answer);
        isSpeaking = true;
        responsiveVoice.speak(item.answer, "Indonesian Female");
        return;
      }
    }
    
    // Jika masih tidak ada yang cocok, gunakan GoogleGenerativeAI
    const result = await chat.sendMessage(prompt);
    const response = await result.response;
    const text = response.text();
    isSpeaking = true;
    responsiveVoice.speak(cleanTextForSpeech(text), "Indonesian Female");
    console.log(cleanTextForSpeech(text));
  }

function checkMatch(item, prompt) {
  // Jika 'jelaskan' atau 'kalu' ada dalam prompt, langsung kembalikan false
  const forbiddenWords = ['jelaskan', 'kalu', 'bagaimana'];
  if (forbiddenWords.some(word => prompt.toLowerCase().includes(word))) {
    return false;
  }

  if (typeof item.question === 'string') {
    if (item.question.startsWith('/') && item.question.endsWith('/i')) {
      // Ekstrak pola regex tanpa tanda / dan flag i
      const patternString = item.question.slice(1, -2);
      // Buat array kata-kata dari pola, abaikan kata-kata umum seperti "di", "mana", "apa", "yang", "adalah"
      const patternWords = patternString.split(/\s+/).filter(word => !['di', 'mana', 'apa', 'yang', 'adalah'].includes(word.toLowerCase()));
      // Buat regex baru yang mencari kata-kata kunci dalam urutan apa pun
      const flexiblePattern = new RegExp(patternWords.map(word => `(?=.*\\b${word}\\b)`).join(''), 'i');
      return flexiblePattern.test(prompt);
    } else {
      return prompt.toLowerCase().includes(item.question.toLowerCase());
    }
  } else if (item.question instanceof RegExp) {
    return item.question.test(prompt);
  }
  
  return false;
}


  // Fungsi untuk memeriksa status pembicara
  function checkSpeakingStatus() {
    if (isSpeaking && !responsiveVoice.isPlaying()) {
      isSpeaking = false;
      updateButtonAppearance("default");
    }
  }

  // Mulai interval untuk memeriksa status pembicara
  setInterval(checkSpeakingStatus, 100);

  var micButton = document.createElement("span");
  micButton.id = "micButton";
  // Membuat elemen icon dan menambahkannya ke button
  var micIcon = document.createElement("i");
  micIcon.classList.add(row.element.icon);
  micIcon.style.fontSize = "18px"; // Atur ukuran font di sini
  micButton.appendChild(micIcon);

  var defaultStyles = {
    backgroundColor: row.element.backgroundColor,
    borderColor: "transparent", // Default border color (bisa disesuaikan)
    color: "white",
  };
  // Menambahkan gaya CSS ke button
  micButton.style.position = "fixed";
  micButton.style.bottom = "20px";
  micButton.style.right = "20px";
  micButton.style.backgroundColor = defaultStyles.backgroundColor;
  micButton.style.color = "white";
  micButton.style.border = "none";
  micButton.style.borderRadius = "50%";
  micButton.style.width = "40px";
  micButton.style.height = "40px";
  micButton.style.display = "flex";
  micButton.style.alignItems = "center";
  micButton.style.justifyContent = "center";
  micButton.style.boxShadow = "0 4px 6px rgba(0, 0, 0, 0.1)";
  micButton.style.cursor = "pointer";
  // Menambahkan button ke body
  document.body.appendChild(micButton);
  // Menambahkan fungsionalitas webkitSpeechRecognition
  var recognition = new (window.SpeechRecognition ||
    window.webkitSpeechRecognition)();
  recognition.lang = "id-ID"; // Atur bahasa ke Bahasa Indonesia
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;

  let isListening = false;

  function updateButtonAppearance(status) {
    switch (status) {
      case "listening":
        micButton.style.backgroundColor = "red";
        micButton.style.borderColor = "red";
        micButton.style.border = "2px solid red";
        micIcon.className = row.element.icon; // Ganti ikon menjadi stop
        break;
      case "speaking":
        micButton.style.backgroundColor = "red";
        micButton.style.borderColor = "red";
        micIcon.className = "fa fa-stop"; // Ganti ikon menjadi stop
        break;
      default:
        micButton.style.backgroundColor = defaultStyles.backgroundColor;
        micButton.style.borderColor = defaultStyles.borderColor;
        micButton.style.border = `2px solid ${defaultStyles.borderColor}`;
        micIcon.className = row.element.icon; // Kembalikan ke ikon mikrofon awal
    }
  }

  micButton.onclick = function () {
    if (isListening) {
      // Menghentikan pengenalan suara
      recognition.stop();
      isListening = false;
      updateButtonAppearance("default");
      console.log("Pengenalan suara dihentikan");
    } else if (isSpeaking) {
      // Menghentikan pembacaan respons
      responsiveVoice.cancel();
      isSpeaking = false;
      updateButtonAppearance("default");
      console.log("Pembacaan respons dihentikan");
    } else {
      // Memulai pengenalan suara
      recognition.start();
      isListening = true;
      updateButtonAppearance("listening");
      console.log("Mendengarkan...");
    }
  };

  recognition.onresult = function (event) {
    var transcript = event.results[0][0].transcript;
    isListening = false;
    if (Tds.cookie().get("oauth_id")) {
      run(transcript);
      isSpeaking = true;
      updateButtonAppearance("speaking");
    } else {
      responsiveVoice.speak(
        "silahkan login terlebih dahulu",
        "Indonesian Female"
      );
      isSpeaking = true;
       updateButtonAppearance("default");
    }
  };

  // Tambahkan event listener untuk mendeteksi akhir pembacaan
  responsiveVoice.OnVoiceReady = function() {
    responsiveVoice.AddEventListener("OnEnd", function() {
      isSpeaking = false;
      updateButtonAppearance("default");
    });
  };

  recognition.onerror = function (event) {
    // console.error('Kesalahan pengenalan suara: ' + event.error);
    // Kembali ke gaya default jika terjadi kesalahan
    micButton.style.backgroundColor = defaultStyles.backgroundColor;
    micButton.style.borderColor = defaultStyles.borderColor;
    micButton.style.border = `2px solid ${defaultStyles.borderColor}`;
    micButton.style.color = defaultStyles.color;
  };

  recognition.onend = function () {
    // Pastikan kembali ke gaya default ketika pengenalan suara selesai
    micButton.style.backgroundColor = defaultStyles.backgroundColor;
    micButton.style.borderColor = defaultStyles.borderColor;
    micButton.style.border = `2px solid ${defaultStyles.borderColor}`;
    micButton.style.color = defaultStyles.color;
  };
function extractDataFromText(Text) {
    // Cari URL dengan menggunakan regex
    var urlMatch = Text.match(/https?:\/\/[^\/]+(\/[^?#]*)?(#[^?#]*)?/);

    if (urlMatch) {
        var fullUrl = urlMatch[0];  // URL lengkap
        var hashPart = fullUrl.match(/#[^?#]*/);  // Bagian setelah #

        // Ambil bagian setelah #
        var link = hashPart ? hashPart[0] : ''; 

        // Hapus URL dari teks asli
        var title = Text.replace(fullUrl, '').trim().replace(/:$/, '');
        
        // Hapus simbol :/i dari title
        title = title.replace(/:\s*\/i/, '').trim();

        // Membuat objek data sesuai dengan struktur yang diinginkan
        const data = {
            'title': title,
            'link': link
        };
        return data;  // Mengembalikan objek data
    } else {
        return null;  // Mengembalikan null jika URL tidak ditemukan
    }
}


}