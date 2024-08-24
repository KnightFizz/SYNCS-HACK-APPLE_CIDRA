import React from "react";
import IconList from '../components/IconList';
import "../styles/global.css";

const Block = ({ color, title, content, className }) => (
  <div
    className={`${color} ${className} border-4 border-slate-800 p-4 rounded-lg shadow-md flex flex-col justify-center items-center`}
  >
    <h2 className="text-xl font-bold mb-2">{title}</h2>
    <p className="text-center">{content}</p>
  </div>
);

export default function Home() {
  return (
    <div className="h-screen flex flex-col">
      {/* Top section - 4/5 of the screen */}
      <div className="h-4/5 p-4 bg-gray-100">
        <div className="h-full grid grid-cols-12 gap-4">
          <Block
            color="bg-blue-200"
            title="Block 1"
            content="1/4 width block in the top section"
            className="col-span-4"
          />
          <Block
            color="bg-green-200"
            title="Block 2"
            content="3/4 width block in the top section"
            className="col-span-8"
          />
        </div>
      </div>

      <div className="h-1/5 bg-gray-300 p-4">
        <div className="h-full grid grid-cols-10 gap-4">
          <div className="col-span-8">
              <IconList/>
            </div>
          <Block
            color="bg-red-200"
            title="Block 4"
            content="1/5 width block in the bottom section"
            className="col-span-2"
          />
        </div>
      </div>
    </div>
  );
}
