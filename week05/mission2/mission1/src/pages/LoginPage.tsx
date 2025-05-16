import { UserSigninInformation, validateSignin } from "../utils/validate";
import useForm from "../hooks/useForm";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const { values, errors, touched, getInputProps } =
    useForm<UserSigninInformation>({
      initialValue: {
        email: "",
        password: "",
      },
      validate: validateSignin,
    });

  const handleSubmit = async () => {
    try {
      const response = await login({
        email: values.email.trim(),
        password: values.password,
      });
      if (!response) {
        throw new Error("로그인에 실패했습니다");
      }
      navigate("/my");
    } catch (error) {
      console.error("로그인 실패:", error);
    }
  };

  // 오류가 하나라도 있거나, 입력값이 비어있으면 버튼을 비활성화
  const isDisabled =
    Object.values(errors || {}).some((error) => error.length > 0) ||
    Object.values(values).some((value) => value === "");

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
          <h1 className="text-xl font-bold text-gray-800">Login</h1>
        </div>

        {/* 이메일 입력 */}
        <div className="flex flex-col gap-3">
          <input
            {...getInputProps("email")}
            placeholder="이메일을 입력해주세요!"
            className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400 ${
              errors?.email && touched?.email
                ? "border-red-400 bg-red-50"
                : "border-gray-300"
            }`}
          />
          {errors?.email && touched?.email && (
            <div className="text-red-500 text-sm">{errors.email}</div>
          )}

          {/* 비밀번호 입력 */}
          <input
            {...getInputProps("password")}
            placeholder="비밀번호를 입력해주세요!"
            type="password"
            className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400 ${
              errors?.password && touched?.password
                ? "border-red-400 bg-red-50"
                : "border-gray-300"
            }`}
          />
          {errors?.password && touched?.password && (
            <div className="text-red-500 text-sm">{errors.password}</div>
          )}

          {/* 로그인 버튼 */}
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isDisabled}
            className={`w-full mt-2 py-2 rounded-md text-white font-semibold transition ${
              isDisabled
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-indigo-500 hover:bg-indigo-600"
            }`}
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
