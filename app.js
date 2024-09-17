const $circle = document.querySelector('#circle');
const $score = document.querySelector('#score');
const $upgradeBtn = document.querySelector('#upgrade-btn');
let pointsPerClick = 1;
const OFFLINE_POINT_INTERVAL = 60 * 60 * 1000; // 60 минут в миллисекундах
const POINTS_PER_OFFLINE_INTERVAL = 200000; // Очки, присуждаемые каждые 60 минут оффлайн

let maxEnergy = 1000;
let currentEnergy = maxEnergy;
const energyRegenRate = 1; // Пополнение энергии в секунду

// Элементы энергии
const $energyInfo = document.querySelector('#energy-info');

// Функция для обновления энергии на экране
function updateEnergyDisplay() {
  $energyInfo.textContent = `${currentEnergy} / ${maxEnergy}`;
}

// Функция для восстановления энергии каждую секунду
function regenEnergy() {
  setInterval(() => {
    if (currentEnergy < maxEnergy) {
      currentEnergy += energyRegenRate;
      currentEnergy = Math.min(currentEnergy, maxEnergy); // Не больше максимума
      updateEnergyDisplay();
    }
  }, 1000); // Пополнение каждую секунду
}

// Функция для уменьшения энергии при клике
function consumeEnergy(amount) {
  if (currentEnergy >= amount) {
    currentEnergy -= amount;
    updateEnergyDisplay();
    return true;
  } else {
    showDialog('There is not enough energy to perform the action!');
    return false;
  }
}

function start() {
  checkOfflinePoints();
  setScore(getScore());
  setImage();
  updateOfflinePointsDisplay(); // Вызов функции обновления при старте приложения
  regenEnergy(); // Запускаем процесс пополнения энергии
}

// Показ подсказки при наведении
const offlinePointsDisplay = document.getElementById('offline-points-display');
const pointsTooltip = document.getElementById('points-tooltip');

offlinePointsDisplay.addEventListener('mouseenter', () => {
  pointsTooltip.classList.remove('hidden');
});

offlinePointsDisplay.addEventListener('mouseleave', () => {
  pointsTooltip.classList.add('hidden');
});

// Обновляем отображение очков за оффлайн время
function updateOfflinePointsDisplay() {
  const tooltip = document.getElementById('points-tooltip');
  tooltip.textContent = `${POINTS_PER_OFFLINE_INTERVAL.toLocaleString()} Sponge Coin in 1 hour`; // Форматирование очков
}

function setScore(score) {
  localStorage.setItem('score', score);
  $score.textContent = score.toLocaleString(); // Форматируем очки с разделением тысяч
}

function setImage() {
  const score = getScore();

  if (score >= 18000000000) {
    $circle.setAttribute('src', './assets/ultimate_lege_reward.webp');
  } else if (score >= 1000000000) {
    $circle.setAttribute('src', './assets/epic_reward.webp');
  } else if (score >= 100000000) {
    $circle.setAttribute('src', './assets/ultimate_epic_reward.png');
  } else if (score >= 50000000) {
    $circle.setAttribute('src', './assets/legendary_reward.png');
  } else if (score >= 10000000) {
    $circle.setAttribute('src', './assets/ultimate_reward.png');
  } else if (score >= 2000000) {
    $circle.setAttribute('src', './assets/cat.png');
  } else if (score >= 1000000) {
    $circle.setAttribute('src', './assets/catcoins.png');
  } else if (score >= 100000) {
    $circle.setAttribute('src', './assets/dragon.png');
  } else if (score >= 25000) {
    $circle.setAttribute('src', './assets/phoenix.png');
  } else if (score >= 5000) {
    $circle.setAttribute('src', './assets/lizzard.png');
  }
}

function getScore() {
  return Number(localStorage.getItem('score')) || 0;
}

function addPoints() {
  // Перед добавлением очков проверяем энергию
  if (consumeEnergy(pointsPerClick)) {
    setScore(getScore() + pointsPerClick);
    setImage();
  }
}

function saveLastActiveTime() {
  localStorage.setItem('lastActiveTime', Date.now());
}

function showDialog(message, callback) {
  const dialog = document.getElementById('custom-dialog');
  const dialogMessage = dialog.querySelector('.dialog-message');
  const okButton = dialog.querySelector('#dialog-ok-button');

  // Форматируем числа в сообщении
  const formattedMessage = message.replace(/\d+/g, match => Number(match).toLocaleString());

  dialogMessage.textContent = formattedMessage;
  dialog.classList.remove('hidden');

  okButton.onclick = () => {
    dialog.classList.add('hidden');
    if (callback) callback(); // Выполняем действие, если передан callback
  };
}

// Обновленный checkOfflinePoints с showDialog вместо alert
function checkOfflinePoints() {
  const lastActiveTime = Number(localStorage.getItem('lastActiveTime')) || 0;
  const currentTime = Date.now();

  if (lastActiveTime) {
    const elapsedTime = currentTime - lastActiveTime;
    const offlinePoints = Math.floor(elapsedTime / OFFLINE_POINT_INTERVAL) * POINTS_PER_OFFLINE_INTERVAL;

    if (offlinePoints > 0) {
      showDialog(`You Got ${offlinePoints} Sponge Coins for your absence!`, () => {
        setScore(getScore() + offlinePoints);
      });
    }
  }

  // Обновляем время последней активности до текущего времени
  saveLastActiveTime();
}

// Обновленный обработчик нажатия кнопки улучшения с showDialog
$upgradeBtn.addEventListener('click', () => {
  const score = getScore();
  const upgradeCost = 3200;

  if (score >= upgradeCost) {
    pointsPerClick = 100;
    setScore(score - upgradeCost);
    setImage();
    $upgradeBtn.remove(); // Удаляем кнопку улучшения после улучшения
  } else {
    // Форматируем очки в сообщении
    showDialog(`Not enough Sponge Coins to upgrade! required ${upgradeCost.toLocaleString()} Sponge Coins`);
  }
});

$circle.addEventListener('click', (event) => {
  const rect = $circle.getBoundingClientRect();

  const offsetX = event.clientX - rect.left - rect.width / 2;
  const offsetY = event.clientY - rect.top - rect.height / 2;

  const DEG = 40;

  const tiltX = (offsetY / rect.height) * DEG;
  const tiltY = (offsetX / rect.width) * -DEG;

  $circle.style.setProperty('--tiltX', `${tiltX}deg`);
  $circle.style.setProperty('--tiltY', `${tiltY}deg`);

  setTimeout(() => {
    $circle.style.setProperty('--tiltX', `0deg`);
    $circle.style.setProperty('--tiltY', `0deg`);
  }, 300);

  const plusOne = document.createElement('div');
  plusOne.classList.add('plus-one');
  plusOne.textContent = `+${pointsPerClick}`;
  plusOne.style.left = `${event.clientX - rect.left}px`;
  plusOne.style.top = `${event.clientY - rect.top}px`;

  $circle.parentElement.appendChild(plusOne);

  addPoints();

  setTimeout(() => {
    plusOne.remove();
  }, 2000);
});

// Сохраняем время последней активности, когда пользователь покидает страницу
window.addEventListener('beforeunload', saveLastActiveTime);

start();
