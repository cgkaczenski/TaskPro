"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserTable } from "./user-table";

interface MemberProps {
  onClick: (index: number) => void;
  activeIndex: number;
}

export const Members = ({ onClick, activeIndex }: MemberProps) => {
  const handleClick = (index: number) => {
    onClick(index);
  };

  return (
    <div>
      <Tabs defaultValue="members">
        <TabsList>
          <TabsTrigger value="members">Members</TabsTrigger>
          <TabsTrigger value="invitations">Invitations</TabsTrigger>
        </TabsList>
        <TabsContent value="members">
          <UserTable />
        </TabsContent>
        <TabsContent value="invitations">
          Make changes to your invitations here.
        </TabsContent>
      </Tabs>
    </div>
  );
};
