import React from "react";
import { useState } from "react";
import "../styles/global.css";
import PostureComp from "../components/posture_comp";
import IconList from "../components/IconList";
import BattleScene from "../components/BattleScene.jsx";

const Block = ({ color, title, content, className, children }) => (
  <div
    className={`${color} ${className} border-4 border-slate-800 drop-shadow-[6px_6px_0px_rgba(0,0,0,0.8)] p-3 rounded-xl shadow-md flex flex-col`}
  >
    <h2 className="text-xl font-bold mb-2">{title}</h2>
    {children || <p className="text-center">{content}</p>}
  </div>
);

export default function Home() {
  const [totalDamage, setTotalDamage] = useState(0);

  const handleTotalDamage = (damage) => {
    setTotalDamage(damage);
  };
  console.log(totalDamage);

  return (
    <div className="h-screen p-4 bg-gray-100">
      <div className="h-full grid grid-cols-12 gap-4">
        {/* Block 1 - 1/4 width, full height */}
        <div className="col-span-4 h-full">
          <Block
            color="bg-blue-200"
            title=""
            content="1/4 width block, full height"
            className="h-full"
          >
            <PostureComp />
          </Block>
        </div>
        <div className="col-span-8 grid grid-rows-6 gap-4">
          {/* Block 2 - 3/4 width, 4/5 height */}
          <div className="row-span-10">
            <Block
              color="bg-green-200"
              title=""
              content="3/4 width block, 4/5 height of the right column"
              className="h-full p-0"
            >
              <BattleScene totalDamage={totalDamage} />
            </Block>
          </div>

          {/* Bottom row for Block 3 and 4 - 1/5 height */}
          <div className="row-span-10 grid grid-cols-10 gap-4">
            {/* Block 3 - 4/5 width of the bottom row */}
            <div className="col-span-10">
              <Block
                color="bg-yellow-200"
                title=""
                content="4/5 width of bottom row"
                className="h-full"
              >
                <IconList onTotalDamage={handleTotalDamage} />
              </Block>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
