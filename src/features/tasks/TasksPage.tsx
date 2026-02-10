import React, { useState, useMemo } from 'react';
import { Plus, CheckSquare, ArrowUp, ArrowDown, Minus, ChevronsUpDown, ChevronUp, ChevronDown, Edit3, Calendar, User as UserIcon, MoreHorizontal, Trash2 } from 'lucide-react';
import { useTasks } from '../../contexts/TasksContext';
import { useUsers } from '../../contexts/UsersContext';
import { useUI } from '../../contexts/UIContext';
import type { Task, TaskStatus, TaskPriority } from '../../types';
import EditTaskModal from './components/EditTaskModal';
import Button from '../../components/shared/ui/Button';

const statusStyles: Record<TaskStatus, { bg: string, text: string, dot: string }> = {
  'Pending': { bg: 'bg-yellow-50', text: 'text-yellow-700', dot: 'bg-yellow-400' },
  'In Progress': { bg: 'bg-indigo-50', text: 'text-indigo-700', dot: 'bg-indigo-400' },
  'Completed': { bg: 'bg-emerald-50', text: 'text-emerald-700', dot: 'bg-emerald-500' },
};

const priorityStyles: Record<TaskPriority, { color: string; icon: React.ElementType, label: string }> = {
  'High': { color: 'text-red-500', icon: ArrowUp, label: 'High Priority' },
  'Medium': { color: 'text-amber-500', icon: Minus, label: 'Mid Priority' },
  'Low': { color: 'text-gray-400', icon: ArrowDown, label: 'Standard' },
};

const TasksPage: React.FC = () => {
  const { tasks, deleteTask } = useTasks();
  const { users } = useUsers();
  const { openCreateTaskModal, openEditTaskModal } = useUI();
  const [statusFilter, setStatusFilter] = useState<TaskStatus | 'All'>('All');
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'ascending' | 'descending' } | null>(null);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const getAssignee = (userId: string) => {
    return users[userId] || { name: 'Unassigned', avatar: '' };
  }

  const filteredTasks = useMemo(() => {
    if (statusFilter === 'All') return tasks;
    return tasks.filter(task => task.status === statusFilter);
  }, [tasks, statusFilter]);

  const sortedTasks = useMemo(() => {
    let sortableItems = [...filteredTasks];
    if (sortConfig !== null) {
      sortableItems.sort((a, b) => {
        let aValue, bValue;
        if (sortConfig.key === 'priority') {
          const priorityOrder = { 'High': 3, 'Medium': 2, 'Low': 1 };
          aValue = priorityOrder[a.priority];
          bValue = priorityOrder[b.priority];
        } else if (sortConfig.key === 'assignedToId') {
          aValue = getAssignee(a.assignedToId).name;
          bValue = getAssignee(b.assignedToId).name;
        } else {
          aValue = a[sortConfig.key as keyof Task];
          bValue = b[sortConfig.key as keyof Task];
        }

        if (aValue < bValue) return sortConfig.direction === 'ascending' ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === 'ascending' ? 1 : -1;
        return 0;
      });
    }
    return sortableItems;
  }, [filteredTasks, sortConfig, users]);

  const handleEditTask = (task: Task) => {
    setSelectedTask(task);
    openEditTaskModal();
  };

  const handleDeleteTask = (taskId: string, title: string) => {
    if (window.confirm(`Are you sure you want to delete "${title}"?`)) {
      deleteTask(taskId);
    }
  };

  const taskStatuses: (TaskStatus | 'All')[] = ['All', 'Pending', 'In Progress', 'Completed'];

  return (
    <div className="space-y-6 flex flex-col h-full animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">Active Tasks</h1>
        </div>
        <div className="flex items-center gap-2 p-1 bg-gray-50 rounded-xl border border-gray-100">
          {taskStatuses.map(status => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-4 py-2 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${statusFilter === status
                ? 'bg-white text-gray-900 shadow-sm border border-gray-100'
                : 'text-gray-400 hover:text-gray-600'
                }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <div className="bg-white rounded-[32px] overflow-hidden border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
          <div className="overflow-x-auto min-h-[500px]">
            <table className="min-w-full divide-y divide-gray-50">
              <thead className="bg-[#FAFAFA]">
                <tr>
                  <th className="px-8 py-5 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Description</th>
                  <th className="px-8 py-5 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Progress</th>
                  <th className="px-8 py-5 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Urgency</th>
                  <th className="px-8 py-5 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Timeline</th>
                  <th className="px-8 py-5 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Operator</th>
                  <th className="px-8 py-5 text-right text-[10px] font-black text-gray-400 uppercase tracking-widest sr-only">Action</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-50">
                {sortedTasks.map((task: Task) => {
                  const assignee = getAssignee(task.assignedToId);
                  const priority = priorityStyles[task.priority];
                  const status = statusStyles[task.status];
                  return (
                    <tr key={task.id} className="group hover:bg-gray-50/50 transition-colors">
                      <td className="px-8 py-5 whitespace-nowrap">
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-gray-900 group-hover:text-primary transition-colors">{task.title}</span>
                          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tight mt-0.5">{task.relatedTo?.name || 'Global Project'}</span>
                        </div>
                      </td>
                      <td className="px-8 py-5 whitespace-nowrap">
                        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full ${status.bg} border border-transparent hover:border-current/10 transition-all`}>
                          <div className={`w-1.5 h-1.5 rounded-full ${status.dot} animate-pulse`} />
                          <span className={`text-[10px] font-black uppercase tracking-wider ${status.text}`}>{task.status}</span>
                        </div>
                      </td>
                      <td className="px-8 py-5 whitespace-nowrap">
                        <div className={`flex items-center gap-1.5 ${priority.color}`}>
                          <priority.icon size={14} strokeWidth={3} />
                          <span className="text-[10px] font-black uppercase tracking-wider">{priority.label}</span>
                        </div>
                      </td>
                      <td className="px-8 py-5 whitespace-nowrap">
                        <div className="flex items-center gap-2 text-gray-600">
                          <Calendar size={14} className="text-gray-300" />
                          <span className="text-xs font-bold tracking-tight">{task.dueDate}</span>
                        </div>
                      </td>
                      <td className="px-8 py-5 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <img className="h-7 w-7 rounded-full ring-2 ring-white border border-gray-100 grayscale-[0.5] group-hover:grayscale-0 transition-all" src={assignee.avatar} alt="" />
                          <span className="text-xs font-bold text-gray-500 group-hover:text-gray-900 transition-colors leading-none tracking-tight">{assignee.name}</span>
                        </div>
                      </td>
                      <td className="px-8 py-5 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleEditTask(task)}
                            className="p-2 text-gray-300 hover:text-gray-900 hover:bg-white rounded-xl transition-all active:scale-95"
                            title="Edit"
                          >
                            <Plus className="w-5 h-5 rotate-45 group-hover:text-primary transition-colors" />
                          </button>
                          <button
                            onClick={() => handleDeleteTask(task.id, task.title)}
                            className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all active:scale-95"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        <div className="flex justify-end">
          <Button
            variant="primary"
            size="md"
            icon={Plus}
            onClick={openCreateTaskModal}
            className="bg-gray-900 hover:bg-black text-white font-black text-xs uppercase tracking-widest rounded-xl shadow-xl shadow-gray-200"
          >
            Create Objective
          </Button>
        </div>
      </div>

      <EditTaskModal task={selectedTask} />
    </div>
  );
};

export default TasksPage;