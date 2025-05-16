import { useForm, SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { postSignup } from "../apis/auth";
import type { ResponseSignUpDto } from "../types/auth";

// 1. Zod 스키마
const schema = z
  .object({
    email: z.string().email({ message: "이메일 형식이 아닙니다!" }),
    passwd: z.string().min(8, { message: "비밀번호는 8자 이상이어야 합니다!" }).max(20),
    passwdCheck: z.string(),
    name: z.string().min(1, { message: "이름은 필수입니다!" }),
  })
  .refine((data) => data.passwd === data.passwdCheck, {
    message: "비밀번호가 일치하지 않습니다!",
    path: ["passwdCheck"],
  });

type FormFields = z.infer<typeof schema>;

const SignupPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormFields>({
    mode: "onBlur",
    defaultValues: {
      email: "",
      passwd: "",
      passwdCheck: "",
      name: "",
    },
    resolver: zodResolver(schema),
  });

  const [step, setStep] = useState(0);
  const [showPass, setShowPass] = useState(false);
  const [showPassCheck, setShowPassCheck] = useState(false);

  // 2. 제출 함수
  const onSubmit: SubmitHandler<FormFields> = async (data) => {
    try {
      const response: ResponseSignUpDto = await postSignup({
        email: data.email,
        name: data.name,
        password: data.passwd, // 필드 이름 주의!
      });

      console.log("회원가입 성공:", response);
      alert("회원가입이 완료되었습니다!");
    } catch (err: any) {
      console.error("회원가입 실패:", err.response?.data || err.message);
      alert("회원가입 실패: " + (err.response?.data?.message || "서버 오류"));
    }
  };

  const handleNext = () => {
    if (step < 2) setStep((prev) => prev + 1);
  };

  const handleBack = () => {
    if (step > 0) setStep((prev) => prev - 1);
  };

  return (
    <div className="flex flex-col items-center justify-center h-full gap-4">
      <div className="flex flex-col gap-3">
        {/* 상단 타이틀 + 뒤로가기 */}
        <div className="w-full flex justify-center items-center gap-2">
          <button
            type="button"
            onClick={handleBack}
            disabled={isSubmitting}
            className={`text-black p-2 rounded-sm ${
              isSubmitting ? "cursor-not-allowed opacity-50" : "hover:bg-gray-100"
            }`}
          >
            {"<"}
          </button>
          <span className="text-center text-xl font-semibold text-gray-800">회원가입</span>
        </div>

        {/* 이메일 */}
        {step === 0 && (
          <>
            <input
              {...register("email")}
              type="email"
              placeholder="이메일을 입력하세요"
              className={`border w-[300px] p-[10px] rounded-sm focus:border-[#807bff] ${
                errors.email ? "border-red-500 bg-red-200" : "border-gray-300"
              }`}
            />
            {errors.email?.message && (
              <div className="text-red-500 text-sm">{errors.email.message}</div>
            )}
          </>
        )}

        {/* 비밀번호 + 확인 */}
        {step === 1 && (
          <>
            <div className="relative w-[300px]">
              <input
                {...register("passwd")}
                type={showPass ? "text" : "password"}
                placeholder="비밀번호를 입력하세요"
                className={`border w-full p-[10px] rounded-sm focus:border-[#807bff] ${
                  errors.passwd ? "border-red-500 bg-red-200" : "border-gray-300"
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPass((prev) => !prev)}
                className="absolute right-2 top-3 text-sm text-blue-500"
              >
                {showPass ? "숨기기" : "보기"}
              </button>
            </div>
            {errors.passwd?.message && (
              <div className="text-red-500 text-sm">{errors.passwd.message}</div>
            )}

            <div className="relative w-[300px]">
              <input
                {...register("passwdCheck")}
                type={showPassCheck ? "text" : "password"}
                placeholder="비밀번호 확인"
                className={`border w-full p-[10px] rounded-sm focus:border-[#807bff] ${
                  errors.passwdCheck ? "border-red-500 bg-red-200" : "border-gray-300"
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassCheck((prev) => !prev)}
                className="absolute right-2 top-3 text-sm text-blue-500"
              >
                {showPassCheck ? "숨기기" : "보기"}
              </button>
            </div>
            {errors.passwdCheck?.message && (
              <div className="text-red-500 text-sm">{errors.passwdCheck.message}</div>
            )}
          </>
        )}

        {/* 이름 */}
        {step === 2 && (
          <>
            <input
              {...register("name")}
              type="text"
              placeholder="이름을 입력하세요"
              className={`border w-[300px] p-[10px] rounded-sm focus:border-[#807bff] ${
                errors.name ? "border-red-500 bg-red-200" : "border-gray-300"
              }`}
            />
            {errors.name?.message && (
              <div className="text-red-500 text-sm">{errors.name.message}</div>
            )}
          </>
        )}

        {/* 버튼 영역 */}
        {step < 2 && (
          <button
            type="button"
            onClick={handleNext}
            disabled={
              (step === 0 && !!errors.email) ||
              (step === 1 && (!!errors.passwd || !!errors.passwdCheck))
            }
            className={`w-full text-white p-2 rounded-sm ${
              (step === 0 && !!errors.email) ||
              (step === 1 && (!!errors.passwd || !!errors.passwdCheck))
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-600"
            }`}
          >
            다음
          </button>
        )}

        {step === 2 && (
          <button
            type="button"
            onClick={handleSubmit(onSubmit)}
            disabled={isSubmitting}
            className={`w-full text-white p-2 rounded-sm ${
              isSubmitting ? "bg-gray-300 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"
            }`}
          >
            회원가입 완료
          </button>
        )}
      </div>
    </div>
  );
};

export default SignupPage;
