'use client';
import React from 'react';
import { Offer } from '@/components/TabCards/index';
import { DragDropContext, Droppable, Draggable, DropResult, DraggableProvided, DraggableStateSnapshot, DroppableProvided, DroppableStateSnapshot } from 'react-beautiful-dnd';

interface LinksDraggableProps {
  items: any[];
  setItems: any;
  name?: string;
  setSelectedId?: React.Dispatch<React.SetStateAction<string>>;
  selectedId?: string;
  handleEdit?: (id: string) => void;
  Component: React.ComponentType<any>;
  onDragComplete?: (id: string, newIndex: number) => void;
  saving?: boolean;
}

const reorder = (list: Offer[], startIndex: number, endIndex: number): Offer[] => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

const getListStyle = (isDraggingOver: boolean) => ({
  background: isDraggingOver ? '#bfdeeb' : '#fff',
  padding: isDraggingOver ? '10px' : '',
  transition: '150ms',
  overflow: 'hidden'
});

const LinksDraggable: React.FC<LinksDraggableProps> = ({ items, setItems, selectedId, setSelectedId, saving, handleEdit, Component, onDragComplete }) => {
  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const updatedItems = reorder(items, result.source.index, result.destination.index);

    setItems([...updatedItems]);
    if (result.source.index !== result.destination.index && !saving) onDragComplete?.(result.draggableId, result.destination.index);
  };

  return (
    <>
      {saving && <img className="loader" src="/images/loading.gif" alt="" />}
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="droppable">
          {(provided: DroppableProvided, snapshot: DroppableStateSnapshot) => (
            <div {...provided.droppableProps} ref={provided.innerRef} style={getListStyle(snapshot.isDraggingOver)}>
              {items?.map((item, index) => (
                <Draggable key={item?._id} draggableId={item?._id} index={index}>
                  {(provided: DraggableProvided, snapshot: DraggableStateSnapshot) => (
                    <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                      <div style={{ pointerEvents: saving ? 'none' : 'all' }}>
                        <Component data={{ ...item, index }} setSelectedId={setSelectedId} selectedId={selectedId} handleEdit={handleEdit} items={items} setItems={setItems} />
                      </div>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </>
  );
};

export default LinksDraggable;
