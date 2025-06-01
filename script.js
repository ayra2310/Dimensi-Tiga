  const sections = ['identitas', 'materi', 'kuis'];
    const startBtn = document.getElementById('start-btn');
    const submitBtn = document.getElementById('submit-btn');
    const userAnswerInput = document.getElementById('user-answer');
    const questionText = document.getElementById('question-text');
    const feedback = document.getElementById('feedback');
    const quizButtons = document.getElementById('quiz-buttons');
    const timerDisplay = document.getElementById('timer');
    const choiceContainer = document.getElementById('choice-container');
    const printableArea = document.getElementById('printable-area');
    const quizComplete = document.getElementById('quiz-complete');

    let shuffledQuestions = [];
    let currentQuestion = 0;
    let score = 0;
    let timer;
    let timeLeft = 60;
    let userAnswers = []; // simpan jawaban user + apakah benar

    // 10 soal, jawaban jarak antara 0-100, plus pembahasan
    const quizQuestions = [
      {
        type: "input",
        text: "Hitung jarak antara A(10,10,10) dan B(15,15,15):",
        answer: Math.sqrt((15-10)**2 + (15-10)**2 + (15-10)**2).toFixed(2),
        pembahasan: `d = √[(15−10)² + (15−10)² + (15−10)²] = √(25 + 25 + 25) = √75 ≈ 8.66`
      },
      {
        type: "input",
        text: "Hitung jarak antara P(5,5,5) dan Q(5,5,10):",
        answer: Math.sqrt((5-5)**2 + (5-5)**2 + (10-5)**2).toFixed(2),
        pembahasan: `d = √[(5−5)² + (5−5)² + (10−5)²] = √(0 + 0 + 25) = 5.00`
      },
      {
        type: "input",
        text: "Hitung jarak antara M(0,0,0) dan N(7,24,0):",
        answer: Math.sqrt(7**2 + 24**2 + 0).toFixed(2),
        pembahasan: `d = √[(7−0)² + (24−0)² + (0−0)²] = √(49 + 576 + 0) = √625 = 25.00`
      },
      {
        type: "mcq",
        text: "Hitung jarak antara titik X(10,10,10) dan Y(10,20,30)?",
        choices: ["20.00", "22.36", "25.00", "18.36"],
        answer: "22.36",
        pembahasan: `d = √[(10−10)² + (20−10)² + (30−10)²] = √(0 + 100 + 400) = √500 ≈ 22.36`
      },
      {
        type: "input",
        text: "Hitung jarak antara K(3,4,12) dan L(0,0,0):",
        answer: Math.sqrt(3**2 + 4**2 + 12**2).toFixed(2),
        pembahasan: `d = √[(3−0)² + (4−0)² + (12−0)²] = √(9 + 16 + 144) = √169 = 13.00`
      },
      {
        type: "mcq",
        text: "Berapa jarak antara titik A(2,3,4) dan B(6,7,8)?",
        choices: ["6.93", "8.00", "10.92", "9.12"],
        answer: "6.93",
        pembahasan: `d = √[(6−2)² + (7−3)² + (8−4)²] = √(16 + 16 + 16) = √48 ≈ 6.93`
      },
      {
        type: "mcq",
        text: "Berapa jarak antara titik P(1,2,3) dan Q(4,6,3)?",
        choices: ["5.00", "6.00", "7.00", "4.00"],
        answer: "5.00",
        pembahasan: `d = √[(4−1)² + (6−2)² + (3−3)²] = √(9 + 16 + 0) = √25 = 5.00`
      },
      {
        type: "input",
        text: "Hitung jarak antara X(20,10,5) dan Y(20,10,50):",
        answer: Math.sqrt((20-20)**2 + (10-10)**2 + (50-5)**2).toFixed(2),
        pembahasan: `d = √[(20−20)² + (10−10)² + (50−5)²] = √(0 + 0 + 2025) = 45.00`
      },
      {
        type: "mcq",
        text: "Hitung jarak antara titik M(7,8,9) dan N(4,1,3)?",
        choices: ["8.54", "10.00", "9.70", "7.81"],
        answer: "9.70",
        pembahasan: `d = √[(7−4)² + (8−1)² + (9−3)²] = √(9 + 49 + 36) = √94 ≈ 9.70`
      },
      {
        type: "input",
        text: "Hitung jarak antara titik A(0,0,0) dan B(50,50,50):",
        answer: Math.sqrt(50**2 + 50**2 + 50**2).toFixed(2),
        pembahasan: `d = √[(50−0)² + (50−0)² + (50−0)²] = √(2500 + 2500 + 2500) = √7500 ≈ 86.60`
      }
    ];

    // Fungsi untuk menampilkan section
    function showSection(section) {
      sections.forEach(s => {
        document.getElementById(s).classList.add('d-none');
      });
      document.getElementById(section).classList.remove('d-none');

      if (section === 'kuis') {
        startBtn.style.display = "inline-block";
        submitBtn.style.display = "none";
        questionText.textContent = "";
        feedback.textContent = "";
        choiceContainer.innerHTML = "";
        userAnswerInput.style.display = "none";
        quizButtons.classList.add("d-none");
        quizComplete.classList.add("d-none");
        printableArea.classList.add("d-none");
        printableArea.innerHTML = "";
        timerDisplay.textContent = "Waktu tersisa: 01:00";
        clearInterval(timer);
        timeLeft = 60;
        userAnswers = [];
      }
    }

    // Fungsi acak array
    function shuffleArray(arr) {
      let newArr = arr.slice();
      for (let i = newArr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
      }
      return newArr;
    }

    // Timer
    function startTimer() {
      timerDisplay.textContent = formatTime(timeLeft);
      timer = setInterval(() => {
        timeLeft--;
        timerDisplay.textContent = "Waktu tersisa: " + formatTime(timeLeft);
        if (timeLeft <= 0) {
          clearInterval(timer);
          alert("Waktu habis!");
          endQuiz();
        }
      }, 1000);
    }

    function formatTime(seconds) {
      const m = Math.floor(seconds / 60);
      const s = seconds % 60;
      return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    }

    // Event listener input userAnswerInput: aktifkan submitBtn saat ada isi
    userAnswerInput.addEventListener("input", () => {
      const val = userAnswerInput.value.trim();
      if (val === "" || isNaN(val) || val < 0 || val > 100) {
        submitBtn.disabled = true;
      } else {
        submitBtn.disabled = false;
      }
    });

    function startQuiz() {
      shuffledQuestions = shuffleArray(quizQuestions);
      currentQuestion = 0;
      score = 0;
      userAnswers = [];
      startBtn.style.display = "none";
      submitBtn.style.display = "inline-block";
      feedback.textContent = "";
      quizButtons.classList.add("d-none");
      quizComplete.classList.add("d-none");
      printableArea.classList.add("d-none");
      printableArea.innerHTML = "";
      showQuestion();
      startTimer();
    }

    function showQuestion() {
      if (currentQuestion >= shuffledQuestions.length) {
        endQuiz();
        return;
      }

      const q = shuffledQuestions[currentQuestion];
      feedback.textContent = "";
      submitBtn.disabled = true;
      submitBtn.textContent = "💡 Jawab";
      userAnswerInput.disabled = false;
      choiceContainer.innerHTML = "";
      choiceContainer.style.display = "none";
      userAnswerInput.style.display = "none";

      questionText.textContent = `Soal ${currentQuestion + 1}: ${q.text}`;

      if (q.type === "mcq") {
        choiceContainer.style.display = "block";
        q.choices.forEach(choice => {
          const label = document.createElement("label");
          label.innerHTML = `<input type="radio" name="choice" value="${choice}"> ${choice}`;
          choiceContainer.appendChild(label);
        });

        // Event listener untuk radio agar tombol submit aktif saat pilih jawaban
        const radios = choiceContainer.querySelectorAll("input[type=radio]");
        radios.forEach(radio => {
          radio.addEventListener("change", () => {
            submitBtn.disabled = false;
          });
        });

        submitBtn.onclick = submitAnswer;
        submitBtn.disabled = true;

      } else if (q.type === "input") {
        userAnswerInput.style.display = "block";
        userAnswerInput.value = "";
        submitBtn.onclick = submitAnswer;
        submitBtn.disabled = true;
        userAnswerInput.focus();
      }
    }

    function submitAnswer() {
      const q = shuffledQuestions[currentQuestion];
      let userAnswer;

      if (q.type === "mcq") {
        const selectedRadio = choiceContainer.querySelector("input[type=radio]:checked");
        if (!selectedRadio) {
          alert("Pilih jawaban dulu!");
          return;
        }
        userAnswer = selectedRadio.value;
      } else {
        userAnswer = userAnswerInput.value.trim();
        if (userAnswer === "" || isNaN(userAnswer) || userAnswer < 0 || userAnswer > 100) {
          alert("Masukkan jawaban valid antara 0 dan 100!");
          return;
        }
        userAnswer = parseFloat(userAnswer).toFixed(2);
      }

      let correct = userAnswer === q.answer;

      if (correct) {
        feedback.textContent = "✅ Jawaban benar!";
        score++;
      } else {
        feedback.textContent = `❌ Jawaban salah! Jawaban benar: ${q.answer}`;
      }

      // Simpan jawaban user dan status benar/salah & pembahasan
      userAnswers.push({
        question: q.text,
        userAnswer,
        correctAnswer: q.answer,
        correct,
        pembahasan: q.pembahasan
      });

      submitBtn.textContent = "➡️ Soal Berikutnya";
      submitBtn.disabled = false;

      if (q.type === "mcq") {
        const radios = choiceContainer.querySelectorAll("input[type=radio]");
        radios.forEach(radio => radio.disabled = true);
      } else {
        userAnswerInput.disabled = true;
      }

      submitBtn.onclick = nextQuestion;
    }

    function nextQuestion() {
      currentQuestion++;
      showQuestion();
    }

    function endQuiz() {
      clearInterval(timer);
      questionText.textContent = "";
      choiceContainer.innerHTML = "";
      userAnswerInput.style.display = "none";
      submitBtn.style.display = "none";
      feedback.textContent = "";
      
      // Show completion message instead of score
      quizComplete.classList.remove("d-none");
      quizButtons.classList.remove("d-none");
      
      // Prepare printable area (hidden from user)
      preparePrintableContent();
    }

    function preparePrintableContent() {
      let html = `
        <h3 style="text-align: center; color: #0052d4;">Hasil Kuis Jarak Antar Dua Titik</h3>
        <hr>
        <h4 style="text-align: center;">Skor: ${score} / ${shuffledQuestions.length}</h4>
        <hr>
      `;

      userAnswers.forEach((item, idx) => {
        html += `
          <div style="margin-bottom: 20px;">
            <p><strong>Soal ${idx+1}:</strong> ${item.question}</p>
            <p>Jawaban Anda: <span style="${item.correct ? 'color: green; font-weight: bold;' : 'color: red; font-weight: bold;'}">${item.userAnswer}</span></p>
            ${!item.correct ? `<p>Jawaban Benar: <span style="color: green; font-weight: bold;">${item.correctAnswer}</span></p>` : ''}
            <p><em>Pembahasan:</em> ${item.pembahasan}</p>
            <hr>
          </div>
        `;
      });

      printableArea.innerHTML = html;
      
      // Tambahkan style khusus untuk printable area
      printableArea.style.backgroundColor = "white";
      printableArea.style.color = "black";
      printableArea.style.padding = "20px";
    }
    function generatePDF() {
      if(userAnswers.length === 0) {
        alert("Anda belum menyelesaikan kuis!");
        return;
      }

      // Sementara tampilkan printable area sebelum generate PDF
      printableArea.classList.remove("d-none");
      
      const element = document.getElementById('printable-area');
      const opt = {
        margin: 10,
        filename: 'hasil_kuis_jarak_titik.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { 
          scale: 2,
          logging: true,
          useCORS: true,
          allowTaint: true
        },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
      };

      // Generate PDF
      html2pdf().set(opt).from(element).save().then(() => {
        // Setelah selesai, sembunyikan kembali printable area
        printableArea.classList.add("d-none");
      });
    }

    // Event Listener tombol
    startBtn.addEventListener("click", startQuiz);

    // Inisialisasi tampilkan halaman awal
    showSection('kuis');