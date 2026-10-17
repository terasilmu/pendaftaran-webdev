document.addEventListener('DOMContentLoaded', () => {
  const regForm = document.getElementById('regForm');
  const alertBox = document.getElementById('alertBox');
  const btnSubmit = document.getElementById('btnSubmit');

  // Ganti URL di bawah ini dengan API URL dari akun SheetDB Anda
  const SHEETDB_API_URL = 'https://sheetdb.io/api/v1/ifrwzaoy81djl';

  regForm.addEventListener('submit', async (e) => {
    e.preventDefault(); // Mencegah reload halaman

    // Reset alert
    alertBox.className = 'alert hidden';
    alertBox.textContent = '';

    // Ambil nilai dari input form
    const nama = document.getElementById('nama').value.trim();
    const email = document.getElementById('email').value.trim();
    const telepon = document.getElementById('telepon').value.trim();
    const posisi = document.getElementById('posisi').value;
    const pengalaman = document.getElementById('pengalaman').value;
    const portfolio = document.getElementById('portfolio').value.trim();

    // Validasi sederhana
    if (!nama || !email || !telepon || !posisi) {
      showAlert('error', 'Harap isi semua kolom wajib (*).');
      return;
    }

    btnSubmit.disabled = true;
    btnSubmit.textContent = 'Menyimpan & Mengirim...';

    // 1. Kirim data ke Google Sheets via SheetDB
    try {
      const response = await fetch(SHEETDB_API_URL, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          data: {
            nama: nama,
            email: email,
            telepon: telepon,
            posisi: posisi,
            pengalaman: pengalaman,
            portfolio: portfolio || '-'
          }
        })
      });

      if (!response.ok) {
        throw new Error('Gagal menyimpan ke database.');
      }

      showAlert('success', 'Data tersimpan! Mengalihkan ke WhatsApp...');

      // 2. Susun format pesan teks untuk WhatsApp
      const nomorWhatsAppAdmin = "6281234567890"; // Ganti dengan nomor WhatsApp Anda (format: 628...)
      const pesan = `Halo Admin, ada pendaftaran baru Web Developer:\n\n` +
                    `*Nama Lengkap:* ${nama}\n` +
                    `*Alamat Email:* ${email}\n` +
                    `*No. Telepon/WA:* ${telepon}\n` +
                    `*Spesialisasi:* ${posisi}\n` +
                    `*Pengalaman:* ${pengalaman}\n` +
                    `*Portfolio:* ${portfolio || '-'}`;

      const encodedPesan = encodeURIComponent(pesan);
      const urlWhatsApp = `https://wa.me/${nomorWhatsAppAdmin}?text=${encodedPesan}`;

      // Buka WhatsApp setelah jeda singkat
      setTimeout(() => {
        window.open(urlWhatsApp, '_blank');
        regForm.reset();
        btnSubmit.disabled = false;
        btnSubmit.textContent = 'Kirim Pendaftaran';
      }, 1500);

    } catch (error) {
      console.error('Error:', error);
      showAlert('error', 'Terjadi kesalahan saat menyimpan ke database.');
      btnSubmit.disabled = false;
      btnSubmit.textContent = 'Kirim Pendaftaran';
    }
  });

  function showAlert(type, message) {
    alertBox.textContent = message;
    alertBox.className = `alert ${type}`;
  }
});