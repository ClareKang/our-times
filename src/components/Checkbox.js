import React, { Component } from 'react';
import moment from 'moment';
import { RaisedButton, FlatButton, IconButton, TextField } from 'material-ui';
import { fullWhite, blueGrey500 } from 'material-ui/styles/colors';
import EditIcon from 'material-ui/svg-icons/image/edit';
import SaveIcon from 'material-ui/svg-icons/content/save';
import ClearIcon from 'material-ui/svg-icons/content/clear';
import { FirebaseDb } from '../helpers/firebase';
import endpoint from '../helpers/endpoint';

const paperStyle = {
  padding: '20px 30px',
};
const headerStyle = {
  margin: 0,
  marginBottom: 15,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'baseline',
};
const textFieldStyle = {
  width: 100,
  textAlign: 'center',
};

class Checkbox extends Component {
  constructor(props) {
    super(props);
    this.state = {
      time: props.time,
    };
    this.handleClick = this.handleClick.bind(this);
    this.recheck = this.recheck.bind(this);
    this.update = this.update.bind(this);
    this.changeMode = this.changeMode.bind(this);
    this.changeTimeText = this.changeTimeText.bind(this);
  }
  componentWillReceiveProps(nextProps) {
    this.setState({
      time: nextProps.time,
    });
  }
  handleClick(e) {
    e.preventDefault();
    const currentDate = new Date();
    const time = moment(currentDate).format('HH:mm:ss');
    const {
      date, timeType,
    } = this.props;
    const postData = {
      // author: userInfo.displayName,
      // uid: userInfo.uid,
      date,
      timestamp: currentDate.getTime(),
      time,
    };
    const weekNo = moment(currentDate).format('YYYY-WW');
    const monthNo = moment(currentDate).format('YYYY-MM');
    const newPostKey = FirebaseDb.ref().child('user-checks').push().key;
    const updates = {};
    updates[endpoint.setUserCheckMonthly(monthNo, date, timeType, newPostKey)] = postData;
    updates[endpoint.setUserCheckWeekly(weekNo, date, timeType, newPostKey)] = postData;
    FirebaseDb.ref().update(updates, error => {
      if (error) {
        alert(`Data could not be saved. ${error}`);
      }
    });
    this.setState({
      time: currentDate.getTime(),
    });
  }
  recheck() {
    this.setState({
      time: null,
    });
  }
  update() {
    const {
      date, timeType,
    } = this.props;
    const timeString = `${date} ${this.state.text}`;
    const timestamp = moment(timeString).unix() * 1000;
    const postData = {
      // author: userInfo.displayName,
      // uid: userInfo.uid,
      date,
      timestamp,
      time: this.state.text,
    };
    const weekNo = moment(date).format('YYYY-WW');
    const monthNo = moment(date).format('YYYY-MM');
    const newPostKey = FirebaseDb.ref().child('user-checks').push().key;
    const updates = {};
    updates[endpoint.setUserCheckMonthly(monthNo, date, timeType, newPostKey)] = postData;
    updates[endpoint.setUserCheckWeekly(weekNo, date, timeType, newPostKey)] = postData;
    FirebaseDb.ref().update(updates, error => {
      if (error) {
        alert(`Data could not be saved. ${error}`);
      }
    });
    this.setState({
      mode: false,
    });
  }
  changeMode(mode) {
    this.setState({
      mode,
    });
  }
  changeTimeText(e, val) {
    const reg = /^([0-1][0-9]|[2][0-3]|):([0-5][0-9]):([0-5][0-9]){1,2}$/;
    if (reg.test(val)) {
      const timeString = `${this.props.date} ${val}`;
      const timestamp = moment(timeString).unix() * 1000;
      this.setState({
        time: timestamp,
        text: val,
        updateDisabled: false,
      });
    } else {
      this.setState({
        text: val,
        updateDisabled: true,
      });
    }
  }
  render() {
    const { label } = this.props;
    let { time, mode, text, updateDisabled } = this.state;
    const isChecked = time !== null;
    time = time ? moment(time).format('HH:mm:ss') : null;
    return (
      <div style={paperStyle}>
        <h2 style={headerStyle}>
          {label}&nbsp;
          {
            mode
              ? <div>
                  <TextField
                    name="name"
                    style={textFieldStyle}
                    value={text}
                    onChange={this.changeTimeText}
                    autoFocus
                  />
                  <IconButton
                    tooltip="저장"
                    onClick={this.update}
                    disabled={updateDisabled}
                  >
                    <SaveIcon color={blueGrey500} />
                  </IconButton>
                  <IconButton
                    tooltip="취소"
                    onClick={() => this.changeMode(false)}
                  >
                    <ClearIcon />
                  </IconButton>
                </div>
              : <span>
                  <span>{time}</span>
                  {
                    time
                      ? <IconButton
                          tooltip="수정"
                          onClick={() => this.changeMode(true)}
                        >
                          <EditIcon />
                        </IconButton>
                      : null
                  }
                </span>
          }
        </h2>
        <RaisedButton
          label={`지금 ${label}했어요!`}
          onClick={this.handleClick}
          labelColor={fullWhite}
          primary
          disabled={isChecked}
        />
        {
          isChecked
            ? <FlatButton
                label="다시 체크하기"
                secondary
                style={{ marginLeft: 10 }}
                onClick={this.recheck}
              />
            : null
        }
      </div>
    );
  }
}

export default Checkbox;
