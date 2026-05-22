import { useEffect, useState } from "react";
import {
    ChevronUp,
    ChevronDown,
    ArrowLeft,
    Loader2,
} from "lucide-react";

import DashboardHeader from "@/components/dashboard/DashboardHeader";
import DashboardFooter from "@/components/dashboard/DashboardFooter";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

import { Button } from "@/components/ui/button";
import { API_BASE, getToken } from "@/lib/auth";
import { useParams } from "react-router-dom";
import { authApi } from "@/lib/api";

type SectionProps = {
    title: string;
    children: React.ReactNode;
    defaultOpen?: boolean;
};

type CityItem = {
    id: number;
    name: string;
};

type LeadSource = {
    uuid: string;
    name: string;
};

const Section = ({
    title,
    children,
    defaultOpen = true,
}: SectionProps) => {
    const [open, setOpen] = useState(defaultOpen);

    return (
        <div className="bg-card rounded-xl shadow overflow-hidden">
            <button
                type="button"
                onClick={() => setOpen(!open)}
                className="w-full px-5 py-4 border-b flex items-center justify-between"
            >
                <h2 className="font-bold text-lg">{title}</h2>
                {open ? (
                    <ChevronUp className="h-5 w-5" />
                ) : (
                    <ChevronDown className="h-5 w-5" />
                )}
            </button>
            {open && <div className="p-5 space-y-4">{children}</div>}
        </div>
    );
};

const Field = ({ label, children }: { label: string; children: React.ReactNode; }) => (
    <div className="space-y-2">
        <Label>{label}</Label>
        {children}
    </div>
);

const FillInfo = () => {
    const { id } = useParams();
    const patientId = Number(id);
    const [loading, setLoading] = useState(false);
    const [cities, setCities] = useState<{
        patient_city: CityItem[];
        treatment_city: CityItem[];
        lead_source: LeadSource[];
    }>({
        patient_city: [],
        treatment_city: [],
        lead_source: [],
    });
    const [lead_uuid, setLeadUUID] = useState("");

    const initialFormData = {
        treatment: "IVF",
        language: "Hindi",

        patient_gender: "Male",

        patient_name: "",
        patient_age: "",

        spouse_name: "",
        spouse_age: "",

        marriage_duration: "",

        patient_country: "India",

        update_country: "",

        patient_area: "",

        address: "",

        annual_income: "",

        emi_eligibility: false,

        occupation: "",

        email: "",

        patient_city: "",

        treatment_city: "",

        source: "",

        comment_type: "",

        comment: "",

        lead: ""
    };

    const [formData, setFormData] =
        useState(initialFormData);

    useEffect(() => {
        fetchDropdowns();
    }, []);

    useEffect(() => {
        if (!id) return;
        fetchPatient();
    }, [id]);

    const fetchPatient = async () => {
        try {

            const res =
                await authApi.get(
                    `/lead/patients/${id}/`
                );

            const p = res.data;
            setLeadUUID(p?.lead)
            setFormData({

                ...formData,

                patient_name:
                    p.patient_name || "",

                patient_age:
                    String(
                        p.patient_age || ""
                    ),

                spouse_name:
                    p.spouse_name || "",

                spouse_age:
                    String(
                        p.spouse_age || ""
                    ),

                patient_gender:
                    p.patient_gender || "Male",

                marriage_duration:
                    p.marriage_duration || "",

                address:
                    p.address || "",

                email:
                    p.email || "",

                annual_income:
                    p.annual_income || "",

                emi_eligibility:
                    p.emi_eligibility,

                patient_city:
                    String(
                        p.patient_city || ""
                    ),

                treatment_city:
                    String(
                        p.treatment_city || ""
                    ),

                source:
                    p.source || "",
            });

        } catch (err) {
            console.log(err);
        }
    };

    const fetchDropdowns = async () => {
        try {
            const token = getToken();
            const res =
                await fetch(`${API_BASE}/core/city/`, {
                    headers: {
                        Accept: "application/json",
                        ...(token ? { Authorization: `Bearer ${token}`, } : {}),
                    },
                });
            const data = await res.json();
            setCities(data);
        } catch (err) {
            console.log(err);
        }
    };

    const handleSubmit = async (
        e: React.FormEvent
    ) => {
        e.preventDefault();
        try {
            setLoading(true);
            const token = getToken();
            const payload = {
                patient_name: formData.patient_name || "",
                patient_age:
                    formData.patient_age
                        ? Number(formData.patient_age)
                        : 0,
                patient_gender:
                    formData.patient_gender || "Male",
                spouse_name:
                    formData.spouse_name || "",
                spouse_age:
                    formData.spouse_age
                        ? Number(formData.spouse_age)
                        : 0,
                marriage_duration:
                    formData.marriage_duration || "",
                address:
                    formData.address || "",
                email:
                    formData.email || "",
                annual_income:
                    formData.annual_income || "0-3",
                emi_eligibility:
                    formData.emi_eligibility,
                patient_city:
                    Number(formData.patient_city),
                treatment_city:
                    formData.treatment_city
                        ? Number(formData.treatment_city)
                        : Number(formData.patient_city),
                source: formData.source || "",
                lead: lead_uuid
            };
            console.log("PAYLOAD =>", payload);
            const res = await fetch(
                `${API_BASE}/lead/patients/${patientId}/`,
                {
                    method: "PUT",
                    headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json",
                        ...(token
                            ? { Authorization: `Bearer ${token}`, } : {}),
                    },
                    body:
                        JSON.stringify(payload),
                }
            );

            const data = await res.json();

            console.log("RESPONSE =>", data);

            if (!res.ok) {
                throw new Error(
                    data?.detail ||
                    data?.message ||
                    "Update failed"
                );
            }

            alert("Updated Successfully");
            setFormData(initialFormData)

        } catch (err) {
            console.log(err);
            alert(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col">
            <DashboardHeader />
            <main className="container py-6 flex-1">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <Section title="Treatment Details">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <Field label="Select Treatment">
                                <div className="flex gap-2">
                                    {["IVF", "IUI"].map((t) => (
                                        <Button
                                            key={t}
                                            type="button"
                                            variant={formData.treatment === t ? "default" : "outline"}
                                            onClick={() => setFormData({ ...formData, treatment: t })}
                                        >
                                            {t}
                                        </Button>
                                    ))}
                                </div>
                            </Field>
                            <Field label="Language">
                                <div className="flex gap-2">
                                    {["Hindi", "English"].map((t) => (
                                        <Button
                                            key={t}
                                            type="button"
                                            variant={formData.language === t ? "default" : "outline"}
                                            onClick={() => setFormData({ ...formData, language: t })}
                                        >
                                            {t}
                                        </Button>
                                    ))}
                                </div>
                            </Field>
                        </div>
                    </Section>
                    <Section title="Relevant">
                        <Field label="Gender">
                            <div className="flex gap-2">
                                {["Male", "Female"].map((g) => (
                                    <Button
                                        key={g}
                                        type="button"
                                        variant={formData.patient_gender === g ? "default" : "outline"}
                                        onClick={() => setFormData({ ...formData, patient_gender: g })}
                                    >
                                        {g}
                                    </Button>
                                ))}
                            </div>
                        </Field>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <Field label="Patient Name">
                                <Input
                                    value={formData.patient_name}
                                    onChange={(e) => setFormData({ ...formData, patient_name: e.target.value })}
                                />
                            </Field>
                            <Field label="Patient Age">
                                <Input
                                    type="number"
                                    value={formData.patient_age}
                                    onChange={(e) => setFormData({ ...formData, patient_age: e.target.value })}
                                />
                            </Field>
                            <Field label="Spouse Name">
                                <Input
                                    value={formData.spouse_name}
                                    onChange={(e) => setFormData({ ...formData, spouse_name: e.target.value })}
                                />
                            </Field>
                            <Field label="Spouse Age">
                                <Input
                                    type="number"
                                    value={formData.spouse_age}
                                    onChange={(e) => setFormData({ ...formData, spouse_age: e.target.value })}
                                />
                            </Field>
                            <Field label="Marriage Duration">
                                <Input
                                    value={formData.marriage_duration}
                                    onChange={(e) => setFormData({ ...formData, marriage_duration: e.target.value })}
                                />
                            </Field>
                            <Field label="Patient Country">
                                <Input
                                    value={formData.patient_country}
                                    onChange={(e) => setFormData({ ...formData, patient_country: e.target.value })}
                                />
                            </Field>
                            <Field label="Update Country">
                                <Input
                                    value={formData.update_country}
                                    onChange={(e) => setFormData({ ...formData, update_country: e.target.value })}
                                />
                            </Field>
                            <Field label="Patient Area">
                                <Input
                                    value={formData.patient_area}
                                    onChange={(e) => setFormData({ ...formData, patient_area: e.target.value })}
                                />
                            </Field>
                            <Field label="Patient City">
                                <Select
                                    value={formData.patient_city}
                                    onValueChange={(v) => setFormData({ ...formData, patient_city: v })}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {cities.patient_city.map(
                                            (city) => (
                                                <SelectItem
                                                    key={city.id}

                                                    value={String(
                                                        city.id
                                                    )}
                                                >

                                                    {city.name}

                                                </SelectItem>
                                            ))
                                        }

                                    </SelectContent>

                                </Select>

                            </Field>


                            <Field label="Treatment City">

                                <Select

                                    value={
                                        formData.treatment_city
                                    }

                                    onValueChange={(v) =>
                                        setFormData({
                                            ...formData,
                                            treatment_city: v
                                        })
                                    }
                                >

                                    <SelectTrigger>

                                        <SelectValue />

                                    </SelectTrigger>

                                    <SelectContent>

                                        {cities.treatment_city.map(
                                            (city) => (
                                                <SelectItem
                                                    key={city.id}

                                                    value={String(
                                                        city.id
                                                    )}
                                                >

                                                    {city.name}

                                                </SelectItem>
                                            ))
                                        }

                                    </SelectContent>

                                </Select>

                            </Field>

                            <Field label="Lead Source">

                                <Select
                                    value={formData.source}

                                    onValueChange={(v) =>
                                        setFormData({
                                            ...formData,
                                            source: v,
                                        })
                                    }
                                >

                                    <SelectTrigger>

                                        <SelectValue placeholder="Select Source" />

                                    </SelectTrigger>

                                    <SelectContent>

                                        {cities.lead_source.map(
                                            (item) => (
                                                <SelectItem
                                                    key={item.uuid}

                                                    value={item.uuid}
                                                >
                                                    {item.name}
                                                </SelectItem>
                                            )
                                        )}

                                    </SelectContent>

                                </Select>

                            </Field>


                            <Field label="Annual Income">

                                <Select
                                    value={formData.annual_income}
                                    onValueChange={(v) =>
                                        setFormData({
                                            ...formData,
                                            annual_income: v
                                        })
                                    }
                                >

                                    <SelectTrigger>
                                        <SelectValue placeholder="Select Income" />
                                    </SelectTrigger>

                                    <SelectContent>

                                        <SelectItem value="<1.5Lac">
                                            &lt;1.5 Lac
                                        </SelectItem>

                                        <SelectItem value="1.5-3Lac">
                                            1.5 - 3 Lac
                                        </SelectItem>

                                        <SelectItem value="3-5Lac">
                                            3 - 5 Lac
                                        </SelectItem>

                                        <SelectItem value=">5Lac">
                                            &gt;5 Lac
                                        </SelectItem>

                                    </SelectContent>

                                </Select>

                            </Field>


                            <Field label="Loan Required">

                                <Select

                                    value={
                                        String(
                                            formData.emi_eligibility
                                        )
                                    }

                                    onValueChange={(v) =>
                                        setFormData({
                                            ...formData,

                                            emi_eligibility:
                                                v === "true"
                                        })
                                    }
                                >

                                    <SelectTrigger>

                                        <SelectValue />

                                    </SelectTrigger>

                                    <SelectContent>

                                        <SelectItem value="true">
                                            Yes
                                        </SelectItem>

                                        <SelectItem value="false">
                                            No
                                        </SelectItem>

                                    </SelectContent>

                                </Select>

                            </Field>


                            <Field label="Occupation">

                                <Input
                                    value={
                                        formData.occupation
                                    }

                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            occupation:
                                                e.target.value
                                        })
                                    }
                                />

                            </Field>


                            <Field label="Email">

                                <Input

                                    value={
                                        formData.email
                                    }

                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            email: e.target.value
                                        })
                                    }
                                />

                            </Field>

                            <Field label="Address">

                                <Input

                                    value={
                                        formData.address
                                    }

                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            address:
                                                e.target.value
                                        })
                                    }
                                />

                            </Field>

                        </div>

                    </Section>


                    <Section title="Other Details">

                        <Field label="Comment Type">

                            <Select

                                value={
                                    formData.comment_type
                                }

                                onValueChange={(v) =>
                                    setFormData({
                                        ...formData,
                                        comment_type: v
                                    })
                                }
                            >

                                <SelectTrigger>

                                    <SelectValue />

                                </SelectTrigger>

                                <SelectContent>

                                    <SelectItem value="call">
                                        Call Later
                                    </SelectItem>

                                    <SelectItem value="appointment">

                                        Appointment

                                    </SelectItem>

                                </SelectContent>

                            </Select>

                        </Field>


                        <Field label="Comment">

                            <Textarea

                                rows={4}

                                value={
                                    formData.comment
                                }

                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        comment: e.target.value
                                    })
                                }
                            />

                        </Field>

                    </Section>


                    <Button
                        type="submit"
                        className="w-full"
                        disabled={loading}
                    >

                        {loading
                            ? "Updating..."
                            : "SUBMIT"}

                    </Button>

                </form>

            </main>

            <DashboardFooter />

        </div>
    );
};

export default FillInfo;