import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { postSignup } from "../apis/auth";
import { AxiosError } from "axios";

const schema = z.object({
  email: z.string().email({ message: "올바른 이메일 형식이 아님" }),
  password: z.string()
    .min(8, { message: "비밀번호는 8자 이상" })
    .max(20, { message: "비밀번호 20자 이상" })
    .regex(/^(?=.*[a-zA-Z])(?=.*\d)/, { message: "비밀번호는 영문과 숫자를 포함해야 합니다" }),
  name: z.string().min(1, { message: "이름 입력" }),
  passwordCheck: z.string()
})
.refine((data) => data.password === data.passwordCheck, { message: "비밀번호 일치x", path: ['passwordCheck'] });

type FormFields = z.infer<typeof schema>

const Signup = () => {
  const navigate = useNavigate();
  
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormFields>({
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

      console.log('Attempting signup with data:', {
        ...signupData,
        password: '********' // 비밀번호는 로그에 표시하지 않음
      });

      const response = await postSignup(signupData);
      
      if (response.status) {
        alert("회원가입이 완료되었습니다!");
        navigate("/Login");
      } else {
        alert(response.message || "회원가입에 실패했습니다.");
      }
    } catch (error) {
      console.error("회원가입 실패:", error);
      
      if (error instanceof AxiosError) {
        const errorMessage = error.response?.data?.message || "회원가입 중 오류가 발생했습니다.";
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
    <div className="flex justify-center items-center h-screen bg-black">
      <div className="w-[300px] flex flex-col gap-4 text-white">
        <div className="flex items-center justify-between">
          <button onClick={() => navigate(-1)} className="text-2xl font-bold">&lt;</button>
          <div className="flex-1 text-center text-xl font-semibold">회원가입</div>
          <div className="w-[24px]"></div>
        </div>
    
        <input
          {...register("email")}
          type="email"
          placeholder="이메일"
          className={`w-full p-3 rounded-md border bg-transparent placeholder-white text-white 
                ${errors?.email ? "border-red-500 bg-red-900" : "border-white"}`}
        />
        {errors.email && <div className="text-red-500 text-sm">{errors.email.message}</div>}

        <input
          {...register("name")}
          type="text"
          placeholder="이름"
          className={`w-full p-3 rounded-md border bg-transparent placeholder-white text-white 
                ${errors?.name ? "border-red-500 bg-red-900" : "border-white"}`}
        />
        {errors.name && <div className="text-red-500 text-sm">{errors.name.message}</div>}
    
        <input
          {...register("password")}
          type="password"
          placeholder="비밀번호 (영문, 숫자 포함 8-20자)"
          className={`w-full p-3 rounded-md border bg-transparent placeholder-white text-white 
                ${errors?.password ? "border-red-500 bg-red-900" : "border-white"}`}
        />
        {errors.password && <div className="text-red-500 text-sm">{errors.password.message}</div>}

        <input
          {...register("passwordCheck")}
          type="password"
          placeholder="비밀번호 확인"
          className={`w-full p-3 rounded-md border bg-transparent placeholder-white text-white 
                ${errors?.passwordCheck ? "border-red-500 bg-red-900" : "border-white"}`}
        />
        {errors.passwordCheck && <div className="text-red-500 text-sm">{errors.passwordCheck.message}</div>}

        <button
          type="submit"
          onClick={handleSubmit(onSubmit)}
          disabled={isSubmitting}
          className="w-full bg-[#ff3399] text-white py-3 rounded-md font-medium hover:bg-[#FFC0CB] transition-colors disabled:bg-gray-600">
          {isSubmitting ? "처리 중..." : "회원가입"}
        </button>
      </div>
    </div>
  );
};

export default Signup;