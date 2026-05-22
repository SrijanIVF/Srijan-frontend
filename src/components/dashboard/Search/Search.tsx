import { useState } from "react";
import {
    Search,
    X,
    Edit,
    Loader2,
    User,
    Hash,
} from "lucide-react";

import { useNavigate } from "react-router-dom";
import { authApi } from "@/lib/api";

type Lead = {
    id: number;
    uid: string;
    patient_name: string;
    patient_status?: string;
    patient_city_name?: string;
    main_mobile?: string;
};

export const SmartLeadSearch = () => {

    const navigate = useNavigate();

    const [query, setQuery] =
        useState("");

    const [loading, setLoading] =
        useState(false);

    const [open, setOpen] =
        useState(false);

    const [results, setResults] =
        useState<Lead[]>([]);

    const handleSearch = async (
        e: React.FormEvent
    ) => {

        e.preventDefault();

        if (!query.trim())
            return;

        try {

            setLoading(true);

            const response =
                await authApi.get(
                    `/lead/patients/?search=${encodeURIComponent(query)}`
                );

            const data =
                response.data;

            setResults(
                data?.results || []
            );

            setOpen(true);

        } catch (err) {

            console.log(err);

            setResults([]);

            setOpen(true);

        } finally {

            setLoading(false);

        }
    };

    return (
        <>
            <form
                onSubmit={
                    handleSearch
                }

                className="
                hidden md:flex
                items-center
                gap-3
                w-full
                max-w-xl
                px-5
                py-3
                rounded-full
                border
                border-slate-200
                bg-white
                shadow-lg
                "
            >

                <Search className="h-5 w-5 text-slate-400" />

                <input
                    value={query}

                    onChange={(e) =>
                        setQuery(
                            e.target.value
                        )
                    }

                    placeholder="Search Lead ID / Patient Name"

                    className="
                    flex-1
                    bg-transparent
                    outline-none
                    text-sm
                    placeholder:text-slate-400
                    "
                />

                <button
                    type="submit"

                    disabled={
                        loading
                    }

                    className="
                    px-4
                    py-2
                    rounded-full
                    bg-gradient-to-r
                    from-blue-600
                    to-indigo-600
                    text-white
                    text-sm
                    font-medium
                    "
                >

                    {loading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                        "Search"
                    )}

                </button>

            </form>

            {open && (

                <div className="
                fixed inset-0
                bg-black/50
                backdrop-blur-sm
                z-50
                flex
                items-center
                justify-center
                p-4
                ">

                    <div className="
                    bg-white
                    rounded-3xl
                    w-full
                    max-w-3xl
                    max-h-[85vh]
                    overflow-hidden
                    shadow-2xl
                    ">

                        <div className="
                        px-6
                        py-5
                        border-b
                        flex
                        items-center
                        justify-between
                        bg-gradient-to-r
                        from-blue-600
                        to-indigo-600
                        text-white
                        ">

                            <div>

                                <h2 className="text-xl font-bold">

                                    Search Result

                                </h2>

                                <p className="text-sm text-white/80">

                                    {results.length}
                                    {" "}
                                    leads found

                                </p>

                            </div>

                            <button
                                onClick={() =>
                                    setOpen(
                                        false
                                    )
                                }
                            >

                                <X />

                            </button>

                        </div>

                        <div className="
                        p-6
                        overflow-auto
                        max-h-[65vh]
                        ">

                            {!results.length && (

                                <div className="
                                text-center
                                py-20
                                ">

                                    <Search className="
                                    h-14 w-14
                                    mx-auto
                                    text-slate-300
                                    mb-4
                                    " />

                                    <h3 className="
                                    font-semibold
                                    text-lg
                                    ">

                                        No Lead Found

                                    </h3>

                                    <p className="
                                    text-slate-500
                                    mt-2
                                    ">

                                        Try another Lead ID

                                    </p>

                                </div>

                            )}

                            <div className="space-y-4">

                                {results.map((lead: any) => (
                                    <div
                                        key={lead.id}
                                        className="border border-slate-200 rounded-2xl p-5 mb-4 bg-gradient-to-r from-white to-slate-50 shadow-sm hover:shadow-md transition"
                                    >

                                        <div className="flex items-start justify-between gap-4">

                                            <div className="flex-1">

                                                <div className="flex items-center gap-3 mb-3">

                                                    <h3 className="text-lg font-bold text-slate-800">
                                                        {lead.patient_name || "Unnamed Patient"}
                                                    </h3>

                                                    <span className="px-3 py-1 text-xs rounded-full bg-blue-100 text-blue-700">
                                                        {lead.uid}
                                                    </span>

                                                    <span
                                                        className={`px-3 py-1 text-xs rounded-full
                        ${lead.patient_status === "fresh"
                                                                ? "bg-green-100 text-green-700"
                                                                : lead.patient_status === "verified"
                                                                    ? "bg-yellow-100 text-yellow-700"
                                                                    : "bg-slate-100 text-slate-700"
                                                            }`}
                                                    >
                                                        {lead.patient_status || "NA"}
                                                    </span>

                                                </div>

                                                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">

                                                    <div>
                                                        <p className="text-slate-400">
                                                            Gender
                                                        </p>

                                                        <p className="font-medium">
                                                            {lead.patient_gender || "-"}
                                                        </p>
                                                    </div>

                                                    <div>
                                                        <p className="text-slate-400">
                                                            Age
                                                        </p>

                                                        <p className="font-medium">
                                                            {lead.patient_age || "-"}
                                                        </p>
                                                    </div>

                                                    <div>
                                                        <p className="text-slate-400">
                                                            Mobile
                                                        </p>

                                                        <p className="font-medium">
                                                            {lead.main_mobile || "-"}
                                                        </p>
                                                    </div>

                                                    <div>
                                                        <p className="text-slate-400">
                                                            City
                                                        </p>

                                                        <p className="font-medium">
                                                            {lead.patient_city_name || "-"}
                                                        </p>
                                                    </div>

                                                    <div>
                                                        <p className="text-slate-400">
                                                            Spouse
                                                        </p>

                                                        <p className="font-medium">
                                                            {lead.spouse_name || "-"}
                                                        </p>
                                                    </div>

                                                    <div>
                                                        <p className="text-slate-400">
                                                            Marriage Duration
                                                        </p>

                                                        <p className="font-medium">
                                                            {lead.marriage_duration || "-"}
                                                        </p>
                                                    </div>

                                                    <div>
                                                        <p className="text-slate-400">
                                                            Income
                                                        </p>

                                                        <p className="font-medium">
                                                            {lead.annual_income || "-"}
                                                        </p>
                                                    </div>

                                                    <div>
                                                        <p className="text-slate-400">
                                                            EMI
                                                        </p>

                                                        <p className="font-medium">
                                                            {lead.emi_eligibility
                                                                ? "Yes"
                                                                : "No"}
                                                        </p>
                                                    </div>

                                                    <div>
                                                        <p className="text-slate-400">
                                                            Source
                                                        </p>

                                                        <p className="font-medium">
                                                            {lead.source || "-"}
                                                        </p>
                                                    </div>

                                                </div>

                                            </div>

                                            <button
                                                onClick={() =>
                                                    navigate(
                                                        `/agent/fill-info/${lead.id}`
                                                    )
                                                }
                                                className="
                    flex items-center gap-2
                    px-4 py-2
                    bg-gradient-to-r
                    from-blue-600
                    to-indigo-600
                    text-white
                    rounded-xl
                    hover:scale-105
                    transition
                "
                                            >
                                                <Edit size={16} />
                                                Edit
                                            </button>

                                        </div>

                                    </div>
                                ))}

                            </div>

                        </div>

                    </div>

                </div>

            )}

        </>
    );
};