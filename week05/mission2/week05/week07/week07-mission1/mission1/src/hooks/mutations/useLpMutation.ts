import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { CreateLpDto, deleteLp, editLp } from "../../apis/lp";
import { UpdateLpResponseDto } from "../../types/lp";

export function useLpMutation(refetchLpDetail: () => void) {
  const navigate = useNavigate();
  const deleteMutation = useMutation({
    mutationFn: (lpId: number) => deleteLp(lpId),
    onSuccess: () => {
      alert("LP가 삭제되었습니다.");
      navigate("/");
      refetchLpDetail();
    }
  });

  const editMutation = useMutation<UpdateLpResponseDto, Error, { lpId: number, data: CreateLpDto }>({
    mutationFn: ({ lpId, data }) => editLp(lpId, data),
    onSuccess: (response) => {
      console.log("Edit success:", response);
      alert("LP가 수정되었습니다.");
      refetchLpDetail();
      navigate(`/lp/${response.data.id}`);
    }
  });

  return { deleteMutation, editMutation };
} 