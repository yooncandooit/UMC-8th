import { useEffect, useState, useRef } from "react";
import { getMyInfo, updateProfile } from "../apis/auth";
import { ResponseMyInfoDto } from "../types/auth";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { createLp } from "../apis/lp";
import { useUser } from '../context/UserContext';
import { User } from '../context/UserContext';

const MyPage = () => {
    const navigate = useNavigate();
    const { user, setUser } = useUser();
    const [data, setData] = useState<ResponseMyInfoDto>();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [lpName, setLpName] = useState("");
    const [lpContent, setLpContent] = useState("");
    const [lpTag, setLpTag] = useState("");
    const [tags, setTags] = useState<string[]>([]);
    const [lpImage, setLpImage] = useState("https://png.pngtree.com/png-vector/20230902/ourmid/pngtree-vinyl-disc-record-illustration-png-image_9244744.png");
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [editMode, setEditMode] = useState(false);
    const [editName, setEditName] = useState("");
    const [editBio, setEditBio] = useState("");
    const [editAvatar, setEditAvatar] = useState("");
    const editFileInputRef = useRef<HTMLInputElement>(null);

    const mutation = useMutation({
        mutationFn: createLp,
        onSuccess: () => {
            closeModal();
            navigate("/");
        },
    });

    const editMutation = useMutation({
        mutationFn: updateProfile,
        onMutate: async (newProfile: { name: string; bio: string; avatar?: string }) => {
            // Optimistic update
            setUser((prev) => ({ ...prev, ...newProfile }));
        },
        onError: (error: unknown, newProfile: { name: string; bio: string; avatar?: string }, context: { previousUser: User | null }) => {
            // Rollback on error
            setUser(context.previousUser);
            alert("닉네임 변경 실패");
        },
        onSuccess: (data: { data: User }) => {
            setEditMode(false);
            // Update with server data
            setUser(data.data);
        },
        onSettled: () => {},
    });

    useEffect(() => {
        const getData = async () => {
            try {
                const response = await getMyInfo();
                console.log("MyInfo response:", response);
                setData(response);
            } catch (error) {
                console.error("사용자 정보 조회 실패:", error);
            }
        };
        getData();
    }, []);

    useEffect(() => {
        if (data?.data) {
            setEditName(data.data.name || "");
            setEditBio(data.data.bio || "");
            setEditAvatar(data.data.avatar || "");
        }
    }, [data]);
    

    const handleImageClick = () => {
        fileInputRef.current?.click();
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (ev) => {
                setLpImage(ev.target?.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setLpName("");
        setLpContent("");
        setLpTag("");
        setTags([]);
        setLpImage("https://png.pngtree.com/png-vector/20230902/ourmid/pngtree-vinyl-disc-record-illustration-png-image_9244744.png");
    };

    const handleAddTag = () => {
        const trimmed = lpTag.trim();
        if (trimmed && !tags.includes(trimmed)) {
            setTags([...tags, trimmed]);
        }
        setLpTag("");
    };

    const handleRemoveTag = (tagToRemove: string) => {
        setTags(tags.filter(tag => tag !== tagToRemove));
    };

    const handleAddLp = () => {
        if (!lpName || !lpContent || tags.length === 0 || !lpImage) {
            alert("모든 정보를 입력해주세요.");
            return;
        }
        mutation.mutate({
            title: lpName,
            content: lpContent,
            thumbnail: lpImage,
            tags,
            published: true,
        });
    };

    const handleEditAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (ev) => setEditAvatar(ev.target?.result as string);
            reader.readAsDataURL(file);
        }
    };

    const handleEditSave = () => {
        if (!editName.trim()) {
            alert("닉네임은 빈칸일 수 없습니다.");
            return;
        }
        editMutation.mutate({
            name: editName,
            bio: editBio,
            avatar: editAvatar || undefined,
        });
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-black p-4 relative">
            {/* 프로필/설정 영역 */}
            <div className="flex flex-col items-center mb-8">
                {editMode ? (
                    <>
                        <img
                            src={editAvatar || "https://cdn-icons-png.flaticon.com/512/149/149071.png"}
                            alt="avatar"
                            className="w-32 h-32 rounded-full object-cover mb-4 cursor-pointer border-2 border-white"
                            onClick={() => editFileInputRef.current?.click()}
                        />
                        <input
                            type="file"
                            accept="image/*"
                            ref={editFileInputRef}
                            style={{ display: "none" }}
                            onChange={handleEditAvatarChange}
                        />
                        <input
                            className="w-64 mb-2 p-2 rounded bg-black text-white border border-white text-center"
                            value={editName}
                            onChange={e => setEditName(e.target.value)}
                            placeholder="닉네임"
                        />
                        <input
                            className="w-64 mb-2 p-2 rounded bg-black text-white border border-white text-center"
                            value={editBio}
                            onChange={e => setEditBio(e.target.value)}
                            placeholder="한 줄 소개 (bio)"
                        />
                        <div className="flex gap-2 mb-2">
                            <button
                                className="px-4 py-2 rounded bg-[#ff3399] text-white font-semibold"
                                onClick={handleEditSave}
                                disabled={editMutation.isPending}
                            >
                                ✔
                            </button>
                            <button
                                className="px-4 py-2 rounded bg-gray-600 text-white font-semibold"
                                onClick={() => setEditMode(false)}
                                disabled={editMutation.isPending}
                            >
                                ✖
                            </button>
                        </div>
                    </>
                ) : (
                    <>
                        <img
                            src={user?.avatar || "https://cdn-icons-png.flaticon.com/512/149/149071.png"}
                            alt="avatar"
                            className="w-32 h-32 rounded-full object-cover mb-4 border-2 border-white"
                        />
                        <div className="flex flex-col items-center">
                            <div className="text-white text-2xl font-bold mb-2">{user?.name}</div>
                            <div className="text-white text-lg mb-2">{user?.bio}</div>
                            <div className="text-white text-base mb-2">{user?.email}</div>
                        </div>
                        <button
                            className="mt-2 px-4 py-2 rounded bg-gray-700 text-white font-semibold hover:bg-[#ff3399]"
                            onClick={() => setEditMode(true)}
                        >
                            설정
                        </button>
                    </>
                )}
            </div>

            {/* + 버튼 */}
            <button
                className="fixed bottom-8 right-8 w-14 h-14 rounded-full bg-pink-500 text-white text-3xl flex items-center justify-center shadow-lg hover:bg-pink-400 z-50"
                onClick={() => setIsModalOpen(true)}
            >
                +
            </button>

            {/* 모달 */}
            {isModalOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50"
                    onClick={closeModal}
                >
                    <div
                        className="relative bg-[#23232b] rounded-xl p-8 w-full max-w-md flex flex-col items-center"
                        onClick={e => e.stopPropagation()}
                    >
                        {/* X 버튼 */}
                        <button
                            className="absolute top-4 right-4 text-white hover:text-pink-400 text-2xl font-bold"
                            onClick={closeModal}
                        >
                            x
                        </button>
                        {/* LP 이미지 */}
                        <img
                            src={lpImage}
                            alt="LP"
                            className="w-32 h-32 mb-6 cursor-pointer"
                            onClick={handleImageClick}
                        />
                        <input
                            type="file"
                            accept="image/*"
                            ref={fileInputRef}
                            style={{ display: "none" }}
                            onChange={handleImageChange}
                        />
                        {/* LP 작성 폼 */}
                        <input
                            className="w-full mb-3 p-2 rounded bg-gray-800 text-white placeholder-gray-400"
                            placeholder="LP Name"
                            value={lpName}
                            onChange={e => setLpName(e.target.value)}
                        />
                        <input
                            className="w-full mb-3 p-2 rounded bg-gray-800 text-white placeholder-gray-400"
                            placeholder="LP Content"
                            value={lpContent}
                            onChange={e => setLpContent(e.target.value)}
                        />
                        <div className="flex w-full mb-2">
                            <input
                                className="flex-1 p-2 rounded-l bg-gray-800 text-white placeholder-gray-400"
                                placeholder="LP Tag"
                                value={lpTag}
                                onChange={e => setLpTag(e.target.value)}
                                onKeyDown={e => { if (e.key === 'Enter') handleAddTag(); }}
                            />
                            <button
                                className="bg-gray-600 text-white px-4 rounded-r hover:bg-pink-400"
                                onClick={handleAddTag}
                                type="button"
                            >
                                Add
                            </button>
                        </div>
                        {/* Tag 목록 */}
                        <div className="flex flex-wrap gap-2 w-full mb-6">
                            {tags.map(tag => (
                                <span
                                    key={tag}
                                    className="flex items-center bg-gray-700 text-white px-3 py-1 rounded-full text-sm"
                                >
                                    {tag}
                                    <button
                                        className="ml-2 text-gray-300 hover:text-pink-400 font-bold"
                                        onClick={() => handleRemoveTag(tag)}
                                        type="button"
                                    >
                                        ×
                                    </button>
                                </span>
                            ))}
                        </div>
                        <button
                            className="w-full bg-gray-400 text-white py-2 rounded hover:bg-pink-400 transition-colors"
                            onClick={handleAddLp}
                            disabled={mutation.isPending}
                        >
                            {mutation.isPending ? "등록 중..." : "Add LP"}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MyPage;