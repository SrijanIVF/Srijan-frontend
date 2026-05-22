// import { useNavigate } from "react-router-dom";
// import { useLeadsStore } from "@/store/leadStore";
// import { ArrowRight } from "lucide-react";

// export const LeadResultItem = ({ lead, setShowDropdown }) => {
//     const navigate = useNavigate();
//     const { clear } = useLeadsStore();

//     const handleClick = () => {
//         clear();
//         navigate(`/agent/leads/${lead.uid}/dashboard`, {
//             state: { leadData: lead, fromSearch: true }
//         });
//         setShowDropdown(false)
//     };

//     return (
//         <div
//             onClick={handleClick}
//             className="p-4 hover:bg-gradient-to-r hover:from-blue-50 hover:to-emerald-50 cursor-pointer border-b border-slate-100 last:border-b-0 transition-all duration-200 flex items-center gap-3 group"
//         >
//             <div className={`w-3 h-3 rounded-full ${lead.patient_status === 'fresh' ? 'bg-emerald-400' :
//                 lead.patient_status === 'verified' ? 'bg-amber-400' : 'bg-slate-400'
//                 }`} />

//             <div className="min-w-0 flex-1">
//                 <div className="font-semibold text-slate-900 truncate group-hover:text-blue-600">
//                     {lead.patient_name || 'Unnamed Lead'}
//                 </div>
//                 <div className="text-xs text-slate-500 flex items-center gap-1">
//                     <span className="font-mono bg-slate-100 px-2 py-0.5 rounded-full">
//                         {lead.uid}
//                     </span>
//                     {lead.patient_status && (
//                         <>
//                             <span>•</span>
//                             <span className="capitalize text-xs px-2 py-0.5 bg-slate-100 rounded-full">
//                                 {lead.patient_status}
//                             </span>
//                         </>
//                     )}
//                 </div>
//             </div>

//             <ArrowRight className="h-4 w-4 text-slate-400 group-hover:text-blue-500 ml-auto" />
//         </div>
//     );
// };

import { useNavigate } from "react-router-dom";

export const LeadResultItem = ({
    lead
}: any) => {

    const navigate =
        useNavigate();

    const handleEdit = () => {

        navigate(
            `/agent/fill-info/${lead.id}`
        );

    };

    return (

        <div className="p-4 border-b flex justify-between items-center">

            <div>

                <div className="font-semibold">

                    {lead.patient_name}

                </div>

                <div className="text-sm text-gray-500">

                    {lead.uid}

                </div>

            </div>

            <button
                onClick={handleEdit}
                className="px-3 py-1 rounded bg-blue-600 text-white"
            >

                Edit

            </button>

        </div>

    );
};
