import React, { Component } from 'react';
import moment from 'moment';
import { RaisedButton, Paper, FlatButton, IconButton, TextField } from 'material-ui';
import { brown500, fullWhite, teal500 } from 'material-ui/styles/colors';
import { FirebaseDb } from '../helpers/firebase';
import endpoint from '../helpers/endpoint';

const paperStyle = {
  padding: 30,
};
const headerStyle = {
  margin: 0,
  marginBottom: 15,
};
const verticalMiddle = {
  display: 'inline-block',
  verticalAlign: 'middle',
};
const textFieldStyle = {
  width: 100,
  textAlign: 'center',
  display: 'inline-block',
  verticalAlign: 'middle',
};

class Checkbox extends Component {
  constructor(props) {
    super(props);
    this.state = {
      time: props.time,
    };
    this.handleClick = this.handleClick.bind(this);
    this.recheck = this.recheck.bind(this);
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
  render() {
    const { label } = this.props;
    let { time, mode, text, updateDisabled } = this.state;
    const isChecked = time !== null;
    time = time ? moment(time).format('HH:mm:ss') : null;
    return (
      <Paper style={paperStyle}>
        <h2 style={headerStyle}>
          {label}&nbsp;
          {
            mode ?
              <div style={verticalMiddle}>
                <TextField
                  name="name"
                  style={textFieldStyle}
                  value={text}
                  onChange={this.changeTimeText}
                  autoFocus
                />
                <IconButton
                  iconConfig={{
                    name: 'save',
                    style: {
                      color: teal500,
                    },
                  }}
                  style={verticalMiddle}
                  label="저장"
                  onClick={this.update}
                  disabled={updateDisabled}
                />
                <IconButton
                  iconConfig={{
                    name: 'close',
                  }}
                  style={verticalMiddle}
                  label="취소"
                  onClick={() => this.changeMode(false)}
                />
              </div>
              :
              <span>
                <span style={verticalMiddle}>{time}</span>
                {
                  time ?
                  <IconButton
                    iconConfig={{
                      name: 'pencil',
                    }}
                    style={verticalMiddle}
                    label="수정"
                    onClick={() => this.changeMode(true)}
                  />
                  : null
                }
              </span>
          }
        </h2>
        <RaisedButton
          label={`지금 ${label}했어요!`}
          labelColor={fullWhite}
          backgroundColor={brown500}
          onClick={this.handleClick}
          disabled={isChecked}
        />
        {
          isChecked ?
            <FlatButton
              label="다시 체크하기"
              primary
              style={{ marginLeft: 10 }}
              onClick={this.recheck}
            />
            : null
        }
      </Paper>
    );
  }
}

export default Checkbox;
