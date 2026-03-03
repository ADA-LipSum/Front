export const RecruitmentGuide = () => {
  return (
    <div className="bg-white rounded border border-[#E0E0E0] p-4 shadow-sm">
      <h3 className="text-center font-bold text-black mb-4">스터디 그룹 모집 가이드</h3>
      <div className="text-sm text-[#424242] space-y-4">
        <section>
          <h4 className="font-semibold text-black mb-2">📌 글 작성 시 포함하면 좋은 내용</h4>
          <ul className="list-disc list-inside space-y-1 text-[#616161]">
            <li>스터디 주제 및 목표</li>
            <li>예상 일정 (횟수·요일·시간)</li>
            <li>진행 방식 (온라인/오프라인)</li>
            <li>참여 조건 (레벨, 선수 지식 등)</li>
            <li>모집 인원</li>
          </ul>
        </section>
        <section>
          <h4 className="font-semibold text-black mb-2">💡 참여 시 참고사항</h4>
          <ul className="list-disc list-inside space-y-1 text-[#616161]">
            <li>관심 있는 글에 댓글로 의사 표현</li>
            <li>일정·조건이 맞는지 확인 후 참여</li>
            <li>궁금한 점은 댓글로 질문하기</li>
          </ul>
        </section>
        <section>
          <h4 className="font-semibold text-black mb-2">⚠️ 운영 원칙</h4>
          <ul className="list-disc list-inside space-y-1 text-[#616161]">
            <li>서로 존중하는 분위기 유지</li>
            <li>스팸·광고·비방 금지</li>
            <li>모집 완료 시 상태를 ‘모집완료’로 변경</li>
          </ul>
        </section>
      </div>
    </div>
  );
};
