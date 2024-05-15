import { Card, List, User } from "@prisma/client";

export type ListWithCards = List & { cards: CardWithPeople[] };

export type CardWithList = Card & { list: List };

export type CardWithPeople = Card & { people: User[] };
