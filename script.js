$(document).ready(function () {
    const playerName = localStorage.getItem('playerName') || 'Tamu';
    $('#displayName').text(playerName);

    let startTime, endTime, timerTimeout;
    let scores = JSON.parse(localStorage.getItem('scores')) || []; // Inisialisasi dengan data dari localStorage
    let isPaused = false; // Status jeda permainan

    // Tampilkan skor saat halaman dimuat
    displayScores();

    // Tombol Start
    $('#startBtn').click(function () {
        resetGameState();
        $('#scoreHistory').html('<p>Bermain...</p>');
        $('#message').text('Tunggu Saja...');
        $('#gameBox').removeClass('blue').text('Tunggu Ketika Berubah Warna...');

        // Set timeout acak antara 1-4 detik
        timerTimeout = setTimeout(() => {
            if (!isPaused) {
                $('#gameBox').addClass('blue').text('Klik Sekarang!');
                startTime = new Date().getTime();
            }
        }, Math.random() * 3000 + 1000);
    });

    // Klik pada Game Box
    $('#gameBox').click(function () {
        if ($('#gameBox').hasClass('blue')) {
            endTime = new Date().getTime();
            const reactionTime = ((endTime - startTime) / 1000).toFixed(3);

            // Simpan skor jika permainan selesai
            saveScore(playerName, reactionTime);

            $('#reactionTime').text(`Reaksi Waktu Anda: ${reactionTime} detik`);
            $('#message').text('Game Over!');
            $('#refreshBtn').removeClass('d-none');

            // Tampilkan skor yang baru
            displayScores();
        }
    });

    // Tombol Pause/Resume
    $('#pauseBtn').click(function () {
        if (!isPaused) {
            isPaused = true;
            clearTimeout(timerTimeout); // Hentikan timeout
            $('#gameBox').removeClass('blue').text('Game Dijeda');
            $('#message').text('Permainan dijeda. Klik Lanjutkan untuk melanjutkan.');
            $('#pauseBtn').text('Lanjutkan');
        } else {
            isPaused = false;
            $('#message').text('Permainan dilanjutkan...');
            $('#pauseBtn').text('Jeda');

            // Lanjutkan permainan
            timerTimeout = setTimeout(() => {
                if (!isPaused) {
                    $('#gameBox').addClass('blue').text('Klik Sekarang!');
                    startTime = new Date().getTime();
                }
            }, Math.random() * 3000 + 1000);
        }
    });

    // Tombol Reset
    $('#resetBtn').click(function () {
        resetGameState();
        localStorage.removeItem('scores');
        scores = []; // Kosongkan skor lokal
        $('#scoreHistory').html('<p>Riwayat skor telah diatur ulang.</p>');
    });

    // Tombol Refresh
    $('#refreshBtn').click(function () {
        location.reload();
    });

    // Tombol Back to Home
    $('#backToHomeBtn').click(function () {
        window.location.href = 'index.html';
    });

    // Fungsi untuk menyimpan skor
    function saveScore(name, reactionTime) {
        const scoreData = { name, score: reactionTime };
        scores.push(scoreData);
        localStorage.setItem('scores', JSON.stringify(scores));
    }

    // Fungsi untuk menampilkan skor
    function displayScores() {
        if (scores.length === 0) {
            $('#scoreHistory').html('<p>Belum Ada Skor Yang Tercatat.</p>');
        } else {
            let scoreList = '<ul>';
            scores.forEach((entry, index) => {
                scoreList += `<li>${index + 1}. ${entry.name}: ${entry.score} detik</li>`;
            });
            scoreList += '</ul>';
            $('#scoreHistory').html(scoreList);
        }
    }

    // Fungsi untuk reset state permainan
    function resetGameState() {
        clearTimeout(timerTimeout); // Hentikan timer yang aktif
        $('#reactionTime').text('');
        $('#message').text('Bersiap...');
        $('#gameBox').removeClass('blue').text('Klik Tombol Start Untuk Memulai Game!');
        $('#refreshBtn').addClass('d-none');
        $('#pauseBtn').text('Jeda');
        isPaused = false;
    }
});
