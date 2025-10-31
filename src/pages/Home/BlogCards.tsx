const BlogCards = () => {
    return (
        <section>
            <h2 className="text-lg font-bold mb-4 text-gray-800">📰 블로그 최신글</h2>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {[1, 2, 3].map((item) => (
                    <div
                        key={item}
                        className="bg-white rounded-xl shadow-md hover:shadow-lg transition p-4 cursor-pointer"
                    >
                        <img
                            src={`https://picsum.photos/seed/blog${item}/400/220`}
                            className="rounded-md mb-3 w-full h-40 object-cover"
                        />
                        <h3 className="font-semibold text-gray-800 mb-1">블로그 글 제목 {item}</h3>
                        <p className="text-sm text-gray-600">간단한 설명이 들어갑니다.</p>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default BlogCards;
