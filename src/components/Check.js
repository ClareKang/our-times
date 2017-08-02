import React, { Component } from 'react';
import moment from 'moment';
import { Paper } from 'material-ui';
import { FirebaseDb, currentUser } from '../helpers/firebase';
import endpoint from '../helpers/endpoint';

import Checkbox from './Checkbox';

export const TOTAL_WORK_TIME = 45;

const textCenterStyle = {
  textAlign: 'center',
};
const paperStyle = {
  padding: 30,
  lineHeight: '1.4em',
};

class Check extends Component {
  constructor(props) {
    super(props);
    const userInfo = currentUser();
    const date = moment(new Date()).format('YYYY-MM-DD');
    this.state = {
      userInfo,
      date,
      start: null,
      end: null,
    };
    this.calculateWeekTime = this.calculateWeekTime.bind(this);
  }
  componentWillMount() {
    const { date } = this.state;
    const currentDate = new Date(date);
    const weekNo = moment(currentDate).format('YYYY-WW');
    const monthNo = moment(currentDate).format('YYYY-MM');
    // get daily
    FirebaseDb
      .ref(`${endpoint.getUserCheckMonthly(monthNo, date, 'START')}`)
      .orderByChild('time')
      .limitToFirst(1)
      .on('child_added', snapshot => {
        const val = snapshot.val();
        this.setState({
          start: val.timestamp,
        });
      });
    FirebaseDb
      .ref(`${endpoint.getUserCheckMonthly(monthNo, date, 'END')}`)
      .orderByChild('time')
      .limitToLast(1)
      .on('child_added', snapshot => {
        const val = snapshot.val();
        this.setState({
          end: val.timestamp,
        });
      });
    // get weekly
    FirebaseDb
      .ref(`${endpoint.getUserCheckWeekly(weekNo)}`)
      .orderByChild('time')
      .on('value', snapshot => {
        const val = snapshot.val();
        this.setState({
          weekly: val,
        });
      });
  }
  getValue(timeObj, timeType, date) {
    let time = null;
    const timeArr = timeObj[timeType];
    for (const key in timeArr) {
      if (timeArr.hasOwnProperty(key)) {
        let tmpTime;
        if (timeArr[key].hasOwnProperty('timestamp')) {
          tmpTime = timeArr[key].timestamp;
        } else {
          const timeString = `${date} ${timeArr[key].time}`;
          tmpTime = moment(timeString).unix() * 1000;
        }

        if ((timeType === 'START' && (!time || time > tmpTime)) ||
          (timeType === 'END' && (!time || time < tmpTime))
        ) {
          time = tmpTime;
        }
      }
    }
    return time;
  }
  caculateTime(a, b) {
    const dist = Math.abs((a - b) / 1000);
    return this.minToString(dist);
  }
  calculateWeekTime() {
    let weeklyTime = 0;
    if (this.state.weekly !== null) {
      const weekly = this.state.weekly;
      for (const date in weekly) {
        if (weekly.hasOwnProperty(date)) {
          const startTime = this.getValue(weekly[date], 'START', date);
          const end = this.getValue(weekly[date], 'END', date);
          const endTime = end !== null ? end : new Date().getTime();
          weeklyTime += Math.abs((endTime - startTime) / 1000);
        }
      }
    }
    return weeklyTime;
  }
  minToString(totalMin) {
    const hour = Math.floor(totalMin / 60 / 60) || 0;
    const min = Math.floor(totalMin / 60 % 60) || 0;
    const result = `${hour}시간 ${min}분`;
    return result;
  }
  render() {
    const { userInfo, start, end, date } = this.state;
    const totalWorkTime = TOTAL_WORK_TIME * 3600;
    let todayWorkingTime = 0;

    if (start !== null) {
      // get today worktime
      const startTime = start;
      const endTime = end ? end : new Date().getTime();
      todayWorkingTime = (endTime - startTime) / 1000;
    }

    // get this week worktime
    const thisWeekTime = this.calculateWeekTime();

    const distWeekTime = (totalWorkTime - thisWeekTime);
    const remainWeekTime = distWeekTime > 0 ? this.minToString(distWeekTime) : '0분';
    const overWeekTime = distWeekTime < 0 ? this.minToString(Math.abs(distWeekTime)) : '0분';

    return (
      <div style={textCenterStyle}>
        <Paper style={paperStyle}>
          오늘 근무시간: {this.minToString(todayWorkingTime)}<br />
          이번주 근무시간: {this.minToString(thisWeekTime)}<br />
          이번주 남은 근무시간: {remainWeekTime}<br />
          이번주 초과 근무시간: {overWeekTime}
        </Paper>
        <Checkbox
          label="출근"
          timeType="START"
          userInfo={userInfo}
          date={date}
          time={start}
        />
        <Checkbox
          label="퇴근"
          timeType="END"
          userInfo={userInfo}
          date={date}
          time={end}
        />
      </div>
    );
  }
}

export default Check;
