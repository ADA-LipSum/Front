export default function Background() {
    return (
        <div className="relative w-screen h-screen bg-[#E6E6E6] overflow-hidden">
            {/* 사각형 */}
            <div
                className="
        absolute
        w-[1000px] h-[1000px]
        bg-[#49A85D]
        rotate-45
        left-[-600px]
        top-[200px]
    "
            />

            {/* 원형 */}
            <div
                className="
                    absolute
                    w-[500px] h-[500px]
                    bg-[#49A85D]
                    rounded-full
                    right-[-150px]
                    top-[-150px]
                "
            />
        </div>
    );
}
