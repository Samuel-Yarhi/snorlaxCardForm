import React, { useState, useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { Experience } from "@/schemas/experience.schema";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import TextField from "@mui/material/TextField";
import LinearProgress from '@mui/material/LinearProgress';

const BackSide = ({
    isFlipped,
    setIsFlipped,
    onVerify,
}: {
    isFlipped: boolean;
    setIsFlipped: React.Dispatch<React.SetStateAction<boolean>>;
    onVerify: () => void;
}) => {
    const [skills, setSkills] = useState<string[]>([]);
    const [newSkill, setNewSkill] = useState("");
    const [editingIndex, setEditingIndex] = useState<number | null>(null);
    const [editingSkill, setEditingSkill] = useState("");
    const [progress, setProgress] = useState(0);

    const updateProgress = () => {
        const totalFields = 4; // Total required fields: currentRole, yearsOfExperience, skills, company
        let filledFields = 0;

        // Check if fields are valid and non-empty
        if (watch("currentRole") && !errors.currentRole) filledFields++;
        if (watch("yearsOfExperience") && !errors.yearsOfExperience) filledFields++;
        if (watch("skills")?.length && !errors.skills) filledFields++;
        if (watch("company") && !errors.company) filledFields++;

        // Calculate progress percentage
        const percentage = (filledFields / totalFields) * 100;
        setProgress(percentage);
    };

    const saveToLocalStorage = (key: string, value: any) => {
        localStorage.setItem(key, JSON.stringify(value));
    };

    const loadFromLocalStorage = (key: string) => {
        const storedValue = localStorage.getItem(key);
        return storedValue ? JSON.parse(storedValue) : null;
    };

    const { register, setValue, trigger, watch, formState: { errors } } = useFormContext<Experience>();

    // Load data from local storage on component mount
    useEffect(() => {
        const storedSkills = loadFromLocalStorage("skills");
        const storedRole = loadFromLocalStorage("currentRole");
        const storedyearsOfExperience = loadFromLocalStorage("yearsOfExperience");
        const storedcompany = loadFromLocalStorage("company");

        if (storedSkills) {
            setSkills(storedSkills);
            setValue("skills", storedSkills);
        }

        if (storedRole) {
            setValue("currentRole", storedRole);
        }
        if (storedyearsOfExperience) {
            setValue("yearsOfExperience", storedyearsOfExperience);
        }
        if (storedcompany) {
            setValue("company", storedcompany);
        }

    }, [setValue]);

    const watchedFields = watch(["currentRole", "yearsOfExperience", "skills", "company"]);

    useEffect(() => {
        updateProgress();
    }, [watchedFields, errors]);

    const addSkill = () => {
        if (newSkill.trim()) {
            const updatedSkills = [...skills, newSkill.trim()];
            setSkills(updatedSkills);
            // Update form value only if the updatedSkills is non-empty
            setValue("skills", updatedSkills as [string, ...string[]]);
            saveToLocalStorage("skills", updatedSkills);
            setNewSkill("");
        }
    };

    const removeSkill = async (index: number) => {
        const updatedSkills = skills.filter((_, i) => i !== index);
        setSkills(updatedSkills);

        // Update form value with the remaining skills
        setValue("skills", updatedSkills as [string, ...string[]]);

        saveToLocalStorage("skills", updatedSkills);

        // Trigger validation after updating the skills
        const result = await trigger("skills");
    };

    // Start editing a skill
    const startEditing = (index: number) => {
        setEditingIndex(index);
        setEditingSkill(skills[index]);
    };

    // Save edited skill
    const saveEditedSkill = () => {
        if (editingIndex !== null && editingSkill.trim()) {
            const updatedSkills = skills.map((skill, i) =>
                i === editingIndex ? editingSkill.trim() : skill
            );
            setSkills(updatedSkills);

            // Ensure that updatedSkills has at least one skill to satisfy the type [string, ...string[]]
            const skillsToSave = updatedSkills.length > 0 ? updatedSkills : ["DefaultSkill"];

            setValue("skills", skillsToSave as [string, ...string[]]);
            saveToLocalStorage("skills", updatedSkills);
            setEditingIndex(null);
            setEditingSkill("");
        }
    };

    // Cancel editing
    const cancelEditing = () => {
        setEditingIndex(null);
        setEditingSkill("");
    };

    return (
        <div className={`card-side ${isFlipped ? "" : "hidden"}`}>
            <div className="card-back bg-gray-700 p-6 border-4 border-gray-400 rounded-lg h-[600px] w-[350px] flex flex-col">
                <h2 className="text-xl font-bold text-snorlaxBrown">Experience</h2>

                <p className="text-center mt-1 text-snorlaxCream">{Math.round(progress)}% completed</p>
                <LinearProgress
                    variant="determinate"
                    value={progress}
                    sx={{
                        backgroundColor: 'rgba(255, 255, 255, 0.3)',
                        '& .MuiLinearProgress-bar': {
                            backgroundColor: '#cc6e49',
                        },
                        zIndex: '9999',
                        width: '100%'
                    }}
                />

                {/* Scrollable Form Section */}
                <div className="overflow-y-auto box-border text-left h-full scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-gray-800">

                    {/* Current Role */}
                    <div>
                        <label className="block mt-4 text-sm font-medium text-snorlaxCream">Current Role</label>
                        <input
                            type="text"
                            {...register("currentRole")}
                            onChange={(e) => {
                                setValue("currentRole", e.target.value);
                                saveToLocalStorage("currentRole", e.target.value); // Save currentRole to local storage
                            }}
                            className="mt-1 p-2 w-full border-[3px] border-gray-400 rounded-lg bg-gray-800 text-snorlaxCream focus:border-snorlaxBrown focus:outline-none"
                        />
                        {errors.currentRole && <p className="text-red-400 text-xs mt-1">{errors.currentRole.message}</p>}
                    </div>

                    {/* Years of Experience */}
                    <div>
                        <label className="block text-sm font-medium text-snorlaxCream mt-4">Years of Experience</label>
                        <input
                            type="number"
                            min={0}
                            {...register("yearsOfExperience", { valueAsNumber: true })}
                            onChange={(e) => {
                                const value = Number(e.target.value); // Ensure it's a number
                                setValue("yearsOfExperience", value);
                                saveToLocalStorage("yearsOfExperience", value); // Save yearsOfExperience to local storage
                            }}
                            className="mt-1 p-2 w-full border-[3px] border-gray-400 rounded-lg bg-gray-800 text-snorlaxCream focus:border-snorlaxBrown focus:outline-none"
                        />
                        {errors.yearsOfExperience && (
                            <p className="text-red-400 text-xs mt-1">{errors.yearsOfExperience.message}</p>
                        )}
                    </div>

                    {/* Skills Section */}
                    <div>
                        <label className="block text-sm font-medium text-snorlaxCream mt-4">Skills</label>
                        <div className="bg-gray-800 border-[3px] border-gray-400 rounded-lg w-full">
                            <List sx={{ paddingTop: 0, paddingBottom: 0 }}>
                                {skills?.map((skill, index) =>
                                    editingIndex === index ? (
                                        <ListItem key={index}>
                                            <TextField
                                                value={editingSkill}
                                                onChange={(e) => setEditingSkill(e.target.value)}
                                                className="flex-grow bg-gray-800 text-snorlaxCream"
                                                InputProps={{
                                                    style: { color: "white" },
                                                }}
                                            />
                                            <IconButton onClick={saveEditedSkill} style={{ color: "white" }}>
                                                ✔
                                            </IconButton>
                                            <IconButton onClick={cancelEditing} style={{ color: "white" }}>
                                                ✖
                                            </IconButton>
                                        </ListItem>
                                    ) : (
                                        <ListItem
                                            key={index}
                                            secondaryAction={
                                                <>
                                                    <IconButton
                                                        edge="end"
                                                        aria-label="edit"
                                                        onClick={() => startEditing(index)}
                                                        style={{ color: "white" }}
                                                    >
                                                        <EditIcon />
                                                    </IconButton>
                                                    <IconButton
                                                        edge="end"
                                                        aria-label="delete"
                                                        onClick={() => removeSkill(index)}
                                                        style={{ color: "white" }}
                                                    >
                                                        <DeleteIcon />
                                                    </IconButton>
                                                </>
                                            }
                                        >
                                            <ListItemText primary={skill} />
                                        </ListItem>
                                    )
                                )}
                            </List>
                            <div className="my-2 flex justify-around">
                                <input
                                    type="text"
                                    value={newSkill}
                                    onChange={(e) => setNewSkill(e.target.value)}
                                    placeholder="Add a skill"
                                    className="w-3/5 pl-2 border-[3px] border-gray-400 rounded-lg bg-gray-700 text-snorlaxCream focus:border-snorlaxBrown focus:outline-none"
                                />
                                <button
                                    type="button"
                                    onClick={addSkill}
                                    className="ml-2 px-4 py-2 bg-snorlaxCream text-snorlaxBrown font-bold rounded-lg hover:bg-snorlaxBrown hover:text-snorlaxCream transition"
                                >
                                    Add
                                </button>
                            </div>
                        </div>
                        {errors.skills && <p className="text-red-400 text-xs mt-1">{errors.skills.message}</p>}
                    </div>

                    {/* Company */}
                    <div>
                        <label className="block text-sm font-medium text-snorlaxCream mt-4">Company</label>
                        <input
                            type="text"
                            {...register("company")}
                            onChange={(e) => {
                                setValue("company", e.target.value);
                                saveToLocalStorage("company", e.target.value); // Save company to local storage
                            }}
                            className="mt-1 p-2 w-full border-[3px] border-gray-400 rounded-lg bg-gray-800 text-snorlaxCream focus:border-snorlaxBrown focus:outline-none"
                        />
                        {errors.company && <p className="text-red-400 text-xs mt-1">{errors.company.message}</p>}
                    </div>
                </div>

                <div className="flex justify-between w-full mt-4">
                    <button
                        type="button"
                        onClick={() => setIsFlipped(!isFlipped)}
                        className="px-4 py-2 bg-snorlaxCream text-snorlaxBrown font-bold rounded-lg hover:bg-snorlaxBrown hover:text-snorlaxCream transition"
                    >
                        Go Back
                    </button>
                    <button
                        type="button"
                        onClick={onVerify}
                        className="px-4 py-2 bg-snorlaxCream text-snorlaxBrown font-bold rounded-lg hover:bg-snorlaxBrown hover:text-snorlaxCream transition"
                    >
                        Verify
                    </button>
                </div>
            </div>
        </div>
    );
};

export default BackSide;
