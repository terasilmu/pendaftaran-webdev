<?php
header('Content-Type: application/json; charset=utf-8');

// Configuration Database
$host     = "localhost";
$username = "root";
$password = "";
$dbname   = "webdev";

// 1. Koneksi ke MySQL Server
$conn = new mysqli($host, $username,$password);

if ($conn->connect_error) {
    echo json_encode([
        'status'  => 'error',
        'message' => 'Koneksi ke MySQL gagal: ' . $conn->connect_error
    ]);
    exit();
}

// 2. Buat Database 'webdev' jika belum ada
$sqlCreateDB = "CREATE DATABASE IF NOT EXISTS `$dbname` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci";
if (!$conn->query($sqlCreateDB)) {
    echo json_encode([
        'status'  => 'error',
        'message' => 'Gagal membuat database: ' . $conn->error
    ]);
    exit();
}

// Pilih database
$conn->select_db($dbname);

// 3. Buat Tabel 'pendaftar' jika belum ada
$sqlCreateTable = "CREATE TABLE IF NOT EXISTS `pendaftar` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `nama` VARCHAR(100) NOT NULL,
    `email` VARCHAR(100) NOT NULL UNIQUE,
    `telepon` VARCHAR(20) NOT NULL,
    `posisi` VARCHAR(50) NOT NULL,
    `pengalaman` VARCHAR(50) NOT NULL,
    `portfolio` VARCHAR(255) NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)";

if (!$conn->query($sqlCreateTable)) {
    echo json_encode([
        'status'  => 'error',
        'message' => 'Gagal membuat tabel: ' . $conn->error
    ]);
    exit();
}

// 4. Proses Simpan Data dari Form (metode POST)
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $nama       = trim($_POST['nama'] ?? '');
    $email      = trim($_POST['email'] ?? '');
    $telepon    = trim($_POST['telepon'] ?? '');
    $posisi     = trim($_POST['posisi'] ?? '');
    $pengalaman = trim($_POST['pengalaman'] ?? '');
    $portfolio  = trim($_POST['portfolio'] ?? '');

    // DIPERBAIKI: Menggunakan operator logika '||' yang benar
if (empty($nama) || empty($email) || empty($telepon) || empty($posisi)) {
    echo json_encode([
        'status'  => 'error',
        'message' => 'Harap isi semua kolom wajib (*).'
    ]);
    exit();

  
    }

    // Gunakan Prepared Statement untuk mencegah SQL Injection
    $stmt =$conn->prepare("INSERT INTO pendaftar (nama, email, telepon, posisi, pengalaman, portfolio) VALUES (?, ?, ?, ?, ?, ?)");
    $stmt->bind_param("ssssss", $nama,$email, $telepon,$posisi, $pengalaman,$portfolio);

    if ($stmt->execute()) {
        echo json_encode([
            'status'  => 'success',
            'message' => 'Pendaftaran berhasil disimpan!'
        ]);
    } else {
        if ($conn->errno === 1062) { // Duplicate entry error code for email
            echo json_encode([
                'status'  => 'error',
                'message' => 'Email ini sudah terdaftar sebelumnya.'
            ]);
        } else {
            echo json_encode([
                'status'  => 'error',
                'message' => 'Gagal menyimpan data: ' . $stmt->error
            ]);
        }
    }

    $stmt->close();
} else {
    echo json_encode([
        'status'  => 'error',
        'message' => 'Akses tidak diizinkan.'
    ]);
}

$conn->close();
?>