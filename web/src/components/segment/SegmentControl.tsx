import React, { useState } from "react";

interface Segment {
  id: string;
  title: string;
}

interface Content {
  key: string;
  value: React.ReactNode;
}

interface SegmentedControlProps {
  segments: Segment[];
  contents: Content[];
}

const SegmentedControl: React.FC<SegmentedControlProps> = ({
  segments,
  contents,
}) => {
  const [activeSegment, setActiveSegment] = useState<string>(segments[0].id);

  const renderContent = () => {
    const activeContent = contents.find(
      (content) => content.key === activeSegment
    );
    return activeContent ? activeContent.value : null;
  };

  return (
    <div className="w-full">
      <div className="segment-buttons relative">
        <div className="absolute bottom-0 left-0 w-full h-1 bg-gray-300"></div>
        <div className="lg:max-w-[500px] lg:w-[50%] md:w-full flex justify-between">
          {segments.map((segment) => (
            <button
              key={segment.id}
              onClick={() => setActiveSegment(segment.id)}
              className={`relative pb-2 px-1 inline-block cursor-pointer lg:min-w-[100px]
                        ${
                          activeSegment === segment.id
                            ? "text-black font-bold after:absolute after:bottom-0 after:left-0 after:w-full after:h-1 after:bg-primary"
                            : "text-gray-500"
                        }`}
              style={{ outline: "none" }}
            >
              {segment.title}
            </button>
          ))}
        </div>
      </div>
      <div className="segment-content mt-3">{renderContent()}</div>
    </div>
  );
};

export default SegmentedControl;
