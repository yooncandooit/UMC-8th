import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { postSignup } from "../apis/auth";
import { AxiosError } from "axios";

const schema = z
  .object({
    email: z.string().email({ message: "이메일 형식이 아닙니다!" }),
    password: z
      .string()
      .min(8, { message: "비밀번호는 8자 이상이어야합니다!" })
      .max(20, { message: "비밀번호 20자 이하여야합니다" })
      .regex(/^(?=.*[a-zA-Z])(?=.*\d)/, {
        message: "비밀번호는 영문과 숫자를 포함해야 합니다!",
      }),
    name: z.string().min(1, { message: "이름을 1자 이상 입력하세요!" }),
    passwordCheck: z.string(),
  })
  .refine((data) => data.password === data.passwordCheck, {
    message: "비밀번호가 일치하지 않습니다!",
    path: ["passwordCheck"],
  });

type FormFields = z.infer<typeof schema>;

const SignupPage = () => {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormFields>({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      passwordCheck: "",
    },
    resolver: zodResolver(schema),
    mode: "onBlur",
  });

  const onSubmit: SubmitHandler<FormFields> = async (data) => {
    try {
      const signupData = {
        email: data.email.trim(),
        password: data.password,
        name: data.name.trim(),
      };

      console.log("Attempting signup with data:", {
        ...signupData,
        password: "********", // 비밀번호는 로그에 표시하지 않음
      });

      const response = await postSignup(signupData);

      if (response.status) {
        alert("회원가입이 완료되었습니다!");
        navigate("/login");
      } else {
        alert(response.message || "회원가입에 실패했습니다.");
      }
    } catch (error) {
      console.error("회원가입 실패:", error);

      if (error instanceof AxiosError) {
        const errorMessage =
          error.response?.data?.message || "회원가입 중 오류가 발생했습니다.";
        alert(errorMessage);

        // 특정 에러 처리
        if (error.response?.status === 409) {
          alert("이미 사용 중인 이메일입니다.");
        }
      } else {
        alert("회원가입 중 오류가 발생했습니다. 다시 시도해주세요.");
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4">
      <div className="w-full max-w-sm p-6 bg-white rounded-xl shadow-md">
        {/* 뒤로가기 + 타이틀 */}
        <div className="relative flex items-center justify-center mb-6">
          <button
            onClick={() => navigate(-1)}
            className="absolute left-0 text-gray-700 text-2xl"
          >
            &lt;
          </button>
          <h1 className="text-xl font-bold text-gray-800">회원가입</h1>
        </div>

        {/* 폼 입력 영역 */}
        <div className="flex flex-col gap-3">
          <input
            {...register("email")}
            type="email"
            placeholder="이메일"
            className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400 ${
              errors?.email ? "border-red-400 bg-red-50" : "border-gray-300"
            }`}
          />
          {errors.email && (
            <div className="text-red-500 text-sm">{errors.email.message}</div>
          )}

          <input
            {...register("name")}
            type="text"
            placeholder="이름"
            className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400 ${
              errors?.name ? "border-red-400 bg-red-50" : "border-gray-300"
            }`}
          />
          {errors.name && (
            <div className="text-red-500 text-sm">{errors.name.message}</div>
          )}

          <input
            {...register("password")}
            type="password"
            placeholder="비밀번호 (영문, 숫자 포함 8-20자)"
            className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400 ${
              errors?.password ? "border-red-400 bg-red-50" : "border-gray-300"
            }`}
          />
          {errors.password && (
            <div className="text-red-500 text-sm">
              {errors.password.message}
            </div>
          )}

          <input
            {...register("passwordCheck")}
            type="password"
            placeholder="비밀번호 확인"
            className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400 ${
              errors?.passwordCheck
                ? "border-red-400 bg-red-50"
                : "border-gray-300"
            }`}
          />
          {errors.passwordCheck && (
            <div className="text-red-500 text-sm">
              {errors.passwordCheck.message}
            </div>
          )}

          <button
            type="submit"
            onClick={handleSubmit(onSubmit)}
            disabled={isSubmitting}
            className={`w-full mt-2 py-2 rounded-md text-white font-semibold transition ${
              isSubmitting
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-indigo-500 hover:bg-indigo-600"
            }`}
          >
            {isSubmitting ? "처리 중..." : "회원가입"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
