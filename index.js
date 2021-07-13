import datebook from 'datebook';
import fs, { fstatSync } from 'fs';
const { ICalendar } = datebook;

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
    const data = row.split('\t');
    if (data.length > 1) {
      const c = new Course();

      // main class
      if (data.length === 15) {
        c.courseCode = data[0];
        c.title = data[1];
        c.au = data[2];
        c.courseType = data[3];
        c.courseGroup = data[4];
        c.su = data[5];
        c.indexNumber = data[6];
        c.status = data[7];
        c.choice = data[8];
        c.classType = data[9];
        c.group = data[10];
        c.day = data[11];
        c.time = data[12];
        c.venue = data[13];
        c.remark = data[14];
        currCourse = c;
      } else if (data.length === 6) {
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
        c.classType = data[0];
        c.group = data[1];
        c.day = data[2];
        c.time = data[3];
        c.venue = data[4];
        c.remark = data[5];
      }
      output.push(c);
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

const main = () => {
  /* TODO
let user paste their timetable
*/

  const text = `AB1202	STATISTICS & ANALYSIS	3	CORE	 	 	00550	REGISTERED	 	SEM	2	MON	1430-1620	S3-SR4	Teaching Wk1-13
AB1301	BUSINESS LAW	3	CORE	 	 	00437	REGISTERED	 	SEM	7	TUE	0930-1220	ONLINE	Teaching Wk1-13
CC0003	ETHICS & CIVICS IN A MULTICULTURAL WORLD	2	CORE	INTERDISCIPLINARY COLLABORATIVE CORE	 	10570	REGISTERED	 	TUT	T60	THU	1430-1620	LHN-TR+30	Teaching Wk3,5,7,9,11,13
CC0005	HEALTHY LIVING & WELLBEING	3	CORE	INTERDISCIPLINARY COLLABORATIVE CORE	 	10620	REGISTERED	 	TUT	T44	WED	1430-1620	LHN-TR+12	Teaching Wk1-13
LEC/STUDIO	LE2	FRI	1630-1720	ONLINE	Teaching Wk1-13
EG1001	ENGINEERS IN SOCIETY	2	CORE	 	 	32207	REGISTERED	 	TUT	E029	TUE	1430-1520	TR+90	Teaching Wk2-13
LEC/STUDIO	LE	WED	0830-1020	ONLINE	Teaching Wk1-13
HE9091	PRINCIPLES OF ECONOMICS	3	CORE	 	 	 	EXEMPTED	 	 	 	 	 	 	 
MH1810	MATHEMATICS 1	3	CORE	 	 	10120	REGISTERED	 	TUT	DD1	WED	1330-1420	TR+9	Teaching Wk2-13
LEC/STUDIO	LB	FRI	0830-1020	ONLINE	Teaching Wk1-13
SC1003	INTRODUCTION TO COMPUTATIONAL THINKING & PROGRAMMING	3	CORE	 	 	10020	REGISTERED	 	TUT	DD1	WED	1030-1120	SWLAB1	Teaching Wk1-13
LAB	DD1	WED	1130-1220	SWLAB1	Teaching Wk1-13
LEC/STUDIO	SC1	MON	0930-1020	ONLINE	Teaching Wk1-13
SC1013	PHYSICS FOR COMPUTING	2	CORE	 	 	10072	REGISTERED	 	LAB	DD1	FRI	1430-1620	HPL	Teaching Wk1,3,5,7,9,11,13
LEC/STUDIO	SC1	TUE	0830-0920	ONLINE	Teaching Wk5-13
LEC/STUDIO	SC1	THU	0930-1020	ONLINE	Teaching Wk5-13
LEC/STUDIO	SC1	MON	1930-2220	ONLINE	Teaching Wk1-4
`;
  const parsedData = parseText(text);

  /* TODO 
let user input semester start date (must be a monday)
*/

  const startDate = new Date(2021, 7, 9);

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
    if (course.status !== 'EXEMPTED') {
      weeks = course.getWeeks();
      addCourse(icalendar, course, weeks, startDate);
    }
  }

  // save to file
  fs.writeFile('classes.ics', icalendar.render(), (err) => {
    if (err) throw err;
    console.log('Saved!');
  });
};

main();
