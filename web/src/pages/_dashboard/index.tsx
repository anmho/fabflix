// At the top of your file
import React, { useState } from "react";
import { Loading } from "~/components/navigation/loading";
import SegmentedControl from "~/components/segment/SegmentControl";
import AddMovieSegment from "~/components/segment/addMovieSegment";
import AddStarSegment from "~/components/segment/addStarSegment";
import MetaDataSegment from "~/components/segment/metadataSegment";
interface Content {
  key: string;
  value: React.ReactNode;
}

const Dashboard: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const segments = [
    { id: "metaData", title: "Database Metadata" },
    { id: "addStar", title: "Add Star" },
    { id: "addMovie", title: "Add Movie" },
  ];

  const contents = [
    { key: "metaData", value: <MetaDataSegment /> },
    { key: "addStar", value: <AddStarSegment /> },
    { key: "addMovie", value: <AddMovieSegment /> },
  ];

  return (
    <>
      <div className="py-[50px] md:py-[80px] lg:py-[100px] xl:py-[120px] lg:px-[2%] md:px-[5%] flex flex-wrap items-center">
        <div className="flex flex-wrap items-start gap-4 p-4 mx-0 overflow-x-auto w-full">
          <div className="w-full flex flex-wrap justify-between items-center">
            <h3 className="text-[22px] md:text-[27px] lg:text-[32px] font-semibold text-primary">
              Employee Dashboard
            </h3>
          </div>
          <hr className="m-0" />
          <SegmentedControl segments={segments} contents={contents} />
        </div>
      </div>
    </>
  );
};

export default Dashboard;
