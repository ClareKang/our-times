import { currentUser } from './firebase';

const userInfo = currentUser();
let basePath = '';
if (userInfo) {
  basePath = `/user-checks/${userInfo.uid}`;
}

const endpoint = {
  setUserCheckMonthly: (monthNo, date, timeType, newPostKey) => (
    `${basePath}/${monthNo}_month/${date}/${timeType}/${newPostKey}`
  ),
  getUserCheckMonthly: (monthNo, date, timeType) => (
    `${basePath}/${monthNo}_month/${date}/${timeType}`
  ),
  setUserCheckWeekly: (weekNo, date, timeType, newPostKey) => (
    `${basePath}/${weekNo}_week/${date}/${timeType}/${newPostKey}`
  ),
  getUserCheckWeekly: (weekNo) => (
    `${basePath}/${weekNo}_week`
  ),
};

export default endpoint;
