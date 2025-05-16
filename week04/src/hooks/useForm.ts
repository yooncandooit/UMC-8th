import { ChangeEvent, useEffect, useState } from "react";

interface UseFormProps<T> {
  values: T;
  touched: Record<keyof T, boolean>;
  errors: Record<keyof T, string>;
  handleChange: (name: keyof T, text: string) => void;
  handleBlur: (name: keyof T) => void;
  getInputProps: (name: keyof T) => {
    name: string;
    value: string;
    onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    onBlur: () => void;
  };
}

function useForm<T extends Record<string, string>>({
  initialValue,
  validate,
}: {
  initialValue: T;
  //값이 올바른지 검증하는 함수
  validate: (values: T) => Record<keyof T, string>;
}): UseFormProps<T> {
  const [values, setValues] = useState<T>(initialValue);
  const [touched, setTouched] = useState<Record<keyof T, boolean>>({} as Record<keyof T, boolean>);
  const [errors, setErrors] = useState<Record<keyof T, string>>(() => validate(initialValue));

  // 사용자가 입력값을 바꿀 때 실행되는 함수
  const handleChange = (name: keyof T, text: string) => {
    setValues((prev) => ({
      ...prev,
      [name]: text,
    }));
  };

  // 입력 필드를 떠날 때 실행되는 함수
  const handleBlur = (name: keyof T) => {
    setTouched((prev) => ({
      ...prev,
      [name]: true,
    }));
  };

  // JSX input 요소에서 바로 사용 가능한 props 반환
  const getInputProps = (name: keyof T) => {
    return {
      name: name as string,
      value: values[name],
      onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
        handleChange(name, e.target.value),
      onBlur: () => handleBlur(name),
    };
  };

  // values가 변경될 때마다 validate 호출
  useEffect(() => {
    const validationResult = validate(values);
    setErrors(validationResult);
  }, [values, validate]);

  return { values, touched, errors, handleChange, handleBlur, getInputProps };
}

export default useForm;