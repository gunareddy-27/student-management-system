import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

const initialData = {
  tasks: {
    'task-1': { id: 'task-1', content: 'Complete React Form Validation' },
    'task-2': { id: 'task-2', content: 'Submit Physics Assignment' },
    'task-3': { id: 'task-3', content: 'Review CS Notes' },
    'task-4': { id: 'task-4', content: 'Database Design Document' },
  },
  columns: {
    'column-1': { id: 'column-1', title: 'To Do', taskIds: ['task-1', 'task-2'] },
    'column-2': { id: 'column-2', title: 'In Progress', taskIds: ['task-3'] },
    'column-3': { id: 'column-3', title: 'Done', taskIds: ['task-4'] },
  },
  columnOrder: ['column-1', 'column-2', 'column-3'],
};

const KanbanBoard = () => {
  const [data, setData] = useState(initialData);

  const onDragEnd = result => {
    const { destination, source, draggableId } = result;
    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;

    const start = data.columns[source.droppableId];
    const finish = data.columns[destination.droppableId];

    if (start === finish) {
      const newTaskIds = Array.from(start.taskIds);
      newTaskIds.splice(source.index, 1);
      newTaskIds.splice(destination.index, 0, draggableId);

      const newColumn = { ...start, taskIds: newTaskIds };
      setData({ ...data, columns: { ...data.columns, [newColumn.id]: newColumn } });
      return;
    }

    const startTaskIds = Array.from(start.taskIds);
    startTaskIds.splice(source.index, 1);
    const newStart = { ...start, taskIds: startTaskIds };

    const finishTaskIds = Array.from(finish.taskIds);
    finishTaskIds.splice(destination.index, 0, draggableId);
    const newFinish = { ...finish, taskIds: finishTaskIds };

    setData({
      ...data,
      columns: { ...data.columns, [newStart.id]: newStart, [newFinish.id]: newFinish },
    });
  };

  return (
    <div style={{ display: 'flex', gap: '1.5rem', overflowX: 'auto', paddingBottom: '1rem' }}>
      <DragDropContext onDragEnd={onDragEnd}>
        {data.columnOrder.map(columnId => {
          const column = data.columns[columnId];
          const tasks = column.taskIds.map(taskId => data.tasks[taskId]);

          return (
            <div key={column.id} style={{ flex: '1', minWidth: '250px', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', padding: '1rem', border: '1px solid rgba(255,255,255,0.05)' }}>
              <h4 style={{ marginBottom: '1rem', color: 'var(--text-main)', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.5rem' }}>{column.title}</h4>
              <Droppable droppableId={column.id}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    style={{ minHeight: '100px', background: snapshot.isDraggingOver ? 'rgba(255,255,255,0.05)' : 'transparent', borderRadius: '8px', padding: '0.5rem' }}
                  >
                    {tasks.map((task, index) => (
                      <Draggable key={task.id} draggableId={task.id} index={index}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            style={{
                              userSelect: 'none',
                              padding: '1rem',
                              margin: '0 0 0.5rem 0',
                              backgroundColor: snapshot.isDragging ? 'var(--primary)' : 'rgba(255,255,255,0.1)',
                              color: 'white',
                              borderRadius: '8px',
                              boxShadow: snapshot.isDragging ? '0 10px 20px rgba(0,0,0,0.3)' : 'none',
                              ...provided.draggableProps.style,
                            }}
                          >
                            {task.content}
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          );
        })}
      </DragDropContext>
    </div>
  );
};

export default KanbanBoard;
