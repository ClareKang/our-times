import moment from 'moment';

export default class Post {
  constructor(type, datetime, createDatetime = null) {
    this.type = type;
    this.datetime = datetime;
    this.createDatetime = createDatetime;
    return this.create();
  }
  create() {
    const datetime = moment(this.datetime);
    const createDatetime = moment(this.createDatetime || this.datetime);
    return {
      type: this.type,
      year: datetime.year(),
      month: datetime.month(),
      date: datetime.date(),
      week: datetime.week(),
      time: datetime.format('HH:mm:ss'),
      timestamp: datetime.getTime(),
      created_at: createDatetime.getTime(),
    };
  }
}
