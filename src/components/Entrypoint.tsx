import { useState } from "react";
import { ListItem, useGetListData } from "../api/getListData";
import { Card } from "./List";
import { Spinner } from "./Spinner";

type DeletedListItem = {
  id: ListItem["id"];
  title: ListItem["title"];
};

export const Entrypoint = () => {
  const listQuery = useGetListData();

  const getInitialState = () => {
    const savedDeletedCards = localStorage.getItem("deletedCards");
    const savedExpandedCardIds = localStorage.getItem("expandedCardIds");

    return {
      deletedCards: savedDeletedCards ? JSON.parse(savedDeletedCards) : [],
      expandedCardIds: savedExpandedCardIds
        ? JSON.parse(savedExpandedCardIds)
        : [],
    };
  };

  const initialState = getInitialState();

  const [visibleCards, setVisibleCards] = useState<ListItem[]>([]);
  const [deletedCards, setDeletedCards] = useState<DeletedListItem[]>(
    initialState.deletedCards
  );
  const [expandedCardIds, setExpandedCardIds] = useState<ListItem["id"][]>(
    initialState.expandedCardIds
  );
  const [showDeletedCards, setShowDeletedCards] = useState(false);

  const saveToLocalStorage = (key: string, data: any) => {
    localStorage.setItem(key, JSON.stringify(data));
  };

  if (listQuery.isLoading) {
    return <Spinner />;
  }

  if (visibleCards.length === 0 && listQuery.data) {
    setVisibleCards(
      listQuery.data.filter(
        (item) => !deletedCards.some((deleted) => deleted.id === item.id)
      )
    );
  }

  const deleteCard = (id: ListItem["id"]) => {
    const cardToDelete = visibleCards.find((card) => card.id === id);
    if (cardToDelete) {
      const updatedDeletedCards = [
        ...deletedCards,
        { id: cardToDelete.id, title: cardToDelete.title },
      ];
      setDeletedCards(updatedDeletedCards);
      saveToLocalStorage("deletedCards", updatedDeletedCards);
    }

    const updatedVisibleCards = visibleCards.filter((card) => card.id !== id);
    setVisibleCards(updatedVisibleCards);
    saveToLocalStorage("visibleCards", updatedVisibleCards);

    const updatedExpandedCardIds = expandedCardIds.filter(
      (expandedId) => expandedId !== id
    );
    setExpandedCardIds(updatedExpandedCardIds);
    saveToLocalStorage("expandedCardIds", updatedExpandedCardIds);
  };

  const toggleCardExpand = (id: ListItem["id"]) => {
    const updatedExpandedCardIds = expandedCardIds.includes(id)
      ? expandedCardIds.filter((expandedId) => expandedId !== id)
      : [...expandedCardIds, id];

    setExpandedCardIds(updatedExpandedCardIds);
    saveToLocalStorage("expandedCardIds", updatedExpandedCardIds);
  };

  return (
    <div className="flex gap-x-16">
      <div className="w-full max-w-xl">
        <h1 className="mb-1 font-medium text-lg">
          My Awesome List ({visibleCards.length})
        </h1>
        <div className="flex flex-col gap-y-3">
          {visibleCards.map((card) => (
            <Card
              key={card.id}
              id={card.id}
              title={card.title}
              description={card.description}
              isExpanded={expandedCardIds.includes(card.id)}
              onToggleExpand={() => toggleCardExpand(card.id)}
              onDelete={deleteCard}
            />
          ))}
        </div>
      </div>
      <div className="w-full max-w-xl">
        <div className="flex items-center justify-between">
          <h1 className="mb-1 font-medium text-lg">
            Deleted Cards ({deletedCards.length})
          </h1>
          <button
            onClick={() => setShowDeletedCards((prev) => !prev)}
            className="text-white text-sm transition-colors hover:bg-gray-800 disabled:bg-black/75 bg-black rounded px-3 py-1"
          >
            {showDeletedCards ? "Hide" : "Reveal"}
          </button>
          <button className="text-white text-sm transition-colors hover:bg-gray-800 disabled:bg-black/75 bg-black rounded px-3 py-1">
            Refresh
          </button>
        </div>
        {showDeletedCards && (
          <div className="flex flex-col gap-y-3">
            {deletedCards.map((card) => (
              <div
                key={card.id}
                className="border border-black px-2 py-1.5 flex items-center justify-between"
              >
                <span className="font-medium">{card.title}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
