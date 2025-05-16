export type UserSignInformation = {
  email: string;
  passwd: string;
};

export type UserSignUpInformation = {
  email: string;
  passwd: string;
  passwdCheck: string;
  name: string;
};

function validateSignin(values: UserSignInformation) {
  const errors = {
    email: "",
    passwd: "",
  };

  if (
    !/^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i.test(
      values.email
    )
  ) {
    errors.email = "유효하지 않은 이메일";
  }

  if (!(values.passwd.length >= 8 && values.passwd.length <= 20)) {
    errors.passwd = "비밀번호 길이가 너무 짧거나 깁니다";
  }

  return errors;
}

function validateSignUp(values: UserSignUpInformation) {
  const errors = {
    email: "",
    passwd: "",
    passwdCheck: "",
    name: "",
  };

  if (
    !/^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i.test(
      values.email
    )
  ) {
    errors.email = "유효하지 않은 이메일";
  }

  if (!(values.passwd.length >= 8 && values.passwd.length <= 20)) {
    errors.passwd = "비밀번호 길이가 너무 짧거나 깁니다";
  }
  if (values.passwd !== values.passwdCheck) {
    errors.passwdCheck = "비밀번호가 일치하지 않습니다";
  }
  if (values.name.length < 1 || values.name.length > 10) {
    errors.name = "이름은 1자 이상 10자 이하로 입력해주세요";
  }

  return errors;
}

export { validateSignin, validateSignUp };
