import './style.css';

const CLOCK_CONFIG = {
  updateInterval: 1000,
  rows: [
    'ESONELASUNA', 'DOSITREAOAM', 'CUATROCINCO', 'SEISASIETEN',
    'OCHONUEVEPM', 'LADIEZSONCE', 'DOCELYMENOS', 'OVEINTEDIEZ',
    'VEINTICINCO', 'MEDIACUARTO'
  ].map(row => row.split('')),
  
  timeTemplates: {
    minutes: {
      0: 'EN PUNTO', 5: 'Y CINCO', 10: 'Y DIEZ', 15: 'Y CUARTO',
      20: 'Y VEINTE', 25: 'Y VEINTICINCO', 30: 'Y MEDIA',
      35: 'MENOS VEINTICINCO', 40: 'MENOS VEINTE', 45: 'MENOS CUARTO',
      50: 'MENOS DIEZ', 55: 'MENOS CINCO'
    },
    hours: {
      0: 'DOCE', 1: 'UNA', 2: 'DOS', 3: 'TRES', 4: 'CUATRO',
      5: 'CINCO', 6: 'SEIS', 7: 'SIETE', 8: 'OCHO', 9: 'NUEVE',
      10: 'DIEZ', 11: 'ONCE', 12: 'DOCE'
    },
    prefixes: {
      0: 'SON LAS',
      1: 'ES LA'
    }
  }
};

const TimeHelper = {
  getRoundedMinutes: (minutes) => Math.round(minutes / 5) * 5,
  adjustHourForMinutes: (hours, minutes) => minutes > 30 ? hours + 1 : hours
};

class ClockController {
  constructor() {
    this.clockElement = document.querySelector('#clock-container');
    this.initializeClock();
    this.startClock();
  }

  initializeClock() {
    CLOCK_CONFIG.rows.forEach(rowLetters => {
      const rowElement = document.createElement('div');
      rowElement.className = 'row';
      
      rowLetters.forEach(letter => {
        const letterElement = document.createElement('span');
        letterElement.className = 'letter';
        letterElement.textContent = letter;
        rowElement.appendChild(letterElement);
      });
      
      this.clockElement.appendChild(rowElement);
    });
  }

  startClock() {
    setInterval(() => this.updateClock(), CLOCK_CONFIG.updateInterval);
    this.updateClock();
  }

  updateClock() {
    const currentTime = this.getCurrentTimeData();
    this.highlightTimeComponents(currentTime);
  }

  getCurrentTimeData() {
    const now = new Date();
    let hours = now.getHours() % 12;
    const minutes = TimeHelper.getRoundedMinutes(now.getMinutes());
    
    hours = TimeHelper.adjustHourForMinutes(hours, minutes);
    
    return {
      prefix: CLOCK_CONFIG.timeTemplates.prefixes[hours === 1 ? 1 : 0],
      hour: CLOCK_CONFIG.timeTemplates.hours[hours],
      minute: CLOCK_CONFIG.timeTemplates.minutes[minutes]
    };
  }

  highlightTimeComponents({ prefix, hour, minute }) {
    const allLetters = document.querySelectorAll('.letter');
    this.resetHighlight(allLetters);
    
    const fullText = Array.from(allLetters).map(letter => letter.textContent).join('');
    let searchPosition = 0;
    
    [prefix, hour, minute].flatMap(component => component.split(' ')).forEach(word => {
      const wordPosition = fullText.indexOf(word, searchPosition);
      if (wordPosition === -1) return;
      
      this.highlightLetters(allLetters, wordPosition, word.length);
      searchPosition = wordPosition + word.length;
    });
  }

  resetHighlight(letters) {
    letters.forEach(letter => letter.classList.remove('active'));
  }

  highlightLetters(letters, startIndex, length) {
    for (let i = 0; i < length; i++) {
      letters[startIndex + i].classList.add('active');
    }
  }
}

window.addEventListener('DOMContentLoaded', () => {
  new ClockController();
});