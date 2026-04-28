import React, { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Ticket } from "../../../types";

interface TicketBuilderProps {
  tickets: Ticket[];
  setTickets: (tickets: Ticket[]) => void;
}

const TicketBuilder: React.FC<TicketBuilderProps> = ({
  tickets,
  setTickets,
}) => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const addTicket = () => {
    setTickets([
      ...tickets,
      {
        name: "",
        price: 0,
        total_seats: 0,
      },
    ]);
  };

  const removeTicket = (index: number) => {
    setTickets(tickets.filter((_, i) => i !== index));
  };

  const updateTicket = (index: number, field: keyof Ticket, value: any) => {
    const updatedTickets = [...tickets];
    updatedTickets[index] = {
      ...updatedTickets[index],
      [field]: value,
    } as Ticket;
    setTickets(updatedTickets);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-slate-900">Ticket Types</h3>
        <button
          type="button"
          onClick={addTicket}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Ticket
        </button>
      </div>

      <div className="space-y-4">
        {tickets.map((ticket, index) => (
          <div
            key={index}
            className="border border-slate-200 rounded-lg overflow-hidden"
          >
            <div
              className="p-4 bg-slate-50 flex items-center justify-between cursor-pointer hover:bg-slate-100"
              onClick={() =>
                setExpandedIndex(expandedIndex === index ? null : index)
              }
            >
              <div className="flex-1">
                <p className="font-semibold text-slate-900">
                  {ticket.name || "Unnamed Ticket"}
                </p>
                <p className="text-sm text-slate-600">
                  Price: Rs. {ticket.price} | Seats: {ticket.total_seats}
                </p>
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  removeTicket(index);
                }}
                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>

            {expandedIndex === index && (
              <div className="p-4 border-t border-slate-200 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Ticket Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., VIP Pass"
                    value={ticket.name}
                    onChange={(e) =>
                      updateTicket(index, "name", e.target.value)
                    }
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Price (Rs.)
                    </label>
                    <input
                      type="number"
                      value={ticket.price}
                      onChange={(e) =>
                        updateTicket(
                          index,
                          "price",
                          parseInt(e.target.value) || 0,
                        )
                      }
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Total Seats
                    </label>
                    <input
                      type="number"
                      value={ticket.total_seats}
                      onChange={(e) =>
                        updateTicket(
                          index,
                          "total_seats",
                          parseInt(e.target.value) || 0,
                        )
                      }
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TicketBuilder;
