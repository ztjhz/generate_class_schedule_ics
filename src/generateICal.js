import { ICalendar } from 'datebook';
import './styles.css';

// course definition
class Course {
  static DAYS = { MON: 0, TUE: 1, WED: 2, THU: 3, FRI: 4, SAT: 5, SUN: 6 };

  constructor() {
    this.courseCode = '';
    this.title = '';
    this.au = '';
    this.courseType = '';
    this.courseGroup = '';
    this.su = '';
    this.indexNumber = '';
    this.status = '';
    this.choice = '';
    this.classType = '';
    this.group = '';
    this.day = '';
    this.time = '';
    this.venue = '';
    this.remark = '';
  }

  toTitle() {
    return `${this.courseCode} - ${this.title} (${this.classType})`;
  }

  toLocation() {
    return `${this.venue}`;
  }

  toDes() {
    return `\
Course Code: ${this.courseCode}
Title: ${this.title}
AU: ${this.au}
Course Type: ${this.courseType}
Course Group: ${this.courseGroup}
SU: ${this.su}
Index Number: ${this.indexNumber}
Status: ${this.status}
Choice: ${this.choice}
Class Type: ${this.classType}
Group: ${this.group}
Day: ${this.day}
Time: ${this.time}
Venue: ${this.venue}
Remark: ${this.remark}`;
  }

  toStart(startDate) {
    const date = addDays(startDate, Course.DAYS[this.day]);
    // time format HHMM
    const time = this.time.split('-')[0];
    date.setHours(Number(time.substring(0, 2)));
    date.setMinutes(Number(time.substring(2, 4)));
    return date;
  }

  toEnd(startDate) {
    const date = addDays(startDate, Course.DAYS[this.day]);
    // time format HHMM
    const time = this.time.split('-')[1];
    date.setHours(Number(time.substring(0, 2)));
    date.setMinutes(Number(time.substring(2, 4)));
    return date;
  }

  getWeeks() {
    const start = this.remark.indexOf('Teaching Wk') + 'Teaching Wk'.length;
    const w = this.remark.substring(start);
    const arr = [];

    // weeks seperated by comma - e.g. 1,3,5
    for (const i of w.split(',')) {
      const j = i.split('-');
      if (j.length == 2) {
        // range of weeks, e.g. 1-4
        for (let x = Number(j[0]); x <= Number(j[1]); x++) arr.push(x);
      } else {
        // range of weeks does not exist
        arr.push(Number(i));
      }
    }
    return arr;
  }
}

// parse pasted timetable into an array of course objects
const parseText = (text) => {
  const rows = text.split('\n');
  const output = [];
  let currCourse;
  for (const row of rows) {
    const data = row.trim().split('\t');
    if (data.length >= 6 && !data.includes('EXEMPTED')) {
      const c = new Course();

      // main class
      if (data.length === 15) {
        c.courseCode = data[0].trim();
        c.title = data[1].trim();
        c.au = data[2].trim();
        c.courseType = data[3].trim();
        c.courseGroup = data[4].trim();
        c.su = data[5].trim();
        c.indexNumber = data[6].trim();
        c.status = data[7].trim();
        c.choice = data[8].trim();
        c.classType = data[9].trim();
        c.group = data[10].trim();
        c.day = data[11].trim();
        c.time = data[12].trim();
        c.venue = data[13].trim();
        c.remark = data[14].trim();
        currCourse = c;
        output.push(c);
      } else if (data.length === 6 && currCourse) {
        // sub classes
        c.courseCode = currCourse.courseCode;
        c.title = currCourse.title;
        c.au = currCourse.au;
        c.courseType = currCourse.courseType;
        c.courseGroup = currCourse.courseGroup;
        c.su = currCourse.su;
        c.indexNumber = currCourse.indexNumber;
        c.status = currCourse.status;
        c.choice = currCourse.choice;
        c.classType = data[0].trim();
        c.group = data[1].trim();
        c.day = data[2].trim();
        c.time = data[3].trim();
        c.venue = data[4].trim();
        c.remark = data[5].trim();
        output.push(c);
      }
    }
  }
  return output;
};

const addDays = (date, days) => {
  var result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

const addCalendarProperties = (calendar, course) => {
  calendar.addProperty('CATEGORIES', 'CLASS');
  calendar.addProperty('X-MICROSOFT-CDO-BUSYSTATUS', 'BUSY');
  calendar.addProperty('UID', `${course.courseCode}-${course.indexNumber}`);
};

const createEvent = (course, weekNum, startDate) => {
  return new ICalendar({
    title: course.toTitle(),
    location: course.toLocation(),
    description: course.toDes(),
    start: addDays(
      course.toStart(startDate),
      weekNum < 8 ? (weekNum - 1) * 7 : weekNum * 7
    ),
    end: addDays(
      course.toEnd(startDate),
      weekNum < 8 ? (weekNum - 1) * 7 : weekNum * 7
    ),
  });
};

// create an event for the different lessons in different teaching weeks of the same course
const addCourse = (calendar, course, weeks, startDate) => {
  for (let i = 0; i < weeks.length; i++) {
    const newEvent = createEvent(course, weeks[i], startDate);
    addCalendarProperties(newEvent, course);
    calendar.addEvent(newEvent);
  }
};

const generateICal = (text, startDate) => {
  // text: string
  // startDate: Date
  try {
    const parsedData = parseText(text);

    // to create a new ICalendar instance, we need to create an event first
    let course = parsedData.shift();
    let weeks = course.getWeeks();

    // initialise icalendar
    const icalendar = createEvent(course, weeks.shift(), startDate);
    addCalendarProperties(icalendar, course);
    icalendar.setMeta('PRODID', 'Class Schedule');

    // fill up rest of the weeks for the first event
    addCourse(icalendar, course, weeks, startDate);

    // loop through rest of the courses
    for (let i = 0; i < parsedData.length; i++) {
      course = parsedData[i];
      weeks = course.getWeeks();
      addCourse(icalendar, course, weeks, startDate);
    }

    console.log(icalendar.render());
    icalendar.download('class_schedule.ics');
    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
};

export default generateICal;
