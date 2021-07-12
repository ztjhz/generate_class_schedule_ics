import pkg from 'datebook';
const { ICalendar } = pkg;

class Course {
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
}

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
const rows = text.split('\n');
console.log(rows);
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
    console.log(c);
  }
}

function addDays(date, days) {
  var result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

// teaching weeks
const startDate = new Date(2021, 7, 10);
const dates = [startDate];
for (let i = 1; i < 13; i++) {
  if (i >= 7) {
    dates.push(addDays(dates[0], 7 * (i + 1)));
  } else {
    dates.push(addDays(dates[0], 7 * i));
  }
}
console.log(dates);

// const options = {
//   title: 'Happy Hour',
//   location: 'The Bar, New York, NY',
//   description: "Let's blow off some steam with a tall cold one!",
//   start: new Date('2022-07-08T19:00:00'),
//   end: new Date('2022-07-08T23:30:00'),
//   recurrence: {
//     frequency: 'WEEKLY',
//     interval: 2,
//   },
// };

// const icalendar = new ICalendar(options);
// console.log(icalendar.render());
