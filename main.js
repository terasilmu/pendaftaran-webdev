document.addEventListener('DOMContentLoaded', () => {
  const regForm = document.getElementById('regForm');
  const alertBox = document.getElementById('alertBox');
  const btnSubmit = document.getElementById('btnSubmit');

  regForm.addEventListener('submit', async (e) => {
    e.preventDefault(); // Mencegah reload halaman

    // Reset alert
    alertBox.className = 'alert hidden';
    alertBox.textContent = '';

    // Disable button saat proses kirim
    btnSubmit.disabled = true;
    btnSubmit.textContent = 'Mengirim...';

    const formData = new FormData(regForm);

    try {
      const response = await fetch('webdev.php', {
        method: 'POST',
        body: formData
      });

      const result = await response.json();

      if (result.status === 'success') {
        showAlert('success', result.message);
        regForm.reset(); // Reset isi form
      } else {
        showAlert('error', result.message || 'Terjadi kesalahan saat menyimpan data.');
      }
    } catch (error) {
      showAlert('error', 'Gagal terhubung ke server PHP.');
      console.error('Error:', error);
    } finally {
      btnSubmit.disabled = false;
      btnSubmit.textContent = 'Kirim Pendaftaran';
    }
  });

  function showAlert(type, message) {
    alertBox.textContent = message;
    alertBox.className = `alert ${type}`;
  }
});