import generateICal from './generateICal.js';

const container = document.querySelector('.container');
const dateContainer = document.querySelector('.dateContainer');
const startDate = document.querySelector('#startDate');
const userText = document.querySelector('#textarea');
const btn = document.querySelector('#generateBtn');

const clearMessage = () => {
  document.querySelectorAll('.message').forEach((message) => message.remove());
};

const showMessage = (message, type) => {
  let color, backgroundColor;
  if (type === 'error') {
    color = '#721c24';
    backgroundColor = '#f8d7da';
  } else if (type === 'success') {
    color = '#155724';
    backgroundColor = '#d4edda';
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
      generateICal(userText.value, date);
      showMessage('Success!', 'success');
    }
  }
};
