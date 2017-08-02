// save firabase user to local storage from firebase and save to local
export const fetchUserObject = obj => (
  new Promise((resolve, reject) => {
    const user = {
      email: obj.user.email,
      uid: obj.user.uid,
      displayName: obj.user.displayName,
      refreshToken: obj.user.refreshToken,
      emailVerified: obj.user.emailVerified,
      isAnonymous: obj.user.isAnonymous,
      photoUrl: obj.user.photoUrl,
      provider: obj.credential.providerId,
    };
    window.localStorage.setItem('currentUser', JSON.stringify(user));
    const userObject = window.localStorage.getItem('currentUser');
    resolve(JSON.parse(userObject));
  })
);

export const fetchUserObjectForEmail = obj => (
  new Promise((resolve, reject) => {
    const user = {
      email: obj.email,
      uid: obj.uid,
      displayName: obj.displayName,
      refreshToken: obj.refreshToken,
      emailVerified: obj.emailVerified,
      isAnonymous: obj.isAnonymous,
      photoUrl: obj.photoUrl,
      provider: 'email',
    };
    window.localStorage.setItem('currentUser', JSON.stringify(user));
    const userObject = window.localStorage.getItem('currentUser');
    resolve(JSON.parse(userObject));
  })
);

export const updateUserObject = obj => (
  new Promise((resolve, reject) => {
    const oldUser = JSON.parse(window.localStorage.getItem('currentUser'));
    const user = {
      ...oldUser,
      ...obj
    };
    window.localStorage.setItem('currentUser', JSON.stringify(user));
    const userObject = window.localStorage.getItem('currentUser');
    resolve(JSON.parse(userObject));
  })
)

// get current user without promise
export const currentUser = () => (
  JSON.parse(window.localStorage.getItem('currentUser'))
);

export const isAdmin = () => {
  const user = currentUser();
  if (user === null) return false;
  return user.permission === 'ADMIN';
};

export const getUserProvider = (user) => {
  const { provider } = user;
  if (!!provider) {
    if (provider.indexOf('google') > -1) {
      return 'google';
    } else if (provider.indexOf('twitter') > -1) {
      return 'twitter';
    }
  }
  return 'email';
};

export const getUserDisplayName = (user) => {
  const { provider, email, displayName } = user;
  const userEmail = email !== null ? ` (${email})` : '';
  if (displayName && !!provider && (provider.indexOf('google') > -1 || provider.indexOf('twitter') > -1)) {
    return `${displayName}${userEmail}`;
  }
  return email;
};
