"use client";
import { useState } from "react";
import { Sidebar } from "./_components/sidebar";
import { Members } from "./_components/members";
import { Card, CardContent, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const SettingsPage = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const getHeader = () => {
    switch (activeIndex) {
      case 0:
        return "Members";
      case 1:
        return "Invitations";
      case 2:
        return "Settings";
      default:
        return "Members";
    }
  };

  const getDescription = () => {
    switch (activeIndex) {
      case 0:
        return "View and manage your team members";
      case 1:
        return "Invitations";
      case 2:
        return "Settings";
      default:
        return "View and manage your team members";
    }
  };

  const handleClick = (index: number) => {
    setActiveIndex(index);
  };

  return (
    <div className="w-full">
      <Card className="2xl:mx-56 2xl:my-14 xl:mx-40 xl:my-10 overflow-x-auto">
        <CardContent className="flex flex-col sm:flex-row">
          <div className="pt-8 sm:w-64 w-full">
            <Sidebar onClick={handleClick} activeIndex={activeIndex} />
          </div>
          <Separator
            orientation="vertical"
            className="mx-4 mt-4 hidden sm:block"
          />
          <Separator orientation="horizontal" className="my-4 sm:hidden" />
          <div className="flex-1">
            <p className="text-2xl font-semibold pt-4">{getHeader()}</p>
            <CardDescription className="pb-4">
              {getDescription()}
            </CardDescription>
            <Separator className="mb-8 sm:block hidden" />
            {(activeIndex === 0 || activeIndex === 1) && (
              <Members onClick={handleClick} activeIndex={activeIndex} />
            )}
            {activeIndex === 2 && <p>Settings</p>}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SettingsPage;
