import { FC } from "react";
import { ListItem } from "../api/getListData";
import { DeleteButton, ExpandButton } from "./Buttons";
import { ChevronDownIcon, ChevronUpIcon } from "./icons";

type CardProps = {
  id: ListItem["id"];
  title: ListItem["title"];
  description: ListItem["description"];
  isExpanded: boolean;
  onToggleExpand: () => void;
  onDelete: (id: ListItem["id"]) => void;
};

export const Card: FC<CardProps> = ({
  id,
  title,
  description,
  isExpanded,
  onToggleExpand,
  onDelete,
}) => {
  return (
    <div className="border border-black px-2 py-1.5">
      <div className="flex justify-between mb-0.5">
        <h1 className="font-medium">{title}</h1>
        <div className="flex">
          <ExpandButton onClick={onToggleExpand}>
            {isExpanded ? <ChevronUpIcon /> : <ChevronDownIcon />}
          </ExpandButton>
          <DeleteButton onClick={() => onDelete(id)} />
        </div>
      </div>
      <p className="text-sm">{isExpanded ? description : ""}</p>
    </div>
  );
};
