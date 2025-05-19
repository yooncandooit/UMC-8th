import { Link, Outlet, useNavigate } from "react-router-dom";
import React, { useEffect, useState, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import { getMyInfo } from "../apis/auth";
import { ResponseMyInfoDto } from "../types/auth";

const SIDEBAR_BREAKPOINT = 768;

const HomeLayout = () => {
    const { accessToken, logout } = useAuth();
    const [user, setUser] = useState<{ nickname: string } | null>(null);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth < SIDEBAR_BREAKPOINT);
    const [showSearch, setShowSearch] = useState(false);
    const [search, setSearch] = useState("");
    const sidebarRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUser = async () => {
            if (accessToken) {
                try {
                    const res: ResponseMyInfoDto = await getMyInfo();
                    setUser({ nickname: res.data.name });
                } catch {
                    setUser(null);
                }
            } else {
                setUser(null);
            }
        };
        fetchUser();
    }, [accessToken]);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < SIDEBAR_BREAKPOINT);
        };
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    useEffect(() => {
        if (!sidebarOpen || !isMobile) return;
        const handleClick = (e: MouseEvent) => {
            if (sidebarRef.current && !sidebarRef.current.contains(e.target as Node)) {
                setSidebarOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClick);
        return () => document.removeEventListener("mousedown", handleClick);
    }, [sidebarOpen, isMobile]);

    const handleLogout = async () => {
        await logout();
        navigate("/");
    };

    return (
        <div className="h-dvh flex flex-col bg-black">
            {/* 네비게이션 바 */}
            <nav className="fixed top-0 left-0 right-0 bg-black px-6 py-4 flex items-center justify-between z-50 relative">
                <div className="flex items-center gap-2">
                    <button
                        className="bg-[#222] text-white p-2 rounded focus:outline-none mr-4"
                        onClick={() => setSidebarOpen(v => !v)}
                        aria-label="사이드바 열기"
                    >
                        <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>
                    <Link to="/" className="text-xl font-bold text-[#ff3399]">돌려돌려LP판</Link>
                </div>
                <div className="flex gap-6 items-center">
                    <button
                        className="text-2xl mr-2"
                        onClick={() => setShowSearch(v => !v)}
                        aria-label="검색 열기"
                    >
                        🔍
                    </button>
                    {!user ? (
                        <>
                            <Link to="/login" className="text-white hover:text-[#ff3399]">로그인</Link>
                            <Link to="/signup" className="bg-[#ff3399] text-white rounded-lg px-4 py-2 ml-2">회원가입</Link>
                        </>
                    ) : (
                        <>
                            <span className="text-white mr-2">{user.nickname}님 반갑습니다.</span>
                            <button onClick={handleLogout} className="text-white hover:text-[#ff3399]">로그아웃</button>
                        </>
                    )}
                </div>
            </nav>
            {/* 검색 input (돋보기 클릭 시) */}
            {showSearch && (
                <div className="w-full bg-black px-6 py-2 flex justify-center z-40">
                    <input
                        type="text"
                        placeholder="찾기..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="w-full max-w-xl p-2 rounded bg-gray-700 text-white placeholder-gray-400 border border-[#ff3399]"
                        autoFocus
                    />
                </div>
            )}
            {/* 오버레이*/}
            {sidebarOpen && isMobile && (
                <div className="fixed inset-0 bg-black bg-opacity-40 z-30 transition-opacity" />
            )}
            {/* 사이드바 */}
            <aside
                ref={sidebarRef}
                className={`fixed z-40 top-0 left-0 h-full w-64 bg-[#222] text-white p-6 flex flex-col gap-4 transition-transform duration-200
                    ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
                style={{ minWidth: 256 }}
            >
                <Link to="/my" className="mt-18 mb-4 p-2 rounded bg-[#ff3399] text-white text-center block">마이페이지</Link>
            </aside>
            <main className="flex-1">
                <Outlet context={search} />
            </main>
        </div>
    );
};

export default HomeLayout;
