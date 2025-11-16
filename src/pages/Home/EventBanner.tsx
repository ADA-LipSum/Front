import ImageBox from '../../components/ImageBox';

const EventBanner = () => (
    <div className="w-full">
        <ImageBox
            src="https://school.gyo6.net/upload/gbsw/widg/img_9497v37d5=b7vad=48vba=b0vd6=6a45v03b1v8c4b_v4101.png"
            alt="이벤트 배너"
            className="w-full h-40 shadow-lg" // 높이만 고정
            fit="cover"
        />
    </div>
);

export default EventBanner;
