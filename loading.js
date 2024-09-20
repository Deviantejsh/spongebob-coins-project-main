document.addEventListener('DOMContentLoaded', function () {
  setTimeout(function () {
    document.getElementById('loading-screen').style.display = 'none';
    document.getElementById('offline-points-display').classList.remove('hidden'); // Убираем класс hidden
    document.getElementById('energy-display').classList.remove('hidden'); // Убираем класс hidden
  }, 7000); // 7 секунд
});