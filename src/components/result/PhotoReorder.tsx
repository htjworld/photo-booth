import React from 'react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, horizontalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { CapturedShot } from '../../types';

function SortablePhotoItem({ id, shot, index }: { id: string, shot: CapturedShot, index: number }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });
  
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };
  
  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="relative w-16 h-16 rounded-md overflow-hidden bg-neutral-800 border-2 border-transparent hover:border-pink-500 cursor-grab active:cursor-grabbing shrink-0 touch-none">
      <img src={shot.dataUrl} className="w-full h-full object-cover pointer-events-none" />
      <div className="absolute top-1 left-1 bg-black/60 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
        {index + 1}
      </div>
    </div>
  );
}

interface PhotoReorderProps {
  shots: CapturedShot[];
  shotOrder: number[];
  onChangeOrder: (newOrder: number[]) => void;
}

export function PhotoReorder({ shots, shotOrder, onChangeOrder }: PhotoReorderProps) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      // actually the items are ids
      const oldIdx = shotOrder.findIndex(idx => shots[idx].id === active.id);
      const newIdx = shotOrder.findIndex(idx => shots[idx].id === over?.id);
      onChangeOrder(arrayMove(shotOrder, oldIdx, newIdx));
    }
  };

  const items = shotOrder.map(idx => shots[idx].id);

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={items} strategy={horizontalListSortingStrategy}>
        <div className="flex flex-wrap gap-2 p-3 bg-neutral-900 rounded-xl border border-neutral-800">
          {shotOrder.map((originalIndex, index) => (
            <SortablePhotoItem 
              key={shots[originalIndex].id} 
              id={shots[originalIndex].id} 
              shot={shots[originalIndex]} 
              index={index} 
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}
