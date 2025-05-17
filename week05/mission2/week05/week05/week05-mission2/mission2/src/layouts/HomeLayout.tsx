import { Link, Outlet } from "react-router-dom";

const HomeLayout = () => {
    return (
        <div className="h-dvh flex flex-col bg-black">
            <nav className="bg-glack-100 px-10 py-4 flex justify-between items-center">
                <div className="text-xl font-bold text-[#ff3399]">돌려돌려LP판</div>
                <div className="flex gap-6">
                    <Link to="/login" className="text-white hover:text-[#ff3399]">로그인</Link>
                    <Link to="/signup" className="text-white hover:text-[#ff3399]">회원가입</Link>
                </div>
            </nav>
            <main className="flex-1">
                <Outlet />
            </main>
            <footer>footer</footer>
        </div>
    );
};

export default HomeLayout;
