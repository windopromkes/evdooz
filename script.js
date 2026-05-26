// Animasi memunculkan elemen saat di-scroll
document.addEventListener("DOMContentLoaded", () => {
    // Memilih semua elemen dengan kelas 'fade-in-on-scroll'
    const observerElements = document.querySelectorAll('.fade-in-on-scroll');

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15 // Elemen akan muncul saat 15% bagiannya terlihat di layar
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Tambahkan kelas 'visible' untuk memicu animasi CSS
                entry.target.classList.add('visible');
                // Berhenti mengamati elemen jika sudah muncul agar tidak berulang
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    observerElements.forEach(element => {
        observer.observe(element);
    });
});

// Logika untuk Mini Quiz
function checkAnswer(buttonElement, isCorrect) {
    // Ambil elemen kontainer tombol dan hasil
    const allButtons = buttonElement.parentElement.querySelectorAll('.quiz-btn');
    const resultDiv = document.getElementById('quiz-result');

    // Matikan klik semua tombol setelah satu jawaban dipilih
    allButtons.forEach(btn => {
        btn.disabled = true;
        btn.style.cursor = 'not-allowed';
    });

    if (isCorrect) {
        // Panggil efek Confetti lucu!
        if (window.confetti) {
            confetti({
                particleCount: 150,
                spread: 70,
                origin: { y: 0.6 }
            });
        }
        // Tampilan Jika Benar
        buttonElement.classList.add('correct');
        resultDiv.innerHTML = "🎉 Yeay, Jawabanmu Benar! Skor: 100 🌟";
        resultDiv.style.color = "#059669";
    } else {
        // Tampilan Jika Salah
        buttonElement.classList.add('wrong');
        resultDiv.innerHTML = "Oops! Jawaban kurang tepat. Coba ingat-ingat lagi ya! 💡";
        resultDiv.style.color = "#dc2626";
        
        // Tunjukkan jawaban yang benar kepada pengguna
        allButtons.forEach(btn => {
            // Karena kita tahu jawaban ke-2 (index 1) adalah yang benar, 
            // kita bisa menandainya. Atau mengecek dari onclick attribut.
            if(btn.getAttribute('onclick').includes('true')){
                btn.classList.add('correct');
            }
        });
    }

    // Animasi muncul untuk teks hasil
    resultDiv.style.opacity = 1;
}

// --- EFEK KLIK MAGIS BINTANG-BINTANG ✨ ---
document.addEventListener('click', function(e) {
    // Jangan keluarkan bintang kalau mereka klik tombol Quiz, biar gak berbenturan animasinya
    if(e.target.classList.contains('quiz-btn')) return;

    const sparkle = document.createElement('div');
    sparkle.innerHTML = '✨';
    sparkle.style.position = 'fixed';
    sparkle.style.left = (e.clientX - 10) + 'px';
    sparkle.style.top = (e.clientY - 10) + 'px';
    sparkle.style.fontSize = '24px';
    sparkle.style.pointerEvents = 'none'; // Biar gak mengganggu klik elemen di bawahnya
    sparkle.style.zIndex = '9999';
    sparkle.style.animation = 'popOut 0.8s ease-out forwards';
    
    document.body.appendChild(sparkle);

    // Hapus elemen setelah animasi selesai agar memori tidak penuh
    setTimeout(() => {
        sparkle.remove();
    }, 800);
});

// --- Scroll Event: Progress Bar & Mascot Back to Top ---
window.addEventListener('scroll', () => {
    // Logika Progress Bar (Menghitung persen scroll)
    const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;
    document.getElementById("progressBar").style.width = scrolled + "%";

    // Logika Maskot Peeking (Muncul setelah layar discroll sedikit)
    const mascot = document.getElementById("backToTop");
    if (winScroll > 300) {
        mascot.classList.add('show');
    } else {
        mascot.classList.remove('show');
    }
});

// Fungsi untuk meluncur ke atas saat maskot diklik
function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}
