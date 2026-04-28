import React from "react";
import { Plus, Trash2 } from "lucide-react";
import { AgendaItem } from "../../../types";

interface AgendaBuilderProps {
  agenda: AgendaItem[];
  setAgenda: (agenda: AgendaItem[]) => void;
}

const AgendaBuilder: React.FC<AgendaBuilderProps> = ({ agenda, setAgenda }) => {
  const addAgendaItem = () => {
    setAgenda([...agenda, { time: "", title: "" }]);
  };

  const removeAgendaItem = (index: number) => {
    setAgenda(agenda.filter((_, i) => i !== index));
  };

  const updateAgendaItem = (
    index: number,
    field: keyof AgendaItem,
    value: any,
  ) => {
    const updatedAgenda = [...agenda];
    updatedAgenda[index] = {
      ...updatedAgenda[index],
      [field]: value,
    } as AgendaItem;
    setAgenda(updatedAgenda);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-slate-900">Event Agenda</h3>
        <button
          type="button"
          onClick={addAgendaItem}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Item
        </button>
      </div>

      <div className="space-y-4">
        {agenda.map((item, index) => (
          <div
            key={index}
            className="flex gap-4 items-end p-4 bg-slate-50 rounded-lg border border-slate-200"
          >
            <div className="flex-1">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Time
              </label>
              <input
                type="text"
                placeholder="e.g., 10:00 AM"
                value={item.time}
                onChange={(e) =>
                  updateAgendaItem(index, "time", e.target.value)
                }
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Title
              </label>
              <input
                type="text"
                placeholder="e.g., Keynote Speech"
                value={item.title}
                onChange={(e) =>
                  updateAgendaItem(index, "title", e.target.value)
                }
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <button
              type="button"
              onClick={() => removeAgendaItem(index)}
              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AgendaBuilder;
