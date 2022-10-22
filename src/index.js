import generateICal from './generateICal.js';
import './images/copy.jpeg';
import './images/generate_course_timetable.jpeg';
import './images/github.svg';
import './images/icon.png';
import './images/demo.png';
import './styles.css';

const container = document.querySelector('.container');
const dateContainer = document.querySelector('.dateContainer');
const startDate = document.querySelector('#startDate');
const userText = document.querySelector('#textarea');
const btn = document.querySelector('#generateBtn');
const instructionBtn = document.querySelector('#instructionBtn');
const overlay = document.querySelector('.overlay');

const clearMessage = () => {
  document.querySelectorAll('.message').forEach((message) => message.remove());
};

const showMessage = (message, type) => {
  let color, backgroundColor;
  if (type === 'error') {
    color = '#fff';
    backgroundColor = '#e63946';
  } else if (type === 'success') {
    color = '#f1faee';
    backgroundColor = '#a8dadc';
  }
  const mes = document.createElement('div');
  mes.innerText = message;
  mes.className = 'message';
  mes.style.backgroundColor = backgroundColor;
  mes.style.color = color;
  container.insertBefore(mes, dateContainer);
};

btn.onclick = () => {
  clearMessage();
  if (!startDate.value) showMessage('Start date is empty!', 'error');
  if (!userText.value)
    showMessage('Paste your timetable in the text area!', 'error');

  if (startDate.value && userText.value) {
    const [year, month, day] = startDate.value.split('-');
    const date = new Date(year, Number(month) - 1, day);
    if (date.getDay() !== 1) {
      showMessage(
        'Start date must fall on a monday of the 1st teaching week!',
        'error'
      );
    } else {
      const success = generateICal(userText.value, date);
      if (success) {
        showMessage('Success!', 'success');
      } else {
        showMessage('Time table incorrect format!', 'error');
      }
    }
  }
};

instructionBtn.onclick = () => {
  overlay.style.display = 'block';
};
overlay.onclick = (e) => {
  if (e.target === overlay) overlay.style.display = 'none';
};
