const Intro = ({ intro }: { intro: string }) => {
  return (
    <div className="w-1 p-2 bg-gray-200 rounded-lg ml-80 -mt-25">
      <p className="text-gray-600">{intro}</p>
    </div>
  );
};

export default Intro;
