import React, { useEffect, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { PersonalInfo } from "../../schemas/personal-info.schema";
import Image from "next/image";
import snorlaxImage from "../challenge/assets/snorlax.jpg";
import PhoneInput from 'react-phone-number-input'
import 'react-phone-number-input/style.css'
import dynamic from 'next/dynamic'; // Dynamic import for React Select
import axios from "axios";
import customSelectStyles from './customSelectStyles';
import LinearProgress from '@mui/material/LinearProgress';
import { CircularProgress } from "@mui/material";
import OptionType from "@/types/option";
import './cardStyles.css'

// Dynamically import React Select with ssr: false
const Select = dynamic(() => import("react-select"), { ssr: false });

const FrontSide = ({ isFlipped, setIsFlipped }: {
    isFlipped: boolean;
    setIsFlipped: React.Dispatch<React.SetStateAction<boolean>>;
}) => {

    const { control, watch, register, setValue, trigger, formState: { errors } } = useFormContext<PersonalInfo>();

    //Watch the selected country to know if its empty
    //This will affect the city first value if empty 
    const selectedCountry = watch("location.country");

    // State for countries and cities coming from APIs
    const [countries, setCountries] = useState<any[]>([]);
    const [cities, setCities] = useState<any[]>([]);

    //For progress bar indicator
    const [progress, setProgress] = useState(0);

    //Loading states when consuming APIs 
    const [loadingCountries, setLoadingCountries] = useState(true);
    const [loadingCities, setLoadingCities] = useState(false);

    //For updating the progress whenever fields change
    const updateProgress = () => {
        const totalFields = 5; // Total number of required fields (excluding portfolioUrl)
        let filledFields = 0;

        // Check each required field to see if it's filled and valid
        if (watch("fullName") && errors.fullName === undefined) filledFields++;
        if (watch("email") && errors.email === undefined) filledFields++;
        if (watch("phone") && errors.phone === undefined) filledFields++;
        if (watch("location.country") && errors.location?.country === undefined) filledFields++;
        if (watch("location.city") && errors.location?.city === undefined) filledFields++;

        // Calculate the progress percentage
        const percentage = (filledFields / totalFields) * 100;
        setProgress(percentage);
    };

    //Listen for changes
    const watchedFields = watch(["fullName", "email", "phone", "location.country", "location.city"]);

    useEffect(() => {
        updateProgress();
    }, [watchedFields]);

    //Retrieve data from localstorage
    useEffect(() => {
        const savedData = localStorage.getItem("formData");
        if (savedData) {
            const parsedData = JSON.parse(savedData);
            Object.keys(parsedData).forEach((key) => {
                setValue(key as keyof PersonalInfo, parsedData[key]);
            });
            // Update the country state if it exists
            if (parsedData.location?.country) {
                setValue("location.country", parsedData.location.country); // Update the form state
                handleCountryChange({ value: parsedData.location.country }); // Update the country state and fetch cities
            }
        }
    }, [setValue]);

    //Save data to local storage
    useEffect(() => {
        const subscription = watch((value) => {
            localStorage.setItem("formData", JSON.stringify(value));
        });
        return () => subscription.unsubscribe();
    }, [watch]);

    // Fetch countries and fetch isFlipped state
    useEffect(() => {
        setLoadingCountries(true); // Set loading to true before fetching
        axios.get("https://restcountries.com/v3.1/all")
            .then(response => {
                const countryOptions = response.data.map((country: any) => ({
                    label: country.name.common,
                    value: country.cca2
                }));
                setCountries(countryOptions);
            })
            .catch(error => console.error("Error fetching countries:", error))
            .finally(() => {
                setLoadingCountries(false); // Set loading to false after fetching
            });
    }, []);

    // Save isFlipped state to local storage whenever it changes
    useEffect(() => {
        localStorage.setItem("isFlipped", JSON.stringify(isFlipped));
    }, [isFlipped]);

    interface City {
        tags: {
            name: string;
            // Add other properties if needed based on the Overpass response
        };
    }

    // Fetch cities when a country is selected
    const handleCountryChange = (selectedCountry: any) => {
        const countryCode = selectedCountry?.value;
        if (countryCode) {
            setLoadingCities(true); // Set loading to true before fetching cities

            const overpassQuery = `
                [out:json];
                area["ISO3166-1"="${countryCode}"]->.searchArea;
                (
                    node["place"="city"](area.searchArea);
                    node["place"="town"](area.searchArea);
                    node["place"="village"](area.searchArea);
                );
                out body;
            `;

            axios.post('https://overpass-api.de/api/interpreter', overpassQuery, { timeout: 10000 }) // 10 seconds timeout
                .then(response => {
                    if (response.data.elements) {
                        const cityOptions = response.data.elements.map((city: City) => ({
                            label: city.tags.name,
                            value: city.tags.name,
                        }));
                        setCities(cityOptions);
                    } else {
                        console.error("No cities found for the selected country");
                        setCities([]);
                    }
                })
                .catch(error => {
                    console.error("Error fetching cities:", error);
                    setCities([]);
                })
                .finally(() => {
                    setLoadingCities(false); // Set loading to false after fetching
                });
        }
    };

    return (
        <div className={`card-side ${isFlipped ? 'hidden' : ''}`}>
            <div className="bg-gradient-to-r from-gray-400 via-gray-300 to-gray-400 p-[1px] rounded-lg shadow-lg">
                <div className="bg-gray-700 p-6 border-4 border-gray-400 rounded-lg h-[600px] w-[350px] flex flex-col">
                    {/* Snorlax Image */}
                    <div className="mb-6">
                        <div className="relative w-full h-48">
                            <Image
                                src={snorlaxImage}
                                alt="Snorlax"
                                className="object-cover rounded-lg shadow-md"
                                fill
                                priority
                                sizes="(max-width: 768px) 100vw, 50vw"
                            />
                        </div>
                    </div>

                    {/* Card Title */}
                    <div className="mb-4 w-full">
                        <LinearProgress
                            variant="determinate"
                            value={progress}
                            sx={{
                                backgroundColor: 'rgba(255, 255, 255, 0.3)',
                                '& .MuiLinearProgress-bar': {
                                    backgroundColor: '#cc6e49',
                                },
                            }}
                        />
                        <p className="text-center mt-1 text-snorlaxCream">{Math.round(progress)}% completed</p>
                    </div>
                    <h2 className="text-center text-xl font-bold mb-6 text-snorlaxBrown">Personal Information</h2>

                    {/* Scrollable Form Section */}
                    <div className="overflow-y-auto h-full scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-gray-800 pr-4">
                        {/* Full Name */}
                        <div>
                            <label className="block text-sm font-medium text-snorlaxCream">Full Name</label>
                            <input
                                type="text"
                                {...register("fullName")}
                                className="mt-1 p-2 w-full border-[3px] border-gray-400 rounded-lg bg-gray-800 text-snorlaxCream focus:border-snorlaxBrown focus:outline-none"
                            />
                            {errors.fullName && <p className="text-red-400 text-xs">{errors.fullName.message}</p>}
                        </div>

                        {/* Email */}
                        <div className="mt-4">
                            <label className="block text-sm font-medium text-snorlaxCream">Email</label>
                            <input
                                type="email"
                                {...register("email")}
                                className="mt-1 p-2 w-full border-[3px] border-gray-400 rounded-lg bg-gray-800 text-snorlaxCream focus:border-snorlaxBrown focus:outline-none"
                            />
                            {errors.email && <p className="text-red-400 text-xs">{errors.email.message}</p>}
                        </div>

                        {/* Phone */}
                        <div className="mt-4">
                            <label className="block text-sm font-medium text-snorlaxCream">Phone</label>
                            <div className="flex items-center space-x-2">
                                <Controller
                                    name="phone"
                                    control={control}
                                    render={({ field }) => (
                                        <PhoneInput
                                            international
                                            defaultCountry="US"
                                            value={field.value}
                                            onChange={field.onChange}
                                            className="phone-input mt-1 p-2 w-full border-[3px] border-gray-400 rounded-lg bg-gray-800 text-snorlaxCream focus:border-snorlaxBrown focus:outline-none"
                                        />
                                    )}
                                />
                            </div>
                            {errors.phone && <p className="text-red-400 text-xs mt-1">{errors.phone.message}</p>}
                        </div>

                        {/* Location - Country */}
                        <div className="mt-4">
                            <label className="block text-sm font-medium text-snorlaxCream">Country</label>
                            {loadingCountries ? (
                                <div className="flex justify-center">
                                    <CircularProgress sx={{ color: '#cc6e49' }} />
                                </div>
                            ) : (
                                <Controller
                                    name="location.country"
                                    control={control}
                                    render={({ field }) => (
                                        <Select
                                            placeholder="Type to search..."
                                            isSearchable={true}
                                            {...field}
                                            options={countries}
                                            value={countries.find(option => option.value === field.value) || null}
                                            onChange={(selectedOption) => {
                                                const option = selectedOption as OptionType;
                                                field.onChange(option.value);
                                                handleCountryChange(option);
                                            }}
                                            styles={customSelectStyles}
                                        />
                                    )}
                                />
                            )}
                            {errors.location?.country && (
                                <p className="text-red-400 text-xs">{errors.location.country.message}</p>
                            )}
                        </div>

                        {/* Location - City */}
                        <div className="mt-4">
                            <label className="block text-sm font-medium text-snorlaxCream">City</label>
                            {selectedCountry && loadingCities ? (
                                <div className="flex justify-center">
                                    <CircularProgress sx={{ color: '#cc6e49' }} />
                                </div>
                            ) : (
                                <Controller
                                    name="location.city"
                                    control={control}
                                    render={({ field }) => (
                                        <Select
                                            placeholder="Type to search..."
                                            isSearchable={true}
                                            {...field}
                                            options={
                                                selectedCountry
                                                    ? cities
                                                    : [{ label: "Please select a country", value: "", isDisabled: true }]
                                            }
                                            value={cities.find(option => option.value === field.value) || null}
                                            onChange={(selectedOption) => {
                                                const option = selectedOption as OptionType;
                                                field.onChange(option.value);
                                            }}
                                            styles={customSelectStyles}
                                        />
                                    )}
                                />
                            )}
                            {errors.location?.city && (
                                <p className="text-red-400 text-xs">{errors.location.city.message}</p>
                            )}
                        </div>

                        {/* Portfolio URL (Optional) */}
                        <div className="mt-4">
                            <label className="block text-sm font-medium text-snorlaxCream">Portfolio URL (Optional)</label>
                            <input
                                type="url"
                                {...register("portfolioUrl")}
                                placeholder="https://yourportfolio.com"
                                className="mt-1 p-2 w-full border-[3px] border-gray-400 rounded-lg bg-gray-800 text-snorlaxCream focus:border-snorlaxBrown focus:outline-none"
                            />
                            {errors.portfolioUrl && (
                                <p className="text-red-400 text-xs">{errors.portfolioUrl.message}</p>
                            )}
                        </div>

                        {/* Next Button */}
                        <button
                            onClick={async (e) => {
                                e.preventDefault();
                                const isValid = await trigger(["fullName", "email", "phone", "location"]); // Validate the form
                                if (isValid) {
                                    setIsFlipped(!isFlipped); // Flip the card to show the back side
                                } else { }
                            }}
                            type="button"
                            className="mt-8 w-full py-2 bg-snorlaxCream text-snorlaxBrown font-bold rounded-lg hover:bg-snorlaxBrown hover:text-snorlaxCream transition duration-200"
                        >
                            Next
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
};

export default FrontSide

