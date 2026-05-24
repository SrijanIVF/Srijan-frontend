import { useState, useEffect } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

import { Loader2 } from "lucide-react";
import { authApi } from "@/lib/api";
import styles from "../CommentModal/Comments.module.css";

export default function CommentModal({
    open,
    setOpen,
    patientData,
}) {
    const [systemComments, setSystemComments] = useState([]);
    const [ceComments, setCeComments] = useState([]);
    const [waComments, setWaComments] = useState([]);
    const [pccComments, setPccComments] = useState([]);
    const [commentsLoading, setCommentsLoading] = useState(false);

    useEffect(() => {
        if (!open || !patientData?.uid) return;

        fetchComments();
    }, [open, patientData]);

    const fetchComments = async () => {
        try {
            setCommentsLoading(true);

            const res = await authApi.get(
                `/communication/patient-comments/?patient_id=${patientData?.uid}`
            );

            const data = res.data || {};

            setSystemComments(data.system_comments || []);
            setCeComments(data.manual_comments || []);
            setWaComments(data.whatsapp_comments || []);
            setPccComments(data.pcc_comments || []);
        } catch (err) {
            console.log(err);
        } finally {
            setCommentsLoading(false);
        }
    };

    const renderComment = (c, index) => (
        <div
            key={c.id || index}
            className="rounded-lg bg-slate-50 p-3 border text-sm"
        >
            <div className="flex gap-2 text-xs text-muted-foreground mb-1">
                <span>{c.created_at?.substring(0, 10)}</span>
                <span>
                    {c.created_at?.substring(11, 19)}
                </span>
            </div>

            <div className="font-medium">
                {c.user_name}
            </div>

            <div className="mt-1">
                {c.comment}
            </div>
        </div>
    );

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="max-w-7xl p-0 overflow-hidden bg-slate-100">

                {/* HEADER */}
                <DialogHeader className="bg-gradient-to-r from-indigo-600 to-violet-600 px-6 py-5 sticky top-0">
                    <DialogTitle className="text-white text-xl">
                        Lead ID : {patientData?.uid}
                    </DialogTitle>
                </DialogHeader>

                {commentsLoading ? (
                    <div className="flex justify-center items-center h-[500px]">
                        <Loader2 className="animate-spin h-8 w-8" />
                    </div>
                ) : (

                    <div className="grid lg:grid-cols-2 gap-5 p-5">

                        {/* SYSTEM */}
                        <section className="bg-white rounded-2xl overflow-hidden shadow-sm border">
                            <div className="bg-purple-600 text-white px-5 py-3 font-semibold sticky top-0">
                                SYSTEM GENERATED
                            </div>

                            <div className="h-[320px] overflow-y-auto p-4 space-y-3">
                                {systemComments.length ? (
                                    systemComments.map(renderComment)
                                ) : (
                                    <p>No comments found</p>
                                )}
                            </div>
                        </section>

                        {/* COMMENT HISTORY */}
                        <section className="bg-white rounded-2xl overflow-hidden shadow-sm border">
                            <div className="bg-orange-500 text-white px-5 py-3 font-semibold">
                                COMMENT HISTORY
                            </div>

                            <div className="h-[320px] overflow-y-auto p-4 space-y-3">
                                {ceComments.length ? (
                                    ceComments.map(renderComment)
                                ) : (
                                    <p>No comments found</p>
                                )}
                            </div>
                        </section>

                        {/* WHATSAPP */}
                        <section className="bg-white rounded-2xl overflow-hidden shadow-sm border">
                            <div className="bg-green-600 text-white px-5 py-3 font-semibold">
                                WHATSAPP HISTORY
                            </div>

                            <div className="h-[250px] overflow-y-auto p-4 space-y-3">

                                {waComments.length ? (
                                    waComments.map((c) => (
                                        <div
                                            key={c.id}
                                            className="bg-green-50 rounded-xl p-3"
                                        >
                                            {c.message}
                                        </div>
                                    ))
                                ) : (
                                    <p>No whatsapp history</p>
                                )}

                            </div>

                            <div className="border-t p-4 flex gap-3">
                                <input
                                    className="flex-1 border rounded-xl px-4 py-2"
                                    placeholder="Add comment..."
                                />

                                <button className="bg-black text-white px-5 rounded-xl">
                                    Send
                                </button>
                            </div>
                        </section>

                        {/* PCC */}
                        <section className="bg-white rounded-2xl overflow-hidden shadow-sm border">
                            <div className="bg-red-600 text-white px-5 py-3 font-semibold">
                                PCC HISTORY / SYSTEM
                            </div>

                            <div className="h-[320px] overflow-y-auto p-4 space-y-3">

                                {pccComments.length ? (
                                    pccComments.map((c) => (
                                        <div
                                            key={c.id}
                                            className="bg-slate-100 rounded-lg p-3"
                                        >
                                            {c.comment}
                                        </div>
                                    ))
                                ) : (
                                    <p>No PCC history</p>
                                )}

                            </div>
                        </section>

                    </div>
                )}

            </DialogContent>
        </Dialog>
    );
}