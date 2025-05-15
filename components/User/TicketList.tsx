import React, { useState } from "react";
import {
  FaBug,
  FaTicketAlt,
  FaSpinner,
  FaReply,
  FaExclamationCircle,
  FaCheckCircle,
  FaClock,
} from "react-icons/fa";
import { BiChevronDown, BiChevronUp } from "react-icons/bi";
import { Ticket, TicketStatus } from "./SupportTicketPage";

interface TicketListProps {
  tickets: Ticket[];
  isLoading: boolean;
}

const TicketList: React.FC<TicketListProps> = ({ tickets, isLoading }) => {
  const [expandedTicket, setExpandedTicket] = useState<string | null>(null);

  const toggleTicket = (ticketId: string) => {
    if (expandedTicket === ticketId) {
      setExpandedTicket(null);
    } else {
      setExpandedTicket(ticketId);
    }
  };

  const getStatusColor = (status: TicketStatus) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "in_progress":
        return "bg-blue-100 text-blue-800";
      case "resolved":
        return "bg-green-100 text-green-800";
      case "closed":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: TicketStatus) => {
    switch (status) {
      case "pending":
        return <FaClock className="mr-1" />;
      case "in_progress":
        return <FaSpinner className="mr-1" />;
      case "resolved":
        return <FaCheckCircle className="mr-1" />;
      case "closed":
        return <FaExclamationCircle className="mr-1" />;
      default:
        return <FaClock className="mr-1" />;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fa-IR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <FaSpinner className="animate-spin text-primary text-2xl" />
        <span className="mr-2">در حال بارگذاری تیکت‌ها...</span>
      </div>
    );
  }

  if (tickets.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <FaTicketAlt className="mx-auto text-3xl mb-2 text-gray-400" />
        <p>شما هنوز تیکتی ثبت نکرده‌اید</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 p-4">
      <h2 className="text-xl font-bold mb-4 border-b pb-2">تیکت‌های قبلی شما</h2>
      
      {tickets.map((ticket) => (
        <div 
          key={ticket.id} 
          className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
        >
          {/* Ticket Header */}
          <div 
            className="flex justify-between items-center p-4 cursor-pointer bg-gray-50"
            onClick={() => toggleTicket(ticket.id)}
          >
            <div className="flex items-center">
              <div className={`p-2 rounded-full ${ticket.type === 'bug' ? 'bg-red-100' : 'bg-blue-100'} ml-3`}>
                {ticket.type === 'bug' ? (
                  <FaBug className="text-red-600" />
                ) : (
                  <FaTicketAlt className="text-blue-600" />
                )}
              </div>
              <div>
                <h3 className="font-medium">{ticket.title}</h3>
                <div className="flex items-center text-xs text-gray-500 mt-1">
                  <span className="ml-2">{formatDate(ticket.created_at)}</span>
                  <span className={`px-2 py-1 rounded-full text-xs flex items-center ${getStatusColor(ticket.status)}`}>
                    {getStatusIcon(ticket.status)}
                    {ticket.status === 'pending' && 'در انتظار بررسی'}
                    {ticket.status === 'in_progress' && 'در حال بررسی'}
                    {ticket.status === 'resolved' && 'حل شده'}
                    {ticket.status === 'closed' && 'بسته شده'}
                  </span>
                </div>
              </div>
            </div>
            <div>
              {expandedTicket === ticket.id ? (
                <BiChevronUp className="text-xl" />
              ) : (
                <BiChevronDown className="text-xl" />
              )}
            </div>
          </div>
          
          {/* Ticket Content */}
          {expandedTicket === ticket.id && (
            <div className="p-4 border-t">
              <div className="bg-gray-50 p-3 rounded-lg mb-4">
                <p className="text-sm whitespace-pre-wrap">{ticket.description}</p>
              </div>
              
              {/* Admin Response */}
              {ticket.response ? (
                <div className="space-y-3 mt-4">
                  <h4 className="font-medium text-sm border-b pb-2">پاسخ:</h4>
                  <div className="p-3 rounded-lg bg-blue-50 mr-4">
                    <div className="flex items-center mb-2">
                      <div className="p-1 rounded-full bg-blue-100 ml-2">
                        <FaReply className="text-blue-600 text-xs" />
                      </div>
                      <span className="text-xs font-medium">
                        {ticket.admin_name || 'پشتیبان'}
                      </span>
                      <span className="text-xs text-gray-500 mr-2">
                        {formatDate(ticket.updated_at)}
                      </span>
                    </div>
                    <p className="text-sm whitespace-pre-wrap">{ticket.response}</p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-3 text-gray-500 text-sm">
                  <p>هنوز پاسخی برای این تیکت ثبت نشده است</p>
                </div>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default TicketList;