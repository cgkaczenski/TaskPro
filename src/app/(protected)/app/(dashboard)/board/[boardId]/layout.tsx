import { notFound, redirect } from "next/navigation";
import { db } from "@/lib/db";
import { BoardNavbar } from "./_components/board-navbar";

export async function generateMetadata({
  params,
}: {
  params: { boardId: string };
}) {
  const { boardId } = params;

  if (!boardId) {
    return { title: "Board" };
  }

  const board = await db.board.findUnique({
    where: { id: boardId },
  });

  if (board) {
    return { title: board.title };
  }

  return { title: "Board" };
}

const BoardIdLayout = async ({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { boardId: string };
}) => {
  const board = await db.board.findUnique({
    where: { id: params.boardId },
  });

  if (!board) {
    notFound();
  }

  if (!board.projectId) {
    redirect("/app/project");
  }

  return (
    <>
      <BoardNavbar data={board} />
      <div className="fixed inset-0 bg-black/10" />
      <main className="relative pt-28 min-h-screen">{children}</main>
    </>
  );
};

export default BoardIdLayout;
