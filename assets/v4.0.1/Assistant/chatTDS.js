import { GoogleGenerativeAI } from "https://esm.run/@google/generative-ai";
// Pindahkan deklarasi variabel ini ke bagian atas file
let dbAi;
let dbReady = false;
function capitalizeAndLimit(text) {
  // Capitalize each word
  var capitalizedText = text
    .split(" ")
    .map(function (word) {
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(" ");

  // Limit to 20 characters
  if (capitalizedText.length > 15) {
    capitalizedText = capitalizedText.slice(0, 15) + "...";
  }
  return capitalizedText;
}
// Contoh penggunaan
// Fungsi untuk membuka database
function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("ChatDatabase", 2); // Ubah versi database
    request.onerror = (event) => {
      console.error("Error membuka database:", event.target.error);
      reject("Error membuka database");
    };

    request.onsuccess = (event) => {
      dbAi = event.target.result;
      dbReady = true;
     // console.log("Database berhasil dibuka");
      resolve(dbAi);
    };

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      // Pastikan object store 'conversations' dibuat jika belum ada
      if (!db.objectStoreNames.contains("conversations")) {
        const objectStore = db.createObjectStore("conversations", {
          keyPath: "id",
          autoIncrement: true,
        });
        objectStore.createIndex("timestamp", "timestamp", { unique: false });
        objectStore.createIndex("conversationTitle", "conversationTitle", {
          unique: false,
        });
      }

      // Pastikan object store 'conversationTitles' dibuat jika belum ada
      if (!db.objectStoreNames.contains("conversationTitles")) {
        const titleStore = db.createObjectStore("conversationTitles", {
          keyPath: "id",
          autoIncrement: true,
        });
        titleStore.createIndex("title", "title", { unique: true });
      }
    };
  });
}

// Fungsi utama untuk menginisialisasi asisten
export async function initializeAssistant(config,tokenize) {
// main.js

  const ICN = config.icon;
  const init=tokenize.generativeAI;
  try {
    await openDB();
    await loadMessages();
  } catch (error) {}

  const latihanAI = [
    { question: /halo/i, answer: "Halo! Apa yang bisa saya bantu hari ini?" },
    { question: /marisa/i, answer: "Ya, apa yang bisa saya bantu?" },
    { question: /apa kabar/i, answer: "Watiyah, piyo-piyo hu. Wanu itoh?" },
    // Tambahkan pertanyaan lain di sini
  ];
  let isSpeaking = false; // Tambahkan variabel ini
  let isTTSActive = true; // Variabel untuk melacak status text-to-speech
  const recognition = new webkitSpeechRecognition(); // Untuk Chrome
  recognition.lang = "id-ID"; // Atur bahasa yang diinginkan, misalnya Bahasa Indonesia
  recognition.interimResults = false; // Atur apakah hasil interim diterima atau tidak (default: false)
  function speakText(text) {
    if (!isTTSActive) return; // Jangan berbicara jika TTS dinonaktifkan

    isSpeaking = true;
    // Male Female
    responsiveVoice.speak(text, "Indonesian Female", {
      onend: function () {
        isSpeaking = false;
      },
    });
  }
  // Event handler ketika hasil suara terdeteksi
  recognition.onresult = function (event) {
    const hasil = event.results[0][0].transcript; // Ambil hasil teks dari suara yang terdeteksi
    // resultPara.textContent = "Anda mengatakan: " + hasil;
    // Masukkan hasil ke dalam #messageInput
    document.getElementById("messageInput").value = hasil;

    // Kirim pesan secara otomatis
    sendMessage(hasil);
  };

  // Tambahkan kode untuk tombol mikrofon
  const micButton = document.getElementById("micButton");
  let isListening = false;

  micButton.addEventListener("click", function () {
    if (!isListening) {
      recognition.start();
      // resultPara.textContent = "Mendengarkan...";
      micButton.innerHTML = '<i class="' + ICN.microphone[0] + '"></i>';
      isListening = true;
    } else {
      recognition.cancel();
      // resultPara.textContent = "Pengenalan suara dihentikan.";
      micButton.innerHTML = '<i class="' + ICN.microphone[1] + '"></i>';
      isListening = false;
    }
  });

  // Tambahkan event listener untuk menangani penghentian pengenalan suara
  recognition.onend = function () {
    if (isListening) {
      micButton.innerHTML = '<i class="' + ICN.microphone[1] + '"></i>';
      isListening = false;
    }
  };
  const API_KEY =init.API_KEY;
  // Access your API key (see "Set up your API key" above)
  const genAI = new GoogleGenerativeAI(API_KEY);
  // Gunakan model gemini-pro
  const model = genAI.getGenerativeModel({ model:init.model});
  let history = [];

  let chat = model.startChat({
    history,
  });

  let isTyping = false;
  let shouldStop = false;
  const stopBtnassistant = document.getElementById("stopBtnassistant");
  function getLatihanAIAnswer(question) {
    const item = latihanAI.find((item) => item.question.test(question));
    return item ? item.answer : null;
  }

  function logFirst250Chars(text) {
    console.log("250 karakter pertama dari jawaban AI:");
    console.log(text.substring(0, 250));
  }

  // Modifikasi fungsi run untuk menggunakan latihanAI jika cocok
  async function run(prompt) {
    isTyping = true;
    shouldStop = false;

    const latihanAnswer = getLatihanAIAnswer(prompt);
    if (latihanAnswer) {
      return latihanAnswer;
    } else {
      try {
        const result = await chat.sendMessage(prompt);
        const response = await result.response;
        const text = response.text();
        logFirst250Chars(text);
        history.push({
          role: "model",
          parts: [{ text: text }],
        });

        return text;
      } catch (error) {
        // console.error("Error detail:", error);
        isTyping = false;
        stopBtnassistant.style.display = "none";

        return (
          "Maaf, terjadi kesalahan saat berkomunikasi dengan AI. Detail: " +
          error.message
        );
      }
    }
  }

  // Ubah event listener untuk tombol Send
  const sendButton = document.getElementById(config.elementById);
  sendButton.addEventListener("click", function (event) {
    event.preventDefault(); // Mencegah perilaku default jika tombol berada dalam form
    sendMessage(event);
  });

  // Tambahkan event listener untuk input
  const messageInput = document.getElementById("messageInput");
  messageInput.addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
      event.preventDefault(); // Mencegah newline dalam input
      sendMessage(event);
    }
  });

  // Fungsi-fungsi yang menggunakan database
  async function saveMessage(role, text) {
    if (!dbReady) {
      await openDB();
    }
    return new Promise((resolve, reject) => {
      const transaction = dbAi.transaction(["conversations"], "readwrite");
      const store = transaction.objectStore("conversations");
      const message = { role, text, timestamp: new Date().getTime() };
      const request = store.add(message);

      request.onerror = (event) => reject("Error menyimpan pesan");
      request.onsuccess = (event) => resolve(event.target.result);
    });
  }

  async function getAllMessages() {
    if (!dbReady) {
      await openDB();
    }
    return new Promise((resolve, reject) => {
      const transaction = dbAi.transaction(["conversations"], "readonly");
      const store = transaction.objectStore("conversations");
      const request = store.getAll();

      request.onerror = (event) => {
        reject("Error mengambil pesan");
      };
      request.onsuccess = (event) => {
        //console.log("Berhasil mengambil pesan:", event.target.result);
        resolve(event.target.result);
      };
    });
  }

  // Tambahkan variabel untuk menyimpan judul percakapan saat ini
  let currentConversationTitle = "";

  // Modifikasi fungsi saveMessage
  async function saveMessage(role, text) {
    if (!dbReady) {
      await openDB();
    }
    return new Promise((resolve, reject) => {
      const transaction = dbAi.transaction(["conversations"], "readwrite");
      const store = transaction.objectStore("conversations");
      const message = {
        role,
        text,
        timestamp: new Date().getTime(),
        conversationTitle: currentConversationTitle,
      };
      const request = store.add(message);

      request.onerror = (event) => reject("Error menyimpan pesan");
      request.onsuccess = (event) => resolve(event.target.result);
    });
  }

  // Modifikasi fungsi sendMessage
  async function sendMessage(event) {
    const messageInput = document.getElementById("messageInput");
    const prompt = messageInput.value;
    const messageText = messageInput.value.trim();

    if (messageText !== "" && !isTyping) {
      // Jika ini adalah pesan pertama dalam percakapan baru, atur judul
      if (currentConversationTitle === "") {
        currentConversationTitle = messageText.substring(0, 50); // Ambil 50 karakter pertama sebagai judul
        await saveConversationTitle(currentConversationTitle);
      }

      // Tambahkan kode ini untuk menampilkan pesan pengguna
      const userMessageElement = document.createElement("div");
      userMessageElement.classList.add("assistant-message", "user");
      userMessageElement.innerHTML = `<div class="message-text2">${messageText} </div>`;
      document
        .querySelector(".assistant-messages")
        .appendChild(userMessageElement);

      try {
        await saveMessage("user", messageText);
      } catch (error) {
        console.error("Error saat menyimpan pesan:", error);
      }

      // Buat elemen pesan baru
      const messageElement = document.createElement("div");
      messageElement.classList.add("assistant-message", "assistant");

      const messageTextElement = document.createElement("div");
      messageTextElement.classList.add("message-text");
      messageTextElement.textContent = "Assistant: ";

      // Tambahkan indikator mengetik ke dalam message-text
      const typingIndicator = document.createElement("span");
      typingIndicator.classList.add("typing-indicator");
      typingIndicator.textContent = "Mengetik";
      messageTextElement.appendChild(typingIndicator);

      messageElement.appendChild(messageTextElement);

      // Tambahkan pesan baru ke container pesan
      const messagesContainer = document.querySelector(".assistant-messages");
      messagesContainer.appendChild(messageElement);

      // Bersihkan input field
      messageInput.value = "";

      // Tampilkan tombol Stop
      stopBtnassistant.style.display = "inline-block";

      // Kirim permintaan ke API
      const jawaban = await run(prompt);

      // Hapus indikator mengetik
      typingIndicator.remove();

      // Simulasikan respons AI
      const cleanedText = cleanTextForSpeech(jawaban);
      console.log(cleanedText);
      // speakText(cleanedText);
      responsiveVoice.speak(cleanedText, "Indonesian Female");

      simulateAIResponse(jawaban, messageTextElement);
    }
  }
  function cleanTextForSpeech(text) {
    // Menghapus karakter khusus, simbol yang dapat mengganggu, dan tanda **
    return text
      .replace(/\*\*/g, "")
      .replace(/[^\w\s.,?!]/g, "")
      .replace(/\s+/g, " ")
      .trim();
  }
  // Definisikan messagesContainer di awal script
  const messagesContainer = document.querySelector(".assistant-messages");

  async function simulateAIResponse(output, messageTextElement) {
    // Simpan respons AI ke IndexedDB dan dapatkan ID-nya
    const messageId = await saveMessage("assistant", output);

    const formattedResponse = formatAIResponse(output);
    typeText(messageTextElement, formattedResponse, output, messageId);

    // Pindahkan pemanggilan speakText ke sini
    if (isTTSActive) {
      const cleanedText = cleanTextForSpeech(output);
      speakText(cleanedText);
    }
  }

  // Modifikasi fungsi typeText
  function typeText(element, html, originalText, messageId, index = 0) {
    if (index < html.length && !shouldStop) {
      element.innerHTML = "Assistant:" + html.substring(0, index + 1);
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
      setTimeout(
        () => typeText(element, html, originalText, messageId, index + 1),
        20
      );
    } else {
      isTyping = false;
      stopBtnassistant.style.display = "none";

      // Buat container untuk ikon-ikon
      const iconContainer = document.createElement("div");
      iconContainer.classList.add("icon-container");

      // Tambahkan tombol salin
      const copyButton = document.createElement("span");
      copyButton.innerHTML = '<i class="' + ICN.message[0] + '"></i>';
      copyButton.classList.add("icon-Assistant", "copy-icon");
      copyButton.title = "Salin pesan";
      copyButton.addEventListener("click", () => copyToClipboard(originalText));

      // Tambahkan tombol hapus
      const deleteButton = document.createElement("span");
      deleteButton.innerHTML = '<i class="' + ICN.message[1] + '"></i>';
      deleteButton.classList.add("icon-Assistant", "delete-icon");
      deleteButton.title = "Hapus pesan";
      // deleteButton.addEventListener("click", () => deleteMessage(messageId, element.parentNode));
      deleteButton.addEventListener("click", async () => {
        await deleteMessage(messageId);
        await loadMessages(); // Muat ulang pesan setelah menghapus
      });

      // Tambahkan kedua tombol ke iconContainer
      iconContainer.appendChild(copyButton);
      iconContainer.appendChild(deleteButton);

      // Tambahkan iconContainer setelah message-text
      element.parentNode.appendChild(iconContainer);
    }
  }

  // Fungsi untuk menghapus pesan
  async function deleteMessage(messageId, messageElement) {
    if (confirm("Apakah Anda yakin ingin menghapus pesan ini?")) {
      try {
        await deleteMessageFromDB(messageId);
        messageElement.remove();
        //console.log("Pesan berhasil dihapus");
      } catch (error) {
       // console.error("Gagal menghapus pesan:", error);
        alert("Gagal menghapus pesan. Silakan coba lagi nanti.");
      }
    }
  }

  // Fungsi untuk menghapus pesan dari IndexedDB
  async function deleteMessageFromDB(messageId) {
    if (!dbReady) {
      await openDB();
    }
    return new Promise((resolve, reject) => {
      const transaction = dbAi.transaction(["conversations"], "readwrite");
      const store = transaction.objectStore("conversations");
      const request = store.delete(messageId);

      request.onerror = (event) => reject("Error menghapus pesan");
      request.onsuccess = (event) => resolve(event.target.result);
    });
  }

  function formatAIResponse(text) {
    // Ubah newline menjadi <br> untuk menjaga pemformatan
    text = text.replace(/\n/g, "<br>");

    // Deteksi dan format kode
    text = text.replace(
      /```(\w+)?\n([\s\S]+?)\n```/g,
      function (match, lang, code) {
        return `<pre><code class="language-${lang || ""}">${escapeHtml(
          code.trim()
        )}</code></pre>`;
      }
    );
    // Format teks tebal
    text = text.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
    // Format teks miring
    text = text.replace(/\*(.*?)\*/g, "<em>$1</em>");
    // Format daftar tidak berurutan
    text = text.replace(/^- (.+)$/gm, "<li>$1</li>");
    text = text.replace(/<li>(.+?)<\/li>/g, "<ul><li>$1</li></ul>");
    // Format daftar berurutan
    text = text.replace(/^\d+\. (.+)$/gm, "<li>$1</li>");
    text = text.replace(/<li>(.+?)<\/li>/g, "<ol><li>$1</li></ol>");
    // Bungkus paragraf
    text = text.replace(/(.+?)(?=<br>|$)/gs, "<div>$1</div>");

    return "<div class='ai-response'>" + text + "</div>";
  }

  function escapeHtml(unsafe) {
    return unsafe
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  // Tambahkan event listener untuk tombol Stop
  stopBtnassistant.addEventListener("click", () => {
    shouldStop = true;
    recognition.stop();
    if (isSpeaking) {
      speechSynthesis.cancel(); // Hentikan semua ucapan yang sedang berlangsung
      isSpeaking = false;
    }
  });

  function copyToClipboard(text) {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();

    try {
      document.execCommand("copy");
      // alert('Teks telah disalin ke clipboard!');
    } catch (err) {
      console.error("Gagal menyalin teks: ", err);
    }
    document.body.removeChild(textArea);
  }

  // Tambahkan fungsi untuk menghapus pesan dari IndexedDB
  function deleteMessage(id) {
    return new Promise((resolve, reject) => {
      const transaction = dbAi.transaction(["conversations"], "readwrite");
      const store = transaction.objectStore("conversations");
      const request = store.delete(id);

      request.onerror = (event) => reject("Error menghapus pesan");
      request.onsuccess = (event) => resolve(event.target.result);
    });
  }

  // Tambahkan fungsi untuk menghapus semua pesan
  async function deleteAllMessages() {
    if (!dbReady) {
      await openDB();
    }

    return new Promise((resolve, reject) => {
      if (!dbAi) {
        reject(new Error("Database belum diinisialisasi"));
        return;
      }
      const transaction = dbAi.transaction(["conversations"], "readwrite");
      const objectStore = transaction.objectStore("conversations");
      const request = objectStore.clear();
      request.onerror = (event) => {
        reject(event.target.error);
      };
      request.onsuccess = (event) => {
        resolve();
      };
    });
  }

  // Tambahkan variabel untuk elemen-elemen yang diperlukan
  const fileAnalysisSection = document.querySelector(".file-analysis");
  const fileInput = document.createElement("input");
  fileInput.type = "file";
  fileInput.id = "fileInput";
  fileInput.style.display = "none"; // Sembunyikan input file
  document.body.appendChild(fileInput); // Tambahkan fileInput ke dalam DOM, misalnya ke body
  const analysisButton = document.getElementById("AnalisisButton");
  function detectFileType(fileName) {
    const extension = fileName.split(".").pop().toLowerCase();
   switch (extension) {
    case "js":
      return "JavaScript";
    case "py":
      return "Python";
    case "html":
      return "HTML";
    case "css":
      return "CSS";
    case "txt":
      return "Text";
    case "doc":
    case "docx":
      return "Word Document";
    default:
      return "Unknown";
  }
}


  // Tambahkan fungsi analyzeFileContent
  async function analyzeFileContent(content, fileType, fileName) {
    const prompt = `Analisis file ${fileType} berikut dan berikan ringkasan singkat tentang isinya, serta saran perbaikan jika ada:\n\n${content}`;

    try {
      const result = await chat.sendMessage(prompt);
      const response = await result.response;
      const analysisText = response.text();

      // Simpan hasil analisis
      //await saveMessage("user", `Analisis file: ${fileType}`);
      await saveMessage("assistant", analysisText);

      // Perbarui judul percakapan jika belum ada
      //if (currentConversationTitle === "") {
        currentConversationTitle =  `Analisis file: ${fileType}`;
        await saveConversationTitle(currentConversationTitle);
      //}

      return analysisText;
    } catch (error) {
      //console.error("Error saat menganalisis file:", error);
      const errorMessage = "Maaf, terjadi kesalahan saat menganalisis file.";
      await saveMessage("assistant", errorMessage);
      return errorMessage;
    }
  }

  // Ganti fungsi analyzeFile dengan selectAndAnalyzeFile
  async function selectAndAnalyzeFile() {
    const tempFileInput = document.createElement("input");
    tempFileInput.type = "file";
    tempFileInput.accept = ".js,.py,.html,.css,.txt,.doc,.docx";
    tempFileInput.addEventListener("change", async function () {
      const file = this.files[0];
      if (file) {
        try {
          // Aktifkan tombol stop dan set isTyping menjadi true
          stopBtnassistant.style.display = "inline-block";
          isTyping = true;
          // Tambahkan pesan "menunggu hasil analisis" dengan indikator mengetik
          const waitingMessage = document.createElement("div");
          waitingMessage.classList.add("assistant-message", "assistant");
          const waitingTextElement = document.createElement("div");
          waitingTextElement.classList.add("message-text");
          waitingTextElement.innerHTML = "Assistant: Menganalisis ";

          const typingIndicator = document.createElement("span");
          typingIndicator.classList.add("typing-indicator");
          waitingTextElement.appendChild(typingIndicator);

          waitingMessage.appendChild(waitingTextElement);
          document
            .querySelector(".assistant-messages")
            .appendChild(waitingMessage);

          const fileContent = await file.text();
          const fileType = detectFileType(file.name);
          const analysis = await analyzeFileContent(fileContent, fileType);

          // Hapus pesan "menunggu hasil analisis"
          waitingMessage.remove();

          // Tampilkan hasil analisis
          const messageElement = document.createElement("div");
          messageElement.classList.add("assistant-message", "assistant");
          const messageTextElement = document.createElement("div");
          messageTextElement.classList.add("message-text");
          messageTextElement.innerHTML =
            `Analisis file ${file.name}:\n\n` + formatAIResponse(analysis);
          messageElement.appendChild(messageTextElement);
          document
            .querySelector(".assistant-messages")
            .appendChild(messageElement);

          const messagesContainer = document.querySelector(
            ".assistant-messages"
          );
          messagesContainer.scrollTop = messagesContainer.scrollHeight;

          // Nonaktifkan tombol stop dan set isTyping menjadi false setelah selesai
          stopBtnassistant.style.display = "none";
          isTyping = false;
        } catch (error) {
          console.error("Error:", error);
          //alert("Terjadi kesalahan saat menganalisis file.");
          // Pastikan untuk menonaktifkan tombol stop dan reset isTyping jika terjadi error
          stopBtnassistant.style.display = "none";
          isTyping = false;
        }
      }
    });

    tempFileInput.click();
  }
  // Ubah event listener untuk #AnalisisButton
  analysisButton.addEventListener("click", selectAndAnalyzeFile);

  // Tambahkan fungsi untuk mengontrol text-to-speech
  function toggleTTS() {
    isTTSActive = !isTTSActive;
    const ttsAssistant = document.getElementById("ttsAssistant");
    if (isTTSActive) {
      ttsAssistant.innerHTML = '<i class="' + ICN.volume[0] + '"></i>';
      responsiveVoice.resume();
    } else {
      ttsAssistant.innerHTML = '<i class="' + ICN.volume[1] + '"></i>';
      if (responsiveVoice.isPlaying()) {
        responsiveVoice.pause();
      }
    }
  }

  // Tambahkan event listener untuk tombol TTS
  const ttsAssistant = document.getElementById("ttsAssistant");
  ttsAssistant.addEventListener("click", toggleTTS);
  async function deleteAllConversationTitles() {
    if (!dbReady) {
      await openDB();
    }
    return new Promise((resolve, reject) => {
      const transaction = dbAi.transaction(["conversationTitles"], "readwrite");
      const store = transaction.objectStore("conversationTitles");
      const request = store.clear();
      request.onerror = (event) => reject("Error menghapus judul percakapan");
      request.onsuccess = (event) => resolve();
    });
  }
  // Tambahkan event listener untuk tombol "Hapus Semua"
  const clearAllButton = document.getElementById("clearAllButton");
  clearAllButton.addEventListener("click", async () => {
    try {
      await deleteAllMessages();
      await deleteAllConversationTitles();
      document.querySelector(".assistant-messages").innerHTML = "";
      document.querySelector("#conversationList").innerHTML = "";
     // console.log("Semua pesan berhasil dihapus dan tampilan diperbarui");
    } catch (error) {
      //console.error("Gagal menghapus pesan:", error);
     // alert("Gagal menghapus pesan. Silakan coba lagi nanti.");
    }
  });

  // Tambahkan fungsi untuk memulai percakapan baru
  function startNewConversation() {
    history = [];
    chat = model.startChat({
      history,
    });
    document.querySelector(".assistant-messages").innerHTML = "";
    console.log("Percakapan baru dimulai");
    currentConversationTitle = ""; // Reset judul percakapan
  }

  // Tambahkan event listener untuk tombol percakapan baru
  const newChatButton = document.getElementById("newChatassistant");
  if (newChatButton) {
    newChatButton.addEventListener("click", startNewConversation);
  } else {
    console.error("Elemen dengan ID 'newChatassistant' tidak ditemukan");
  }

  // Tambahkan fungsi untuk menyimpan judul percakapan baru
  async function saveConversationTitle(title) {
    if (!dbReady) {
      await openDB();
    }
    return new Promise((resolve, reject) => {
      const transaction = dbAi.transaction(["conversationTitles"], "readwrite");
      const store = transaction.objectStore("conversationTitles");
      const request = store.add({ title: title });
      request.onsuccess = (event) => resolve(event.target.result);
    });
  }

  // Tambahkan fungsi untuk mendapatkan semua judul percakapan
  async function getAllConversationTitles() {
    if (!dbReady) {
      await openDB();
    }
    return new Promise((resolve, reject) => {
      const transaction = dbAi.transaction(["conversationTitles"], "readonly");
      const store = transaction.objectStore("conversationTitles");
      const request = store.getAll();

      request.onerror = (event) => reject("Error mengambil judul percakapan");
      request.onsuccess = (event) => resolve(event.target.result);
    });
  }

  // Modifikasi fungsi loadMessages untuk menampilkan daftar percakapan
  async function loadMessages() {
    try {
      // console.log("Memulai loadMessages");
      if (!dbReady) {
        //console.log("Database belum siap, membuka database...");
        await openDB();
      }
      const messages = await getAllMessages();
      // console.log("Pesan yang dimuat:", messages);
      const messagesContainer = document.querySelector(".assistant-messages");
      if (!messagesContainer) {
        console.error("Container .assistant-messages tidak ditemukan");
        return;
      }
      messagesContainer.innerHTML = "";

      const titles = await getAllConversationTitles();
      const messagesListContainer = document.querySelector("#conversationList");
      const titleList = document.createElement("ul");
      titles.forEach((titleObj) => {
        const listItem = document.createElement("li");

        listItem.style.cursor = "pointer";
        listItem.textContent = capitalizeAndLimit(titleObj.title);
        listItem.className = "nav-link";

        listItem.addEventListener("click", () =>
          loadConversation(titleObj.title)
        );
        messagesListContainer.appendChild(listItem);
      });

      messages.forEach((message) => {
        const messageElement = document.createElement("div");
        messageElement.classList.add("assistant-message", message.role);

        const messageTextElement = document.createElement("div");
        messageTextElement.classList.add("message-text");

        if (message.role === "user") {
          messageTextElement.textContent = message.text;
        } else {
          messageTextElement.innerHTML =
            "Assistant: " + formatAIResponse(message.text);
        }

        messageElement.appendChild(messageTextElement);

        // Tambahkan tombol-tombol setelah message-text
        const buttonContainer = document.createElement("div");
        buttonContainer.classList.add("message-buttons");
        if (message.role === "assistant") {
          const copyButton = document.createElement("span");
          copyButton.innerHTML = '<i class="' + ICN.message[0] + '"></i>';
          copyButton.classList.add("icon-Assistant");
          copyButton.addEventListener("click", () =>
            copyToClipboard(message.text)
          );
          buttonContainer.appendChild(copyButton);
        }

        const deleteButton = document.createElement("span");
        deleteButton.innerHTML = '<i class="' + ICN.message[1] + '"></i>';
        deleteButton.classList.add("icon-Assistant");
        deleteButton.addEventListener("click", async () => {
          await deleteMessage(message.id);
          await loadMessages(); // Muat ulang pesan setelah menghapus
        });

        if (message.role === "assistant") {
          buttonContainer.appendChild(deleteButton);
        }
        messageElement.appendChild(buttonContainer);
        messagesContainer.appendChild(messageElement);
      });

      messagesContainer.scrollTop = messagesContainer.scrollHeight;
     // console.log("Pesan berhasil dimuat ke dalam container");
    } catch (error) {
      console.error("Error dalam loadMessages:", error);
    }
  }

  // Tambahkan fungsi untuk memuat percakapan berdasarkan judul
  async function loadConversation(title) {
    const messages = await getAllMessages();
    const filteredMessages = messages.filter(
      (msg) => msg.conversationTitle === title
    );

    const messagesContainer = document.querySelector(".assistant-messages");
    messagesContainer.innerHTML = "";

    filteredMessages.forEach((message) => {
      const messageElement = document.createElement("div");
      messageElement.classList.add("assistant-message", message.role);

      const messageTextElement = document.createElement("div");
      messageTextElement.classList.add("message-text");

      if (message.role === "user") {
        messageTextElement.textContent = message.text;
      } else {
        messageTextElement.innerHTML =
          "Assistant: " + formatAIResponse(message.text);
      }

      messageElement.appendChild(messageTextElement);

      // Tambahkan tombol-tombol setelah message-text
      const buttonContainer = document.createElement("div");
      buttonContainer.classList.add("message-buttons");

      if (message.role === "assistant") {
        const copyButton = document.createElement("span");
        copyButton.innerHTML = '<i class="' + ICN.message[0] + '"></i>';
        copyButton.classList.add("icon-Assistant");
        copyButton.addEventListener("click", () =>
          copyToClipboard(message.text)
        );
        buttonContainer.appendChild(copyButton);
      }

      const deleteButton = document.createElement("span");
      deleteButton.innerHTML = '<i class="' + ICN.message[1] + '"></i>';
      deleteButton.classList.add("icon-Assistant");
      deleteButton.addEventListener("click", async () => {
        await deleteMessage(message.id);
        await loadMessages(); // Muat ulang pesan setelah menghapus
      });
      if (message.role === "assistant") {
        buttonContainer.appendChild(deleteButton);
      }

      messageElement.appendChild(buttonContainer);

      messagesContainer.appendChild(messageElement);
    });
    currentConversationTitle = title;
  }
  // Pastikan fungsi ini mengembalikan objek atau nilai yang diperlukan
  return {
    loadMessages: loadMessages,
    sendMessage: sendMessage,
    saveMessage: saveMessage,
    getAllMessages: getAllMessages,
    startNewConversation: startNewConversation,
    // ... metode lain yang mungkin Anda perlukan
  };
}
