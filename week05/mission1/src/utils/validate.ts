export type UserSigninInformation = {
    email: string;
    password: string;
};

function validateUser(values: UserSigninInformation) {
    const errors = {
        email: "",
        password: "",
    };

    if (!/^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i.test(values.email)) {
        errors.email = '올바른 이메일 형식이 아님';
    }

    if (!(values.password.length >= 8 && values.password.length < 20)) {
        errors.password = "비밀번호는 8~20자 사이로 입력";
    }

    return errors;
}

function validateSignin(values: UserSigninInformation) {
    return validateUser(values);
}

export { validateSignin };