import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { ListContainer } from "./_components/list-container";
interface BoardIdPageProps {
  params: {
    boardId: string;
  };
}

const BoardIdPage = async ({ params }: BoardIdPageProps) => {
  //Todo: add view permission check

  const lists = await db.list.findMany({
    where: {
      boardId: params.boardId,
    },
    include: {
      cards: {
        orderBy: {
          order: "asc",
        },
        include: {
          people: true,
        },
      },
    },
    orderBy: {
      order: "asc",
    },
  });

  return (
    <div className="p-4 h-full overflow-x-auto">
      <ListContainer boardId={params.boardId} data={lists} />
    </div>
  );
};

export default BoardIdPage;
