// 프로필 세팅에서 파일 선택 시 미리보기 URL을 생성하고, 선택된 파일을 상태로 관리하는 함수
export const handleFileChange = (
  e: React.ChangeEvent<HTMLInputElement>,
  setPendingImageFile: (file: File | null) => void,
  setPreviewImageUrl: (url: string | null) => void,
) => {
  const file = e.target.files?.[0];
  if (!file) return;
  setPendingImageFile(file);
  setPreviewImageUrl(URL.createObjectURL(file));
  e.target.value = '';
  console.log('Selected file:', file);
};
