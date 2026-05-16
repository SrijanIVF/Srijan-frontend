import { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronUp, ChevronDown, ArrowLeft } from "lucide-react";
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

type SectionProps = {
    title: string;
    children: React.ReactNode;
    defaultOpen?: boolean;
};

const Section = ({ title, children, defaultOpen = true }: SectionProps) => {
    const [open, setOpen] = useState(defaultOpen);
    return (
        <div className="bg-card rounded-xl shadow-[var(--shadow-card)] overflow-hidden">
            <button
                type="button"
                onClick={() => setOpen((o) => !o)}
                className="w-full flex items-center justify-between px-5 py-4 border-b"
            >
                <h2 className="text-lg font-bold bg-[image:var(--gradient-brand)] bg-clip-text text-transparent">
                    {title}
                </h2>
                {open ? (
                    <ChevronUp className="h-5 w-5 text-[hsl(var(--brand-pink))]" />
                ) : (
                    <ChevronDown className="h-5 w-5 text-[hsl(var(--brand-pink))]" />
                )}
            </button>
            <div
                className={`grid transition-all duration-300 ease-in-out ${open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                    }`}
            >
                <div className="overflow-hidden">
                    <div className="p-5 space-y-4">{children}</div>
                </div>
            </div>
        </div>
    );
};

const Submit = () => (
    <button
        type="submit"
        className="w-full py-3 rounded-md bg-[image:var(--gradient-card-header)] text-white text-sm font-semibold tracking-wider hover:shadow-lg hover:brightness-105 transition"
    >
        SUBMIT
    </button>
);

const Pill = ({
    active,
    children,
    onClick,
}: {
    active?: boolean;
    children: React.ReactNode;
    onClick?: () => void;
}) => (
    <button
        type="button"
        onClick={onClick}
        className={`px-4 py-1.5 text-xs font-semibold rounded border transition ${active
            ? "bg-[image:var(--gradient-pink)] text-white border-transparent shadow"
            : "bg-background text-foreground border-border hover:border-[hsl(var(--brand-pink))]"
            }`}
    >
        {children}
    </button>
);

const Field = ({
    label,
    required,
    children,
}: {
    label: string;
    required?: boolean;
    children: React.ReactNode;
}) => (
    <div className="space-y-1.5">
        <Label className="text-xs font-semibold">
            {label} {required && <span className="text-destructive">*</span>}
        </Label>
        {children}
    </div>
);

const FillInfo = () => {
    const [treatment, setTreatment] = useState("IVF");
    const [lang, setLang] = useState("Hindi");
    const [gender, setGender] = useState<"MALE" | "FEMALE">("MALE");
    const [commentType, setCommentType] = useState("");

    return (
        <div className="min-h-screen flex flex-col bg-background">
            <DashboardHeader />
            <main className="flex-1 container py-6 space-y-6">
                <div className="flex items-center justify-between">
                    <Link
                        to="/agent"
                        className="inline-flex items-center gap-2 text-sm font-semibold text-[hsl(var(--brand-purple))] hover:text-[hsl(var(--brand-pink))] transition"
                    >
                        <ArrowLeft className="h-4 w-4" /> Back to Dashboard
                    </Link>
                    <h1 className="text-xl font-bold bg-[image:var(--gradient-brand)] bg-clip-text text-transparent">
                        Fill Info
                    </h1>
                </div>

                {/* Treatment Details */}
                <form
                    className="space-y-4"
                    onSubmit={(e) => {
                        e.preventDefault();
                    }}
                >
                    <Section title="Treatment Details">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            <Field label="Select Treatment" required>
                                <div className="flex flex-wrap gap-2">
                                    {["IVF", "IUI"].map((t) => (
                                        <Pill key={t} active={treatment === t} onClick={() => setTreatment(t)}>
                                            {t}
                                        </Pill>
                                    ))}
                                </div>
                            </Field>
                            <Field label="Select Language" required>
                                <div className="flex flex-wrap gap-2">
                                    {["Hindi", "English"].map((ln) => (
                                        <Pill key={ln} active={lang === ln} onClick={() => setLang(ln)}>
                                            {ln}
                                        </Pill>
                                    ))}
                                </div>
                            </Field>
                        </div>
                        <Submit />
                    </Section>
                </form>

                {/* Relevant */}
                <form
                    className="space-y-4"
                    onSubmit={(e) => {
                        e.preventDefault();
                    }}
                >
                    <Section title="Relevant">
                        <Field label="Patient Gender" required>
                            <div className="flex rounded-md overflow-hidden border border-border w-full max-w-md">
                                {(["MALE", "FEMALE"] as const).map((g) => (
                                    <button
                                        key={g}
                                        type="button"
                                        onClick={() => setGender(g)}
                                        className={`flex-1 py-2 text-xs font-semibold transition ${gender === g
                                            ? "bg-[image:var(--gradient-pink)] text-white"
                                            : "bg-background text-foreground hover:bg-muted"
                                            }`}
                                    >
                                        {g}
                                    </button>
                                ))}
                            </div>
                        </Field>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            <Field label="Patient name" required>
                                <Input defaultValue="Test" />
                            </Field>
                            <Field label="Patient Age" required>
                                <Input type="number" defaultValue={0} />
                            </Field>
                            <Field label="Spouse name" required>
                                <Input />
                            </Field>
                            <Field label="Spouse age" required>
                                <Input type="number" defaultValue={0} />
                            </Field>

                            <Field label="Mariage duration" required>
                                <Input type="number" defaultValue={0} />
                            </Field>
                            <Field label="Patient Country">
                                <Input defaultValue="India" />
                            </Field>
                            <Field label="Update Country" required>
                                <Input />
                            </Field>
                            <Field label="Patient city">
                                <Input defaultValue="test" />
                            </Field>

                            <Field label="Update Patient city" required>
                                <Input />
                            </Field>
                            <Field label="Patient area" required>
                                <Input defaultValue="2--test" />
                            </Field>
                            <Field label="Treatment city">
                                <Input defaultValue="Lajpat Nagar" />
                            </Field>
                            <Field label="Update Treatment city" required>
                                <Input placeholder="Update Treatment City*" />
                            </Field>

                            <Field label="Patient Address">
                                <Input />
                            </Field>
                            <Field label="Annual Income">
                                <Select>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="0-3">0-3 Lakhs</SelectItem>
                                        <SelectItem value="3-6">3-6 Lakhs</SelectItem>
                                        <SelectItem value="6-10">6-10 Lakhs</SelectItem>
                                        <SelectItem value="10+">10+ Lakhs</SelectItem>
                                    </SelectContent>
                                </Select>
                            </Field>
                            <Field label="Loan Required">
                                <Select defaultValue="no">
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="yes">Yes</SelectItem>
                                        <SelectItem value="no">No</SelectItem>
                                    </SelectContent>
                                </Select>
                            </Field>
                            <Field label="Patient Occupation" required>
                                <Select>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="business">Business</SelectItem>
                                        <SelectItem value="salaried">Salaried</SelectItem>
                                        <SelectItem value="other">Other</SelectItem>
                                    </SelectContent>
                                </Select>
                            </Field>

                            <Field label="Email">
                                <Input defaultValue="NA" />
                            </Field>
                        </div>

                        <Submit />
                    </Section>
                </form>

                {/* Other Details */}
                <form
                    className="space-y-4"
                    onSubmit={(e) => {
                        e.preventDefault();
                    }}
                >
                    <Section title="Other Details">
                        <Field label="Comment Type" required>
                            <Select value={commentType} onValueChange={setCommentType}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="call-later">Call Later</SelectItem>
                                    <SelectItem value="appointment">Appointment Schedule</SelectItem>
                                </SelectContent>
                            </Select>
                        </Field>
                        <Field label="Add Comment" required>
                            <Textarea placeholder="Add Comment(Required)" rows={4} />
                        </Field>
                        <Submit />
                    </Section>
                </form>
            </main>
            <DashboardFooter />
        </div>
    );
};

export default FillInfo;