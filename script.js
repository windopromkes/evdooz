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
        resultDiv.innerHTML = "🎉 Luar Biasa! +50 XP 🌟";
        resultDiv.style.color = "#059669";

        // Animasi Update Gem / XP di Navbar
        const xpElement = document.getElementById('xp-count');
        if(xpElement) {
            let currentXp = parseInt(xpElement.innerText);
            let newXp = currentXp + 50;
            
            let counter = setInterval(() => {
                if(currentXp >= newXp) {
                    clearInterval(counter);
                } else { 
                    currentXp += 2; 
                    xpElement.innerText = currentXp; 
                }
            }, 25);
            xpElement.parentElement.classList.add('floating');
            setTimeout(() => xpElement.parentElement.classList.remove('floating'), 1500);
        }
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

// Fungsi untuk membuka materi gembok dan scroll ke sana
function unlockAndScroll(targetId) {
    const targetSection = document.getElementById(targetId);
    if (targetSection) {
        targetSection.classList.remove('locked-section');
        setTimeout(() => {
            targetSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 100);
    }
}

// Fungsi untuk memulai pelajaran video interaktif
function startVideoLesson(buttonElement) {
    const wrapper = buttonElement.closest('.video-wrapper');
    if (!wrapper) return;

    const overlay = wrapper.querySelector('.video-overlay');
    const videoContainer = wrapper.querySelector('.video-container');

    // Sembunyikan overlay dan tampilkan video
    overlay.style.display = 'none';
    videoContainer.style.display = 'block';

    // Tambahkan kelas 'unlocked' untuk mengubah style wrapper (misal: hapus padding)
    wrapper.classList.add('unlocked');
    document.getElementById('finish-video-btn').style.display = 'inline-block';
}

// Fungsi untuk menyingkap kata rahasia (Game Membaca)
function revealWord(element, actualWord) {
    if (element.classList.contains('revealed')) return;

    // Ubah teks dan tambahkan kelas animasi
    element.innerText = actualWord;
    element.classList.add('revealed');

    // Cek apakah semua kata sudah terbuka di dalam kotak ini
    const container = element.closest('.reveal-box');
    const unrevealed = container.querySelectorAll('.magic-word:not(.revealed)');

    if (unrevealed.length === 0) {
        // Semua kata sudah terbuka!
        const banner = document.getElementById('reveal-completion-banner');
        if (banner && banner.style.display === 'none') {
            setTimeout(() => {
                banner.style.display = 'block';
                document.getElementById('next-to-level-2').style.display = 'inline-block';
                if (window.confetti) {
                    confetti({ particleCount: 80, spread: 60, origin: { y: 0.6 } });
                }
                // Tambahkan XP ke Navbar
                const xpElement = document.getElementById('xp-count');
                if (xpElement) {
                    let currentXp = parseInt(xpElement.innerText);
                    xpElement.innerText = currentXp + 20;
                }
            }, 400); // Sedikit delay agar user sempat melihat kata terakhir
        }
    }
}

// --- Logika Interactive Story (6 Langkah SADARI) ---
let currentSadariStep = 1;
const totalSadariSteps = 6;

function nextSadariStep() {
    const currentStepEl = document.getElementById(`sadari-step-${currentSadariStep}`);
    
    if (currentSadariStep < totalSadariSteps) {
        // Sembunyikan langkah saat ini
        currentStepEl.classList.remove('active');
        
        // Tampilkan langkah berikutnya
        currentSadariStep++;
        const nextStepEl = document.getElementById(`sadari-step-${currentSadariStep}`);
        nextStepEl.classList.add('active');
        
        // Update Progress Bar
        const progressFill = document.getElementById('sadari-progress');
        progressFill.style.width = `${(currentSadariStep / totalSadariSteps) * 100}%`;
        
        // Ubah teks tombol jika mencapai langkah terakhir
        if (currentSadariStep === totalSadariSteps) {
            const btn = document.getElementById('sadari-next-btn');
            btn.innerHTML = 'Selesai Belajar <i class="fa-solid fa-check"></i>';
            btn.style.backgroundColor = 'var(--yellow-main)';
            btn.style.borderColor = 'transparent';
            btn.style.borderBottomColor = 'var(--yellow-shadow)';
            btn.style.color = '#b45309';
        }
    } else {
        // Jika sudah di langkah terakhir dan tombol "Selesai" ditekan
        const btn = document.getElementById('sadari-next-btn');
        btn.style.display = 'none'; // Sembunyikan tombol
        
        const banner = document.getElementById('steps-completion-banner');
        banner.style.display = 'block'; // Tampilkan banner
        document.getElementById('next-to-level-3').style.display = 'inline-block';
        
        // Beri efek Confetti
        if (window.confetti) {
            confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
        }
        
        // Tambahkan XP ke Navbar
        const xpElement = document.getElementById('xp-count');
        if (xpElement) {
            let currentXp = parseInt(xpElement.innerText);
            xpElement.innerText = currentXp + 30;
        }
    }
}

// --- Logika Journey Path (7 Langkah Pencegahan) ---
function openNode(step) {
    const node = document.getElementById(`node-${step}`);
    // Tolak klik jika masih terkunci (abu-abu)
    if (!node.classList.contains('current') && !node.classList.contains('completed')) return; 
    
    // Tutup semua popup lain yang mungkin sedang terbuka
    document.querySelectorAll('.node-popup').forEach(p => p.style.display = 'none');
    
    // Buka popup untuk node yang diklik
    document.getElementById(`node-popup-${step}`).style.display = 'block';
}

function completeNode(step) {
    // Tutup popup saat tombol "Paham" ditekan
    document.getElementById(`node-popup-${step}`).style.display = 'none';
    
    // Tandai node menjadi hijau (selesai)
    const node = document.getElementById(`node-${step}`);
    node.classList.remove('current');
    node.classList.add('completed');
    
    // Buka (unlock) node berikutnya
    const nextStep = step + 1;
    const nextNode = document.getElementById(`node-${nextStep}`);
    
    if (nextNode) {
        nextNode.classList.add('current');
    } else {
        // Jika tidak ada node berikutnya, berarti level ini tamat!
        const banner = document.getElementById('path-completion-banner');
        if(banner.style.display === 'none') {
            banner.style.display = 'block';
            document.getElementById('next-to-boss-level').style.display = 'inline-block';
            if (window.confetti) {
                confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 } });
            }
            // Tambahkan XP ke indikator Navbar
            const xpElement = document.getElementById('xp-count');
            if (xpElement) {
                let currentXp = parseInt(xpElement.innerText);
                xpElement.innerText = currentXp + 50;
            }
        }
    }
}

// --- EFEK KLIK INTERAKTIF ---
document.addEventListener('click', function(e) {
    // Matikan efek saat mengklik area game yang sudah interaktif
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
