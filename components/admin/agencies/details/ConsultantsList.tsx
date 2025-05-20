'use client';

import React from 'react';
import Image from 'next/image';

interface Consultant {
  _id: string;
  phone: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  avatar?: {
    _id: string;
    fileName: string;
  };
}

interface ConsultantsListProps {
  consultants: Consultant[];
  title?: string;
}

const ConsultantsList: React.FC<ConsultantsListProps> = ({ 
  consultants, 
  title = 'مشاوران آژانس' 
}) => {
  if (!consultants || consultants.length === 0) {
    return (
      <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
          <svg className="w-5 h-5 text-purple-600 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path>
          </svg>
          {title}
        </h2>
        <div className="text-center py-8 text-gray-500">
          هیچ مشاوری برای این آژانس ثبت نشده است.
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
      <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
        <svg className="w-5 h-5 text-purple-600 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path>
        </svg>
        {title}
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {consultants.map((consultant) => (
          <div key={consultant._id} className="flex items-center p-4 border border-gray-100 rounded-lg hover:bg-purple-50 transition-colors">
            <div className="relative w-12 h-12 rounded-full overflow-hidden bg-purple-100 ml-3 flex-shrink-0">
              {consultant.avatar ? (
                <Image 
                  src={`/api/images/${consultant.avatar.fileName}`}
                  alt={`${consultant.firstName} ${consultant.lastName}`}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-purple-500 font-bold text-lg">
                  {consultant.firstName.charAt(0)}{consultant.lastName.charAt(0)}
                </div>
              )}
            </div>
            
            <div className="flex-1">
              <h3 className="font-semibold text-gray-800">{consultant.firstName} {consultant.lastName}</h3>
              <div className="flex flex-col text-sm text-gray-600">
                <span>{consultant.phone}</span>
                <span className="truncate">{consultant.email}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ConsultantsList;