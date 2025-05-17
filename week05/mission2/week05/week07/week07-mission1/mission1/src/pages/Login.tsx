import { UserSigninInformation, validateSignin } from "../utils/validate";
import useForm from "../hooks/useForm";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { useAuth } from "../context/AuthContext";

const Login = () => {
    const navigate = useNavigate();
    const { login } = useAuth();

    const mutation = useMutation({
        mutationFn: (body: { email: string; password: string }) => {
            console.log("로그인 시도:", body);
            return login(body);
        },
        onSuccess: (response) => {
            console.log("로그인 성공 응답:", response);
            if (!response) {
                alert("이메일 또는 비밀번호가 올바르지 않습니다");
                return;
            }
            navigate("/my");
        },
        onError: () => {
            alert("이메일 또는 비밀번호가 올바르지 않습니다");
        }
    });

    const { values, errors, touched, getInputProps } = useForm<UserSigninInformation>({
        initialValue: {
            email: "",
            password: "",
        },
        validate: validateSignin,
    });

    const handleSubmit = () => {
        mutation.mutate({
            email: values.email,
            password: values.password
        });
    };

    const handleGoogleLogin = () => {
        window.location.href=import.meta.env.VITE_SERVER_API_URL + "/v1/auth/google/login";
    }

    const isDisabled = Object.values(errors || {}).some((error) => error.length > 0) || Object.values(values).some((value) => value === "");

    return (
        <div className="flex justify-center items-center h-screen bg-black">
            <div className="w-[300px] flex flex-col gap-4 text-white">
                <div className="flex items-center justify-between">
                    <button onClick={() => navigate(-1)} className="text-2xl font-bold">&lt;</button>
                    <div className="flex-1 text-center text-xl font-semibold">로그인</div>
                    <div className="w-[24px]"></div>
                </div>
    
                {/*구글*/}
                <button className="border border-white rounded-md py-2 w-full flex items-center justify-center gap-2"
                    type="button"
                    onClick={handleGoogleLogin}
                >
                    <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="google" className="w-5 h-5" />
                    <span>구글 로그인</span>
                </button>
    
                {/*OR*/}
                <div className="flex items-center gap-2">
                    <div className="flex-1 h-px bg-white" />
                    <span className="text-sm text-white">OR</span>
                    <div className="flex-1 h-px bg-white" />
                </div>
    
                <input
                    {...getInputProps("email")}
                    placeholder="이메일을 입력해주세요!"
                    className={`w-full p-3 rounded-md border bg-transparent placeholder-white text-white 
                ${errors?.email && touched?.email ? "border-red-500 bg-red-900" : "border-white"}`}
                />
                {errors?.email && touched?.email && (
                    <span className="text-red-500 text-sm">{errors.email}</span>
                )}
    
                <input
                    {...getInputProps("password")}
                    placeholder="비밀번호를 입력해주세요!"
                    className={`w-full p-3 rounded-md border bg-transparent placeholder-white text-white 
                ${errors?.password && touched?.password ? "border-red-500 bg-red-900" : "border-white"}`}
                />
                {errors?.password && touched?.password && (
                    <span className="text-red-500 text-sm">{errors.password}</span>
                )}

                <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={isDisabled || mutation.isPending}
                    className="w-full bg-[#ff3399] text-white py-3 rounded-md font-medium hover:bg-[#FFC0CB] transition-colors disabled:bg-gray-600">
                    {mutation.isPending ? "로그인 중..." : "로그인"}
                </button>
            </div>
        </div>
    );
};

export default Login